import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, UserCheck, Database, CheckCircle, AlertCircle, Copy, Terminal, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ThreeRole } from '../../types';
import { checkSupabaseConnection, SupabaseHealthCheckResult } from '../../lib/supabase';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [health, setHealth] = useState<SupabaseHealthCheckResult | null>(null);
  const [checking, setChecking] = useState(true);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    async function verifyConnection() {
      setChecking(true);
      const res = await checkSupabaseConnection();
      setHealth(res);
      setChecking(false);
    }
    verifyConnection();
  }, []);

  const handleContinueAs = (role: ThreeRole) => {
    navigate(`/login/${role}`);
  };

  const copySqlNotice = () => {
    setCopiedSql(true);
    navigator.clipboard?.writeText(`-- Run schema.sql from supabase/schema.sql in your Supabase SQL Editor`);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        
        {/* Supabase Connection Status Banner */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 tracking-tight">Supabase Project</span>
                {checking ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    Checking...
                  </span>
                ) : health?.connected ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Connected &amp; Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                    Connection Error
                  </span>
                )}
              </div>
              <p className="text-[11px] font-mono text-slate-500">
                https://abjhusvnynwvjbiwtxho.supabase.co
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!checking && health?.connected && !health.profilesTableAccessible && (
              <button
                type="button"
                onClick={() => setShowSqlGuide(!showSqlGuide)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Run schema.sql in Supabase</span>
              </button>
            )}
            {!checking && health?.connected && health.profilesTableAccessible && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>DB Schema Ready</span>
              </span>
            )}
          </div>
        </div>

        {/* SQL Guide Dropdown/Modal */}
        {showSqlGuide && (
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-amber-700" />
                  Apply Database Tables to Supabase
                </h3>
                <p className="text-amber-800 mt-1">
                  Supabase Auth is connected! To enable the persistent <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">profiles</code>, <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">farmer_profiles</code>, <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">distributor_profiles</code>, <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">transporter_profiles</code>, <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">consumer_profiles</code>, and <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">bulk_requirements</code> tables in your PostgreSQL database:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlGuide(false)}
                className="text-amber-600 hover:text-amber-800 font-bold ml-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <ol className="list-decimal list-inside space-y-1 text-amber-800">
              <li>Open your Supabase Dashboard: <strong>https://supabase.com/dashboard/project/abjhusvnynwvjbiwtxho</strong></li>
              <li>Click on the <strong>SQL Editor</strong> in the left sidebar.</li>
              <li>Click <strong>New query</strong> and paste the contents of <code className="font-mono bg-amber-100 px-1 py-0.5 rounded font-bold">supabase/schema.sql</code>.</li>
              <li>Click <strong>Run</strong> (or press Cmd/Ctrl + Enter).</li>
            </ol>
          </div>
        )}

        {/* Brand and Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
            <span>AgriChain Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display">
            AgriChain
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-semibold max-w-xl mx-auto">
            Connect. Trade. Deliver.
          </p>

          {/* Active account indicator if already logged in */}
          {currentUser && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-xs text-xs text-slate-600">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Currently signed in as <strong>{currentUser.name}</strong> (<span className="capitalize">{currentUser.role}</span>)</span>
              <button
                type="button"
                onClick={() => navigate(`/${currentUser.role}/dashboard`)}
                className="font-bold text-emerald-600 hover:text-emerald-700 underline ml-1 cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* 4 ROLE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* CARD 1: FARMER */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                🌾
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">Farmer</h2>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Sell and manage your produce
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleContinueAs('farmer')}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Continue as Farmer</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/register/farmer')}
                className="w-full py-1.5 px-2 text-[11px] font-semibold text-slate-500 hover:text-emerald-700 transition-colors text-center cursor-pointer"
              >
                Need an account? Register
              </button>
            </div>
          </div>

          {/* CARD 2: DISTRIBUTOR */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                🏪
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">Distributor</h2>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Source, aggregate and distribute produce
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleContinueAs('distributor')}
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Continue as Distributor</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-200" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/register/distributor')}
                className="w-full py-1.5 px-2 text-[11px] font-semibold text-slate-500 hover:text-amber-700 transition-colors text-center cursor-pointer"
              >
                Need an account? Register
              </button>
            </div>
          </div>

          {/* CARD 3: CONSUMER / BULK BUYER */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-indigo-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                🍽️
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">Consumer / Bulk Buyer</h2>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Buy fresh produce directly for your business
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleContinueAs('consumer')}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Continue as Consumer</span>
                <ArrowRight className="w-3.5 h-3.5 text-indigo-200" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/register/consumer')}
                className="w-full py-1.5 px-2 text-[11px] font-semibold text-slate-500 hover:text-indigo-700 transition-colors text-center cursor-pointer"
              >
                Need an account? Register
              </button>
            </div>
          </div>

          {/* CARD 4: TRANSPORTER */}
          <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform">
                🚚
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 font-display">Transporter</h2>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  Find loads and manage deliveries
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleContinueAs('transporter')}
                className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Continue as Transporter</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/register/transporter')}
                className="w-full py-1.5 px-2 text-[11px] font-semibold text-slate-500 hover:text-blue-700 transition-colors text-center cursor-pointer"
              >
                Need an account? Register
              </button>
            </div>
          </div>
        </div>

        {/* HELPER TEXT */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            Switch account type at any time from your dashboard account menu.
          </p>
        </div>

      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-10">
        &copy; {new Date().getFullYear()} AgriChain Commerce &bull; Production Role-Based Access
      </footer>
    </div>
  );
};
