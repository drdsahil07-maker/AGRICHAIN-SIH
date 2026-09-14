import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  ArrowRight, 
  ShoppingBag, 
  Clock, 
  DollarSign, 
  Users, 
  MapPin, 
  PhoneCall, 
  Cpu, 
  Navigation, 
  Play, 
  CheckCircle2, 
  Truck, 
  Sparkles,
  ChevronRight,
  Store,
  Sprout,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { getStoredCallRecords } from '../data/callRecords';
import { AgriMap } from './AgriMap';
import { callAudio } from '../utils/callAudio';
import { authService } from '../auth/authService';

interface LandingOverviewProps {
  onNavigateTab: (tab: string) => void;
  onOpenCall: () => void;
  onOpenSellModal?: () => void;
  onOpenVoice?: () => void;
}

export const LandingOverview: React.FC<LandingOverviewProps> = ({ 
  onNavigateTab,
  onOpenCall,
  onOpenSellModal,
}) => {
  const navigate = useNavigate();
  const recentCalls = getStoredCallRecords().slice(0, 3);

  const handlePortalNavigate = (role: 'farmer' | 'distributor' | 'transporter') => {
    navigate(`/login/${role}`);
  };

  // Sample recent active listings for Ramesh Patel
  const activeOrders = [
    {
      id: 'ORD-1024',
      crop: 'Tomato',
      variety: 'Hybrid Grade A',
      quantity: '510 kg',
      status: 'In Transit',
      buyer: 'Shreemaya Kitchens',
      price: '₹18.00 / kg',
      route: 'Sanwer → Indore',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'ORD-1025',
      crop: 'Soybean',
      variety: 'JS-335 Grade A',
      quantity: '1,200 kg',
      status: 'Offer Received',
      buyer: 'Patanjali Agro Hub',
      price: '₹46.50 / kg',
      route: 'Dewas Mandi Gate',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'ORD-1026',
      crop: 'Onion',
      variety: 'Nashik Red',
      quantity: '800 kg',
      status: 'Pending Pickup',
      buyer: 'Direct Retail Co-op',
      price: '₹22.00 / kg',
      route: 'Hatod Village',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Role-Based Quick Access & Portal Entry */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm border border-emerald-500/30">
              AC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-white font-display">AgriChain</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded border border-emerald-500/30">
                  Connect. Trade. Deliver.
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent Agricultural Value Chain &amp; Logistics Platform
              </p>
            </div>
          </div>

          {/* Quick Role Portal Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Select Portal:
            </span>
            <button
              type="button"
              onClick={() => handlePortalNavigate('farmer')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              Farmer Portal
            </button>
            <button
              type="button"
              onClick={() => handlePortalNavigate('distributor')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              Distributor Portal
            </button>
            <button
              type="button"
              onClick={() => handlePortalNavigate('transporter')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              Transporter Portal
            </button>
          </div>
        </div>
      </div>

      {/* 2. "CONTINUE AS" THREE-ROLE SECTION (Requested) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AgriChain Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-display mt-0.5">
              Connect. Trade. Deliver.
            </h2>
            <p className="text-xs text-slate-500">
              Select your role to access transparent pricing, direct purchasing, or verified loads.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium italic">
            &ldquo;We don&apos;t remove the middleman. We remove the mystery around the middleman.&rdquo;
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* ROLE CARD 1: FARMER */}
          <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200/90 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sprout className="w-7 h-7" />
                </div>
                <span className="text-xl font-bold">🌾</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">Farmer</h3>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Sell your produce with transparent pricing
                </p>
              </div>
              <div className="text-[11px] text-emerald-700 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
                Formula: Farmer Net Value = Buyer Price - Transport Cost - Service Cost - Expected Loss
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/login/farmer')}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer text-center"
              >
                Continue as Farmer
              </button>
              <div className="flex items-center justify-between text-xs px-1">
                <button
                  type="button"
                  onClick={() => navigate('/login/farmer')}
                  className="text-slate-500 hover:text-emerald-700 font-medium cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register/farmer')}
                  className="text-emerald-700 hover:underline font-bold cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>

          {/* ROLE CARD 2: DISTRIBUTOR */}
          <div className="bg-white rounded-3xl p-6 border-2 border-amber-200/90 shadow-xs hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Store className="w-7 h-7" />
                </div>
                <span className="text-xl font-bold">🏪</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">Distributor</h3>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Source produce and manage purchases
                </p>
              </div>
              <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-xl border border-amber-100">
                Wholesalers, food processors, and institutional buyers with direct escrow contracts.
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/login/distributor')}
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer text-center"
              >
                Continue as Distributor
              </button>
              <div className="flex items-center justify-between text-xs px-1">
                <button
                  type="button"
                  onClick={() => navigate('/login/distributor')}
                  className="text-slate-500 hover:text-amber-700 font-medium cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register/distributor')}
                  className="text-amber-700 hover:underline font-bold cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>

          {/* ROLE CARD 3: TRANSPORTER */}
          <div className="bg-white rounded-3xl p-6 border-2 border-blue-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between space-y-5 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Truck className="w-7 h-7" />
                </div>
                <span className="text-xl font-bold">🚚</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">Transporter</h3>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Find loads and manage deliveries
                </p>
              </div>
              <div className="text-[11px] text-blue-800 bg-blue-50/80 p-2.5 rounded-xl border border-blue-100">
                Monetize empty return trips with pre-weighed farmgate pickup loads along active corridors.
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/login/transporter')}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer text-center"
              >
                Continue as Transporter
              </button>
              <div className="flex items-center justify-between text-xs px-1">
                <button
                  type="button"
                  onClick={() => navigate('/login/transporter')}
                  className="text-slate-500 hover:text-blue-700 font-medium cursor-pointer"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/register/transporter')}
                  className="text-blue-700 hover:underline font-bold cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Hero Section (Clean, Calm, Action-Oriented) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
            <span>Good morning 👋</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Manage your farm sales
          </h1>
          <p className="text-slate-500 text-sm">
            Find buyers, compare offers, and track deliveries.
          </p>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="btn-add-produce"
            type="button"
            onClick={onOpenSellModal || (() => onNavigateTab('farmer'))}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-3 rounded-2xl shadow-xs transition-colors cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Produce</span>
          </button>

          <button
            id="btn-view-orders"
            type="button"
            onClick={() => onNavigateTab('farmer')}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold px-4 py-3 rounded-2xl border border-slate-200 transition-colors cursor-pointer"
          >
            <span>View Orders</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* 2. Four Compact Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Active Sales */}
        <div 
          onClick={() => onNavigateTab('farmer')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-2">
            12
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <span>↑ 3 new offers today</span>
          </div>
        </div>

        {/* Card 2: Pending Orders */}
        <div 
          onClick={() => onNavigateTab('farmer')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Pending Orders</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-2">
            4
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            2 dispatches scheduled
          </div>
        </div>

        {/* Card 3: Amount Earned */}
        <div 
          onClick={() => onNavigateTab('escrow')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Amount Earned</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-display mt-2">
            ₹24,500
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Settled directly via UPI
          </div>
        </div>

        {/* Card 4: Available Buyers */}
        <div 
          onClick={() => onNavigateTab('buyer')}
          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Available Buyers</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-2">
            18
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            Indore &amp; Dewas hubs
          </div>
        </div>
      </div>

      {/* 3. Primary Actions: "What do you want to do?" */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display">
          What do you want to do?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Action 1: Add Produce */}
          <button
            type="button"
            onClick={onOpenSellModal || (() => onNavigateTab('farmer'))}
            className="bg-white hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs text-left transition-all hover:shadow-sm cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                + Add Produce
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                List today&apos;s harvest
              </p>
            </div>
          </button>

          {/* Action 2: Find Buyers */}
          <button
            type="button"
            onClick={() => onNavigateTab('buyer')}
            className="bg-white hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs text-left transition-all hover:shadow-sm cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                Find Buyers
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                See nearby demand
              </p>
            </div>
          </button>

          {/* Action 3: Track Order */}
          <button
            type="button"
            onClick={() => onNavigateTab('map')}
            className="bg-white hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs text-left transition-all hover:shadow-sm cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 transition-colors">
                Track Order
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Check delivery status
              </p>
            </div>
          </button>

          {/* Action 4: AI Assistant */}
          <button
            type="button"
            onClick={onOpenCall}
            className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 sm:p-5 rounded-2xl shadow-xs text-left transition-all hover:shadow-md cursor-pointer group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <PhoneCall className="w-5 h-5" />
              </div>
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                AI Assistant
              </div>
              <p className="text-xs text-emerald-100 mt-0.5">
                Talk instead of typing
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 4. Best Selling Route Quick Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Best Selling Route
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            We compare available options and show you the best one.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('compiler')}
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-center shrink-0"
        >
          <span>Compare Options →</span>
        </button>
      </div>

      {/* 5. Two Columns: Active Orders & Live Map Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base font-display">
                Recent Orders &amp; Dispatches
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track payments and delivery states
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('farmer')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              View all →
            </button>
          </div>

          <div className="space-y-2.5">
            {activeOrders.map((order) => (
              <div 
                key={order.id}
                className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{order.crop}</span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-semibold text-slate-700">{order.quantity}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="text-slate-500 flex items-center gap-2 text-[11px]">
                    <span>Buyer: <strong className="text-slate-700">{order.buyer}</strong></span>
                    <span>&bull;</span>
                    <span>{order.route}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                  <div className="text-left sm:text-right">
                    <span className="font-bold text-emerald-700 text-sm block">{order.price}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{order.id}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateTab('compiler')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    title="View details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Map Snapshot (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base font-display">
                Logistics Map
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active Corridor: Sanwer &rarr; Indore (32 km)
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('map')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              Full map →
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 h-56 relative z-0 isolate">
            <AgriMap height="224px" />
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-500 text-[11px]">
              Tata Ace (MP-09-AB) on route
            </span>
            <button
              type="button"
              onClick={() => onNavigateTab('map')}
              className="font-bold text-slate-800 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <span>Track Fleet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 6. Recent Call Records Section */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base font-display">
              Call Records History
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Recent calls with the AI assistant
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('calls')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
          >
            View all calls ({getStoredCallRecords().length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {recentCalls.map((rec) => (
            <div 
              key={rec.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2.5"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">{rec.crop}</span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  ₹{rec.minAcceptablePrice}/kg
                </span>
              </div>

              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>{rec.quantityKg} kg</span>
                <span className="text-slate-400 text-[11px]">{rec.timestamp.split(',')[1] || rec.timestamp}</span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    callAudio.speak({
                      text: `Call with ${rec.farmerName}. Crop: ${rec.crop}, Quantity: ${rec.quantityKg} kg, Minimum acceptable price: ₹${rec.minAcceptablePrice} per kg.`,
                      isAi: true,
                    });
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Play Recording</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('compiler')}
                  className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Find buyers →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
