import React, { useState } from 'react';
import { Truck, Navigation, Plus, CheckCircle2, Clock, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { Transporter, BackhaulTrip } from '../types';
import { SEED_TRANSPORTERS, SEED_BACKHAUL_TRIPS } from '../data/seedData';
import { api } from '../services/api';

export const TransporterDashboard: React.FC = () => {
  const [transporter] = useState<Transporter>(SEED_TRANSPORTERS[0]); // Jagdish Yadav
  const [backhauls, setBackhauls] = useState<BackhaulTrip[]>(SEED_BACKHAUL_TRIPS);
  const [showAddTripModal, setShowAddTripModal] = useState(false);
  const [acceptedLoadId, setAcceptedLoadId] = useState<string | null>(null);

  // New trip form state
  const [origin, setOrigin] = useState('Bhopal Bypass');
  const [destination, setDestination] = useState('Indore City / Sanwer');
  const [availableCapacity, setAvailableCapacity] = useState<number>(500);
  const [departureTime, setDepartureTime] = useState('Today 4:30 PM');

  // Available loads requiring pickup
  const availableLoads = [
    {
      id: 'load-1',
      route: 'Indore → Dewas',
      distance: '35 km',
      weight: '180 kg available',
      pickup: 'Sanwer (Village Cluster A)',
      estimatedEarnings: '₹1,200',
      crop: 'Fresh Tomato Crates',
      pickupTime: 'Today 5:00 PM',
    },
    {
      id: 'load-2',
      route: 'Sanwer → Indore Central Terminal',
      distance: '28 km',
      weight: '500 kg available',
      pickup: 'Kishan Seva Kendra Hub',
      estimatedEarnings: '₹2,100',
      crop: 'Soybean Sacks',
      pickupTime: 'Today 6:30 PM',
    },
    {
      id: 'load-3',
      route: 'Hatod → Dewas Mandi',
      distance: '42 km',
      weight: '320 kg available',
      pickup: 'Hatod Farmgate Point',
      estimatedEarnings: '₹1,650',
      crop: 'Red Onion Mesh Bags',
      pickupTime: 'Tomorrow 7:00 AM',
    },
  ];

  const handleCreateBackhaul = async () => {
    const newTrip = await api.createBackhaulTrip({
      transporterName: transporter.name,
      vehicleType: transporter.vehicleType,
      origin,
      destination,
      availableCapacityKg: availableCapacity,
      departureTime,
    });
    setBackhauls((prev) => [newTrip, ...prev]);
    setShowAddTripModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Available Loads &amp; Transport
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Accept high-paying agricultural pickup loads along your travel route.
          </p>
        </div>

        <button
          id="btn-list-return-trip"
          type="button"
          onClick={() => setShowAddTripModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-2 text-xs transition-colors cursor-pointer self-start sm:self-center active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ List Empty Return Trip</span>
        </button>
      </div>

      {/* Driver Summary Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{transporter.name}</span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-semibold">
                {transporter.vehicleNumber}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {transporter.vehicleType} &bull; Rated capacity: {transporter.totalCapacityKg} kg
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Route Match</span>
            <span className="font-bold text-emerald-700 text-sm">{transporter.efficiencyRating}%</span>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          <div>
            <span className="text-slate-400 block text-[10px]">Today&apos;s Revenue</span>
            <span className="font-bold text-slate-900 text-sm">₹3,400</span>
          </div>
        </div>
      </div>

      {/* Available Loads Section (Clean, Action-Oriented Cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-display">
            Available Loads
          </h2>
          <span className="text-xs text-slate-500">3 loads along your corridor</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {availableLoads.map((load) => (
            <div 
              key={load.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900 font-display">{load.route}</span>
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    {load.distance}
                  </span>
                </div>

                <div className="text-xl font-extrabold text-emerald-700 font-display">
                  {load.estimatedEarnings} <span className="text-xs font-normal text-slate-500">estimated earning</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Available Weight:</span>
                    <span className="font-semibold text-slate-800">{load.weight}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Pickup Location:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[180px]">{load.pickup}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Pickup Time:</span>
                    <span className="font-semibold text-slate-800">{load.pickupTime}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAcceptedLoadId(load.id)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  acceptedLoadId === load.id 
                    ? 'bg-emerald-800 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                {acceptedLoadId === load.id ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Load Confirmed</span>
                  </>
                ) : (
                  <>
                    <span>Accept Load</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: List Empty Return Trip */}
      {showAddTripModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 font-display">List Empty Return Trip</h3>
            <p className="text-xs text-slate-500">Pick up farmgate consignments on your return route.</p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Origin Point</label>
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Available Payload Capacity (kg)</label>
                <input
                  type="number"
                  value={availableCapacity}
                  onChange={(e) => setAvailableCapacity(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Departure Time</label>
                <input
                  type="text"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddTripModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateBackhaul}
                className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer"
              >
                Publish Availability
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
