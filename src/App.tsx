import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CompilerView } from './components/CompilerView';
import { FarmerDashboard } from './components/FarmerDashboard';
import { DynamicPoolingView } from './components/DynamicPoolingView';
import { TransporterDashboard } from './components/TransporterDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { QualityVerificationView } from './components/QualityVerificationView';
import { CorridorMapView } from './components/CorridorMapView';
import { EscrowSettlementView } from './components/EscrowSettlementView';
import { LandingOverview } from './components/LandingOverview';
import { CallRecordsView } from './components/CallRecordsView';
import { AdminCommandCenter } from './components/AdminCommandCenter';

// Modals
import { AgriMitraVoiceModal } from './components/AgriMitraVoiceModal';
import { AIFarmerCallModal } from './components/AIFarmerCallModal';
import { AssistedAccessModal } from './components/AssistedAccessModal';
import { SellHarvestModal } from './components/SellHarvestModal';
import { AuthModal } from './components/AuthModal';

import { Harvest, ChainOption, QualityGrade } from './types';
import { SEED_HARVESTS } from './data/seedData';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { isAuthModalOpen, setIsAuthModalOpen, role } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [activeHarvests, setActiveHarvests] = useState<Harvest[]>(SEED_HARVESTS);
  
  // Modals state
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isAssistedOpen, setIsAssistedOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  const handleHarvestCreated = async (data: {
    crop: string;
    quantityKg: number;
    location: string;
    minAcceptablePrice: number;
    qualityGrade: QualityGrade;
    sellingWindow: string;
  }) => {
    const newHarvest: Harvest = {
      id: `AC-HRV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      farmerId: 'farmer-ramesh-patel',
      farmerName: 'Ramesh Patel',
      crop: data.crop,
      quantityKg: data.quantityKg,
      location: data.location,
      harvestDate: new Date().toISOString().split('T')[0],
      qualityGrade: data.qualityGrade,
      minAcceptablePrice: data.minAcceptablePrice,
      sellingWindow: data.sellingWindow,
      status: 'compiled',
      poolId: 'pool-cluster-a-tomato',
      createdAt: new Date().toISOString(),
    };

    setActiveHarvests((prev) => [newHarvest, ...prev]);
    showNotification(`✓ Harvest saved: ${data.quantityKg} kg ${data.crop} (Min ₹${data.minAcceptablePrice}/kg). Supply chain route compiled!`);
    setCurrentTab('compiler');
  };

  const handleChainAccepted = (option: ChainOption) => {
    showNotification(`✓ Accepted: "${option.title}" @ ₹${option.farmerNetValue.toFixed(2)}/kg Farmer Net. Consignment locked!`);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* Universal Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenCall={() => setIsCallOpen(true)}
        onOpenAssisted={() => setIsAssistedOpen(true)}
        onOpenQuality={() => setCurrentTab('quality')}
      />

      {/* Ephemeral Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-md text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
          <p className="font-medium">{notification}</p>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 pb-16">
        {currentTab === 'landing' && (
          <LandingOverview
            onNavigateTab={(tab) => setCurrentTab(tab)}
            onOpenCall={() => setIsCallOpen(true)}
            onOpenSellModal={() => setIsSellOpen(true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
          />
        )}

        {currentTab === 'compiler' && (
          <CompilerView onChainAccepted={handleChainAccepted} />
        )}

        {currentTab === 'calls' && (
          <CallRecordsView
            onOpenNewCall={() => setIsCallOpen(true)}
            onCompileForCrop={(crop, qty, price) => {
              setCurrentTab('compiler');
              showNotification(`Compiling optimal supply chain for ${qty}kg ${crop} (Target: ₹${price}/kg)...`);
            }}
          />
        )}

        {currentTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold text-slate-900 font-display">
                  Live Logistics &amp; Corridor Fleet Radar
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time GPS tracking of farmgate pickups, consignment hubs, and return-trip trucks across Indore &amp; Malwa.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCallOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-xs cursor-pointer"
                >
                  + Add Farmgate Pickup
                </button>
              </div>
            </div>

            <CorridorMapView onSelectChain={() => setCurrentTab('compiler')} />
          </div>
        )}

        {currentTab === 'farmer' && (
          <FarmerDashboard
            onOpenSellModal={() => setIsSellOpen(true)}
            onOpenVoice={() => setIsVoiceOpen(true)}
            onOpenCall={() => setIsCallOpen(true)}
            onOpenCompiler={() => setCurrentTab('compiler')}
            onOpenQuality={() => setCurrentTab('quality')}
            activeHarvests={activeHarvests}
          />
        )}

        {currentTab === 'pooling' && (
          <DynamicPoolingView />
        )}

        {currentTab === 'transporter' && (
          <TransporterDashboard />
        )}

        {currentTab === 'buyer' && (
          <BuyerDashboard />
        )}

        {currentTab === 'quality' && (
          <QualityVerificationView />
        )}

        {currentTab === 'escrow' && (
          <EscrowSettlementView />
        )}

        {currentTab === 'admin' && (
          <AdminCommandCenter />
        )}
      </main>

      {/* Enterprise Business Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-white font-bold font-display">
              <span>AgriChain Enterprise</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Supply Chain Operating Layer
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Direct Farmgate Sourcing &bull; Return Backhaul Fleet Matching &bull; Automated Escrow
            </p>
          </div>

          <div className="text-center sm:text-right space-y-0.5 text-[11px]">
            <p className="text-slate-300 font-medium">
              Sanwer &bull; Dewas &bull; Hatod &bull; Indore Wholesale Terminal
            </p>
            <p className="text-slate-500">
              Zero opaque middleman dealer margins. Auditable settlement per kilogram.
            </p>
          </div>
        </div>
      </footer>

      {/* Interactive Global Modals */}
      <AgriMitraVoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onHarvestCreated={handleHarvestCreated}
      />

      <AIFarmerCallModal
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        onHarvestCreated={handleHarvestCreated}
      />

      <AssistedAccessModal
        isOpen={isAssistedOpen}
        onClose={() => setIsAssistedOpen(false)}
        onHarvestCreated={handleHarvestCreated}
      />

      <SellHarvestModal
        isOpen={isSellOpen}
        onClose={() => setIsSellOpen(false)}
        onSubmitHarvest={handleHarvestCreated}
      />

      {/* Role-Based Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}
