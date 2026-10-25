import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Complaint, PickupRequest } from '../types';
import {
  User,
  Award,
  Sparkles,
  AlertCircle,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  Calendar,
  Layers,
  Star
} from 'lucide-react';
import { BackButton } from '../components/BackButton';

export const CitizenDashboard: React.FC<{
  setCurrentTab: (tab: string) => void;
  onBack?: () => void;
}> = ({ setCurrentTab, onBack }) => {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('smartwaste_token');
    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch('/api/complaints', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/pickups', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json())
    ])
      .then(([compData, pickData]) => {
        if (compData.complaints) setComplaints(compData.complaints);
        if (pickData.pickupRequests) setPickups(pickData.pickupRequests);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <div className="text-center space-y-4">
          <User className="w-12 h-12 text-slate-300 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Sign in to Access Your Dashboard</h2>
          <p className="text-xs text-slate-500">
            Track your submitted waste complaints, view assigned staff, and monitor your Eco-Points & badges.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  // Calculate real DB statistics
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => ['Submitted', 'Assigned to Staff', 'In Progress'].includes(c.status)).length;
  const underVerification = complaints.filter(c => c.status === 'Under Verification').length;
  const resolvedComplaints = complaints.filter(c => ['Resolved', 'Closed'].includes(c.status)).length;
  const activePickups = pickups.filter(p => !['Completed', 'Cancelled'].includes(p.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
          Karnataka Citizen Grievance Portal
        </span>
      </div>

      {/* Citizen Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Karnataka Citizen Profile
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
              CITIZEN
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t.welcomeBack}, {user.name}
          </h1>
          <p className="text-xs text-slate-500">
            {user.ward} · {user.district}, Karnataka
          </p>
        </div>

        {/* Eco-Points & Badges Lockup */}
        <div className="flex items-center gap-4 bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl shrink-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-emerald-950 font-mono tabular-nums">
                {user.points || 50}
              </span>
              <span className="text-xs font-bold text-emerald-700">Eco-Points</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((b, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-semibold">
                    {b}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-400">Complete quizzes to unlock badges</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setCurrentTab('report')}
          className="p-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-left transition-all transform hover:-translate-y-0.5 shadow-xs flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-xs text-emerald-200 font-medium block">Report New Blackspot</span>
            <span className="text-sm font-bold">File Waste Complaint &rarr;</span>
          </div>
          <PlusCircle className="w-6 h-6 text-emerald-300" />
        </button>

        <button
          onClick={() => setCurrentTab('pickup')}
          className="p-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-left transition-all transform hover:-translate-y-0.5 shadow-xs flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-xs text-slate-300 font-medium block">Doorstep Bulk Collection</span>
            <span className="text-sm font-bold">Schedule Pickup &rarr;</span>
          </div>
          <Truck className="w-6 h-6 text-emerald-400" />
        </button>

        <button
          onClick={() => setCurrentTab('quiz')}
          className="p-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white text-left transition-all transform hover:-translate-y-0.5 shadow-xs flex items-center justify-between cursor-pointer"
        >
          <div>
            <span className="text-xs text-teal-200 font-medium block">Segregation Knowledge</span>
            <span className="text-sm font-bold">Take Quiz (+50 Pts) &rarr;</span>
          </div>
          <Award className="w-6 h-6 text-amber-300" />
        </button>
      </div>

      {/* 5 Real DB Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Filed</span>
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{totalComplaints}</span>
          <p className="text-[11px] text-slate-400">All-time complaints</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Pending</span>
          <span className="text-2xl font-black text-amber-600 font-mono tabular-nums">{pendingComplaints}</span>
          <p className="text-[11px] text-slate-400">In queue or field</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-semibold text-sky-700 uppercase tracking-wider block">Under Verification</span>
          <span className="text-2xl font-black text-sky-600 font-mono tabular-nums">{underVerification}</span>
          <p className="text-[11px] text-slate-400">Ward review</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Resolved</span>
          <span className="text-2xl font-black text-emerald-600 font-mono tabular-nums">{resolvedComplaints}</span>
          <p className="text-[11px] text-slate-400">Completed cleanups</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1 col-span-2 md:col-span-1">
          <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">Active Pickups</span>
          <span className="text-2xl font-black text-indigo-600 font-mono tabular-nums">{activePickups}</span>
          <p className="text-[11px] text-slate-400">Scheduled collections</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            {t.recentComplaints} ({complaints.length})
          </h3>
          <button
            onClick={() => setCurrentTab('track')}
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
          >
            Track in Detail &rarr;
          </button>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">No Complaints Logged</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have not submitted any waste complaints yet. Your neighborhood is clean and green!
            </p>
            <button
              onClick={() => setCurrentTab('report')}
              className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Report Your First Complaint
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-y border-slate-200 text-slate-500">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Complaint ID</th>
                  <th className="py-2.5 px-3 font-semibold">Waste Category</th>
                  <th className="py-2.5 px-3 font-semibold">Location</th>
                  <th className="py-2.5 px-3 font-semibold">Est. Qty</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                  <th className="py-2.5 px-3 font-semibold">Date</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{c.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{c.wasteCategory}</td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-xs">{c.street}, {c.ward}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{c.quantityKg} kg</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setCurrentTab('track')}
                        className="text-emerald-700 hover:text-emerald-900 font-bold text-xs"
                      >
                        Track &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
