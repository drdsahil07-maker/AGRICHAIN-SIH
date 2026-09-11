import React from 'react';
import { Boxes, MapPin, CheckCircle2, TrendingUp, Truck, Users, ArrowRight, ShieldCheck } from 'lucide-react';
import { FarmerPool } from '../types';
import { SEED_POOLS } from '../data/seedData';

interface DynamicPoolingViewProps {
  onInspectPool?: (pool: FarmerPool) => void;
}

export const DynamicPoolingView: React.FC<DynamicPoolingViewProps> = ({ onInspectPool }) => {
  const pool = SEED_POOLS[0]; // Flagship AC-POOL-1024 (510 kg)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title & Concept Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold border border-purple-200">
          <Boxes className="w-3.5 h-3.5" />
          <span>DYNAMIC SMALL-LOT AGGREGATION</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          Virtual Smallholder Consignments
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          The fundamental bottleneck of Indian agriculture is the <strong>small-lot barrier</strong>: an individual farmer with 80–120 kg cannot hire a truck or contract with a major restaurant. AgriChain dynamically aggregates nearby small lots into high-volume commercial consignments.
        </p>
      </div>

      {/* Flagship Consignment Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-purple-100 text-purple-900 text-xs font-mono font-bold px-2.5 py-1 rounded-lg border border-purple-200">
                {pool.poolCode}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">
                READY FOR DISPATCH
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-display">
              {pool.totalQuantityKg} kg {pool.crop} Consolidated Lot
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Pickup: <strong>{pool.clusterName}</strong> &bull; Destination: <strong>{pool.destination}</strong>
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 text-right shrink-0">
            <div className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">
              Combined Freight Savings
            </div>
            <div className="text-2xl font-black text-purple-900 font-display mt-0.5">
              ₹{pool.estimatedSavings.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-purple-700 font-medium mt-0.5">
              Saved vs 5 solo truck pickups
            </div>
          </div>
        </div>

        {/* Participating Farmers Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              <span>Participating Smallholder Batches (5 Farmers = 510 kg)</span>
            </h3>
            <span className="text-xs text-slate-500">Autonomous clustering by geographical proximity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {pool.farmers.map((farmer, idx) => (
              <div 
                key={farmer.farmerId}
                className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400 font-bold">FARMER {String.fromCharCode(65 + idx)}</span>
                  <span className="font-bold text-emerald-700">{farmer.quantityKg} kg</span>
                </div>
                <div className="font-bold text-slate-900 text-sm">{farmer.farmerName}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {farmer.village}
                </div>
                <div className="pt-1.5 border-t border-slate-200 text-[10px] text-slate-600 flex items-center justify-between font-mono">
                  <span>Net: ₹14.20/kg</span>
                  <span className="text-emerald-600 font-bold">₹{(farmer.quantityKg * 14.2).toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Matched Shared Transport & Buyer Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Matched Return-Leg Logistics</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              {pool.transporterVehicle} &bull; Driver: Jagdish Yadav
            </div>
            <p className="text-xs text-slate-500">
              Utilizing 510 kg of 800 kg capacity returning empty from Bhopal to Indore. Transport cost dropped from ₹4,000 to ₹2,400.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Direct Commercial Buyer Order</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              Shreemaya Hotel & Restaurants (Indore)
            </div>
            <p className="text-xs text-slate-500">
              Purchasing total 510 kg consignment @ ₹18.00/kg gross landed price. Buyer funds escrow in advance.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
