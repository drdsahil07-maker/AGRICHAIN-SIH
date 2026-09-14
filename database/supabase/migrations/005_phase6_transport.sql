-- Migration: Phase 6 Transport & Backhaul Matching

CREATE TABLE IF NOT EXISTS public.transport_trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  capacity_kg NUMERIC NOT NULL CHECK (capacity_kg > 0),
  available_capacity_kg NUMERIC NOT NULL CHECK (available_capacity_kg >= 0 AND available_capacity_kg <= capacity_kg),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  primary_route TEXT,
  return_route TEXT,
  departure_time TIMESTAMPTZ NOT NULL,
  trip_type TEXT NOT NULL DEFAULT 'PRIMARY', -- 'PRIMARY', 'BACKHAUL'
  status TEXT NOT NULL DEFAULT 'AVAILABLE', -- 'AVAILABLE', 'MATCHED', 'ASSIGNED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'
  standard_rate_per_trip NUMERIC,
  discounted_backhaul_rate NUMERIC,
  saving_estimate NUMERIC,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS tr_transport_trips_updated_at ON public.transport_trips;
CREATE TRIGGER tr_transport_trips_updated_at
  BEFORE UPDATE ON public.transport_trips
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Add assigned_trip_id to pools
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pools' AND column_name = 'trip_id'
  ) THEN
    ALTER TABLE public.pools ADD COLUMN trip_id UUID REFERENCES public.transport_trips(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transport_trips_transporter ON public.transport_trips(transporter_id);
CREATE INDEX IF NOT EXISTS idx_transport_trips_status ON public.transport_trips(status);
CREATE INDEX IF NOT EXISTS idx_transport_trips_type ON public.transport_trips(trip_type);

-- RLS Enablement
ALTER TABLE public.transport_trips ENABLE ROW LEVEL SECURITY;

-- 1. Transporters can view their own trips
DROP POLICY IF EXISTS "Transporters can view their own trips" ON public.transport_trips;
CREATE POLICY "Transporters can view their own trips" ON public.transport_trips
FOR SELECT USING (auth.uid() = transporter_id);

-- 2. Distributors can view available trips for matching OR trips assigned to their pools
DROP POLICY IF EXISTS "Distributors can view relevant trips" ON public.transport_trips;
CREATE POLICY "Distributors can view relevant trips" ON public.transport_trips
FOR SELECT USING (
  status IN ('AVAILABLE', 'MATCHED') OR 
  id IN (SELECT trip_id FROM public.pools WHERE created_by = auth.uid())
);

-- 3. Government Admin can view all trips
DROP POLICY IF EXISTS "Government admins can view all trips" ON public.transport_trips;
CREATE POLICY "Government admins can view all trips" ON public.transport_trips
FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'government_admin')
);

-- 4. Farmers can view trips assigned to pools that include their harvests
DROP POLICY IF EXISTS "Farmers can view assigned trips" ON public.transport_trips;
CREATE POLICY "Farmers can view assigned trips" ON public.transport_trips
FOR SELECT USING (
  id IN (
    SELECT p.trip_id FROM public.pools p
    JOIN public.pool_members pm ON p.id = pm.pool_id
    JOIN public.harvests h ON pm.harvest_id = h.id
    WHERE h.farmer_id = auth.uid()
  )
);

-- 5. Consumers can view trips assigned to requirements they own (if we link them up)
DROP POLICY IF EXISTS "Consumers can view relevant trips" ON public.transport_trips;
CREATE POLICY "Consumers can view relevant trips" ON public.transport_trips
FOR SELECT USING (
  id IN (
    SELECT trip_id FROM public.pools 
    WHERE requirement_id IN (SELECT id FROM public.bulk_requirements WHERE consumer_id = auth.uid())
  )
);

-- Remove the old overly broad policy if it existed
DROP POLICY IF EXISTS "Authenticated users can view available trips" ON public.transport_trips;

-- Transporters can insert their own trips
DROP POLICY IF EXISTS "Transporters can insert their own trips" ON public.transport_trips;
CREATE POLICY "Transporters can insert their own trips" ON public.transport_trips
FOR INSERT WITH CHECK (
  auth.uid() = transporter_id AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'transporter')
);

-- Transporters can update their own trips
DROP POLICY IF EXISTS "Transporters can update their own trips" ON public.transport_trips;
CREATE POLICY "Transporters can update their own trips" ON public.transport_trips
FOR UPDATE USING (
  auth.uid() = transporter_id AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'transporter')
);

-- Secure RPC for atomic transport assignment
CREATE OR REPLACE FUNCTION public.assign_transport_trip_safely(p_pool_id UUID, p_trip_id UUID)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_trip RECORD;
    v_pool RECORD;
    v_new_capacity NUMERIC;
    v_new_trip_status TEXT;
BEGIN
    -- 1. Lock the trip row to prevent concurrent modification
    SELECT * INTO v_trip FROM public.transport_trips WHERE id = p_trip_id FOR UPDATE;
    IF v_trip IS NULL THEN
        RAISE EXCEPTION 'Trip not found';
    END IF;

    IF v_trip.status NOT IN ('AVAILABLE', 'MATCHED') THEN
        RAISE EXCEPTION 'Trip is not available for assignment (status: %)', v_trip.status;
    END IF;

    -- 2. Lock the pool row
    SELECT * INTO v_pool FROM public.pools WHERE id = p_pool_id FOR UPDATE;
    IF v_pool IS NULL THEN
        RAISE EXCEPTION 'Pool not found';
    END IF;

    IF v_pool.status NOT IN ('forming', 'ready', 'locked') THEN
        RAISE EXCEPTION 'Pool is not in a valid state for transport assignment (status: %)', v_pool.status;
    END IF;

    IF v_pool.trip_id IS NOT NULL THEN
        RAISE EXCEPTION 'Pool has already been assigned to a transport trip';
    END IF;

    IF v_pool.current_quantity_kg <= 0 THEN
        RAISE EXCEPTION 'Pool has no quantity to assign';
    END IF;

    IF v_trip.available_capacity_kg < v_pool.current_quantity_kg THEN
        RAISE EXCEPTION 'Insufficient transport capacity (available: %, required: %)', v_trip.available_capacity_kg, v_pool.current_quantity_kg;
    END IF;

    -- 3. Calculate new capacity and status
    v_new_capacity := v_trip.available_capacity_kg - v_pool.current_quantity_kg;
    IF v_new_capacity <= 0 THEN
        v_new_trip_status := 'ASSIGNED';
    ELSE
        v_new_trip_status := 'MATCHED'; -- partially filled, still available potentially
    END IF;

    -- 4. Execute atomic updates
    UPDATE public.transport_trips 
    SET available_capacity_kg = v_new_capacity, status = v_new_trip_status
    WHERE id = p_trip_id;

    -- Note: We lock the pool but do NOT prematurely mark it as 'dispatched'.
    UPDATE public.pools
    SET trip_id = p_trip_id, status = 'locked'
    WHERE id = p_pool_id;

    RETURN json_build_object(
        'success', true, 
        'trip_id', p_trip_id, 
        'pool_id', p_pool_id, 
        'remaining_capacity', v_new_capacity,
        'new_trip_status', v_new_trip_status
    );
END;
$$;
