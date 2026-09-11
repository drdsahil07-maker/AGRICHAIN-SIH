import React from 'react';
import { SlidersHorizontal, ShieldCheck, Activity, TrendingUp, Cpu, Users, Truck, Store, AlertCircle } from 'lucide-react';

export const AdminCommandCenter: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-xs font-semibold border border-slate-300">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>PROTOCOL GOVERNANCE & NEUTRALITY MONITOR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
          System Neutrality Command Center
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          AgriChain functions as a pure mathematical compiler. It owns zero trucks, holds zero crop inventories, and takes zero speculative market positions—ensuring absolute algorithmic impartiality.
        </p>
      </div>

      {/* Protocol Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-semibold block">Supply Chains Compiled</span>
          <div className="font-black text-3xl text-slate-900 font-display">1,420</div>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% this harvest cycle</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-semibold block">Average Farmer Net Lift</span>
          <div className="font-black text-3xl text-emerald-700 font-display">+28.4%</div>
          <span className="text-[11px] text-slate-500">Relative to local village trader</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-semibold block">Logistics Waste Eliminated</span>
          <div className="font-black text-3xl text-blue-700 font-display">₹4.2M</div>
          <span className="text-[11px] text-slate-500">Saved via backhaul sharing</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-semibold block">Protocol Impartiality Audit</span>
          <div className="font-black text-3xl text-purple-700 font-display">100%</div>
          <span className="text-[11px] text-emerald-600 font-semibold">Zero inventory risk held</span>
        </div>
      </div>

      {/* Neutrality Safeguards */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-lg text-slate-900 font-display">Algorithmic Safeguards & Anti-Monopoly Guarantees</h3>
          <p className="text-xs text-slate-500 mt-1">Guarantees designed to safeguard smallholder autonomy and prevent platform lock-in.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Inventory Holding</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              AgriChain never buys low to store and sell high. Farmers always remain the legal and beneficial owners of produce until final buyer delivery.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Multi-Option Transparency</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              The compiler always presents all viable routes—including traditional Mandi auctions—so farmers can choose based on their individual risk tolerance.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Open Protocol Interoperability</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Full compatibility with ONDC and e-NAM standards, enabling any verified logistics or aggregation provider to plug into the execution mesh.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
