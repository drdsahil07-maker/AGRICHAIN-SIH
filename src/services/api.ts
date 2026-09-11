import { 
  ChainOption, 
  Harvest, 
  FarmerPool, 
  BackhaulTrip, 
  BuyerDemand, 
  ServiceProvider, 
  PriceBenchmark, 
  QualityAnalysisResult 
} from '../types';
import { 
  SEED_HARVESTS, 
  SEED_POOLS, 
  SEED_BACKHAUL_TRIPS, 
  SEED_BUYER_DEMANDS, 
  SEED_SERVICE_PROVIDERS, 
  SEED_PRICE_BENCHMARKS 
} from '../data/seedData';
import { compileSupplyChains, evaluateCounterfactual, CounterfactualScenario } from './chainCompiler';

export interface CompileParams {
  crop: string;
  quantityKg: number;
  location: string;
  harvestDate?: string;
  minAcceptablePrice: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Grade C';
  preferredBuyerType?: string;
}

export const api = {
  async compileChain(params: CompileParams): Promise<{ options: ChainOption[]; bestOption: ChainOption }> {
    try {
      const res = await fetch('/api/chain/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        return { options: data.options, bestOption: data.bestOption };
      }
    } catch (e) {
      console.warn('API call failed, compiling locally:', e);
    }
    const options = compileSupplyChains({
      crop: params.crop,
      quantityKg: params.quantityKg,
      location: params.location,
      harvestDate: params.harvestDate || '2026-09-10',
      minAcceptablePrice: params.minAcceptablePrice,
      qualityGrade: params.qualityGrade,
      preferredBuyerType: params.preferredBuyerType,
    });
    return { options, bestOption: options[0] };
  },

  async getCounterfactual(scenario: 'replace_distributor' | 'replace_trader' | 'enable_backhaul' | 'full_optimal'): Promise<CounterfactualScenario> {
    try {
      const res = await fetch(`/api/chain/counterfactual?scenario=${scenario}`);
      if (res.ok) {
        const data = await res.json();
        return data.counterfactual;
      }
    } catch (e) {
      console.warn('Counterfactual API fallback:', e);
    }
    return evaluateCounterfactual(scenario);
  },

  async getHarvests(): Promise<Harvest[]> {
    try {
      const res = await fetch('/api/harvests');
      if (res.ok) {
        const data = await res.json();
        return data.harvests;
      }
    } catch (e) {
      console.warn('Harvests API fallback:', e);
    }
    return SEED_HARVESTS;
  },

  async createHarvest(payload: Partial<Harvest>): Promise<Harvest> {
    try {
      const res = await fetch('/api/harvests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        return data.harvest;
      }
    } catch (e) {
      console.warn('Create harvest API fallback:', e);
    }
    const newH: Harvest = {
      id: `AC-HRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerId: 'f-1',
      farmerName: payload.farmerName || 'Ramesh Patel',
      crop: payload.crop || 'Tomato',
      quantityKg: payload.quantityKg || 100,
      location: payload.location || 'Sanwer, Indore',
      harvestDate: new Date().toISOString().split('T')[0],
      sellingWindow: payload.sellingWindow || 'Tomorrow Morning',
      minAcceptablePrice: payload.minAcceptablePrice || 12,
      qualityGrade: payload.qualityGrade || 'Grade A',
      status: 'compiled',
      createdAt: new Date().toISOString(),
    };
    return newH;
  },

  async getPools(): Promise<FarmerPool[]> {
    try {
      const res = await fetch('/api/pools');
      if (res.ok) {
        const data = await res.json();
        return data.pools;
      }
    } catch (e) {
      console.warn('Pools API fallback:', e);
    }
    return SEED_POOLS;
  },

  async getBackhaulTrips(): Promise<BackhaulTrip[]> {
    try {
      const res = await fetch('/api/transporters/backhaul');
      if (res.ok) {
        const data = await res.json();
        return data.backhaulTrips;
      }
    } catch (e) {
      console.warn('Backhaul API fallback:', e);
    }
    return SEED_BACKHAUL_TRIPS;
  },

  async createBackhaulTrip(trip: Partial<BackhaulTrip>): Promise<BackhaulTrip> {
    try {
      const res = await fetch('/api/transporters/backhaul', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trip),
      });
      if (res.ok) {
        const data = await res.json();
        return data.trip;
      }
    } catch (e) {
      console.warn('Backhaul create fallback:', e);
    }
    return {
      id: `bh-${Date.now()}`,
      transporterId: 'tr-1',
      transporterName: trip.transporterName || 'Jagdish Yadav',
      vehicleType: trip.vehicleType || 'Tata Ace',
      primaryRoute: 'Bhopal → Indore Outbound',
      returnRoute: 'Indore → Bhopal',
      origin: trip.origin || 'Dewas Naka',
      destination: trip.destination || 'Indore City',
      departureTime: trip.departureTime || 'Tomorrow 5:00 PM',
      availableCapacityKg: trip.availableCapacityKg || 500,
      standardRatePerTrip: 4000,
      discountedBackhaulRate: 2400,
      savingEstimate: 1600,
      status: 'open',
    };
  },

  async getBuyerDemands(): Promise<BuyerDemand[]> {
    try {
      const res = await fetch('/api/buyers/demand');
      if (res.ok) {
        const data = await res.json();
        return data.demands;
      }
    } catch (e) {
      console.warn('Buyer demand fallback:', e);
    }
    return SEED_BUYER_DEMANDS;
  },

  async getServiceProviders(): Promise<ServiceProvider[]> {
    try {
      const res = await fetch('/api/service-providers');
      if (res.ok) {
        const data = await res.json();
        return data.providers;
      }
    } catch (e) {
      console.warn('Service providers fallback:', e);
    }
    return SEED_SERVICE_PROVIDERS;
  },

  async getPriceBenchmarks(): Promise<Record<string, PriceBenchmark>> {
    try {
      const res = await fetch('/api/prices/benchmark');
      if (res.ok) {
        const data = await res.json();
        return data.benchmarks;
      }
    } catch (e) {
      console.warn('Price benchmark fallback:', e);
    }
    return SEED_PRICE_BENCHMARKS;
  },

  async analyzeQuality(crop: string, base64Image?: string, sampleType: 'grade_a' | 'grade_b' = 'grade_a'): Promise<QualityAnalysisResult> {
    try {
      const res = await fetch('/api/quality/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, base64Image, sampleType }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.result;
      }
    } catch (e) {
      console.warn('Quality analyze fallback:', e);
    }
    return {
      crop,
      estimatedGrade: sampleType === 'grade_a' ? 'Grade A' : 'Grade B',
      confidence: sampleType === 'grade_a' ? 91 : 84,
      colorUniformity: sampleType === 'grade_a' ? 94 : 79,
      visibleDefects: sampleType === 'grade_a' ? 'Low' : 'Medium',
      sizeConsistency: sampleType === 'grade_a' ? 'High' : 'Medium',
      firmnessScore: sampleType === 'grade_a' ? 92 : 81,
      recommendation: sampleType === 'grade_a'
        ? 'Grade A Premium: Optimal for restaurant & hotel contracts.'
        : 'Grade B Standard: Suitable for processing or wholesale.',
      isAiAssistedEstimate: true,
    };
  },

  async processVoice(transcript: string): Promise<any> {
    try {
      const res = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      if (res.ok) {
        const data = await res.json();
        return data.extracted;
      }
    } catch (e) {
      console.warn('Voice API fallback:', e);
    }
    return {
      crop: 'Tomato',
      quantityKg: 100,
      sellingWindow: 'Tomorrow Morning',
      minAcceptablePrice: 12,
      farmerIntent: 'confirmed',
      hindiReply: 'Ram-ram ji! Aapke 100 kg tamatar ka entry taiyyar hai (bhav ₹12/kg).'
    };
  },

  async simulateFarmerCall(farmerName: string = 'Ramesh Patel', crop: string = 'Tomato', quantityKg: number = 100): Promise<any> {
    try {
      const res = await fetch('/api/calls/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerName, crop, quantityKg }),
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('Call simulation fallback:', e);
    }
    return {
      success: true,
      callId: `CALL-${Date.now()}`,
      farmerName,
      status: 'completed',
      durationSeconds: 24,
      script: [
        { speaker: 'AI Assistant', text: `Namaste ${farmerName} ji! Main AgriChain se bol raha hoon.` },
        { speaker: 'AI Assistant', text: `Aapke ${quantityKg} kg ${crop} ki entry mili hai. Kya aap ise kal bechna chahte hain?` },
        { speaker: farmerName, text: 'Haan, kal subah tak taiyyar ho jayega.', isFarmer: true },
        { speaker: 'AI Assistant', text: 'Aapka minimum bhav kya hona chahiye?' },
        { speaker: farmerName, text: '12 rupaye kilo kam se kam.', isFarmer: true },
        { speaker: 'AI Assistant', text: 'Thik hai Ramesh ji! Main aapke liye buyers aur shared transport options compile karta hoon.' }
      ],
      extractedHarvest: {
        crop,
        quantityKg,
        minAcceptablePrice: 12,
        sellingWindow: 'Tomorrow Morning',
        location: 'Sanwer (Cluster A), Indore'
      }
    };
  },

  async getAdminDashboard(): Promise<any> {
    try {
      const res = await fetch('/api/dashboard/admin');
      if (res.ok) {
        const data = await res.json();
        return data.metrics;
      }
    } catch (e) {
      console.warn('Admin dashboard fallback:', e);
    }
    return {
      totalFarmers: 420,
      activeHarvestsToday: 30,
      activeConsignmentPools: 8,
      activeTransporters: 10,
      availableReturnTrucks: 3,
      activeBuyerDemands: 10,
      averageFarmerNetValue: 14.20,
      traditionalMandiNet: 11.00,
      farmerNetGainPercentage: 29.1,
      averageLogisticsCostPerKg: 1.20,
      estimatedWastageAvoidedKg: 4250,
      completedTransactionsCount: 148,
      totalGrossVolumeInr: 1285000,
      verifiedServiceProviders: 10,
      activeTrustAlertsCount: 0
    };
  }
};
