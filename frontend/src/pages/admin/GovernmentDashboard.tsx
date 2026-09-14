import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchWithAuth } from '../../services/apiFetch';
import { useOrders } from '../../hooks/useOrders';
import {
  Users,
  Activity,
  Truck,
  TrendingUp,
  AlertCircle,
  Tractor,
  Layers,
  MapPin,
  ClipboardList
} from 'lucide-react';
import { RoleGuard } from '../../auth/roleGuard';

export const GovernmentDashboard: React.FC = () => {
  const [overview, setOverview] = useState<any>(null);
  const [supplyDemand, setSupplyDemand] = useState<any[]>([]);
  const [pools, setPools] = useState<any[]>([]);
  const [logistics, setLogistics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Orders integration
  const { orders, loading: ordersLoading, refreshOrders } = useOrders();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    refreshOrders();
    try {
      const [overviewRes, sdRes, poolsRes, logRes] = await Promise.all([
        fetchWithAuth('/api/government/overview'),
        fetchWithAuth('/api/government/supply-demand'),
        fetchWithAuth('/api/government/pools'),
        fetchWithAuth('/api/government/logistics')
      ]);
      setOverview(overviewRes.ok ? (await overviewRes.json()).data : null);
      setSupplyDemand(sdRes.ok ? (await sdRes.json()).data : []);
      setPools(poolsRes.ok ? (await poolsRes.json()).data : []);
      setLogistics(logRes.ok ? (await logRes.json()).data : []);
    } catch (err) {
      console.error('Failed to load government data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['government_admin']}>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-slate-900">Government Agricultural Supply Chain Command Center</h1>
              <p className="text-slate-600 mt-2">Real-time monitoring of crop pooling, logistics, and pricing.</p>
            </div>
            <button onClick={fetchData} className="px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50">
              Refresh Data
            </button>
          </header>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard icon={<Users />} title="Registered Farmers" value={overview?.registeredFarmers || 0} />
            <KpiCard icon={<Layers />} title="Active Pools" value={overview?.activePools || 0} />
            <KpiCard icon={<Truck />} title="Orders In Transit" value={overview?.ordersInTransit || 0} />
            <KpiCard icon={<TrendingUp />} title="Transporters" value={overview?.activeTransporters || 0} />
          </div>

          {/* Supply & Demand */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-600"/> Supply & Demand Gap</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="py-3 px-4 font-semibold">Crop</th>
                    <th className="py-3 px-4 font-semibold">Supply (kg)</th>
                    <th className="py-3 px-4 font-semibold">Demand (kg)</th>
                    <th className="py-3 px-4 font-semibold">Gap (kg)</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {supplyDemand.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-500">No supply/demand data available.</td></tr>
                  )}
                  {supplyDemand.map((sd, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors text-sm">
                      <td className="py-3 px-4 font-medium text-slate-900 capitalize">{sd.crop}</td>
                      <td className="py-3 px-4 text-emerald-700 font-medium">{sd.supplyQuantity}</td>
                      <td className="py-3 px-4 text-rose-700 font-medium">{sd.demandQuantity}</td>
                      <td className="py-3 px-4 font-mono">{sd.gap}</td>
                      <td className="py-3 px-4">
                        {sd.gap < 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-1 rounded-full"><AlertCircle className="w-3 h-3"/> Shortage</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">Surplus</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pool Monitoring */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Tractor className="w-5 h-5 text-amber-600"/> Pooling Activity</h2>
              <div className="space-y-4">
                {pools.length === 0 && <p className="text-sm text-slate-500">No active pools.</p>}
                {pools.slice(0, 5).map((pool, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">{pool.crop} - {pool.total_quantity_kg}kg</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> {pool.cluster_name || 'Unknown Cluster'}</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-700 uppercase tracking-wider">{pool.status}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Logistics Monitoring */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-blue-600"/> Logistics Monitoring</h2>
              <div className="space-y-4">
                {logistics.length === 0 && <p className="text-sm text-slate-500">No active transport trips.</p>}
                {logistics.slice(0, 5).map((trip, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-900">{trip.origin} → {trip.destination}</div>
                      <div className="text-xs text-slate-500 mt-1">Avail: {trip.available_capacity_kg}kg / {trip.capacity_kg}kg</div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">{trip.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Active Orders Monitoring */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><ClipboardList className="w-5 h-5 text-emerald-600"/> Order Monitoring</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500">
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">Crop</th>
                    <th className="py-3 px-4 font-semibold">Quantity</th>
                    <th className="py-3 px-4 font-semibold">Amount</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading && (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-500">Loading orders...</td></tr>
                  )}
                  {!ordersLoading && orders.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-slate-500">No active orders found.</td></tr>
                  )}
                  {orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors text-sm">
                      <td className="py-3 px-4 font-mono text-slate-500">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4 font-medium text-slate-900">{order.crop}</td>
                      <td className="py-3 px-4 text-slate-700">{order.quantity_kg} kg</td>
                      <td className="py-3 px-4 text-emerald-700 font-bold">₹{Number(order.total_amount).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full ${
                          order.status === 'DELIVERED' || order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </div>
    </RoleGuard>
  );
};

const KpiCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | number }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
    <div className="p-3 bg-slate-50 rounded-lg text-slate-600">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-slate-500">{title}</h3>
      <div className="text-2xl font-black text-slate-900 mt-1">{value}</div>
    </div>
  </div>
);
