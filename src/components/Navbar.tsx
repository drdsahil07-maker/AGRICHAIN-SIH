import React, { useState } from 'react';
import { 
  Sprout, 
  Cpu, 
  Boxes, 
  Truck, 
  ShoppingBag, 
  QrCode, 
  PhoneCall, 
  MapPin, 
  Camera,
  ChevronDown,
  User,
  Menu,
  X,
  Sparkles,
  Shield,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountMenu } from './AccountMenu';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenVoice: () => void;
  onOpenCall: () => void;
  onOpenAssisted: () => void;
  onOpenQuality: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCall,
}) => {
  const { userProfile, role, setIsAuthModalOpen } = useAuth();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'landing', label: 'Dashboard', icon: Sprout },
    { id: 'compiler', label: 'Best Route', icon: Cpu },
    { id: 'farmer', label: 'Orders', icon: ShoppingBag },
    { id: 'buyer', label: 'Buyers', icon: ShoppingBag },
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'calls', label: 'Call Records', icon: PhoneCall },
  ];

  const secondaryTabs = [
    { id: 'pooling', label: 'Consignment Pooling', icon: Boxes },
    { id: 'transporter', label: 'Backhaul Fleet', icon: Truck },
    { id: 'escrow', label: 'Escrow Settlement', icon: QrCode },
    { id: 'quality', label: 'Quality Scan', icon: Camera },
    { id: 'admin', label: 'Admin Console', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-[100] bg-white border-b border-slate-200/80 shadow-xs">
      {/* Main Top Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Online Status */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onSelectTab('landing')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-display">
                  AGRICHAIN
                </span>
                <span 
                  title="Supabase Connected: abjhusvnynwvjbiwtxho"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Supabase Live
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Primary Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {mainTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  type="button"
                  onClick={() => {
                    onSelectTab(tab.id);
                    setIsMoreOpen(false);
                  }}
                  className={`
                    flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                    ${isActive 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            {/* More Menu Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen(!isMoreOpen)}
                className={`
                  flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                  ${secondaryTabs.some(t => t.id === currentTab) 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }
                `}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isMoreOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsMoreOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Operations Suite
                    </div>
                    {secondaryTabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = currentTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            onSelectTab(tab.id);
                            setIsMoreOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer
                            ${isActive ? 'bg-slate-900 text-white font-semibold' : 'text-slate-700 hover:bg-slate-50'}
                          `}
                        >
                          <Icon className="w-4 h-4 text-slate-500" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Action Area: AI Assistant Call & Account Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              id="btn-call-farmer"
              type="button"
              onClick={onOpenCall}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>AI Farmer Call</span>
            </button>

            {/* Account / Easy Role Switcher Menu */}
            <AccountMenu />

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu (Clean & Non-Overflowing) */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {userProfile.displayName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-slate-900 block">{userProfile.displayName}</span>
                <span className="text-[10px] text-emerald-700 font-bold uppercase">{userProfile.role}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Switch Role
            </button>
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase px-1 py-0.5">Navigation Menu</div>
          {[...mainTabs, ...secondaryTabs].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  onSelectTab(tab.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer
                  ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar (Thumb-friendly touch targets > 44px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 flex items-center justify-around shadow-lg">
        <button
          type="button"
          onClick={() => onSelectTab('landing')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
            currentTab === 'landing' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Sprout className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Dashboard</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('compiler')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
            currentTab === 'compiler' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <Cpu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Best Route</span>
        </button>

        {/* Center Floating AI Call Button */}
        <button
          type="button"
          onClick={onOpenCall}
          className="flex flex-col items-center justify-center -mt-4 w-12 h-12 rounded-full bg-emerald-600 text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700 active:scale-95 transition-transform"
          title="Call AI Assistant"
        >
          <PhoneCall className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('farmer')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
            currentTab === 'farmer' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Orders</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('map')}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] rounded-lg transition-colors ${
            currentTab === 'map' ? 'text-emerald-600 font-bold' : 'text-slate-500'
          }`}
        >
          <MapPin className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Map</span>
        </button>
      </div>
    </header>
  );
};
