import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Complaint, PickupRequest } from '../types';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Star,
  AlertCircle,
  Truck,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Navigation,
  Compass,
  Radio,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';

import confetti from 'canvas-confetti';
import { BackButton } from '../components/BackButton';

const PROGRESS_STATUSES = [
  'Submitted',
  'Verified',
  'Assigned to Staff',
  'Accepted',
  'Staff En Route',
  'Arrived',
  'Work In Progress',
  'Waste Collected',
  'Work Completed',
  'Closed'
];

export const TrackComplaintPage: React.FC<{
  initialId?: string;
  setCurrentTab?: (tab: string) => void;
  onBack?: () => void;
}> = ({ initialId, setCurrentTab, onBack }) => {
  const { t, language, translateStatus, translateCategory } = useLanguage();
  const { user } = useAuth();

  const [searchId, setSearchId] = useState(initialId || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [pickup, setPickup] = useState<PickupRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live Staff Location State
  const [staffLiveLocation, setStaffLiveLocation] = useState<{
    lat: number;
    lng: number;
    lastUpdated: string;
    isSharing: boolean;
    staffName?: string;
  } | null>(null);
  const [staffTrackingActive, setStaffTrackingActive] = useState<boolean>(false);
  const [staffTrackingMessage, setStaffTrackingMessage] = useState<string>('');

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // List of citizen complaints for quick picking
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [myPickups, setMyPickups] = useState<PickupRequest[]>([]);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('smartwaste_token');
      if (token) {
        fetch('/api/complaints', { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.json())
          .then(data => {
            if (data.complaints) setMyComplaints(data.complaints);
          })
          .catch(err => console.error(err));

        fetch('/api/pickups', { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.json())
          .then(data => {
            if (data.pickupRequests) setMyPickups(data.pickupRequests);
          })
          .catch(err => console.error(err));
      }
    }
  }, [user]);

  // Poll staff live location if complaint is active & assigned
  useEffect(() => {
    if (!complaint || !complaint.id || ['Resolved', 'Closed', 'Rejected', 'Work Completed'].includes(complaint.status)) {
      setStaffLiveLocation(null);
      setStaffTrackingActive(false);
      return;
    }

    const fetchStaffLocation = async () => {
      try {
        const res = await fetch(`/api/staff/location/${complaint.id}`);
        const data = await res.json();
        if (res.ok && data.live && data.location) {
          setStaffLiveLocation(data.location);
          setStaffTrackingActive(true);
          setStaffTrackingMessage(`Staff ${data.location.staffName || 'Officer'} is live on route. Last update: ${new Date(data.location.lastUpdated).toLocaleTimeString()}`);
        } else {
          setStaffTrackingActive(false);
          setStaffTrackingMessage(data.message || 'Staff live GPS tracking inactive.');
          if (data.lastUpdated) {
            setStaffLiveLocation(prev => prev ? { ...prev, isSharing: false, lastUpdated: data.lastUpdated } : null);
          }
        }
      } catch (err) {
        console.warn('Could not fetch staff live location:', err);
      }
    };

    fetchStaffLocation();
    const interval = setInterval(fetchStaffLocation, 8000);
    return () => clearInterval(interval);
  }, [complaint]);

  const handleTrack = async (idToTrack?: string) => {
    const targetId = (idToTrack || searchId).trim().toUpperCase();
    if (!targetId) return;

    setLoading(true);
    setErrorMessage('');
    setComplaint(null);
    setPickup(null);
    setFeedbackSubmitted(false);

    try {
      if (targetId.startsWith('PK-')) {
        // Track pickup
        const token = localStorage.getItem('smartwaste_token');
        const res = await fetch('/api/pickups', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await res.json();
        const found = data.pickupRequests?.find((p: PickupRequest) => p.id.toUpperCase() === targetId);
        if (found) {
          setPickup(found);
        } else {
          setErrorMessage(`Pickup request '${targetId}' was not found in Karnataka registry.`);
        }
      } else {
        // Track complaint
        const token = localStorage.getItem('smartwaste_token');
        const res = await fetch(`/api/complaints/track/${targetId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        const data = await res.json();
        if (res.ok && data.complaint) {
          setComplaint(data.complaint);
          if (data.complaint.feedbackRating) {
            setRating(data.complaint.feedbackRating);
            setFeedbackComment(data.complaint.feedbackComment || '');
            setFeedbackSubmitted(true);
          }
        } else {
          setErrorMessage(data.error || `Complaint '${targetId}' not found in registry.`);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error tracking record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialId) {
      handleTrack(initialId);
    }
  }, [initialId]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaint) return;

    setSubmittingFeedback(true);
    try {
      const token = localStorage.getItem('smartwaste_token');
      const res = await fetch(`/api/complaints/${complaint.id}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment: feedbackComment })
      });
      if (res.ok) {
        setFeedbackSubmitted(true);
        setComplaint(prev => (prev ? { ...prev, feedbackRating: rating, feedbackComment } : null));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Submitted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Under Review':
      case 'Under Verification':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Verified':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Assigned to Staff':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Accepted':
        return 'bg-violet-100 text-violet-800 border-violet-200';
      case 'Staff En Route':
        return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
      case 'Arrived':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Work In Progress':
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Waste Collected':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Work Completed':
      case 'Resolved':
      case 'Completed':
      case 'Closed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getProgressIndex = (status: string) => {
    if (status === 'Resolved' || status === 'Closed' || status === 'Work Completed') return 9;
    if (status === 'Waste Collected') return 7;
    if (status === 'Work In Progress' || status === 'In Progress') return 6;
    if (status === 'Arrived') return 5;
    if (status === 'Staff En Route') return 4;
    if (status === 'Accepted') return 3;
    if (status === 'Assigned to Staff') return 2;
    if (status === 'Verified') return 1;
    return 0;
  };

  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    if (dist < 1) {
      return `${Math.round(dist * 1000)} meters`;
    }
    return `${dist.toFixed(2)} km`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          Live Grievance Tracking
        </span>
      </div>

      <div className="text-center space-y-1">
        <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
          Citizen Transparency & Real-Time Tracking
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
          {t.trackingTitle}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Enter your unique complaint reference ID (e.g. SW-2026-000001) or pickup ID to view live progress, assigned staff, and Google Map location.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleTrack();
          }}
          className="flex flex-col sm:flex-row gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              required
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder={t.enterComplaintId}
              className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 font-mono uppercase"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loading ? (language === 'kn' ? 'ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : language === 'hi' ? 'ट्रैक किया जा रहा है...' : 'Tracking...') : t.trackBtn}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick click suggestions for logged-in user */}
        {user && (myComplaints.length > 0 || myPickups.length > 0) && (
          <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">{t.quickPickTitle}</span>
            {myComplaints.slice(0, 3).map(c => (
              <button
                key={c.id}
                onClick={() => {
                  setSearchId(c.id);
                  handleTrack(c.id);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-mono text-[11px] border border-slate-200 transition-colors cursor-pointer"
              >
                {c.id} ({translateStatus(c.status)})
              </button>
            ))}
            {myPickups.slice(0, 2).map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setSearchId(p.id);
                  handleTrack(p.id);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-mono text-[11px] border border-slate-200 transition-colors cursor-pointer"
              >
                {p.id} ({translateStatus(p.status)})
              </button>
            ))}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* COMPLAINT RESULT DISPLAY */}
      {complaint && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          {/* Header Status Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {complaint.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeColor(complaint.status)}`}>
                  {translateStatus(complaint.status)}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Submitted on {new Date(complaint.createdAt).toLocaleString()} by {complaint.citizenName}
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400 block text-[11px]">Ward Jurisdiction:</span>
              <span className="font-semibold text-slate-800">{complaint.ward}</span>
            </div>
          </div>

          {/* Progress Stepper Bar */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Civic Cleanliness Progress:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-center text-[10px]">
              {PROGRESS_STATUSES.map((st, i) => {
                const currentIdx = getProgressIndex(complaint.status);
                const isPassed = currentIdx >= i;
                const isCurrent = currentIdx === i;
                return (
                  <div
                    key={st}
                    className={`p-2 rounded-lg border font-semibold flex flex-col items-center justify-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-800 text-white border-emerald-900 ring-2 ring-emerald-500/30'
                        : isPassed
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    <span className="text-[9px] uppercase tracking-wider opacity-80">Step {i + 1}</span>
                    <span className="truncate w-full mt-0.5 font-bold">{st}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">{t.stepCategory}</span>
              <span className="font-bold text-slate-800">{translateCategory(complaint.wasteCategory)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Estimated Weight</span>
              <span className="font-bold text-emerald-700 font-mono">
                {complaint.actualCollectedKg ? `${complaint.actualCollectedKg} kg (Collected)` : `~${complaint.quantityKg} kg`}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Assigned Staff</span>
              <span className="font-bold text-slate-800">
                {complaint.assignedStaffName || 'Pending Ward Supervisor Allocation'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Contact Verified</span>
              <span className="font-bold text-slate-800 font-mono">{complaint.mobile}</span>
            </div>

            {complaint.arrivalTime && (
              <div className="col-span-2 sm:col-span-4 p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>Sanitation Staff Arrival Confirmed on Site:</span>
                </span>
                <span className="font-mono font-bold text-amber-800">
                  {new Date(complaint.arrivalTime).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Full Administrative Location Breadcrumbs */}
          <div className="p-3 bg-slate-100/70 rounded-xl border border-slate-200 text-xs space-y-1">
            <span className="text-slate-500 font-bold block text-[11px] uppercase tracking-wider">
              Reported Location Hierarchy:
            </span>
            <div className="font-semibold text-slate-800">
              Karnataka &rarr; {complaint.district} &rarr; {complaint.taluk} &rarr; {complaint.city} &rarr; {complaint.ward}
            </div>
            <div className="text-slate-600 text-[11px] pt-1">
              <span className="font-bold text-slate-700">Street / Landmark: </span>
              {complaint.street}
            </div>
          </div>

          {/* Google Maps Display with Real Staff Live Tracking Pin */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                Live Location & GIS Coordinates:
              </span>

              {staffTrackingActive && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 animate-pulse">
                  <Radio className="w-3.5 h-3.5 text-purple-600" />
                  Staff Live GPS Tracking Active
                </span>
              )}
            </div>

            <div className="w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
              <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={{ lat: complaint.lat || 12.9716, lng: complaint.lng || 77.5946 }}
                center={{ lat: complaint.lat || 12.9716, lng: complaint.lng || 77.5946 }}
                zoom={14}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                gestureHandling="cooperative"
              >
                {/* Complaint Location Marker */}
                <AdvancedMarker
                  position={{ lat: complaint.lat, lng: complaint.lng }}
                  title={`Complaint: ${complaint.id}`}
                />

                {/* Staff Live Location Marker (If sharing) */}
                {staffLiveLocation && staffLiveLocation.lat && (
                  <AdvancedMarker
                    position={{ lat: staffLiveLocation.lat, lng: staffLiveLocation.lng }}
                    title={`Staff: ${staffLiveLocation.staffName || 'Sanitation Team'}`}
                  />
                )}
              </Map>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  Complaint Pin: {complaint.lat}, {complaint.lng}
                </span>
                {staffLiveLocation && (
                  <span className="flex items-center gap-1 font-mono text-purple-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    Staff Pin: {staffLiveLocation.lat}, {staffLiveLocation.lng}
                  </span>
                )}
                {staffLiveLocation && complaint.lat && complaint.lng && (
                  <span className="flex items-center gap-1 font-mono text-purple-900 font-bold bg-purple-100/70 px-2 py-0.5 rounded border border-purple-200">
                    <Compass className="w-3.5 h-3.5 text-purple-700" />
                    Distance: ~{calculateDistanceKm(staffLiveLocation.lat, staffLiveLocation.lng, complaint.lat, complaint.lng)} away
                  </span>
                )}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${complaint.lat},${complaint.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
              >
                Open in Google Maps &rarr;
              </a>
            </div>

            {staffTrackingMessage && (
              <p className="text-[11px] text-slate-500 italic px-1">
                {staffTrackingMessage}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1 text-xs">
            <span className="font-bold text-slate-700 block">Citizen Problem Description:</span>
            <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Before & After Photo Evidence Comparison */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
              Before & After Evidence Documentation:
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Photos (Submitted by Citizen and/or Staff) */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-600" />
                  Initial & Arrival Site Evidence ({(complaint.attachments?.length || 0) + (complaint.beforePhotos?.length || 0)}):
                </span>
                
                {((complaint.attachments && complaint.attachments.length > 0) || (complaint.beforePhotos && complaint.beforePhotos.length > 0)) ? (
                  <div className="grid grid-cols-2 gap-2">
                    {complaint.attachments && complaint.attachments.map((att, i) => (
                      <div key={`att-${i}`} className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 h-28 relative group">
                        {att.type.startsWith('video') ? (
                          <div className="w-full h-full flex items-center justify-center text-white text-[10px]">
                            Video Clip ({att.name})
                          </div>
                        ) : (
                          <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                        )}
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                          Citizen Photo
                        </span>
                      </div>
                    ))}
                    {complaint.beforePhotos && complaint.beforePhotos.map((photo, i) => (
                      <div key={`before-${i}`} className="rounded-lg overflow-hidden border border-amber-300 bg-slate-900 h-28 relative group">
                        <img src={photo} alt={`Staff Arrival Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 left-1 bg-amber-700/80 text-white text-[9px] px-1.5 py-0.5 rounded font-semibold">
                          Staff Arrival Photo
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No initial photo evidence attached.</p>
                )}
              </div>

              {/* After Photos (Submitted by Staff on Completion) */}
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Completed Cleanliness Evidence ({complaint.afterPhotos?.length || 0}):
                </span>
                {complaint.afterPhotos && complaint.afterPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {complaint.afterPhotos.map((photo, i) => (
                      <div key={i} className="rounded-lg overflow-hidden border border-emerald-300 bg-slate-900 h-28">
                        <img src={photo} alt={`Cleared Site ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic">
                    {['Resolved', 'Closed', 'Work Completed'].includes(complaint.status)
                      ? 'Work resolved without completion photo upload.'
                      : 'Pending sanitation team task execution and photo verification.'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Resolution Notes & Officer Remarks */}
          {complaint.resolutionNotes && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Field Sanitation Officer Completion Remarks:</span>
              </div>
              <p className="text-slate-700">{complaint.resolutionNotes}</p>
              {complaint.actualCollectedKg && (
                <p className="text-[11px] text-emerald-800 font-mono font-semibold pt-1">
                  Actual Waste Lifted & Weighed: {complaint.actualCollectedKg} kg
                </p>
              )}
            </div>
          )}

          {/* Status Update History Timeline */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.timelineLabel}
            </h3>

            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {complaint.statusHistory && complaint.statusHistory.map((item, idx) => (
                <div key={idx} className="relative text-xs">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white"></div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-slate-900">
                      {item.status}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    By {item.actorName} ({item.actorRole}) {item.notes ? `· ${item.notes}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Feedback Form (After Resolution) */}
          {['Resolved', 'Closed', 'Work Completed'].includes(complaint.status) && (
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4 pt-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">{t.rateService}</h3>
              </div>

              {!feedbackSubmitted ? (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Satisfaction Rating (1 to 5 Stars):</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="font-bold text-slate-800 ml-2">{rating} / 5 Stars</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">Citizen Comments / Feedback:</label>
                    <textarea
                      rows={2}
                      value={feedbackComment}
                      onChange={e => setFeedbackComment(e.target.value)}
                      placeholder="Share your feedback regarding the cleanliness and promptness of the municipal staff..."
                      className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-600"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingFeedback}
                    className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {submittingFeedback ? 'Submitting...' : 'Submit Rating (+10 Eco-Points)'}
                  </button>
                </form>
              ) : (
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-amber-900 font-medium">
                  ✓ Thank you! Your satisfaction feedback has been recorded: {rating} / 5 Stars.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* PICKUP RESULT DISPLAY */}
      {pickup && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {pickup.id}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeColor(pickup.status)}`}>
                  {pickup.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Requested by {pickup.citizenName} on {new Date(pickup.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Waste Type</span>
              <span className="font-bold text-slate-800">{pickup.wasteType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Estimated Weight</span>
              <span className="font-bold text-emerald-700 font-mono">{pickup.estimatedQtyKg} kg</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Scheduled Slot</span>
              <span className="font-bold text-slate-800">{pickup.preferredDate} ({pickup.preferredTimeSlot.split(' ')[0]})</span>
            </div>
          </div>

          <div className="text-xs space-y-1">
            <span className="font-semibold text-slate-700 block">Pickup Address:</span>
            <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{pickup.address}</p>
          </div>
        </div>
      )}
    </div>
  );
};
