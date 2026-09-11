import React, { useState } from 'react';
import { 
  Sprout, 
  TrendingUp, 
  Mic, 
  PhoneCall, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  Plus, 
  Sparkles,
  Camera,
  MapPin,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Harvest, PriceBenchmark } from '../types';
import { SEED_PRICE_BENCHMARKS } from '../data/seedData';

interface FarmerDashboardProps {
  onOpenSellModal: () => void;
  onOpenVoice: () => void;
  onOpenCall: () => void;
  onOpenCompiler: () => void;
  onOpenQuality: () => void;
  activeHarvests: Harvest[];
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onOpenSellModal,
  onOpenVoice,
  onOpenCall,
  onOpenCompiler,
  onOpenQuality,
  activeHarvests
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const benchmark: PriceBenchmark = SEED_PRICE_BENCHMARKS[selectedCrop] || SEED_PRICE_BENCHMARKS['Tomato'];

  const flagshipHarvest = activeHarvests.find(h => h.id === 'AC-HRV-2026-00124') || activeHarvests[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* Farmer Identity & Low Connectivity Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg border-2 border-emerald-500">
            RP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">Ramesh Patel</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Verified Farmer
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-slate-400" /> Sanwer (Village Cluster A), Indore &bull; 3.5 Acres
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium self-start sm:self-center">
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Trust Score</span>
            <span className="font-bold text-emerald-600 text-sm">94 / 100</span>
          </div>
          <div className="h-8 w-px bg-slate-200"></div>
          <div className="text-right">
            <span className="text-slate-400 block text-[11px]">Offline Cache</span>
            <span className="font-bold text-slate-700 text-sm">Synced (4G)</span>
          </div>
        </div>
      </div>

      {/* Primary Hero Actions (Mobile-Optimized Touch Targets > 48px) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Big CTA: Sell My Harvest */}
        <button
          id="btn-farmer-sell-harvest"
          onClick={onOpenSellModal}
          className="sm:col-span-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-4 rounded-2xl shadow-md shadow-emerald-600/20 flex sm:flex-col items-center justify-between sm:justify-center gap-3 text-left sm:text-center transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-extrabold font-display">SELL MY HARVEST</div>
            <p className="text-xs text-emerald-100 mt-0.5">Fasal Bechein (Enter Details)</p>
          </div>
          <ArrowRight className="w-5 h-5 text-emerald-200 sm:hidden" />
        </button>

        {/* Voice Assistant Button */}
        <button
          id="btn-farmer-voice"
          onClick={onOpenVoice}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-indigo-900 border border-indigo-200 font-bold p-4 rounded-2xl flex sm:flex-col items-center justify-between sm:justify-center gap-3 text-left sm:text-center transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Mic className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-extrabold font-display text-indigo-950">AgriMitra Voice</div>
            <p className="text-xs text-indigo-700 mt-0.5">Bolkar Fasal Darj Karein (Hindi)</p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-400 sm:hidden" />
        </button>

        {/* Simulated Outbound Phone Call */}
        <button
          id="btn-farmer-call"
          onClick={onOpenCall}
          className="bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-950 border border-amber-200 font-bold p-4 rounded-2xl flex sm:flex-col items-center justify-between sm:justify-center gap-3 text-left sm:text-center transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold font-display text-amber-950">AI Phone Call</div>
            <p className="text-xs text-amber-800 mt-0.5">Auto-Call Ramesh Ji (Simulation)</p>
          </div>
          <ArrowRight className="w-5 h-5 text-amber-400 sm:hidden" />
        </button>
      </div>

      {/* Active Harvest Card & Current Best Offer */}
      {flagshipHarvest && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-emerald-400 font-bold">ACTIVE HARVEST:</span>
              <span>{flagshipHarvest.id}</span>
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
              COMPILED & OPTIMIZED
            </span>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    {flagshipHarvest.quantityKg} kg {flagshipHarvest.crop}
                  </h2>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {flagshipHarvest.qualityGrade}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Harvested Today &bull; Selling Window: {flagshipHarvest.sellingWindow} &bull; Min: ₹{flagshipHarvest.minAcceptablePrice}/kg
                </p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-right shrink-0">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Current Best Farmer Net Value
                </div>
                <div className="text-2xl font-black text-emerald-700 font-display mt-0.5">
                  ₹14.20 <span className="text-xs font-medium text-slate-600">/ kg</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Total ₹1,420 (Local Trader: ₹1,100)
                </div>
              </div>
            </div>

            {/* Compiled Supply Chain Route Preview */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider">
                  Selected Optimal Chain: Dynamic Pool + Return Tata Ace
                </span>
                <span className="text-emerald-700 font-bold">+₹3.20/kg (+29.1%) Gain</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  👨‍🌾 Ramesh Patel (100 kg)
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  📦 Sharma Aggregation (₹1/kg fee)
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 shadow-2xs">
                  🚚 Return Tata Ace (Jagdish Yadav)
                </span>
                <span className="text-slate-400">→</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold shadow-2xs">
                  🍽️ Shreemaya Restaurant (₹18/kg)
                </span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                id="btn-inspect-compiler-from-farmer"
                onClick={onOpenCompiler}
                className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-xs font-bold py-2 px-3 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
              >
                <span>Compare Other 4 Chains in Compiler</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  id="btn-farmer-ai-quality"
                  onClick={onOpenQuality}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Verify AI Grade</span>
                </button>

                <button
                  id="btn-farmer-accept-payout"
                  onClick={onOpenCompiler}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  Commit Harvest (₹14.20/kg)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mandi Price Benchmark Engine Card */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Fair-Price Benchmark Engine</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">e-NAM & Mandi Live Feeds vs Local Trader Offers</p>
          </div>

          <div className="flex items-center gap-1">
            {['Tomato', 'Onion', 'Potato'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  selectedCrop === c ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] text-slate-500 block">Indore APMC Mandi Range</span>
            <span className="text-base font-bold text-slate-900 mt-0.5 block">
              ₹{benchmark.mandiBenchmarkMin.toFixed(2)} – ₹{benchmark.mandiBenchmarkMax.toFixed(2)}
            </span>
            <span className="text-[10px] text-slate-400">Choithram Yard auction band</span>
          </div>

          <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
            <span className="text-[11px] text-rose-700 block font-medium">Local Trader Offering</span>
            <span className="text-base font-bold text-rose-800 mt-0.5 block">
              ₹{benchmark.currentTraderOffer.toFixed(2)} / kg
            </span>
            <span className="text-[10px] text-rose-600 font-semibold">Below market benchmark</span>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="text-[11px] text-emerald-800 block font-medium">Bargaining Gap Discovered</span>
            <span className="text-base font-bold text-emerald-700 mt-0.5 block font-display">
              +₹{benchmark.potentialBargainingGap.toFixed(2)} / kg
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold">AgriChain compiles higher net</span>
          </div>
        </div>
      </div>

    </div>
  );
};
