import { Response } from 'express';
import { AuthRequest, getScopedClient, supabaseAnon } from '../middleware/auth';

const VALID_STATUSES = [
  'CREATED', 'CONFIRMED', 'POOLING', 'TRANSPORT_ASSIGNED', 
  'PICKUP_READY', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 
  'COMPLETED', 'CANCELLED'
];

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getScopedClient(req);
    const { 
      pool_id, 
      crop, 
      quantity_kg, 
      agreed_price_per_kg, 
      pickup_location, 
      delivery_location 
    } = req.body;

    // Validate request
    if (!crop || !quantity_kg || !agreed_price_per_kg) {
      return res.status(400).json({ success: false, error: { message: 'Missing required fields' } });
    }

    if (quantity_kg <= 0 || agreed_price_per_kg <= 0) {
      return res.status(400).json({ success: false, error: { message: 'Quantity and price must be positive' } });
    }

    // Must be a buyer or consumer to create an order
    if (req.user?.role !== 'consumer' && req.user?.role !== 'distributor') {
      return res.status(403).json({ success: false, error: { message: 'Only buyers/consumers can create orders' } });
    }

    // Verify pool exists and has quantity if pool_id is provided
    if (pool_id) {
      const { data: pool, error: poolErr } = await supabase
        .from('pools')
        .select('total_quantity_kg, status')
        .eq('id', pool_id)
        .single();
      
      if (poolErr || !pool) {
        return res.status(404).json({ success: false, error: { message: 'Pool not found' } });
      }
      
      if (pool.total_quantity_kg < quantity_kg) {
        return res.status(400).json({ success: false, error: { message: 'Pool does not have enough quantity' } });
      }
    }

    // Calculate financials
    const total_amount = quantity_kg * agreed_price_per_kg;
    // Farmer Net Value = Buyer Price - Transport Cost - Service Cost - Expected Loss
    // Mocking the costs for now: 10% service cost, 5% transport, 2% loss
    const service_cost = total_amount * 0.10;
    const transport_cost = total_amount * 0.05;
    const expected_loss = total_amount * 0.02;
    const farmer_net_value = total_amount - service_cost - transport_cost - expected_loss;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        pool_id,
        buyer_id: req.user.id,
        crop,
        quantity_kg,
        agreed_price_per_kg,
        total_amount,
        farmer_net_value,
        pickup_location: pickup_location || 'TBD',
        delivery_location: delivery_location || 'TBD',
        status: 'CREATED'
      })
      .select()
      .single();

    if (error) throw error;

    // Create notification for the buyer
    await supabaseAnon.from('notifications').insert({
      user_id: req.user.id,
      type: 'ORDER_CREATED',
      message: `Order for ${quantity_kg}kg of ${crop} has been created.`,
      reference_id: order.id
    });

    res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getScopedClient(req);
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getScopedClient(req);
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const supabase = getScopedClient(req);
    const { status } = req.body;
    const orderId = req.params.id;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, error: { message: 'Invalid status' } });
    }

    // Get current order to validate transition and auth
    const { data: currentOrder, error: fetchErr } = await supabase
      .from('orders')
      .select('status, buyer_id, transport_trip_id')
      .eq('id', orderId)
      .single();

    if (fetchErr || !currentOrder) {
      return res.status(404).json({ success: false, error: { message: 'Order not found' } });
    }

    // Basic lifecycle validation
    // E.g., cannot go back to CREATED if already COMPLETED
    if (currentOrder.status === 'COMPLETED' || currentOrder.status === 'CANCELLED') {
      return res.status(400).json({ success: false, error: { message: 'Cannot update status of a completed or cancelled order' } });
    }

    // Transporter restrictions: Transporters can only move through pickup -> transit -> delivery
    if (req.user?.role === 'transporter') {
      const allowedTransporterStatuses = ['PICKUP_READY', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
      if (!allowedTransporterStatuses.includes(status)) {
        return res.status(403).json({ success: false, error: { message: 'Transporter not authorized for this status transition' } });
      }
    }

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    // Send notifications based on status change
    if (status === 'CONFIRMED') {
        await supabaseAnon.from('notifications').insert({
          user_id: currentOrder.buyer_id,
          type: 'ORDER_CONFIRMED',
          message: `Your order ${orderId.substring(0,8)} has been confirmed.`,
          reference_id: orderId
        });
    } else if (status === 'DELIVERED') {
         await supabaseAnon.from('notifications').insert({
          user_id: currentOrder.buyer_id,
          type: 'ORDER_DELIVERED',
          message: `Your order ${orderId.substring(0,8)} has been delivered.`,
          reference_id: orderId
        });
    }

    res.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { message: error.message } });
  }
};
