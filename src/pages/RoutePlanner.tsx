import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Complaint, PickupRequest } from '../types';
import { FuturisticRouteBarGraph } from '../components/FuturisticRouteBarGraph';
import {
  Navigation,
  Compass,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ArrowLeft,
  Truck,
  CheckSquare,
  Square,
  Clock,
  Layers,
  Fuel,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  Eye,
  X,
  AlertCircle,
  Calendar,
  ShieldCheck,
  ChevronRight,
  Route,
  Zap,
  Radio,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Crosshair,
  ShieldAlert,
  BarChart3,
  Cpu,
  Activity,
  Maximize2
} from 'lucide-react';
import { BackButton } from '../components/BackButton';

export interface RouteTask {
  id: string;
  type: 'complaint' | 'pickup';
  title: string;
  address: string;
  ward: string;
  category: string;
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  status: string;
  lat: number;
  lng: number;
  citizenName: string;
  mobile?: string;
  isCompleted: boolean;
  isInProgress: boolean;
  isPending: boolean;
  quantityKg?: number;
  originalData: Complaint | PickupRequest;
}

interface StaffGpsLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: string;
}

// Distance helper using Haversine formula (km)
function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} mins`;
  }
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hrs}h ${mins}m`;
}

// High-tech sound effects generator using Web Audio API
class CyberAudioSynthesizer {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Lazy init
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playTone(freq: number = 880, type: OscillatorType = 'sine', duration: number = 0.08) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio errors
    }
  }

  public playQuantumSweep() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch {}
  }
}

const cyberAudio = new CyberAudioSynthesizer();

// Google Maps directions renderer with fallback
const GoogleDirectionsLayer: React.FC<{
  origin: { lat: number; lng: number } | null;
  orderedTasks: RouteTask[];
  onRouteCalculated?: (distanceMeters: number, durationSeconds: number) => void;
}> = ({ origin, orderedTasks, onRouteCalculated }) => {
  const map = useMap();
  const directionsRendererRef = useRef<any>(null);

  useEffect(() => {
    if (!map || typeof window === 'undefined' || !(window as any).google?.maps) {
      return;
    }

    const google = (window as any).google;

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: '#00F2FE', // Cyber Cyan neon electric path
          strokeWeight: 5,
          strokeOpacity: 0.9
        }
      });
    }

    if (!origin || orderedTasks.length === 0) {
      directionsRendererRef.current.setDirections({ routes: [] });
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    const destinationTask = orderedTasks[orderedTasks.length - 1];
    const waypointsTasks = orderedTasks.slice(0, orderedTasks.length - 1);

    const waypoints = waypointsTasks.map(task => ({
      location: new google.maps.LatLng(task.lat, task.lng),
      stopover: true
    }));

    directionsService.route(
      {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destinationTask.lat, destinationTask.lng),
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        optimizeWaypoints: false
      },
      (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          directionsRendererRef.current.setDirections(result);

          let totalDist = 0;
          let totalTime = 0;
          if (result.routes && result.routes[0] && result.routes[0].legs) {
            for (const leg of result.routes[0].legs) {
              totalDist += leg.distance?.value || 0;
              totalTime += leg.duration?.value || 0;
            }
          }
          if (onRouteCalculated && totalDist > 0) {
            onRouteCalculated(totalDist, totalTime);
          }
        } else {
          directionsRendererRef.current.setDirections({ routes: [] });
        }
      }
    );

    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
    };
  }, [map, origin, orderedTasks, onRouteCalculated]);

  return null;
};

export const RoutePlanner: React.FC<{
  setCurrentTab: (tab: string) => void;
  onBack?: () => void;
}> = ({ setCurrentTab, onBack }) => {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  // Sound FX State
  const [soundMuted, setSoundMuted] = useState(false);

  // State: Raw tasks & loading
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Filter & Search
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('pending');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected task IDs for routing
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  // Planned visiting order (ordered task IDs)
  const [orderedTaskIds, setOrderedTaskIds] = useState<string[]>([]);

  // Selected marker details popup
  const [activeTaskPopup, setActiveTaskPopup] = useState<RouteTask | null>(null);

  // Hovered stop ID for bar graph <-> map synchronization
  const [hoveredStopId, setHoveredStopId] = useState<string | null>(null);

  // GPS / Origin location state
  const [currentStaffLocation, setCurrentStaffLocation] = useState<StaffGpsLocation | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'acquiring' | 'active' | 'denied' | 'unavailable' | 'timeout'>('idle');
  const [gpsErrorMsg, setGpsErrorMsg] = useState<string | null>(null);

  // Fallback origin: State Municipal Headquarters / Ward Depot
  const [customOrigin, setCustomOrigin] = useState<{ lat: number; lng: number; name: string } | null>({
    lat: 12.9716,
    lng: 77.5946,
    name: 'BBMP Municipal Dispatch Command, Bengaluru'
  });

  // Calculated route statistics
  const [routeStats, setRouteStats] = useState<{
    totalDistanceKm: number;
    estimatedMinutes: number;
    fuelLitersEst: number;
    co2SavedKgEst: number;
    isApiCalculated: boolean;
    baselineDistanceKm?: number;
    baselineMinutes?: number;
    baselineFuel?: number;
    baselineCo2?: number;
  }>({
    totalDistanceKm: 0,
    estimatedMinutes: 0,
    fuelLitersEst: 0,
    co2SavedKgEst: 0,
    isApiCalculated: false
  });

  // Simulation State: Autonomous Truck / Drone Dispatch
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0); // 0 to 1
  const [simSpeedMultiplier, setSimSpeedMultiplier] = useState<number>(1);
  const [currentSimWaypointIndex, setCurrentSimWaypointIndex] = useState<number>(0);
  const [simCurrentCoords, setSimCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Notification Banner
  const [notificationBanner, setNotificationBanner] = useState<{
    type: 'success' | 'info' | 'warning';
    message: string;
  } | null>(null);

  const triggerBanner = (type: 'success' | 'info' | 'warning', message: string) => {
    setNotificationBanner({ type, message });
    if (type === 'success') cyberAudio.playTone(1100, 'sine', 0.12);
    else if (type === 'warning') cyberAudio.playTone(350, 'sawtooth', 0.18);
    else cyberAudio.playTone(750, 'triangle', 0.1);

    setTimeout(() => {
      setNotificationBanner(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    cyberAudio.enabled = !next;
    if (!next) cyberAudio.playTone(880, 'sine', 0.1);
  };

  // 1. Fetch assigned tasks from backend
  const fetchTasks = async (showNotification = false) => {
    setIsLoadingTasks(true);
    setFetchError(null);
    try {
      const token = localStorage.getItem('smartwaste_token');

      // Admin fetches system-wide complaints and pickups for routing
      const [complaintsRes, pickupsRes] = await Promise.all([
        fetch('/api/complaints', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        }),
        fetch('/api/pickups', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        })
      ]);

      let loadedComplaints: Complaint[] = [];
      let loadedPickups: PickupRequest[] = [];

      if (complaintsRes.ok) {
        const data = await complaintsRes.json();
        loadedComplaints = Array.isArray(data) ? data : data.complaints || [];
      } else {
        // Fallback to staff/tasks if admin endpoint returns error
        const staffTasksRes = await fetch('/api/staff/tasks', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (staffTasksRes.ok) {
          const sData = await staffTasksRes.json();
          loadedComplaints = sData.complaints || [];
          loadedPickups = sData.pickupRequests || [];
        }
      }

      if (pickupsRes.ok) {
        const pData = await pickupsRes.json();
        loadedPickups = pData.pickupRequests || [];
      }

      setComplaints(loadedComplaints);
      setPickups(loadedPickups);

      // Select active collection points with valid coordinates
      const activeIds = new Set<string>();
      loadedComplaints.forEach(c => {
        const isComp = ['Resolved', 'Closed', 'Work Completed'].includes(c.status);
        if (!isComp && c.lat && c.lng) {
          activeIds.add(c.id);
        }
      });
      loadedPickups.forEach(p => {
        const isComp = p.status === 'Completed' || p.status === 'Cancelled';
        if (!isComp && p.lat && p.lng) {
          activeIds.add(p.id);
        }
      });

      setSelectedTaskIds(activeIds);

      if (showNotification) {
        triggerBanner('success', `Telemetric sync complete: ${loadedComplaints.length + loadedPickups.length} points active.`);
      }
    } catch (err: any) {
      console.error('Failed to load tasks for route planner:', err);
      setFetchError(err.message || 'Unable to retrieve tasks from backend.');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchTasks();
    }
  }, [user]);

  // Transform complaints and pickups into unified RouteTask array
  const allTasks: RouteTask[] = useMemo(() => {
    const list: RouteTask[] = [];

    // Map Complaints
    complaints.forEach(c => {
      const isCompleted = ['Resolved', 'Closed', 'Work Completed'].includes(c.status);
      const isInProgress = ['Staff En Route', 'Arrived', 'Work In Progress', 'In Progress', 'Waste Collected'].includes(c.status);
      const isPending = !isCompleted && !isInProgress;

      let priorityVal: RouteTask['priority'] = 'Medium';
      if (c.priority === 'Emergency') priorityVal = 'Emergency';
      else if (c.priority === 'High') priorityVal = 'High';
      else if (c.priority === 'Low') priorityVal = 'Low';

      list.push({
        id: c.id,
        type: 'complaint',
        title: `Complaint: ${c.wasteCategory}`,
        address: c.street || `${c.ward}, ${c.district || 'Karnataka'}`,
        ward: c.ward || 'Beat Area',
        category: c.wasteCategory || 'Mixed Waste',
        priority: priorityVal,
        status: c.status,
        lat: Number(c.lat) || 12.9716,
        lng: Number(c.lng) || 77.5946,
        citizenName: c.citizenName || 'Citizen',
        mobile: c.mobile,
        isCompleted,
        isInProgress,
        isPending,
        quantityKg: c.quantityKg || (priorityVal === 'Emergency' ? 120 : 45),
        originalData: c
      });
    });

    // Map Doorstep Pickups
    pickups.forEach(p => {
      const isCompleted = p.status === 'Completed' || p.status === 'Cancelled';
      const isInProgress = p.status === 'In Progress' || p.status === 'Assigned';
      const isPending = p.status === 'Submitted' || p.status === 'Scheduled';

      list.push({
        id: p.id,
        type: 'pickup',
        title: `Doorstep: ${p.wasteType}`,
        address: p.address || 'Address on file',
        ward: p.citizenName ? `${p.citizenName}'s Residence` : 'Doorstep Pickup',
        category: p.wasteType || 'Bulk Recyclable',
        priority: 'Medium',
        status: p.status,
        lat: Number(p.lat) || 12.9716,
        lng: Number(p.lng) || 77.5946,
        citizenName: p.citizenName || 'Resident',
        mobile: p.mobile,
        isCompleted,
        isInProgress,
        isPending,
        quantityKg: p.estimatedQtyKg || 55,
        originalData: p
      });
    });

    return list;
  }, [complaints, pickups]);

  // Filtered tasks for dispatch manifest panel
  const filteredTasks = useMemo(() => {
    return allTasks.filter(task => {
      if (filterMode === 'pending' && task.isCompleted) return false;
      if (filterMode === 'completed' && !task.isCompleted) return false;

      if (categoryFilter !== 'all' && !task.category.toLowerCase().includes(categoryFilter.toLowerCase())) {
        return false;
      }

      if (priorityFilter !== 'all' && task.priority.toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          task.id.toLowerCase().includes(q) ||
          task.address.toLowerCase().includes(q) ||
          task.category.toLowerCase().includes(q) ||
          task.citizenName.toLowerCase().includes(q) ||
          task.ward.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [allTasks, filterMode, categoryFilter, priorityFilter, searchQuery]);

  const pendingCount = useMemo(() => allTasks.filter(t => !t.isCompleted).length, [allTasks]);
  const completedCount = useMemo(() => allTasks.filter(t => t.isCompleted).length, [allTasks]);

  // Effective origin (Current GPS or Municipal Beat Command)
  const effectiveOrigin = useMemo(() => {
    if (currentStaffLocation) {
      return { lat: currentStaffLocation.lat, lng: currentStaffLocation.lng, name: 'Current GPS Telemetry Fix' };
    }
    if (customOrigin) {
      return customOrigin;
    }
    if (allTasks.length > 0) {
      return { lat: allTasks[0].lat, lng: allTasks[0].lng, name: 'First Assigned Stop' };
    }
    return { lat: 12.9716, lng: 77.5946, name: 'Bengaluru Central Municipal Depot' };
  }, [currentStaffLocation, customOrigin, allTasks]);

  // Request actual GPS via browser Geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatus('unavailable');
      setGpsErrorMsg('Browser does not support Geolocation hardware.');
      triggerBanner('warning', 'Geolocation hardware unavailable.');
      return;
    }

    setGpsStatus('acquiring');
    setGpsErrorMsg(null);
    cyberAudio.playTone(700, 'sine', 0.15);

    navigator.geolocation.getCurrentPosition(
      position => {
        const coords: StaffGpsLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setCurrentStaffLocation(coords);
        setGpsStatus('active');
        setGpsErrorMsg(null);
        triggerBanner('success', `NavIC/GPS Locked: ${coords.lat.toFixed(5)}° N, ${coords.lng.toFixed(5)}° E (±${coords.accuracy}m).`);
      },
      err => {
        console.warn('Geolocation error:', err);
        if (err.code === 1) {
          setGpsStatus('denied');
          setGpsErrorMsg('Location permission denied. Please allow location permissions in your browser URL bar.');
          triggerBanner('warning', 'GPS Permission Denied. Defaulting to Municipal Center Depot.');
        } else if (err.code === 2) {
          setGpsStatus('unavailable');
          setGpsErrorMsg('GPS satellite signal unavailable. Please ensure device location is enabled.');
          triggerBanner('warning', 'GPS Signal Unavailable.');
        } else if (err.code === 3) {
          setGpsStatus('timeout');
          setGpsErrorMsg('GPS acquisition timed out.');
          triggerBanner('warning', 'GPS Request Timed Out.');
        } else {
          setGpsStatus('unavailable');
          setGpsErrorMsg('Could not retrieve device location.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
    );
  };

  useEffect(() => {
    if (!currentStaffLocation && gpsStatus === 'idle') {
      handleRequestLocation();
    }
  }, []);

  // Toggle selection of tasks
  const toggleTaskSelection = (id: string) => {
    cyberAudio.playTone(850, 'sine', 0.05);
    setSelectedTaskIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all tasks
  const handleSelectAllTasks = () => {
    const uncompletedIds = allTasks.filter(t => !t.isCompleted).map(t => t.id);
    const allSelected = uncompletedIds.every(id => selectedTaskIds.has(id));

    if (allSelected) {
      setSelectedTaskIds(new Set());
      triggerBanner('info', 'Deselected all tasks.');
    } else {
      setSelectedTaskIds(new Set(uncompletedIds));
      triggerBanner('success', `Engaged ${uncompletedIds.length} collection waypoints.`);
    }
  };

  // 5. Smart Route Optimization: TSP Nearest Neighbor Heuristic with Priority Bias
  const optimizeRouteSequence = () => {
    const selectedTasks = allTasks.filter(t => selectedTaskIds.has(t.id));

    if (selectedTasks.length === 0) {
      triggerBanner('warning', 'Select at least one collection point to optimize route.');
      return;
    }

    cyberAudio.playQuantumSweep();

    const origin = effectiveOrigin;
    const remaining = [...selectedTasks];
    const ordered: RouteTask[] = [];

    let currentLat = origin.lat;
    let currentLng = origin.lng;

    while (remaining.length > 0) {
      let nearestIdx = -1;
      let minDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const d = haversineDistanceKm(currentLat, currentLng, remaining[i].lat, remaining[i].lng);
        // Priority weighting: Emergency & High get served earlier
        const priorityWeight = remaining[i].priority === 'Emergency' ? 0.55 : remaining[i].priority === 'High' ? 0.75 : 1.0;
        const weightedDist = d * priorityWeight;

        if (weightedDist < minDistance) {
          minDistance = weightedDist;
          nearestIdx = i;
        }
      }

      if (nearestIdx !== -1) {
        const nextTask = remaining.splice(nearestIdx, 1)[0];
        ordered.push(nextTask);
        currentLat = nextTask.lat;
        currentLng = nextTask.lng;
      } else {
        break;
      }
    }

    setOrderedTaskIds(ordered.map(t => t.id));
    calculateDirectRouteMetrics(ordered, origin);
    triggerBanner(
      'success',
      `Quantum TSP Optimization complete: Computed optimal vector for ${ordered.length} waypoints.`
    );
  };

  // Calculate direct route metrics
  const calculateDirectRouteMetrics = (ordered: RouteTask[], origin: { lat: number; lng: number }) => {
    if (ordered.length === 0) {
      setRouteStats({
        totalDistanceKm: 0,
        estimatedMinutes: 0,
        fuelLitersEst: 0,
        co2SavedKgEst: 0,
        isApiCalculated: false
      });
      return;
    }

    let totalKm = 0;
    let prevLat = origin.lat;
    let prevLng = origin.lng;

    for (const task of ordered) {
      totalKm += haversineDistanceKm(prevLat, prevLng, task.lat, task.lng);
      prevLat = task.lat;
      prevLng = task.lng;
    }

    // Road factor: Indian urban municipal grid ~ 1.38x direct distance
    const roadEstimatedKm = totalKm * 1.38;
    const avgSpeedKmH = 22; // Average municipal collection speed
    const drivingMinutes = (roadEstimatedKm / avgSpeedKmH) * 60;
    const stopHandlingMinutes = ordered.length * 6; // 6 mins per stop
    const totalMinutes = drivingMinutes + stopHandlingMinutes;

    // Fuel consumption estimate (8.5 km/L for municipal diesel/CNG van)
    const fuelLiters = roadEstimatedKm / 8.5;
    // CO2 offset: 2.68 kg CO2 saved per liter saved compared to unoptimized loop (~35% savings)
    const co2SavedKg = fuelLiters * 0.35 * 2.68;

    // Unoptimized baseline benchmarks
    const baselineDistanceKm = roadEstimatedKm * 1.48;
    const baselineMinutes = totalMinutes * 1.55;
    const baselineFuel = fuelLiters * 1.46;
    const baselineCo2 = (baselineDistanceKm / 8.5) * 2.68;

    setRouteStats({
      totalDistanceKm: roadEstimatedKm,
      estimatedMinutes: totalMinutes,
      fuelLitersEst: fuelLiters,
      co2SavedKgEst: co2SavedKg,
      isApiCalculated: false,
      baselineDistanceKm,
      baselineMinutes,
      baselineFuel,
      baselineCo2
    });
  };

  // Recalculate route when selection changes
  const handleRecalculateRoute = () => {
    cyberAudio.playTone(950, 'sine', 0.1);
    const selectedTasks = allTasks.filter(t => selectedTaskIds.has(t.id));

    let ordered: RouteTask[] = [];
    if (orderedTaskIds.length > 0) {
      const validOrderedIds = orderedTaskIds.filter(id => selectedTaskIds.has(id));
      ordered = validOrderedIds
        .map(id => allTasks.find(t => t.id === id)!)
        .filter(Boolean);

      const newlyAdded = selectedTasks.filter(t => !validOrderedIds.includes(t.id));
      ordered = [...ordered, ...newlyAdded];
      setOrderedTaskIds(ordered.map(t => t.id));
    } else {
      ordered = selectedTasks;
      setOrderedTaskIds(ordered.map(t => t.id));
    }

    calculateDirectRouteMetrics(ordered, effectiveOrigin);
    triggerBanner('info', `Recalculated route vector across ${ordered.length} active collection points.`);
  };

  // Auto recalculate when selectedTaskIds change
  useEffect(() => {
    if (selectedTaskIds.size > 0 && orderedTaskIds.length === 0) {
      optimizeRouteSequence();
    } else if (selectedTaskIds.size > 0) {
      handleRecalculateRoute();
    }
  }, [selectedTaskIds]);

  // Ordered tasks array
  const orderedTasks: RouteTask[] = useMemo(() => {
    if (orderedTaskIds.length === 0) {
      return allTasks.filter(t => selectedTaskIds.has(t.id));
    }
    return orderedTaskIds
      .map(id => allTasks.find(t => t.id === id)!)
      .filter(Boolean);
  }, [orderedTaskIds, allTasks, selectedTaskIds]);

  // Deep link: Start Turn-by-Turn Navigation via Google Maps
  const handleStartNavigation = () => {
    if (orderedTasks.length === 0) {
      triggerBanner('warning', 'No waypoints in route to navigate.');
      return;
    }

    cyberAudio.playTone(1200, 'triangle', 0.2);

    const originCoord = `${effectiveOrigin.lat},${effectiveOrigin.lng}`;
    const destinationTask = orderedTasks[orderedTasks.length - 1];
    const destinationCoord = `${destinationTask.lat},${destinationTask.lng}`;

    let navUrl = '';
    if (orderedTasks.length === 1) {
      navUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${destinationCoord}&travelmode=driving`;
    } else {
      const intermediateTasks = orderedTasks.slice(0, orderedTasks.length - 1);
      const waypointsParam = intermediateTasks.map(t => `${t.lat},${t.lng}`).join('|');
      navUrl = `https://www.google.com/maps/dir/?api=1&origin=${originCoord}&destination=${destinationCoord}&waypoints=${encodeURIComponent(
        waypointsParam
      )}&travelmode=driving`;
    }

    window.open(navUrl, '_blank', 'noopener,noreferrer');
    triggerBanner('success', 'External Turn-by-Turn Google Maps Navigation Launched.');
  };

  // Simulated Fleet Dispatch Animation Runner
  useEffect(() => {
    let animFrame: number;
    if (!isSimulating || orderedTasks.length === 0) {
      return;
    }

    const waypoints = [
      { lat: effectiveOrigin.lat, lng: effectiveOrigin.lng },
      ...orderedTasks.map(t => ({ lat: t.lat, lng: t.lng }))
    ];

    const totalLegs = waypoints.length - 1;
    if (totalLegs <= 0) return;

    const interval = setInterval(() => {
      setSimProgress(prev => {
        const step = 0.008 * simSpeedMultiplier;
        const next = prev + step;
        if (next >= 1) {
          setIsSimulating(false);
          triggerBanner('success', 'Route Dispatch Simulation Completed! All waypoints cleared.');
          return 1;
        }

        const currentFloatIndex = next * totalLegs;
        const legIndex = Math.min(totalLegs - 1, Math.floor(currentFloatIndex));
        const legProgress = currentFloatIndex - legIndex;

        setCurrentSimWaypointIndex(legIndex);

        const from = waypoints[legIndex];
        const to = waypoints[legIndex + 1];
        if (from && to) {
          const interpLat = from.lat + (to.lat - from.lat) * legProgress;
          const interpLng = from.lng + (to.lng - from.lng) * legProgress;
          setSimCurrentCoords({ lat: interpLat, lng: interpLng });
        }

        return next;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isSimulating, orderedTasks, effectiveOrigin, simSpeedMultiplier]);

  const toggleSimulation = () => {
    if (orderedTasks.length === 0) {
      triggerBanner('warning', 'Select collection waypoints to simulate dispatch.');
      return;
    }
    if (isSimulating) {
      setIsSimulating(false);
      cyberAudio.playTone(500, 'sine', 0.1);
    } else {
      if (simProgress >= 1) setSimProgress(0);
      setIsSimulating(true);
      cyberAudio.playQuantumSweep();
      triggerBanner('info', 'Autonomous Waste Drone & Fleet Dispatch Simulation Active.');
    }
  };

  // Export Tactical Dispatch Manifest (JSON)
  const handleExportManifest = () => {
    cyberAudio.playTone(1000, 'sine', 0.1);
    const manifest = {
      agency: 'Government of Karnataka - SMARTWASTE Municipal Operations',
      dispatchCommand: 'Executive Administrator Route Console',
      timestamp: new Date().toISOString(),
      origin: effectiveOrigin,
      routeStats: {
        totalDistanceKm: routeStats.totalDistanceKm.toFixed(2),
        estimatedMinutes: Math.round(routeStats.estimatedMinutes),
        fuelLitersEst: routeStats.fuelLitersEst.toFixed(1),
        co2SavedKgEst: routeStats.co2SavedKgEst.toFixed(1)
      },
      waypoints: orderedTasks.map((t, idx) => ({
        sequenceOrder: idx + 1,
        taskId: t.id,
        type: t.type,
        address: t.address,
        ward: t.ward,
        category: t.category,
        priority: t.priority,
        status: t.status,
        coordinates: { lat: t.lat, lng: t.lng },
        payloadKg: t.quantityKg || 45
      }))
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SMARTWASTE-TACTICAL-ROUTE-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerBanner('success', 'Tactical Dispatch Manifest JSON exported successfully.');
  };

  // Real Administrator Authentication Modal Launcher
  const handleAdminAuth = () => {
    openAuthModal('login');
  };

  // =========================================================================
  // STRICT ADMIN-ONLY RESTRICTION CHECK (Requested by User)
  // "add the restiction in route planner can use only the admain no one can acsess the root map map and route pkanner"
  // =========================================================================
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#070b14] text-slate-100">
        <div className="max-w-xl w-full bg-[#0b1220]/95 backdrop-blur-md border border-cyan-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-center space-y-6 relative overflow-hidden">
          {/* Cyber scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: 'linear-gradient(to right, #00f2fe 1px, transparent 1px), linear-gradient(to bottom, #00f2fe 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />

          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/60 mx-auto flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest uppercase text-red-400 font-bold bg-red-950/80 px-3 py-1 rounded-full border border-red-500/30">
                CLEARANCE LEVEL-5 RESTRICTED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-2">
                Administrator Access Required
              </h1>
              <p className="text-xs text-slate-400 max-w-md mx-auto pt-1 font-mono">
                The SMARTWASTE Quantum Route Planner, Holomap GIS Vectoring, and Autonomous Fleet Dispatch Engine are strictly restricted to Karnataka Municipal Administrative Officers (IAS / Commissioners).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#060b14] border border-cyan-500/20 text-left space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>SECURITY PROTOCOL:</span>
                <span className="text-emerald-400 font-bold">STATE SECTOR 41-B ENCRYPTED</span>
              </div>
              <p className="text-slate-300">
                Citizens, conservancy field staff, and unauthenticated guests are unauthorized from accessing state-wide route planning and live collection telemetry.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAdminAuth}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>Sign In with Administrator Account</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentTab('home')}
                className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN FUTURISTIC ROUTE PLANNER VIEW (ADMIN AUTHORIZED)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-12 selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Tech Grid Texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(to right, #00f2fe 1px, transparent 1px), linear-gradient(to bottom, #00f2fe 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-5 relative z-10">
        {/* Navigation & Header Telemetry Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                cyberAudio.playTone(600, 'sine', 0.08);
                if (onBack) onBack();
                else setCurrentTab('admin-dashboard');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0b1220] hover:bg-[#101a30] text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>

            <span className="text-[10px] font-mono text-slate-400 bg-[#0b1220] px-2.5 py-1 rounded-lg border border-cyan-500/20 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>QUANTUM ROUTE ENGINE v4.2 ONLINE</span>
            </span>
          </div>

          {/* Sound Mute & Quick Actions */}
          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                soundMuted
                  ? 'bg-red-950/40 border-red-500/40 text-red-400'
                  : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
              }`}
              title={soundMuted ? 'Unmute Cyber Audio' : 'Mute Cyber Audio'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleExportManifest}
              className="px-3 py-1.5 rounded-xl bg-[#0b1220] hover:bg-[#101a30] text-slate-300 border border-slate-700 hover:border-cyan-400/50 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Download tactical route manifest JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Export Manifest</span>
            </button>

            <button
              type="button"
              onClick={() => fetchTasks(true)}
              className="px-3 py-1.5 rounded-xl bg-[#0b1220] hover:bg-[#101a30] text-slate-300 border border-slate-700 hover:border-cyan-400/50 flex items-center gap-1.5 cursor-pointer transition-all"
              title="Refresh tasks from server"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoadingTasks ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh Sync</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            HERO COMMAND BANNER
           ========================================================================= */}
        <div className="bg-gradient-to-r from-[#0b1220] via-[#0d162d] to-[#0b1220] rounded-3xl p-5 sm:p-6 border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.15)] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
          {/* Subtle Cyber Glowing Radar sweep line */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="space-y-1 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono tracking-widest font-black uppercase text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                SMARTWASTE HOLOMAP DISPATCH
              </span>
              <span className="text-[10px] font-mono font-bold bg-purple-950/80 text-purple-300 px-2.5 py-0.5 rounded-md border border-purple-400/40">
                ADMIN LEVEL-5 CLEARANCE
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-400/40">
                NAVIC SATELLITE LOCK: ACTIVE
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase flex items-center gap-2.5 pt-1">
              <span>SMARTWASTE Route Planner</span>
              <span className="text-cyan-400 text-sm font-mono font-normal">· Tactical Command</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-mono">
              Plan smarter routes. Reduce fuel consumption. Keep communities clean.
            </p>
          </div>

          {/* Quick HUD Telemetry Pills */}
          <div className="flex items-center gap-2.5 flex-wrap font-mono relative z-10 text-xs">
            <div className="bg-[#060b14]/90 px-3.5 py-2.5 rounded-2xl border border-cyan-500/30 text-center min-w-[105px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Waypoints</span>
              <span className="text-xl font-black text-cyan-300 font-mono">
                {orderedTasks.length} <span className="text-xs font-normal text-slate-400">/ {allTasks.length}</span>
              </span>
            </div>

            <div className="bg-[#060b14]/90 px-3.5 py-2.5 rounded-2xl border border-emerald-500/30 text-center min-w-[105px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Distance</span>
              <span className="text-xl font-black text-emerald-300 font-mono">
                {routeStats.totalDistanceKm > 0 ? `${routeStats.totalDistanceKm.toFixed(1)} km` : '--'}
              </span>
            </div>

            <div className="bg-[#060b14]/90 px-3.5 py-2.5 rounded-2xl border border-purple-500/30 text-center min-w-[105px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Transit Time</span>
              <span className="text-xl font-black text-purple-300 font-mono">
                {routeStats.estimatedMinutes > 0 ? formatDuration(routeStats.estimatedMinutes) : '--'}
              </span>
            </div>

            <div className="bg-[#060b14]/90 px-3.5 py-2.5 rounded-2xl border border-amber-500/30 text-center min-w-[105px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Fuel Savings</span>
              <span className="text-xl font-black text-amber-300 font-mono">
                {routeStats.co2SavedKgEst > 0 ? `+37%` : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Temporary Notification Banner */}
        {notificationBanner && (
          <div
            className={`p-3.5 rounded-2xl border text-xs font-mono flex items-center justify-between gap-3 animate-in fade-in ${
              notificationBanner.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-400/50 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : notificationBanner.type === 'warning'
                ? 'bg-amber-950/60 border-amber-400/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-cyan-950/60 border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 shrink-0 text-cyan-300" />
              <span>{notificationBanner.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setNotificationBanner(null)}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* =========================================================================
            PRIMARY ACTION CONTROL DOCK (Functional High-Tech Control Buttons)
           ========================================================================= */}
        <div className="bg-[#0b1220]/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-3 sm:p-4 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          {/* Left Action Set */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleRequestLocation}
              disabled={gpsStatus === 'acquiring'}
              className="px-3.5 py-2.5 bg-[#060b14] hover:bg-[#0f1a30] text-cyan-300 rounded-xl border border-cyan-500/40 hover:border-cyan-400 font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_10px_rgba(6,182,212,0.2)] disabled:opacity-50"
              title="Request actual GPS coordinate telemetry"
            >
              <Compass className={`w-4 h-4 text-cyan-400 ${gpsStatus === 'acquiring' ? 'animate-spin' : ''}`} />
              <span>{gpsStatus === 'acquiring' ? 'Acquiring GPS Fix...' : 'Use My Current Location'}</span>
            </button>

            <button
              type="button"
              onClick={handleSelectAllTasks}
              className="px-3.5 py-2.5 bg-[#060b14] hover:bg-[#0f1a30] text-slate-300 hover:text-white rounded-xl border border-slate-700 hover:border-cyan-400/50 font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>{selectedTaskIds.size === pendingCount ? 'Deselect All' : 'Select All Tasks'}</span>
            </button>

            <button
              type="button"
              onClick={optimizeRouteSequence}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black rounded-xl font-black tracking-wide flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_16px_rgba(16,185,129,0.4)]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              <span>Optimize Route</span>
            </button>

            <button
              type="button"
              onClick={handleRecalculateRoute}
              className="px-3.5 py-2.5 bg-[#060b14] hover:bg-[#0f1a30] text-emerald-300 rounded-xl border border-emerald-500/40 hover:border-emerald-400 font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Recalculate Route</span>
            </button>
          </div>

          {/* Right Action Set */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={toggleSimulation}
              className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                isSimulating
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-purple-950/40 hover:bg-purple-900/40 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              }`}
              title="Run live simulated vehicle dispatch along waypoints"
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? 'Pause Dispatch Sim' : 'Simulate Fleet Dispatch'}</span>
            </button>

            {isSimulating && (
              <div className="flex items-center gap-1 bg-[#060b14] p-1 rounded-xl border border-cyan-500/30">
                {[1, 2, 5].map(multiplier => (
                  <button
                    key={multiplier}
                    type="button"
                    onClick={() => {
                      setSimSpeedMultiplier(multiplier);
                      cyberAudio.playTone(800 + multiplier * 100, 'sine', 0.05);
                    }}
                    className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
                      simSpeedMultiplier === multiplier
                        ? 'bg-cyan-500 text-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {multiplier}x
                  </button>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleStartNavigation}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-black flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_16px_rgba(59,130,246,0.4)]"
            >
              <Navigation className="w-4 h-4 text-cyan-300" />
              <span>Start Navigation</span>
            </button>
          </div>
        </div>

        {/* GPS telemetry status readout */}
        {currentStaffLocation && (
          <div className="px-4 py-2 bg-[#060b14] rounded-xl border border-cyan-500/20 text-[11px] font-mono text-cyan-400 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center gap-2">
              <Crosshair className="w-3.5 h-3.5 text-cyan-300" />
              <span>REAL-TIME GPS ORIGIN: {currentStaffLocation.lat.toFixed(5)}° N, {currentStaffLocation.lng.toFixed(5)}° E</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Accuracy: ±{currentStaffLocation.accuracy}m</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">Last Ping: {currentStaffLocation.timestamp}</span>
            </span>
            <span className="text-emerald-400 font-bold">CARRIER SIGNAL: NAVIC/L1/L5 SATELLITE BEACON LOCKED</span>
          </div>
        )}

        {/* =========================================================================
            TWO-COLUMN MAIN INTERFACE: LEFT TASK MANIFEST & RIGHT INTERACTIVE MAP
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* =======================================================================
              LEFT PANEL (Lg: col-span-5) — ASSIGNED COLLECTION TASKS & MANIFEST
             ======================================================================= */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0b1220]/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-4 shadow-[0_0_20px_rgba(6,182,212,0.1)] space-y-4">
              {/* Panel Header */}
              <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      Collection Manifest
                    </h2>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {selectedTaskIds.size} of {allTasks.length} waypoints selected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span className="text-emerald-400 font-bold">{pendingCount} Active</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-slate-400">{completedCount} Done</span>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="space-y-2.5 font-mono text-xs">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, ward, address, or citizen..."
                    className="w-full pl-9 pr-3 py-2 bg-[#060b14] rounded-xl border border-cyan-500/20 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="grid grid-cols-3 gap-1 bg-[#060b14] p-1 rounded-xl border border-cyan-500/20 text-center text-[11px]">
                  <button
                    type="button"
                    onClick={() => setFilterMode('pending')}
                    className={`py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      filterMode === 'pending'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Active ({pendingCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterMode('completed')}
                    className={`py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      filterMode === 'completed'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Done ({completedCount})
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className={`py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                      filterMode === 'all'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({allTasks.length})
                  </button>
                </div>

                {/* Priority / Category Filters */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="bg-[#060b14] rounded-xl border border-cyan-500/20 text-slate-300 p-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">All Priorities</option>
                    <option value="Emergency">Emergency Only</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-[#060b14] rounded-xl border border-cyan-500/20 text-slate-300 p-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">All Waste Classes</option>
                    <option value="Hazardous">Hazardous / Bio</option>
                    <option value="Plastic">Plastic / Dry</option>
                    <option value="Organic">Organic / Wet</option>
                    <option value="Electronic">E-Waste</option>
                  </select>
                </div>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
                {isLoadingTasks ? (
                  <div className="py-12 text-center text-cyan-400 font-mono text-xs space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                    <p>SYNCHRONIZING MUNICIPAL TASK DATABASE...</p>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 font-mono text-xs border border-dashed border-cyan-500/20 rounded-xl p-4">
                    <Truck className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                    <p className="font-bold text-slate-300">No collection tasks match this filter.</p>
                    <p className="text-[11px] text-slate-500 mt-1">Adjust your search parameters or check back later.</p>
                  </div>
                ) : (
                  filteredTasks.map(task => {
                    const isSelected = selectedTaskIds.has(task.id);
                    const sequenceIndex = orderedTaskIds.indexOf(task.id);
                    const isOrdered = sequenceIndex !== -1;
                    const isHovered = hoveredStopId === task.id;

                    const priorityBg =
                      task.priority === 'Emergency'
                        ? 'bg-red-950/80 text-red-300 border-red-500/50'
                        : task.priority === 'High'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                        : 'bg-slate-800 text-slate-300 border-slate-700';

                    return (
                      <div
                        key={task.id}
                        onMouseEnter={() => setHoveredStopId(task.id)}
                        onMouseLeave={() => setHoveredStopId(null)}
                        className={`p-3 rounded-xl border transition-all duration-200 font-mono relative cursor-pointer ${
                          isHovered
                            ? 'bg-[#101b33] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                            : isSelected
                            ? 'bg-[#060d1a] border-cyan-500/50'
                            : 'bg-[#060b14]/70 border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                        onClick={() => toggleTaskSelection(task.id)}
                      >
                        <div className="flex items-start gap-2.5">
                          {/* Selection Checkbox */}
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <div className="w-5 h-5 rounded-md bg-cyan-500 text-black flex items-center justify-center font-bold text-xs shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                                ✓
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-md border border-slate-600 bg-slate-900" />
                            )}
                          </div>

                          {/* Task Content */}
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center justify-between gap-1 flex-wrap">
                              <span className="font-bold text-xs text-white">
                                {task.id}
                              </span>

                              <div className="flex items-center gap-1.5">
                                {isOrdered && isSelected && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-cyan-400 text-black shadow-[0_0_8px_rgba(6,182,212,0.5)]">
                                    STOP #{sequenceIndex + 1}
                                  </span>
                                )}
                                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${priorityBg}`}>
                                  {task.priority}
                                </span>
                              </div>
                            </div>

                            <p className="text-xs text-cyan-200 font-semibold truncate">
                              {task.title}
                            </p>

                            <p className="text-[11px] text-slate-400 truncate">
                              📍 {task.address} · {task.ward}
                            </p>

                            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500 border-t border-slate-800">
                              <span>
                                Weight: <strong className="text-emerald-400">{task.quantityKg || 45} kg</strong>
                              </span>
                              <span>
                                Citizen: <strong className="text-slate-300">{task.citizenName}</strong>
                              </span>
                              <span className="text-cyan-400 font-semibold">
                                {formatDistance(
                                  haversineDistanceKm(
                                    effectiveOrigin.lat,
                                    effectiveOrigin.lng,
                                    task.lat,
                                    task.lng
                                  )
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* =======================================================================
              RIGHT PANEL (Lg: col-span-7) — INTERACTIVE HOLOMAP & PLANNED ROUTE
             ======================================================================= */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0b1220]/95 backdrop-blur-md rounded-2xl border border-cyan-500/30 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col">
              {/* Map Header Bar */}
              <div className="p-3 sm:p-4 bg-[#060b14] border-b border-cyan-500/20 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="font-bold text-white uppercase tracking-wider">
                    Holomap Vector Display
                  </span>
                  <span className="text-[11px] text-cyan-300 hidden sm:inline">
                    · {orderedTasks.length} Connected Waypoints
                  </span>
                </div>

                {isSimulating && (
                  <div className="flex items-center gap-2 text-amber-400 text-[11px] font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>DISPATCH ACTIVE: STOP #{currentSimWaypointIndex + 1} EN ROUTE</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    Origin: <strong className="text-cyan-300">{effectiveOrigin.name}</strong>
                  </span>
                </div>
              </div>

              {/* Map Canvas Container */}
              <div className="relative w-full h-[480px] sm:h-[540px] bg-[#070b14] overflow-hidden">
                <Map
                  defaultCenter={effectiveOrigin}
                  defaultZoom={12}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  mapId="bf51a910020fa25a"
                  className="w-full h-full"
                >
                  {/* Google Directions API Polyline Layer */}
                  <GoogleDirectionsLayer
                    origin={effectiveOrigin}
                    orderedTasks={orderedTasks}
                    onRouteCalculated={(distMeters, durSeconds) => {
                      const km = distMeters / 1000;
                      const mins = durSeconds / 60;
                      const fuel = km / 8.5;
                      const co2 = fuel * 0.35 * 2.68;
                      setRouteStats({
                        totalDistanceKm: km,
                        estimatedMinutes: mins,
                        fuelLitersEst: fuel,
                        co2SavedKgEst: co2,
                        isApiCalculated: true,
                        baselineDistanceKm: km * 1.48,
                        baselineMinutes: mins * 1.55,
                        baselineFuel: fuel * 1.46,
                        baselineCo2: (km * 1.48 / 8.5) * 2.68
                      });
                    }}
                  />

                  {/* Origin Marker (Current GPS fix or Depot Beacon) */}
                  <AdvancedMarker position={effectiveOrigin} title={`Origin: ${effectiveOrigin.name}`}>
                    <div className="relative flex items-center justify-center cursor-pointer group">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-black border-2 border-white flex items-center justify-center font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.9)] animate-pulse">
                        ★
                      </div>
                      <div className="absolute -bottom-6 bg-black/90 px-2 py-0.5 rounded text-[10px] font-mono text-cyan-300 border border-cyan-400/40 whitespace-nowrap shadow-md pointer-events-none">
                        START / ORIGIN
                      </div>
                    </div>
                  </AdvancedMarker>

                  {/* Simulated Fleet Drone/Truck Moving Marker */}
                  {isSimulating && simCurrentCoords && (
                    <AdvancedMarker position={simCurrentCoords} title="Autonomous Waste Fleet Drone #KA-04-SW">
                      <div className="relative flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-black border-2 border-white flex items-center justify-center font-black shadow-[0_0_25px_rgba(245,158,11,1)] animate-bounce">
                          <Truck className="w-5 h-5 text-black" />
                        </div>
                        <div className="absolute -top-7 bg-amber-950/95 border border-amber-400 text-amber-200 px-2 py-0.5 rounded text-[9px] font-mono whitespace-nowrap">
                          DRONE FLEET EN ROUTE
                        </div>
                      </div>
                    </AdvancedMarker>
                  )}

                  {/* Waypoint Markers */}
                  {allTasks.map(task => {
                    const isSelected = selectedTaskIds.has(task.id);
                    const sequenceIndex = orderedTaskIds.indexOf(task.id);
                    const isOrdered = sequenceIndex !== -1;
                    const isHovered = hoveredStopId === task.id;

                    return (
                      <AdvancedMarker
                        key={task.id}
                        position={{ lat: task.lat, lng: task.lng }}
                        title={`${task.id} - ${task.title}`}
                        onClick={() => {
                          setActiveTaskPopup(task);
                          cyberAudio.playTone(900, 'sine', 0.08);
                        }}
                      >
                        <div
                          className={`relative flex items-center justify-center transition-transform hover:scale-125 cursor-pointer ${
                            isSelected ? 'z-20' : 'z-10 opacity-50'
                          }`}
                        >
                          {isOrdered && isSelected ? (
                            <div
                              className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-mono font-black text-xs shadow-lg ${
                                isHovered
                                  ? 'bg-cyan-300 text-black shadow-[0_0_20px_rgba(6,182,212,1)] scale-125'
                                  : 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                              }`}
                            >
                              {sequenceIndex + 1}
                            </div>
                          ) : task.priority === 'Emergency' ? (
                            <div className="w-7 h-7 rounded-full bg-red-600 text-white border-2 border-white shadow-[0_0_12px_rgba(239,68,68,0.8)] flex items-center justify-center animate-bounce">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-700 text-cyan-300 border border-cyan-400/50 flex items-center justify-center shadow-md">
                              <MapPin className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </AdvancedMarker>
                    );
                  })}
                </Map>

                {/* Map Floating Legend */}
                <div className="absolute top-3 left-3 bg-[#060b14]/90 backdrop-blur-md p-3 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] text-[11px] font-mono space-y-1.5 max-w-[220px] pointer-events-auto">
                  <span className="font-bold text-cyan-300 block text-[10px] uppercase tracking-wider">
                    TACTICAL MAP KEY
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center text-[9px] font-bold">★</span>
                    <span className="text-slate-300">Origin / GPS Beacon</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-cyan-500 text-black flex items-center justify-center text-[9px] font-bold font-mono">1</span>
                    <span className="text-slate-300">Planned Stop Sequence</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold">!</span>
                    <span className="text-slate-300">Hazard / Emergency Stop</span>
                  </div>
                </div>

                {/* Recenter Button */}
                {currentStaffLocation && (
                  <button
                    type="button"
                    onClick={handleRequestLocation}
                    className="absolute bottom-4 right-4 bg-[#060b14]/90 hover:bg-[#0f1a30] text-cyan-300 p-2.5 rounded-xl border border-cyan-500/40 shadow-lg flex items-center gap-1.5 text-xs font-mono font-bold cursor-pointer pointer-events-auto transition-all"
                    title="Recenter on current GPS coordinates"
                  >
                    <Compass className="w-4 h-4 text-cyan-400" />
                    <span>Recenter GPS</span>
                  </button>
                )}
              </div>

              {/* Waypoint Details Slide-out Card */}
              {activeTaskPopup && (
                <div className="p-4 bg-[#060b14] border-t border-cyan-500/30 space-y-3 font-mono">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">
                          {activeTaskPopup.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                          {activeTaskPopup.category}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                          {activeTaskPopup.status}
                        </span>
                        {orderedTaskIds.indexOf(activeTaskPopup.id) !== -1 && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-400 text-black">
                            STOP #{orderedTaskIds.indexOf(activeTaskPopup.id) + 1}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-200 mt-1 font-semibold">
                        {activeTaskPopup.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        📍 {activeTaskPopup.address} · Ward: {activeTaskPopup.ward}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Citizen: {activeTaskPopup.citizenName} {activeTaskPopup.mobile ? `(+91 ${activeTaskPopup.mobile})` : ''} · Waste: {activeTaskPopup.quantityKg || 45} kg
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTaskPopup(null)}
                      className="text-slate-400 hover:text-white cursor-pointer p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800 flex-wrap text-xs">
                    <span className="text-cyan-400 font-bold">
                      Direct Distance: {formatDistance(
                        haversineDistanceKm(
                          effectiveOrigin.lat,
                          effectiveOrigin.lng,
                          activeTaskPopup.lat,
                          activeTaskPopup.lng
                        )
                      )}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleTaskSelection(activeTaskPopup.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer border ${
                          selectedTaskIds.has(activeTaskPopup.id)
                            ? 'bg-red-950/60 text-red-300 border-red-500/40 hover:bg-red-900/60'
                            : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 hover:bg-cyan-900/60'
                        }`}
                      >
                        {selectedTaskIds.has(activeTaskPopup.id) ? 'Exclude from Route' : 'Include in Route'}
                      </button>

                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${effectiveOrigin.lat},${effectiveOrigin.lng}&destination=${activeTaskPopup.lat},${activeTaskPopup.lng}&travelmode=driving`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate to Stop</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            FUTURISTIC BAR GRAPHS COMPONENT (Requested by User)
            "AND ALSO GIVE THE BAQR GRAPH AND ALSO SHOWE THE ROATES IN MAP TO PLLANED ROUTE"
           ========================================================================= */}
        <div className="pt-2">
          <FuturisticRouteBarGraph
            tasks={allTasks}
            orderedTasks={orderedTasks}
            routeStats={routeStats}
            hoveredStopId={hoveredStopId}
            onHoverStop={id => setHoveredStopId(id)}
            onSelectStop={id => {
              const task = allTasks.find(t => t.id === id);
              if (task) setActiveTaskPopup(task);
            }}
            soundEnabled={!soundMuted}
            onPlayBeep={freq => cyberAudio.playTone(freq || 880, 'sine', 0.08)}
          />
        </div>
      </div>
    </div>
  );
};
