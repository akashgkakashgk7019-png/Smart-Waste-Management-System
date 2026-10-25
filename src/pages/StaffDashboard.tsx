import React, { useState, useEffect, useRef } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Complaint, PickupRequest, StatusHistoryItem } from '../types';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Camera,
  AlertCircle,
  FileCheck,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Upload,
  Radio,
  Navigation,
  Compass,
  ExternalLink,
  Trash2,
  Video,
  Play,
  Eye,
  Award,
  DollarSign,
  CreditCard,
  TrendingUp,
  BarChart3,
  User,
  Bell,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  FileText,
  Check,
  X,
  Route
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BackButton } from '../components/BackButton';

interface StaffLocationCoords {
  lat: number;
  lng: number;
  accuracy?: number;
  speed?: number | null;
  heading?: number | null;
  timestamp: string;
}

interface PerformanceData {
  monthly: {
    monthName: string;
    completedTasksCount: number;
    totalKgCollected: number;
    onTimeRatePercent: number;
    averageResolutionHours: number;
    attendanceDays: number;
  };
  yearly: {
    year: number;
    completedTasksCount: number;
    totalTonnageMetricTons: number;
    citizenRatingAvg: number;
    cleanlinessRank: string;
  };
  allowanceAndPay: {
    baseDutyDays: number;
    dailyRate: number;
    baseSalaryAmount: number;
    taskIncentivesAmount: number;
    highPriorityBonus: number;
    grossEarnings: number;
    deductionsPFESI: number;
    netDisbursableAmount: number;
    payoutMethod: string;
    payoutStatus: string;
    treasuryAccountNo: string;
    lastDisbursedDate: string;
    lastDisbursedAmount: number;
    verifiedPaymentRecords?: Array<{
      id: string;
      period: string;
      year: number;
      month: number;
      baseDutyDays: number;
      dailyRate: number;
      baseAmount: number;
      taskIncentiveAmount: number;
      bonusAmount: number;
      deductions: number;
      totalAmount: number;
      status: string;
      paymentDate?: string;
      paymentMethod?: string;
      transactionRef?: string;
      notes?: string;
    }>;
    yearlySummary?: {
      year: number;
      totalDisbursed: number;
      totalPending: number;
      totalDutyDays: number;
      recordsCount: number;
    };
    recentDisbursements?: Array<{
      month: string;
      amount: number;
      date: string;
      refId: string;
      status: string;
    }>;
  };
}

export const StaffDashboard: React.FC<{
  setCurrentTab: (tab: string) => void;
  onBack?: () => void;
}> = ({ setCurrentTab, onBack }) => {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  // Active Main Dashboard Sub-Tab
  const [activeTab, setActiveTab] = useState<'queue' | 'map' | 'performance' | 'profile'>('queue');
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'inprogress' | 'completed' | 'pickups'>('all');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');

  // Tasks & Server Data
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [stats, setStats] = useState({
    totalAssignedComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalAssignedPickups: 0,
    pendingPickups: 0,
    resolvedPickups: 0,
    priorityCount: 0,
    todayDate: ''
  });
  const [loading, setLoading] = useState(true);

  // Live Staff Location State (Real GPS)
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const [currentStaffCoords, setCurrentStaffCoords] = useState<StaffLocationCoords | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'acquiring' | 'active' | 'denied' | 'unavailable' | 'timeout'>('idle');
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Map Selected Item
  const [selectedMapItem, setSelectedMapItem] = useState<{ type: 'complaint' | 'pickup'; data: any } | null>(null);

  // Expanded History or Evidence Drawers
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);
  const [expandedEvidenceId, setExpandedEvidenceId] = useState<string | null>(null);

  // Completion Modal State
  const [activeTask, setActiveTask] = useState<{ type: 'complaint' | 'pickup'; data: any } | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actualCollectedKg, setActualCollectedKg] = useState<number>(25);
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);
  const [evidenceVideos, setEvidenceVideos] = useState<string[]>([]);
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [modalValidationError, setModalValidationError] = useState('');

  // Fetch Tasks and Staff Data
  const fetchStaffTasks = async () => {
    const token = localStorage.getItem('smartwaste_token');
    if (!token) return;

    try {
      const res = await fetch('/api/staff/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
        setPickups(data.pickupRequests || []);
        if (data.notifications) setNotifications(data.notifications);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching staff tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Performance & Section 4 Payment Info
  const fetchPerformance = async () => {
    const token = localStorage.getItem('smartwaste_token');
    if (!token) return;

    try {
      const res = await fetch('/api/staff/performance', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPerformance(data);
      }
    } catch (err) {
      console.error('Error fetching performance:', err);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'STAFF' || user.role === 'ADMIN')) {
      fetchStaffTasks();
      fetchPerformance();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Clean up GPS watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  // Request Current Location (One-shot GPS ping)
  const requestInstantGps = () => {
    setGpsErrorMsg(null);
    if (!navigator.geolocation) {
      setGpsStatus('unavailable');
      setGpsErrorMsg('Geolocation is not supported by your current browser.');
      return;
    }

    setGpsStatus('acquiring');
    navigator.geolocation.getCurrentPosition(
      pos => {
        if (!pos.coords || isNaN(pos.coords.latitude) || isNaN(pos.coords.longitude)) {
          setGpsStatus('unavailable');
          setGpsErrorMsg('Invalid GPS coordinate data returned by device hardware.');
          return;
        }

        const newCoords: StaffLocationCoords = {
          lat: parseFloat(pos.coords.latitude.toFixed(5)),
          lng: parseFloat(pos.coords.longitude.toFixed(5)),
          accuracy: Math.round(pos.coords.accuracy || 0),
          speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : null,
          heading: pos.coords.heading ? Math.round(pos.coords.heading) : null,
          timestamp: new Date().toLocaleTimeString()
        };

        setCurrentStaffCoords(newCoords);
        setGpsStatus('active');
        setGpsErrorMsg(null);

        // Update backend
        const token = localStorage.getItem('smartwaste_token');
        if (token) {
          fetch('/api/staff/location', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              lat: newCoords.lat,
              lng: newCoords.lng,
              isSharing: isSharingLocation,
              heading: newCoords.heading || 0,
              speed: newCoords.speed || 0
            })
          }).catch(() => {});
        }
      },
      err => {
        handleGeolocationError(err);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Continuous GPS Broadcasting Toggle
  const toggleLocationSharing = (complaintId?: string) => {
    setGpsErrorMsg(null);

    if (isSharingLocation) {
      // Stop broadcast
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsSharingLocation(false);
      setGpsStatus('idle');

      // Inform backend
      const token = localStorage.getItem('smartwaste_token');
      if (token && currentStaffCoords) {
        fetch('/api/staff/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            lat: currentStaffCoords.lat,
            lng: currentStaffCoords.lng,
            complaintId: complaintId || '',
            isSharing: false
          })
        }).catch(() => {});
      }
    } else {
      // Start continuous broadcast
      if (!navigator.geolocation) {
        setGpsStatus('unavailable');
        setGpsErrorMsg('Geolocation is not supported by your current browser.');
        return;
      }

      setGpsStatus('acquiring');
      setIsSharingLocation(true);
      const token = localStorage.getItem('smartwaste_token');

      watchIdRef.current = navigator.geolocation.watchPosition(
        pos => {
          if (!pos.coords || isNaN(pos.coords.latitude) || isNaN(pos.coords.longitude)) {
            setGpsStatus('unavailable');
            setGpsErrorMsg('Incomplete GPS coordinate data received.');
            return;
          }

          const newCoords: StaffLocationCoords = {
            lat: parseFloat(pos.coords.latitude.toFixed(5)),
            lng: parseFloat(pos.coords.longitude.toFixed(5)),
            accuracy: Math.round(pos.coords.accuracy || 0),
            speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : null,
            heading: pos.coords.heading ? Math.round(pos.coords.heading) : null,
            timestamp: new Date().toLocaleTimeString()
          };

          setCurrentStaffCoords(newCoords);
          setGpsStatus('active');
          setGpsErrorMsg(null);

          // Push real-time coordinates to backend
          if (token) {
            fetch('/api/staff/location', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                lat: newCoords.lat,
                lng: newCoords.lng,
                complaintId: complaintId || '',
                isSharing: true,
                heading: newCoords.heading || 0,
                speed: newCoords.speed || 0
              })
            }).catch(() => {});
          }
        },
        err => {
          setIsSharingLocation(false);
          handleGeolocationError(err);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 3000 }
      );
    }
  };

  // Helper to handle Geolocation errors according to W3C specification
  const handleGeolocationError = (err: GeolocationPositionError) => {
    console.warn('Geolocation Error:', err);
    if (err.code === 1) {
      setGpsStatus('denied');
      setGpsErrorMsg(
        'Location permission denied by browser. Please tap the lock / site settings icon next to your URL bar, set Location to "Allow", and retry.'
      );
    } else if (err.code === 2) {
      setGpsStatus('unavailable');
      setGpsErrorMsg(
        'GPS position unavailable. Unable to acquire satellite signal. Please verify that your device GPS / Location toggle is switched on.'
      );
    } else if (err.code === 3) {
      setGpsStatus('timeout');
      setGpsErrorMsg('GPS location acquisition timed out. Please step into an open area with clear sky view and retry.');
    } else {
      setGpsStatus('unavailable');
      setGpsErrorMsg('An unexpected error occurred while accessing device GPS.');
    }
  };

  // Calculate distance in km or meters between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    if (dist < 1) {
      return `${Math.round(dist * 1000)} m`;
    }
    return `${dist.toFixed(2)} km`;
  };

  // Progressive Status Updater (Accepted, Staff En Route, Arrived, Work In Progress, Waste Collected)
  const updateTaskStatus = async (complaintId: string, newStatus: string, defaultNote?: string, extraData?: any) => {
    const token = localStorage.getItem('smartwaste_token');
    try {
      const res = await fetch(`/api/staff/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          notes: defaultNote || `Sanitation officer updated task status to ${newStatus}`,
          ...extraData
        })
      });
      if (res.ok) {
        fetchStaffTasks();
        fetchPerformance();
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  // Handle Before Photo Selection / Live Capture
  const handleBeforePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalValidationError('');
    const files = e.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    if (file.size > 15 * 1024 * 1024) {
      setModalValidationError('File size exceeds 15MB limit. Please capture or select a smaller image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setModalValidationError('Invalid file format. Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBeforePhotos(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle After Photo Selection / Live Capture
  const handleAfterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalValidationError('');
    const files = e.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    if (file.size > 15 * 1024 * 1024) {
      setModalValidationError('File size exceeds 15MB limit. Please capture or select a smaller image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setModalValidationError('Invalid file format. Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAfterPhotos(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Handle Video Evidence Selection / Live Video Capture
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setModalValidationError('');
    const files = e.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    if (file.size > 15 * 1024 * 1024) {
      setModalValidationError('Video file size exceeds 15MB limit. Please record a shorter 5–10 second clip.');
      return;
    }

    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!validVideoTypes.includes(file.type) && !file.type.startsWith('video/')) {
      setModalValidationError('Invalid video format. Supported formats: MP4, WebM, QuickTime.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setEvidenceVideos(prev => [...prev, reader.result as string]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Discard / Delete selected evidence items
  const removeBeforePhoto = (index: number) => {
    setBeforePhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeAfterPhoto = (index: number) => {
    setAfterPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const removeEvidenceVideo = (index: number) => {
    setEvidenceVideos(prev => prev.filter((_, i) => i !== index));
  };

  // Handle Complete Task Submission with strict validation
  const handleCompleteTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalValidationError('');
    if (!activeTask) return;

    // Strict evidence validation requirement
    if (activeTask.type === 'complaint') {
      if (afterPhotos.length === 0 && evidenceVideos.length === 0) {
        setModalValidationError('Mandatory evidence missing: You must upload at least one cleared site photo or video before completing this task.');
        return;
      }

      if (!resolutionNotes || resolutionNotes.trim().length < 5) {
        setModalValidationError('Please write detailed sanitation officer remarks (minimum 5 characters).');
        return;
      }

      if (actualCollectedKg <= 0) {
        setModalValidationError('Please enter a valid collected weight in kg (greater than 0).');
        return;
      }
    }

    setSubmittingAction(true);
    setActionSuccess('');
    const token = localStorage.getItem('smartwaste_token');

    try {
      if (activeTask.type === 'complaint') {
        const res = await fetch(`/api/staff/complaints/${activeTask.data.id}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            resolutionNotes: resolutionNotes.trim(),
            actualCollectedKg,
            beforePhotos: beforePhotos.length > 0 ? beforePhotos : (activeTask.data.beforePhotos || []),
            afterPhotos,
            evidenceVideos
          })
        });

        const data = await res.json();
        if (res.ok) {
          setActionSuccess(`Complaint ${activeTask.data.id} marked as Resolved! Citizen & Admin notified.`);
          confetti({ particleCount: 90, spread: 65, origin: { y: 0.6 } });

          // Turn off live broadcast if active
          if (isSharingLocation) {
            toggleLocationSharing();
          }

          setTimeout(() => {
            setActiveTask(null);
            fetchStaffTasks();
            fetchPerformance();
          }, 1400);
        } else {
          setModalValidationError(data.error || 'Failed to complete task.');
        }
      } else {
        // Doorstep Pickup completion
        const res = await fetch(`/api/staff/pickups/${activeTask.data.id}/complete`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            completionNotes: resolutionNotes.trim() || 'Doorstep bulk collection completed successfully.',
            photoUrl: afterPhotos[0] || undefined
          })
        });

        const data = await res.json();
        if (res.ok) {
          setActionSuccess(`Pickup ${activeTask.data.id} marked as Completed!`);
          setTimeout(() => {
            setActiveTask(null);
            fetchStaffTasks();
            fetchPerformance();
          }, 1200);
        } else {
          setModalValidationError(data.error || 'Failed to complete pickup.');
        }
      }
    } catch (err: any) {
      setModalValidationError(err.message || 'Network error submitting work completion.');
    } finally {
      setSubmittingAction(false);
    }
  };

  // Auth gate
  if (!user || (user.role !== 'STAFF' && user.role !== 'ADMIN')) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Municipal Staff Portal Access Restricted</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          This portal is reserved for authorized Karnataka municipal waste collection supervisors, Pourakarmikas, and conservancy drivers.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
        >
          Sign In as Staff
        </button>
      </div>
    );
  }

  // Filter tasks
  const filteredComplaints = complaints.filter(c => {
    // Sub-tab filter
    if (taskFilter === 'pending' && ['Resolved', 'Closed', 'Rejected'].includes(c.status)) return false;
    if (taskFilter === 'inprogress' && !['Staff En Route', 'Arrived', 'Work In Progress', 'In Progress', 'Waste Collected'].includes(c.status)) return false;
    if (taskFilter === 'completed' && !['Resolved', 'Closed', 'Work Completed'].includes(c.status)) return false;
    if (taskFilter === 'pickups') return false;

    // Search query
    if (taskSearchQuery.trim()) {
      const q = taskSearchQuery.toLowerCase();
      const match =
        c.id.toLowerCase().includes(q) ||
        c.street.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.wasteCategory.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const filteredPickups = pickups.filter(p => {
    if (taskFilter === 'pending' && p.status === 'Completed') return false;
    if (taskFilter === 'inprogress' && p.status !== 'In Progress' && p.status !== 'Assigned') return false;
    if (taskFilter === 'completed' && p.status !== 'Completed') return false;

    if (taskSearchQuery.trim()) {
      const q = taskSearchQuery.toLowerCase();
      const match =
        p.id.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.wasteType.toLowerCase().includes(q) ||
        p.citizenName.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Calculate Map Center (prefer current staff GPS, otherwise first complaint or Bengaluru default)
  const mapCenter = currentStaffCoords
    ? { lat: currentStaffCoords.lat, lng: currentStaffCoords.lng }
    : complaints.length > 0
    ? { lat: complaints[0].lat, lng: complaints[0].lng }
    : { lat: 12.9344, lng: 77.6214 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            Karnataka Municipal Field Operations Console
          </span>
        </div>
      </div>

      {/* Header Banner with Profile Summary */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Department of Municipal Administration · Ward Beat Operations
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-bold font-mono">
              STAFF ACTIVE
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-purple-900/60 text-purple-200 font-mono border border-purple-500/40">
              ID: {user.id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {user.name}
          </h1>
          <p className="text-xs text-slate-300 flex items-center gap-2 flex-wrap">
            <span>
              <strong className="text-slate-100 font-semibold">Assigned Service Area:</strong> {user.ward} · {user.district}
            </span>
            <span className="text-slate-600">•</span>
            <span>
              <strong className="text-slate-100 font-semibold">Contact:</strong> +91 {user.mobile}
            </span>
          </p>
        </div>

        {/* Quick KPI Stat Pills */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700/80 text-center min-w-[90px]">
            <span className="text-xl font-bold font-mono text-emerald-400 block tabular-nums">
              {stats.pendingComplaints}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Active Tasks</span>
          </div>
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700/80 text-center min-w-[90px]">
            <span className="text-xl font-bold font-mono text-amber-400 block tabular-nums">
              {stats.priorityCount}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">High Priority</span>
          </div>
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700/80 text-center min-w-[90px]">
            <span className="text-xl font-bold font-mono text-white block tabular-nums">
              {stats.resolvedComplaints + stats.resolvedPickups}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Cleared</span>
          </div>
          <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700/80 text-center min-w-[90px]">
            <span className="text-xl font-bold font-mono text-purple-300 block tabular-nums">
              {user.points || 450}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Cleanliness Pts</span>
          </div>
        </div>
      </div>

      {/* Primary Dashboard Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('queue')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'queue'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Assigned Tasks & Queue ({complaints.length + pickups.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('map');
            if (!currentStaffCoords) requestInstantGps();
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'map'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>GIS Beat Map & GPS Navigation</span>
          {isSharingLocation && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab('performance');
            fetchPerformance();
          }}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'performance'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Work Performance & Allowance (Sec 4)</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            activeTab === 'profile'
              ? 'bg-emerald-800 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Officer Profile & Service Area</span>
          {notifications.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black">
              {notifications.length}
            </span>
          )}
        </button>
      </div>

      {/* =========================================================================
          SECTION A: STAFF LOCATION, GPS, AND MAPS (Live Geolocation Control Bar)
         ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${
                isSharingLocation
                  ? 'bg-purple-600 text-white animate-pulse'
                  : currentStaffCoords
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              <Radio className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Staff Geolocation & Field Telematics
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isSharingLocation
                      ? 'bg-purple-100 text-purple-900 border border-purple-200 font-mono'
                      : currentStaffCoords
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono'
                      : 'bg-slate-100 text-slate-600 font-mono'
                  }`}
                >
                  {isSharingLocation ? 'LIVE BROADCASTING ON BEAT' : currentStaffCoords ? 'GPS FIX ACQUIRED' : 'OFFLINE'}
                </span>
                {currentStaffCoords && (
                  <span className="text-[11px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {currentStaffCoords.lat}° N, {currentStaffCoords.lng}° E
                    {currentStaffCoords.accuracy ? ` (±${currentStaffCoords.accuracy}m)` : ''}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                {isSharingLocation
                  ? `Broadcasting actual GPS coordinates to citizen tracking & municipal admin dispatch. Last ping: ${currentStaffCoords?.timestamp || 'Updating...'}`
                  : currentStaffCoords
                  ? `Device GPS fix acquired at ${currentStaffCoords.timestamp}. Enable continuous broadcast while driving to provide turn-by-turn citizen arrival updates.`
                  : 'Acquire actual GPS coordinates using your device hardware to enable route planning, turn-by-turn navigation, and live citizen tracking.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 flex-wrap">
            <button
              type="button"
              onClick={requestInstantGps}
              disabled={gpsStatus === 'acquiring'}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${gpsStatus === 'acquiring' ? 'animate-spin' : ''}`} />
              <span>{gpsStatus === 'acquiring' ? 'Acquiring GPS...' : 'Acquire Current GPS Fix'}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleLocationSharing()}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-2 ${
                isSharingLocation
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-purple-700 hover:bg-purple-800 text-white'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>{isSharingLocation ? 'Stop GPS Broadcast' : 'Start Live GPS Broadcast'}</span>
            </button>

            <div
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-200 flex items-center gap-1.5"
              title="Route optimization & collection beat planning are restricted to Municipal Administrator dispatch"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Beat Route: Admin Dispatch</span>
            </div>
          </div>
        </div>

        {/* GPS Error & Permission Guidance Banners */}
        {gpsErrorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">GPS Notice ({gpsStatus.toUpperCase()})</p>
                <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">{gpsErrorMsg}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setGpsErrorMsg(null)}
              className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer p-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          TAB 1: ASSIGNED TASKS & WORK LOCATIONS QUEUE
         ========================================================================= */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Dedicated Route Planner Callout Banner */}
          <div className="bg-linear-to-r from-blue-900 via-slate-900 to-emerald-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md border border-blue-800/40">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase font-mono tracking-wider">
                  NEW SMARTWASTE FEATURE
                </span>
                <span className="text-xs text-blue-200 font-semibold">
                  Multi-Stop Beat Route Optimization
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <Route className="w-5 h-5 text-blue-400" />
                <span>SMARTWASTE Route Planner</span>
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Plan smarter routes. Reduce fuel consumption. Keep communities clean. Optimize your visiting sequence across all assigned stops and launch turn-by-turn navigation in Google Maps.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab('route-planner')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0 whitespace-nowrap active:scale-95"
            >
              <Navigation className="w-4 h-4 text-white" />
              <span>Launch Route Planner</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Filters and Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
              <button
                onClick={() => setTaskFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                  taskFilter === 'all'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Tasks ({complaints.length + pickups.length})
              </button>
              <button
                onClick={() => setTaskFilter('pending')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                  taskFilter === 'pending'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Active Complaints ({stats.pendingComplaints})
              </button>
              <button
                onClick={() => setTaskFilter('inprogress')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                  taskFilter === 'inprogress'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                In Progress ({complaints.filter(c => ['Staff En Route', 'Arrived', 'Work In Progress', 'In Progress', 'Waste Collected'].includes(c.status)).length})
              </button>
              <button
                onClick={() => setTaskFilter('completed')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                  taskFilter === 'completed'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Completed & Evidence ({stats.resolvedComplaints + stats.resolvedPickups})
              </button>
              <button
                onClick={() => setTaskFilter('pickups')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer shrink-0 ${
                  taskFilter === 'pickups'
                    ? 'bg-emerald-800 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Scheduled Pickups ({pickups.length})
              </button>
            </div>

            <div className="w-full sm:w-64">
              <input
                type="text"
                placeholder="Search ID, street, or ward..."
                value={taskSearchQuery}
                onChange={e => setTaskSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Assigned Complaints List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Assigned Waste Grievances ({filteredComplaints.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Karnataka Ward Beat Queue</span>
            </div>

            {filteredComplaints.length === 0 ? (
              <div className="text-center py-12 text-slate-500 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No complaints matching current filter.</p>
                <p className="text-[11px] text-slate-400">All assigned ward spots are cleared or matching other filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredComplaints.map(c => {
                  const isCompleted = ['Resolved', 'Closed', 'Work Completed'].includes(c.status);
                  const isEnRoute = c.status === 'Staff En Route';
                  const isArrived = c.status === 'Arrived';
                  const isWorking = c.status === 'Work In Progress' || c.status === 'In Progress';
                  const isWasteCollected = c.status === 'Waste Collected';

                  // Calculate live distance if staff GPS is known
                  const liveDistance = currentStaffCoords
                    ? calculateDistance(currentStaffCoords.lat, currentStaffCoords.lng, c.lat, c.lng)
                    : null;

                  return (
                    <div
                      key={c.id}
                      className={`p-5 rounded-2xl border transition-all space-y-4 ${
                        isCompleted
                          ? 'bg-slate-50/70 border-slate-200'
                          : c.priority === 'High' || c.priority === 'Emergency'
                          ? 'bg-red-50/20 border-red-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                      }`}
                    >
                      {/* Top Row: Task ID, Waste Category, Priority, and Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono font-bold text-slate-900 text-sm">{c.id}</span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200">
                            {c.wasteCategory}
                          </span>
                          {c.priority && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                                c.priority === 'High' || c.priority === 'Emergency'
                                  ? 'bg-red-100 text-red-800 border border-red-200 font-mono'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {c.priority} Priority
                            </span>
                          )}
                          {liveDistance && (
                            <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-semibold flex items-center gap-1">
                              <Compass className="w-3 h-3 text-purple-600" />
                              <span>{liveDistance} away</span>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-mono px-3 py-1 rounded-lg font-bold border ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : isWorking
                                ? 'bg-indigo-100 text-indigo-900 border-indigo-300 animate-pulse'
                                : isEnRoute
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : isArrived
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            Status: {c.status}
                          </span>
                        </div>
                      </div>

                      {/* Location Details & Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-600 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                            Street & Landmark:
                          </span>
                          <p className="font-medium text-slate-900 truncate mt-0.5">{c.street}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                            Service Area / Ward:
                          </span>
                          <p className="font-medium text-slate-900 truncate mt-0.5">{c.ward}, {c.district}</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                            Estimated Weight / Qty:
                          </span>
                          <p className="font-mono font-bold text-emerald-800 mt-0.5">~{c.quantityKg} kg</p>
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wide">
                            Citizen Reporter:
                          </span>
                          <p className="text-slate-900 mt-0.5 flex items-center gap-1.5 font-medium">
                            <span>{c.citizenName}</span>
                            <a
                              href={`tel:${c.mobile}`}
                              className="text-emerald-700 hover:text-emerald-900 font-mono font-bold underline inline-flex items-center gap-0.5"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{c.mobile}</span>
                            </a>
                          </p>
                        </div>
                      </div>

                      {/* Citizen Description */}
                      {c.description && (
                        <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-900">Citizen Observation: </span>
                          {c.description}
                        </p>
                      )}

                      {/* Expandable Status History Timeline */}
                      <div className="border-t border-slate-100 pt-2 text-xs">
                        <button
                          onClick={() => setExpandedHistoryId(expandedHistoryId === c.id ? null : c.id)}
                          className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5 cursor-pointer py-1"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Status Timeline & Audit History ({c.statusHistory?.length || 1} records)</span>
                          {expandedHistoryId === c.id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {expandedHistoryId === c.id && (
                          <div className="mt-2.5 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            {c.statusHistory && c.statusHistory.length > 0 ? (
                              c.statusHistory.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-[11px] pb-1.5 border-b border-slate-200 last:border-none">
                                  <span className="font-mono text-slate-500 shrink-0">
                                    {new Date(item.timestamp).toLocaleString()}
                                  </span>
                                  <span className="font-bold text-slate-900 shrink-0">[{item.status}]</span>
                                  <span className="text-slate-600">
                                    by {item.actorName} ({item.actorRole}): {item.notes || 'Status updated'}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-[11px] text-slate-500">Initial registration recorded at {new Date(c.createdAt).toLocaleString()}.</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* For Completed Tasks: Show Uploaded Evidence & Timestamps */}
                      {isCompleted && (
                        <div className="border-t border-slate-100 pt-2 text-xs">
                          <button
                            onClick={() => setExpandedEvidenceId(expandedEvidenceId === c.id ? null : c.id)}
                            className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1.5 cursor-pointer py-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-emerald-700" />
                            <span>
                              View Work Completion Evidence ({(c.afterPhotos?.length || 0)} photos, {(c.evidenceVideos?.length || 0)} videos)
                            </span>
                            {expandedEvidenceId === c.id ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {expandedEvidenceId === c.id && (
                            <div className="mt-2.5 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                              <div className="flex items-center justify-between text-[11px] text-slate-600">
                                <span>
                                  <strong>Completed At:</strong> {c.completedAt ? new Date(c.completedAt).toLocaleString() : new Date(c.updatedAt).toLocaleString()}
                                </span>
                                <span>
                                  <strong>Actual Cleared Weight:</strong> {c.actualCollectedKg || c.quantityKg} kg
                                </span>
                              </div>

                              {c.resolutionNotes && (
                                <p className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-emerald-200">
                                  <strong>Sanitation Remarks:</strong> {c.resolutionNotes}
                                </p>
                              )}

                              {/* After Photos Grid */}
                              {c.afterPhotos && c.afterPhotos.length > 0 && (
                                <div>
                                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                                    Cleared Site 'After' Photos:
                                  </span>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {c.afterPhotos.map((photo, pIdx) => (
                                      <div key={pIdx} className="h-28 rounded-xl overflow-hidden border border-emerald-300 bg-slate-900">
                                        <img src={photo} alt={`Evidence ${pIdx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Evidence Videos */}
                              {c.evidenceVideos && c.evidenceVideos.length > 0 && (
                                <div className="pt-2">
                                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">
                                    Verified Live Video Records:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {c.evidenceVideos.map((video, vIdx) => (
                                      <div key={vIdx} className="rounded-xl overflow-hidden border border-emerald-300 bg-black">
                                        <video src={video} controls className="w-full h-40 object-cover" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Multi-Stage Task Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* In-App Map Selection */}
                          <button
                            onClick={() => {
                              setSelectedMapItem({ type: 'complaint', data: c });
                              setActiveTab('map');
                            }}
                            className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                            <span>View on GIS Map</span>
                          </button>

                          {/* External Google Maps Turn-By-Turn Navigation */}
                          <a
                            href={
                              currentStaffCoords
                                ? `https://www.google.com/maps/dir/?api=1&origin=${currentStaffCoords.lat},${currentStaffCoords.lng}&destination=${c.lat},${c.lng}`
                                : `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 rounded-lg font-semibold flex items-center gap-1.5 shadow-2xs"
                          >
                            <Navigation className="w-3.5 h-3.5 text-blue-700" />
                            <span>Turn-by-Turn Navigation</span>
                          </a>
                        </div>

                        {/* Multi-Stage Workflow Execution Buttons */}
                        {!isCompleted && (
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Status: Assigned / Submitted -> Accept */}
                            {(c.status === 'Assigned to Staff' || c.status === 'Submitted') && (
                              <button
                                onClick={() => updateTaskStatus(c.id, 'Accepted', 'Task accepted by sanitation beat officer')}
                                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                              >
                                Accept Task
                              </button>
                            )}

                            {/* Status: Accepted -> Start En Route */}
                            {c.status === 'Accepted' && (
                              <button
                                onClick={() => {
                                  updateTaskStatus(c.id, 'Staff En Route', 'Collection vehicle en route to waste location');
                                  if (!isSharingLocation) toggleLocationSharing(c.id);
                                }}
                                className="px-3.5 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                              >
                                Start En Route (Drive)
                              </button>
                            )}

                            {/* Status: Staff En Route -> Confirm Arrival */}
                            {c.status === 'Staff En Route' && (
                              <button
                                onClick={() => {
                                  updateTaskStatus(c.id, 'Arrived', 'Staff confirmed arrival at waste location', {
                                    lat: currentStaffCoords?.lat,
                                    lng: currentStaffCoords?.lng
                                  });
                                }}
                                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                              >
                                Confirm Arrival at Site
                              </button>
                            )}

                            {/* Status: Arrived -> Start Work In Progress */}
                            {c.status === 'Arrived' && (
                              <button
                                onClick={() => updateTaskStatus(c.id, 'Work In Progress', 'Arrived at site; sanitation team actively clearing waste')}
                                className="px-3.5 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                              >
                                Start Work in Progress
                              </button>
                            )}

                            {/* Status: Work In Progress -> Mark Waste Collected */}
                            {c.status === 'Work In Progress' && (
                              <button
                                onClick={() => updateTaskStatus(c.id, 'Waste Collected', 'Waste loaded into vehicle; clearing complete')}
                                className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                              >
                                Mark Waste Collected
                              </button>
                            )}

                            {/* Work Completion Trigger (Strict Evidence Verification) */}
                            <button
                              onClick={() => {
                                setActiveTask({ type: 'complaint', data: c });
                                setActualCollectedKg(c.quantityKg || 25);
                                setResolutionNotes('');
                                setBeforePhotos(c.beforePhotos || []);
                                setAfterPhotos(c.afterPhotos || []);
                                setEvidenceVideos(c.evidenceVideos || []);
                                setModalValidationError('');
                              }}
                              className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              <Camera className="w-3.5 h-3.5" />
                              <span>Complete & Upload Evidence &rarr;</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Scheduled Doorstep Pickups Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-700" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Assigned Doorstep Bulk Pickups ({filteredPickups.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Karnataka Bulk Collection</span>
            </div>

            {filteredPickups.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No doorstep pickups matching current filter.</p>
            ) : (
              <div className="space-y-3">
                {filteredPickups.map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs bg-white hover:border-indigo-300 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-slate-900">{p.id}</span>
                        <span className="font-semibold text-slate-800">{p.wasteType}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          {p.status}
                        </span>
                        <span className="font-mono text-slate-500 font-semibold">
                          Slot: {p.preferredDate} ({p.preferredTimeSlot.split(' ')[0]})
                        </span>
                      </div>
                      <p className="text-slate-600">
                        <strong>Address:</strong> {p.address} · <strong>Citizen:</strong> {p.citizenName} (+91 {p.mobile})
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
                      >
                        <Navigation className="w-3.5 h-3.5 text-blue-600" />
                        <span>Directions</span>
                      </a>

                      {p.status !== 'Completed' && (
                        <button
                          onClick={() => {
                            setActiveTask({ type: 'pickup', data: p });
                            setResolutionNotes('');
                            setAfterPhotos([]);
                            setEvidenceVideos([]);
                            setModalValidationError('');
                          }}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
                        >
                          Mark Collected
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION A: GIS BEAT MAP & GPS NAVIGATION VIEW
         ========================================================================= */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-700" />
                  <span>Karnataka Ward Beat GIS Dispatch Map</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualizing assigned collection spots, current vehicle position, and turn-by-turn route directions.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-purple-600 border border-white shadow-xs"></span>
                  <span>My Location</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-red-600 border border-white shadow-xs"></span>
                  <span>High Priority</span>
                </span>
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
                  <span>Collection Spots</span>
                </span>
              </div>
            </div>

            {/* Embedded Google Map Component */}
            <div className="w-full h-[450px] rounded-2xl overflow-hidden border border-slate-300 relative shadow-inner">
              <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={mapCenter}
                center={mapCenter}
                zoom={14}
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              >
                {/* 1. Live Staff Location Marker */}
                {currentStaffCoords && (
                  <AdvancedMarker
                    position={{ lat: currentStaffCoords.lat, lng: currentStaffCoords.lng }}
                    title={`Staff: ${user.name} (My Current Position)`}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-8 h-8 rounded-full bg-purple-500/40 animate-ping"></span>
                      <div className="relative w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center border-2 border-white shadow-lg">
                        <Truck className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </AdvancedMarker>
                )}

                {/* 2. Assigned Complaints Markers */}
                {complaints.map(c => {
                  const isHigh = c.priority === 'High' || c.priority === 'Emergency';
                  const isResolved = ['Resolved', 'Closed'].includes(c.status);

                  return (
                    <AdvancedMarker
                      key={c.id}
                      position={{ lat: c.lat, lng: c.lng }}
                      onClick={() => setSelectedMapItem({ type: 'complaint', data: c })}
                      title={`${c.id}: ${c.wasteCategory}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-110 ${
                          isResolved
                            ? 'bg-emerald-600'
                            : isHigh
                            ? 'bg-red-600 animate-bounce'
                            : 'bg-amber-600'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                    </AdvancedMarker>
                  );
                })}

                {/* 3. Doorstep Pickups Markers */}
                {pickups.map(p => (
                  <AdvancedMarker
                    key={p.id}
                    position={{ lat: p.lat, lng: p.lng }}
                    onClick={() => setSelectedMapItem({ type: 'pickup', data: p })}
                    title={`Pickup ${p.id}: ${p.wasteType}`}
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-700 text-white flex items-center justify-center border-2 border-white shadow-md cursor-pointer">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                  </AdvancedMarker>
                ))}
              </Map>
            </div>

            {/* Selected Map Spot Detail Card */}
            {selectedMapItem ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{selectedMapItem.data.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                      {selectedMapItem.type === 'complaint' ? selectedMapItem.data.wasteCategory : selectedMapItem.data.wasteType}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                      {selectedMapItem.data.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Address:</strong> {selectedMapItem.type === 'complaint' ? selectedMapItem.data.street : selectedMapItem.data.address},{' '}
                    {selectedMapItem.data.ward}
                  </p>
                  {currentStaffCoords && (
                    <p className="text-[11px] font-mono text-purple-700 font-bold">
                      Direct Distance: {calculateDistance(currentStaffCoords.lat, currentStaffCoords.lng, selectedMapItem.data.lat, selectedMapItem.data.lng)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={
                      currentStaffCoords
                        ? `https://www.google.com/maps/dir/?api=1&origin=${currentStaffCoords.lat},${currentStaffCoords.lng}&destination=${selectedMapItem.data.lat},${selectedMapItem.data.lng}`
                        : `https://www.google.com/maps/dir/?api=1&destination=${selectedMapItem.data.lat},${selectedMapItem.data.lng}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Launch Google Navigation</span>
                  </a>

                  <button
                    onClick={() => setSelectedMapItem(null)}
                    className="px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                Click on any pin on the map to view task details, distance from your current position, and launch turn-by-turn routing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: WORK PERFORMANCE & SECTION 4 ALLOWANCE / PAYMENTS
         ========================================================================= */}
      {activeTab === 'performance' && performance && (
        <div className="space-y-6">
          {/* Monthly & Yearly Performance Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Performance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Monthly Performance ({performance.monthly.monthName})
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold">
                  Target: 95%+
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl font-black text-slate-900 font-mono block">
                    {performance.monthly.completedTasksCount}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Tasks Cleared This Month</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl font-black text-emerald-700 font-mono block">
                    {performance.monthly.totalKgCollected} kg
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Total Waste Tonnage</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl font-black text-indigo-700 font-mono block">
                    {performance.monthly.onTimeRatePercent}%
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">SLA On-Time Rate</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl font-black text-purple-700 font-mono block">
                    {performance.monthly.averageResolutionHours} hrs
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Avg Resolution Speed</span>
                </div>
              </div>
            </div>

            {/* Yearly Cumulative Performance */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Yearly Performance Summary ({performance.yearly.year})
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                  Cleanliness Champion
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl font-black text-slate-900 font-mono block">
                    {performance.yearly.completedTasksCount}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Annual Tasks Cleared</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl font-black text-emerald-700 font-mono block">
                    {performance.yearly.totalTonnageMetricTons} MT
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Diverted from Landfills</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-2xl font-black text-amber-600 font-mono block">
                    {performance.yearly.citizenRatingAvg} / 5.0
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Citizen Rating Score</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-purple-800 font-mono block mt-2">
                    {performance.yearly.cleanlinessRank}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Municipal Standing</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Payment & Conservancy Duty Allowance Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-6 h-6 text-emerald-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Section 4: Conservancy Duty Allowance & Payout Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official Karnataka Urban Local Bodies (ULB) & BBMP Pourakarmika compensation breakdown.
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 font-mono">
                {performance.allowanceAndPay.payoutStatus}
              </span>
            </div>

            {/* Allowance Breakdown Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 block">Base Duty Allowance ({performance.allowanceAndPay.baseDutyDays} days @ ₹{performance.allowanceAndPay.dailyRate}/day):</span>
                <span className="text-lg font-black font-mono text-slate-900 block">
                  ₹{performance.allowanceAndPay.baseSalaryAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Guaranteed monthly conservancy base</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 block">Verified Clearance Incentives:</span>
                <span className="text-lg font-black font-mono text-emerald-700 block">
                  + ₹{performance.allowanceAndPay.taskIncentivesAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">₹35/complaint + ₹45/pickup cleared</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 block">High Priority Blackspot Bonus:</span>
                <span className="text-lg font-black font-mono text-amber-600 block">
                  + ₹{performance.allowanceAndPay.highPriorityBonus.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Emergency & biohazard spot cleared</span>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-emerald-900 font-bold block">Net Disbursable Amount:</span>
                <span className="text-xl font-black font-mono text-emerald-800 block">
                  ₹{performance.allowanceAndPay.netDisbursableAmount.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">After 5% statutory PF/ESI</span>
              </div>
            </div>

            {/* Electronic Payout Details & Treasury Account */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-slate-800">Direct Benefit Transfer (DBT) Payout Routing:</span>
                <p className="text-slate-600 font-mono text-[11px]">
                  Method: {performance.allowanceAndPay.payoutMethod}
                </p>
                <p className="text-slate-600 font-mono text-[11px]">
                  Linked Government Salary Account: {performance.allowanceAndPay.treasuryAccountNo}
                </p>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[11px] text-slate-500">Last Disbursed Date:</span>
                <p className="font-bold text-slate-900 font-mono text-sm">
                  {performance.allowanceAndPay.lastDisbursedDate} (₹{performance.allowanceAndPay.lastDisbursedAmount.toLocaleString()})
                </p>
              </div>
            </div>

            {/* Yearly Payment Summary Strip */}
            {performance.allowanceAndPay.yearlySummary && (
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Yearly Payment Summary ({performance.allowanceAndPay.yearlySummary.year})
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Official Karnataka Urban Local Bodies (ULB) Verified Ledger
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TOTAL DISBURSED (YTD)</span>
                    <span className="text-lg font-black font-mono text-emerald-400 block">
                      ₹{performance.allowanceAndPay.yearlySummary.totalDisbursed.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">PENDING DISBURSEMENT</span>
                    <span className="text-lg font-black font-mono text-amber-400 block">
                      ₹{performance.allowanceAndPay.yearlySummary.totalPending.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TOTAL DUTY DAYS PAID</span>
                    <span className="text-lg font-black font-mono text-white block">
                      {performance.allowanceAndPay.yearlySummary.totalDutyDays} Days
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">VERIFIED PAY SLIPS</span>
                    <span className="text-lg font-black font-mono text-purple-300 block">
                      {performance.allowanceAndPay.yearlySummary.recordsCount} Records
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Monthly Payment Records & Verified History Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Verified Monthly Payment Records & DBT PFMS Ledger
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Disbursed directly from Karnataka Municipal Accounts Directorate under Treasury Budget Head 2217.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  {(performance.allowanceAndPay.verifiedPaymentRecords || []).length} Verified Records
                </span>
              </div>

              {(performance.allowanceAndPay.verifiedPaymentRecords && performance.allowanceAndPay.verifiedPaymentRecords.length > 0) ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 text-[11px] uppercase font-bold">
                      <tr>
                        <th className="p-3">Period</th>
                        <th className="p-3">Slip ID</th>
                        <th className="p-3">Duty Days</th>
                        <th className="p-3">Base Pay</th>
                        <th className="p-3">Incentives</th>
                        <th className="p-3">Net Disbursed</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Disbursed Date</th>
                        <th className="p-3">DBT / PFMS Ref</th>
                        <th className="p-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 font-mono text-[11px]">
                      {performance.allowanceAndPay.verifiedPaymentRecords.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3 font-sans font-bold text-slate-900">{pay.period}</td>
                          <td className="p-3 text-slate-600 font-bold">{pay.id}</td>
                          <td className="p-3">{pay.baseDutyDays} days</td>
                          <td className="p-3">₹{pay.baseAmount.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-emerald-700">
                            +₹{((pay.taskIncentiveAmount || 0) + (pay.bonusAmount || 0)).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 font-bold text-emerald-800 font-mono text-xs">
                            ₹{pay.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 font-sans">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                pay.status === 'Disbursed'
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : pay.status === 'Approved'
                                  ? 'bg-blue-100 text-blue-900'
                                  : pay.status === 'On Hold'
                                  ? 'bg-purple-100 text-purple-900'
                                  : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {pay.status}
                            </span>
                          </td>
                          <td className="p-3 font-sans text-slate-600">
                            {pay.paymentDate || 'Pending release'}
                          </td>
                          <td className="p-3 text-[10px] text-slate-500 max-w-xs truncate" title={pay.transactionRef}>
                            {pay.transactionRef || 'Pending PFMS ACK'}
                          </td>
                          <td className="p-3 font-sans text-[10px] text-slate-500 max-w-xs truncate" title={pay.notes}>
                            {pay.notes || 'Routine conservancy duty'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                  No verified payment records have been posted yet for this employee. Official records are generated by the Municipal Administrator at month-end.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: OFFICER PROFILE & SERVICE AREA CREDENTIALS
         ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="text-center space-y-2 pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl mx-auto shadow-inner border border-emerald-200">
                {user.name.charAt(0)}
              </div>
              <h3 className="text-base font-bold text-slate-900">{user.name}</h3>
              <p className="text-xs text-slate-500 font-mono">Employee ID: {user.id}</p>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-bold border border-emerald-200">
                Senior Beat Conservancy Officer
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Designated Service Beat:</span>
                <span className="font-semibold text-slate-800">{user.ward}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">District & State:</span>
                <span className="font-semibold text-slate-800">{user.district}, Karnataka</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Registered Mobile:</span>
                <span className="font-semibold text-slate-800 font-mono">+91 {user.mobile}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Government Email:</span>
                <span className="font-semibold text-slate-800 font-mono">{user.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Cleanliness Score:</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">{user.points || 420} Points</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 block">Civic Badges Earned:</span>
              <div className="flex flex-wrap gap-1.5">
                {(user.badges || ['Super Sanitation Hero', '100% On-Time Collection']).map((b, bIdx) => (
                  <span key={bIdx} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-[10px] font-bold border border-amber-200">
                    🏅 {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications Feed */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Field Alerts & Municipal Notifications
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">{notifications.length} alerts</span>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">No new notifications.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((n, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600">{n.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION B: WORK COMPLETION AND LIVE EVIDENCE UPLOAD MODAL
         ========================================================================= */}
      {activeTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Submit Work Completion Evidence: {activeTask.data.id}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Mandatory photographic / video evidence verification before task closure.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTask(null)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer p-1"
              >
                ✕ Close
              </button>
            </div>

            {actionSuccess && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {modalValidationError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{modalValidationError}</span>
              </div>
            )}

            <form onSubmit={handleCompleteTask} className="space-y-4 text-xs">
              {activeTask.type === 'complaint' && (
                <div>
                  <label className="block text-slate-800 font-bold mb-1">
                    Actual Collected Waste Weight (kg) *:
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    required
                    value={actualCollectedKg}
                    onChange={e => setActualCollectedKg(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-xl font-mono font-bold text-sm focus:ring-2 focus:ring-emerald-600"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Estimated by citizen: ~{activeTask.data.quantityKg} kg</span>
                </div>
              )}

              <div>
                <label className="block text-slate-800 font-bold mb-1">
                  Sanitation Officer Remarks & Clearance Notes *:
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={e => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Cleared 25kg accumulated roadside waste using mechanical tipper. Disinfected sidewalk with lime powder. Blackspot cleared completely."
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                ></textarea>
              </div>

              {activeTask.type === 'complaint' && (
                <div className="space-y-4 pt-1">
                  {/* Before Photo Section (Optional/Supporting) */}
                  <div className="space-y-2 p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-800 font-bold">
                        1. Site Condition 'Before' Evidence (Optional):
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">{beforePhotos.length} files</span>
                    </div>

                    <label className="border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl p-3 text-center block cursor-pointer bg-white transition-colors">
                      <Camera className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                      <span className="text-slate-700 font-semibold block text-[11px]">Capture or select 'Before' photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleBeforePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {beforePhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {beforePhotos.map((photo, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden border border-amber-300 h-20 group">
                            <img src={photo} alt={`Before Evidence ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeBeforePhoto(i)}
                              title="Delete this photo"
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* After Photo Section (Mandatory Evidence) */}
                  <div className="space-y-2 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-800 font-bold">
                        2. Cleared Site 'After' Photo Evidence (Mandatory) *:
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">{afterPhotos.length} uploaded</span>
                    </div>

                    <label className="border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-xl p-3 text-center block cursor-pointer bg-white transition-colors">
                      <Camera className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                      <span className="text-slate-700 font-semibold block text-[11px]">Capture live 'After' photo with device camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleAfterPhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {afterPhotos.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {afterPhotos.map((photo, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden border border-emerald-300 h-20 group">
                            <img src={photo} alt={`After Evidence ${i + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeAfterPhoto(i)}
                              title="Delete and replace"
                              className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Evidence Section (Live Video Capture or File Selection) */}
                  <div className="space-y-2 p-3.5 bg-indigo-50/50 rounded-2xl border border-indigo-200">
                    <div className="flex items-center justify-between">
                      <label className="block text-slate-800 font-bold">
                        3. Cleared Site Video Evidence (Live Clip / MP4, WebM):
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">{evidenceVideos.length} clips</span>
                    </div>

                    <label className="border-2 border-dashed border-indigo-300 hover:border-indigo-600 rounded-xl p-3 text-center block cursor-pointer bg-white transition-colors">
                      <Video className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                      <span className="text-slate-700 font-semibold block text-[11px]">Record live video clip (max 15MB)</span>
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        capture="environment"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>

                    {evidenceVideos.length > 0 && (
                      <div className="space-y-2 pt-1">
                        {evidenceVideos.map((video, i) => (
                          <div key={i} className="relative rounded-xl overflow-hidden border border-indigo-300 bg-black">
                            <video src={video} controls className="w-full h-32 object-cover" />
                            <button
                              type="button"
                              onClick={() => removeEvidenceVideo(i)}
                              title="Delete video"
                              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 cursor-pointer shadow-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="px-6 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold cursor-pointer disabled:opacity-50 shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{submittingAction ? 'Validating & Uploading...' : 'Mark Completed & Save (+35 Pts)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
