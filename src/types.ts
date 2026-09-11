export type Role = 
  | 'farmer' 
  | 'transporter' 
  | 'aggregator' 
  | 'fpo' 
  | 'buyer' 
  | 'consumer' 
  | 'admin' 
  | 'judge';

export type QualityGrade = 'Grade A' | 'Grade B' | 'Grade C';

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  acres: number;
  crops: string[];
  trustScore: number;
}

export interface Harvest {
  id: string;
  farmerId: string;
  farmerName: string;
  crop: string;
  quantityKg: number;
  location: string;
  harvestDate: string;
  sellingWindow: string;
  minAcceptablePrice: number;
  qualityGrade: QualityGrade;
  status: 'pending' | 'pooled' | 'compiled' | 'matched' | 'in_transit' | 'delivered' | 'settled';
  photoUrl?: string;
  aiQualityConfidence?: number;
  selectedChainId?: string;
  poolId?: string;
  createdAt: string;
}

export interface CostBreakdown {
  buyerPrice: number;
  aggregationFee: number;
  transportCost: number;
  gradingFee: number;
  storageFee: number;
  financeCost: number;
  platformFee: number;
  farmerNetValue: number;
}

export interface ChainNode {
  id: string;
  role: string;
  name: string;
  feePerKg: number;
  timeHours: number;
  isServiceOnly: boolean;
  serviceType?: string;
  reliabilityScore: number;
}

export interface ChainOption {
  id: string;
  title: string;
  type: 'trader_mandi' | 'dynamic_pool' | 'fpo_route' | 'direct_buyer' | 'mandi_direct';
  description: string;
  nodes: ChainNode[];
  breakdown: CostBreakdown;
  farmerNetValue: number; // per kg
  totalFarmerPayout: number; // total ₹
  totalTransitHours: number;
  reliabilityScore: number; // 0-100
  paymentReliability: number; // 0-100
  wastageRisk: 'Low' | 'Medium' | 'High';
  logisticsRisk: 'Low' | 'Medium' | 'High';
  qualityDisputeRisk: 'Low' | 'Medium' | 'High';
  overallScore: number; // 0-100 calculated
  badge?: string;
  recommendedReason: string;
  isBestNetValue?: boolean;
}

export interface FarmerPool {
  id: string;
  poolCode: string; // e.g. "AC-POOL-1024"
  crop: string;
  totalQuantityKg: number;
  farmerCount: number;
  farmers: {
    farmerId: string;
    farmerName: string;
    quantityKg: number;
    village: string;
    lat: number;
    lng: number;
  }[];
  clusterName: string;
  destination: string;
  targetBuyerPrice: number;
  status: 'forming' | 'ready' | 'matched' | 'dispatched' | 'completed';
  transporterId?: string;
  transporterVehicle?: string;
  estimatedSavings: number;
  createdAt: string;
}

export interface Transporter {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: string;
  totalCapacityKg: number;
  currentLocation: string;
  currentRoute: string;
  availableCapacityKg: number;
  rating: number;
  completedTrips: number;
  trustScore: number;
}

export interface BackhaulTrip {
  id: string;
  transporterId: string;
  transporterName: string;
  vehicleType: string;
  primaryRoute: string;
  returnRoute: string;
  origin: string;
  destination: string;
  departureTime: string;
  availableCapacityKg: number;
  standardRatePerTrip: number;
  discountedBackhaulRate: number;
  savingEstimate: number;
  status: 'open' | 'matched' | 'in_transit' | 'completed';
}

export interface Buyer {
  id: string;
  name: string;
  businessType: 'Restaurant' | 'Hotel' | 'Retailer' | 'Processor' | 'Wholesaler' | 'Institutional';
  location: string;
  contactPerson: string;
  phone: string;
  trustScore: number;
  verified: boolean;
}

export interface BuyerDemand {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerType: string;
  crop: string;
  requiredQuantityKg: number;
  qualityGrade: QualityGrade;
  requiredBy: string;
  maxLandedPrice: number;
  deliveryLocation: string;
  status: 'open' | 'matched' | 'fulfilled';
}

export interface ServiceProvider {
  id: string;
  name: string;
  type: 'Trader' | 'Aggregator' | 'Quality Assessor' | 'Cold Storage' | 'Logistics Partner';
  location: string;
  services: {
    serviceName: string;
    feePerKg: number;
    capacityPerDay: string;
    verified: boolean;
  }[];
  scorecard: {
    aggregationReliability: number;
    paymentReliability: number;
    qualityDisputeRate: number;
    avgCompletionHours: number;
    farmerNetImprovement: number;
    overallTrustScore: number;
  };
  verifiedServicesCount: number;
  quote: string;
}

export interface Transaction {
  id: string;
  harvestId: string;
  poolId?: string;
  crop: string;
  quantityKg: number;
  buyerName: string;
  grossBuyerAmount: number;
  farmerPayout: number;
  transportPayout: number;
  aggregatorPayout: number;
  qualityPayout: number;
  platformFee: number;
  status: 'buyer_escrow_funded' | 'pickup_verified' | 'delivered' | 'settled';
  pickupOtp: string;
  deliveryOtp: string;
  timeline: {
    step: string;
    timestamp: string;
    completed: boolean;
  }[];
  createdAt: string;
}

export interface QualityAnalysisResult {
  crop: string;
  estimatedGrade: QualityGrade;
  confidence: number;
  colorUniformity: number; // percentage
  visibleDefects: 'Low' | 'Medium' | 'High';
  sizeConsistency: 'High' | 'Medium' | 'Low';
  firmnessScore: number;
  recommendation: string;
  isAiAssistedEstimate: boolean;
}

export interface PriceBenchmark {
  crop: string;
  location: string;
  mandiBenchmarkMin: number;
  mandiBenchmarkMax: number;
  currentTraderOffer: number;
  suggestedFairBandMin: number;
  suggestedFairBandMax: number;
  potentialBargainingGap: number;
  lastUpdated: string;
  source: string;
}
