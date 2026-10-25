import React, { useState, useEffect, useMemo } from 'react';
import { Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { useLanguage } from '../i18n/LanguageContext';
import { Complaint, WasteBin } from '../types';
import {
  MapPin,
  Navigation,
  Filter,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Info,
  ExternalLink,
  Users,
  Clock,
  CheckCircle,
  Truck,
  Search,
  RotateCcw,
  Building2,
  Inbox,
  Radio,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { BackButton } from '../components/BackButton';

// 31 Karnataka Districts with exact geographical administrative coordinates
export const ALL_31_KARNATAKA_DISTRICT_COORDS: Record<
  string,
  { lat: number; lng: number; headquarters: string; zoom: number; region: string }
> = {
  Bagalkote: { lat: 16.1817, lng: 75.6958, headquarters: 'Bagalkote', zoom: 11, region: 'Belagavi Division' },
  Ballari: { lat: 15.1394, lng: 76.9214, headquarters: 'Ballari', zoom: 11, region: 'Kalaburagi Division' },
  Belagavi: { lat: 15.8497, lng: 74.4977, headquarters: 'Belagavi', zoom: 11, region: 'Belagavi Division' },
  'Bengaluru Urban': { lat: 12.9716, lng: 77.5946, headquarters: 'Bengaluru', zoom: 12, region: 'Bengaluru Division' },
  'Bengaluru Rural': { lat: 13.245, lng: 77.7126, headquarters: 'Devanahalli', zoom: 11, region: 'Bengaluru Division' },
  Bidar: { lat: 17.9104, lng: 77.5199, headquarters: 'Bidar', zoom: 11, region: 'Kalaburagi Division' },
  Chamarajanagar: { lat: 11.9261, lng: 76.9437, headquarters: 'Chamarajanagar', zoom: 11, region: 'Mysuru Division' },
  Chikkaballapura: { lat: 13.4355, lng: 77.7315, headquarters: 'Chikkaballapura', zoom: 11, region: 'Bengaluru Division' },
  Chikkamagaluru: { lat: 13.3161, lng: 75.772, headquarters: 'Chikkamagaluru', zoom: 11, region: 'Mysuru Division' },
  Chitradurga: { lat: 14.2251, lng: 76.398, headquarters: 'Chitradurga', zoom: 11, region: 'Bengaluru Division' },
  'Dakshina Kannada (Mangaluru)': { lat: 12.9141, lng: 74.856, headquarters: 'Mangaluru', zoom: 11, region: 'Mysuru Division' },
  Davanagere: { lat: 14.4644, lng: 75.9218, headquarters: 'Davanagere', zoom: 11, region: 'Bengaluru Division' },
  'Dharwad (Hubballi-Dharwad)': { lat: 15.3647, lng: 75.124, headquarters: 'Dharwad', zoom: 11, region: 'Belagavi Division' },
  Gadag: { lat: 15.4298, lng: 75.6318, headquarters: 'Gadag-Betageri', zoom: 11, region: 'Belagavi Division' },
  Hassan: { lat: 13.0072, lng: 76.0964, headquarters: 'Hassan', zoom: 11, region: 'Mysuru Division' },
  Haveri: { lat: 14.7967, lng: 75.4011, headquarters: 'Haveri', zoom: 11, region: 'Belagavi Division' },
  Kalaburagi: { lat: 17.3297, lng: 76.8343, headquarters: 'Kalaburagi', zoom: 11, region: 'Kalaburagi Division' },
  'Kodagu (Madikeri)': { lat: 12.4244, lng: 75.7382, headquarters: 'Madikeri', zoom: 11, region: 'Mysuru Division' },
  Kolar: { lat: 13.1367, lng: 78.1291, headquarters: 'Kolar', zoom: 11, region: 'Bengaluru Division' },
  Koppal: { lat: 15.3547, lng: 76.1554, headquarters: 'Koppal', zoom: 11, region: 'Kalaburagi Division' },
  Mandya: { lat: 12.5238, lng: 76.897, headquarters: 'Mandya', zoom: 11, region: 'Mysuru Division' },
  Mysuru: { lat: 12.2958, lng: 76.6394, headquarters: 'Mysuru', zoom: 11, region: 'Mysuru Division' },
  Raichur: { lat: 16.2076, lng: 77.3463, headquarters: 'Raichur', zoom: 11, region: 'Kalaburagi Division' },
  Ramanagara: { lat: 12.7209, lng: 77.2799, headquarters: 'Ramanagara', zoom: 11, region: 'Bengaluru Division' },
  Shivamogga: { lat: 13.9299, lng: 75.5681, headquarters: 'Shivamogga', zoom: 11, region: 'Bengaluru Division' },
  Tumakuru: { lat: 13.3409, lng: 77.101, headquarters: 'Tumakuru', zoom: 11, region: 'Bengaluru Division' },
  Udupi: { lat: 13.3409, lng: 74.7421, headquarters: 'Udupi', zoom: 11, region: 'Mysuru Division' },
  'Uttara Kannada (Karwar)': { lat: 14.8185, lng: 74.1352, headquarters: 'Karwar', zoom: 11, region: 'Belagavi Division' },
  Vijayapura: { lat: 16.8302, lng: 75.71, headquarters: 'Vijayapura', zoom: 11, region: 'Belagavi Division' },
  'Vijayanagara (Hosapete)': { lat: 15.2689, lng: 76.3909, headquarters: 'Hosapete', zoom: 11, region: 'Kalaburagi Division' },
  Yadgir: { lat: 16.7644, lng: 77.1378, headquarters: 'Yadgir', zoom: 11, region: 'Kalaburagi Division' }
};

export interface DistrictCollectionData {
  name: string;
  headquarters: string;
  lat: number;
  lng: number;
  zoom: number;
  taluksCount: number;
  hasData: boolean;
  stats: {
    assignedStaffCount: number;
    pendingPickupsCount: number;
    ongoingCollectionsCount: number;
    completedCollectionsCount: number;
    activeComplaintsCount: number;
    binsCount: number;
  };
  assignedStaff: Array<{
    id: string;
    name: string;
    email: string;
    mobile: string;
    ward: string;
    district: string;
    staffBadge?: string;
    activeTasks: number;
    completedTasks: number;
  }>;
  pendingPickups: Array<{
    id: string;
    citizenName?: string;
    address: string;
    ward: string;
    district: string;
    wasteType: string;
    estimatedWeightKg?: number;
    scheduledDate?: string;
    timeSlot?: string;
    status: string;
    lat?: number;
    lng?: number;
  }>;
  ongoingCollections: Array<any>;
  completedCollections: Array<any>;
  activeComplaints: Complaint[];
  wasteBins: WasteBin[];
}

export type MapFilterType =
  | 'all'
  | 'districts'
  | 'staff'
  | 'pending'
  | 'ongoing'
  | 'completed'
  | 'complaints'
  | 'bins';

// Helper component to control map pan/zoom programmatically
const MapController: React.FC<{ center: { lat: number; lng: number }; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(center);
      map.setZoom(zoom);
    }
  }, [map, center.lat, center.lng, zoom]);
  return null;
};

export const CollectionMapPage: React.FC<{
  setCurrentTab: (tab: string) => void;
  onBack?: () => void;
}> = ({ setCurrentTab, onBack }) => {
  const { t } = useLanguage();

  const [districtsData, setDistrictsData] = useState<DistrictCollectionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>('All');
  const [searchDistrictQuery, setSearchDistrictQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<MapFilterType>('all');

  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 14.5, lng: 75.8 });
  const [zoom, setZoom] = useState<number>(7);

  // Selected Pin for InfoWindow and details panel
  const [selectedPin, setSelectedPin] = useState<{
    type: 'district' | 'complaint' | 'bin' | 'pickup' | 'staff';
    data: any;
  } | null>(null);

  // Active detail view tab inside the district panel
  const [activeDistrictTab, setActiveDistrictTab] = useState<'overview' | 'staff' | 'pickups' | 'complaints' | 'bins'>('overview');

  // Load live data from the backend
  useEffect(() => {
    setLoading(true);
    fetch('/api/locations/collection-map-data')
      .then(res => res.json())
      .then(data => {
        if (data.districts && Array.isArray(data.districts)) {
          setDistrictsData(data.districts);
        }
      })
      .catch(err => {
        console.error('Failed to load collection map data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter districts list based on search input
  const filteredDistrictList = useMemo(() => {
    if (!searchDistrictQuery.trim()) return districtsData;
    const q = searchDistrictQuery.toLowerCase().trim();
    return districtsData.filter(
      d =>
        d.name.toLowerCase().includes(q) ||
        d.headquarters.toLowerCase().includes(q)
    );
  }, [districtsData, searchDistrictQuery]);

  // Find currently active district data
  const currentDistrictData = useMemo(() => {
    if (selectedDistrictName === 'All') return null;
    return districtsData.find(d => d.name === selectedDistrictName) || null;
  }, [districtsData, selectedDistrictName]);

  // Overall statistics aggregated across all 31 districts
  const aggregatedStats = useMemo(() => {
    return districtsData.reduce(
      (acc, d) => {
        acc.totalStaff += d.stats.assignedStaffCount;
        acc.totalPending += d.stats.pendingPickupsCount;
        acc.totalOngoing += d.stats.ongoingCollectionsCount;
        acc.totalCompleted += d.stats.completedCollectionsCount;
        acc.totalComplaints += d.stats.activeComplaintsCount;
        acc.totalBins += d.stats.binsCount;
        if (d.hasData) acc.districtsWithData += 1;
        return acc;
      },
      {
        totalStaff: 0,
        totalPending: 0,
        totalOngoing: 0,
        totalCompleted: 0,
        totalComplaints: 0,
        totalBins: 0,
        districtsWithData: 0
      }
    );
  }, [districtsData]);

  // Select a district and smoothly pan to it
  const handleSelectDistrict = (districtName: string) => {
    setSelectedDistrictName(districtName);
    setActiveDistrictTab('overview');

    if (districtName === 'All') {
      setCenter({ lat: 14.5, lng: 75.8 });
      setZoom(7);
      setSelectedPin(null);
      return;
    }

    const dist = districtsData.find(d => d.name === districtName);
    if (dist) {
      setCenter({ lat: dist.lat, lng: dist.lng });
      setZoom(dist.zoom || 11);
      setSelectedPin({ type: 'district', data: dist });
    }
  };

  const resetToKarnatakaOverview = () => {
    setSelectedDistrictName('All');
    setCenter({ lat: 14.5, lng: 75.8 });
    setZoom(7);
    setSelectedPin(null);
  };

  // Extract all assets for the selected scope (All or single district)
  const scopedDistricts = useMemo(() => {
    if (selectedDistrictName === 'All') return districtsData;
    return districtsData.filter(d => d.name === selectedDistrictName);
  }, [districtsData, selectedDistrictName]);

  const allScopedComplaints = useMemo(() => {
    return scopedDistricts.flatMap(d => d.activeComplaints || []);
  }, [scopedDistricts]);

  const allScopedBins = useMemo(() => {
    return scopedDistricts.flatMap(d => d.wasteBins || []);
  }, [scopedDistricts]);

  const allScopedPendingPickups = useMemo(() => {
    return scopedDistricts.flatMap(d => d.pendingPickups || []);
  }, [scopedDistricts]);

  const allScopedOngoing = useMemo(() => {
    return scopedDistricts.flatMap(d => d.ongoingCollections || []);
  }, [scopedDistricts]);

  const allScopedCompleted = useMemo(() => {
    return scopedDistricts.flatMap(d => d.completedCollections || []);
  }, [scopedDistricts]);

  const allScopedStaff = useMemo(() => {
    return scopedDistricts.flatMap(d => d.assignedStaff || []);
  }, [scopedDistricts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            31 Districts Live GIS Engine
          </span>
          <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
            Karnataka State Municipal Grid
          </span>
        </div>
      </div>

      {/* Main Page Title & Key Metrics Cards */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300 inline-block">
              Karnataka State Solid Waste Monitoring
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              {t.collectionMap} & District Grid
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
              Interactive geographic tracking across <strong>all 31 Karnataka districts</strong>. Inspect real-time waste collection requests, assigned staff, smart bins, and unresolved grievances on Google Maps.
            </p>
          </div>

          <button
            onClick={resetToKarnatakaOverview}
            className="self-start lg:self-center px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
            <span>Reset to Karnataka View</span>
          </button>
        </div>

        {/* State Summary KPI Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Total Districts</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-slate-900">31</span>
              <span className="text-[10px] text-emerald-700 font-semibold">({aggregatedStats.districtsWithData} active)</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Collection Staff</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-purple-700">{aggregatedStats.totalStaff}</span>
              <span className="text-[10px] text-slate-400">deployed</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Pending Pickups</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-amber-700">{aggregatedStats.totalPending}</span>
              <span className="text-[10px] text-slate-400">doorstep</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Ongoing Collections</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-blue-700">{aggregatedStats.totalOngoing}</span>
              <span className="text-[10px] text-slate-400">in-progress</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Completed</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-emerald-700">{aggregatedStats.totalCompleted}</span>
              <span className="text-[10px] text-slate-400">collected</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-[11px] text-slate-500 block">Smart Bins</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-black text-cyan-700">{aggregatedStats.totalBins}</span>
              <span className="text-[10px] text-slate-400">monitored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* District Dropdown Selector */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-800" />
              Focus District:
            </label>
            <select
              value={selectedDistrictName}
              onChange={e => handleSelectDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 font-semibold text-slate-800"
            >
              <option value="All">All 31 Karnataka Districts (State Overview)</option>
              {districtsData.map(d => (
                <option key={d.name} value={d.name}>
                  {d.name} {d.hasData ? `• (${d.stats.activeComplaintsCount + d.stats.binsCount + d.stats.assignedStaffCount} records)` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Asset Type Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Assets
            </button>
            <button
              onClick={() => setFilterType('districts')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'districts'
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              31 District Centers
            </button>
            <button
              onClick={() => setFilterType('staff')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'staff'
                  ? 'bg-purple-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Collection Staff ({allScopedStaff.length})
            </button>
            <button
              onClick={() => setFilterType('pending')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'pending'
                  ? 'bg-amber-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Pending Pickups ({allScopedPendingPickups.length})
            </button>
            <button
              onClick={() => setFilterType('ongoing')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'ongoing'
                  ? 'bg-blue-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ongoing ({allScopedOngoing.length})
            </button>
            <button
              onClick={() => setFilterType('completed')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'completed'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Completed ({allScopedCompleted.length})
            </button>
            <button
              onClick={() => setFilterType('complaints')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'complaints'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Complaints ({allScopedComplaints.length})
            </button>
            <button
              onClick={() => setFilterType('bins')}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filterType === 'bins'
                  ? 'bg-cyan-800 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Smart Bins ({allScopedBins.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout: District Browser, Interactive Google Map, Collection Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Searchable 31 Districts List (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col h-[600px] overflow-hidden">
          <div className="space-y-2 pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                All 31 Districts
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {filteredDistrictList.length} shown
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchDistrictQuery}
                onChange={e => setSearchDistrictQuery(e.target.value)}
                placeholder="Search districts (e.g. Mysuru)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Scrollable District List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pt-3 pr-1 divide-y divide-slate-100">
            <button
              type="button"
              onClick={() => handleSelectDistrict('All')}
              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                selectedDistrictName === 'All'
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">All 31 Districts</span>
                <span className="text-[10px] text-slate-500">Statewide Grid Map</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {filteredDistrictList.map(dist => {
              const isSelected = selectedDistrictName === dist.name;
              const totalItems =
                dist.stats.assignedStaffCount +
                dist.stats.pendingPickupsCount +
                dist.stats.ongoingCollectionsCount +
                dist.stats.completedCollectionsCount +
                dist.stats.activeComplaintsCount +
                dist.stats.binsCount;

              return (
                <button
                  key={dist.name}
                  type="button"
                  onClick={() => handleSelectDistrict(dist.name)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">{dist.name}</span>
                    {dist.hasData ? (
                      <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                        {totalItems} active
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">
                        No data
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>HQ: {dist.headquarters}</span>
                    <span>{dist.taluksCount} Taluks</span>
                  </div>
                </button>
              );
            })}

            {filteredDistrictList.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400 space-y-1">
                <p>No districts matching "{searchDistrictQuery}"</p>
                <button
                  onClick={() => setSearchDistrictQuery('')}
                  className="text-emerald-700 font-semibold hover:underline text-[11px]"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CENTER COLUMN: Google Map View (6 cols on desktop) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 h-[600px] overflow-hidden flex flex-col justify-between p-3 text-white shadow-xl relative">
          <div className="w-full h-full rounded-xl overflow-hidden relative">
            <Map
              style={{ width: '100%', height: '100%' }}
              defaultCenter={{ lat: 14.5, lng: 75.8 }}
              center={center}
              zoom={zoom}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              gestureHandling="greedy"
            >
              <MapController center={center} zoom={zoom} />

              {/* 1. All 31 District Markers */}
              {(filterType === 'all' || filterType === 'districts') &&
                districtsData.map(dist => {
                  const isSelected = selectedDistrictName === dist.name;
                  return (
                    <AdvancedMarker
                      key={`district-${dist.name}`}
                      position={{ lat: dist.lat, lng: dist.lng }}
                      onClick={() => {
                        handleSelectDistrict(dist.name);
                      }}
                      title={`District: ${dist.name} (${dist.headquarters})`}
                    >
                      <div
                        className={`group relative flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                          isSelected ? 'scale-125 z-30' : 'z-10'
                        }`}
                      >
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full shadow-lg border text-[11px] font-bold ${
                            isSelected
                              ? 'bg-emerald-900 text-white border-emerald-400 ring-2 ring-emerald-400'
                              : dist.hasData
                              ? 'bg-white text-emerald-900 border-emerald-600'
                              : 'bg-slate-100 text-slate-700 border-slate-400 opacity-90'
                          }`}
                        >
                          <Building2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[90px]">{dist.name.split(' ')[0]}</span>
                          {dist.hasData && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
                          )}
                        </div>
                      </div>
                    </AdvancedMarker>
                  );
                })}

              {/* 2. Complaints Markers */}
              {(filterType === 'all' || filterType === 'complaints') &&
                allScopedComplaints.map(c => {
                  return (
                    <AdvancedMarker
                      key={`comp-${c.id}`}
                      position={{ lat: c.lat, lng: c.lng }}
                      onClick={() => setSelectedPin({ type: 'complaint', data: c })}
                      title={`Complaint: ${c.id} - ${c.wasteCategory}`}
                    >
                      <Pin
                        background="#DC2626"
                        borderColor="#7F1D1D"
                        glyphColor="#FFFFFF"
                        scale={0.9}
                      />
                    </AdvancedMarker>
                  );
                })}

              {/* 3. Smart Bins Markers */}
              {(filterType === 'all' || filterType === 'bins') &&
                allScopedBins.map(bin => {
                  const isFull = bin.currentFillLevel >= 75;
                  return (
                    <AdvancedMarker
                      key={`bin-${bin.id}`}
                      position={{ lat: bin.lat, lng: bin.lng }}
                      onClick={() => setSelectedPin({ type: 'bin', data: bin })}
                      title={`Smart Bin: ${bin.name} (${bin.currentFillLevel}% filled)`}
                    >
                      <Pin
                        background={isFull ? '#E11D48' : '#0284C7'}
                        borderColor="#0C4A6E"
                        glyphColor="#FFFFFF"
                        scale={0.9}
                      />
                    </AdvancedMarker>
                  );
                })}

              {/* 4. Pending Pickups Markers */}
              {(filterType === 'all' || filterType === 'pending') &&
                allScopedPendingPickups
                  .filter(p => typeof p.lat === 'number' && typeof p.lng === 'number')
                  .map(pickup => (
                    <AdvancedMarker
                      key={`pickup-${pickup.id}`}
                      position={{ lat: pickup.lat!, lng: pickup.lng! }}
                      onClick={() => setSelectedPin({ type: 'pickup', data: pickup })}
                      title={`Doorstep Pickup: ${pickup.id}`}
                    >
                      <Pin
                        background="#D97706"
                        borderColor="#78350F"
                        glyphColor="#FFFFFF"
                        scale={0.9}
                      />
                    </AdvancedMarker>
                  ))}

              {/* 5. Ongoing Collections Markers */}
              {(filterType === 'all' || filterType === 'ongoing') &&
                allScopedOngoing
                  .filter(o => typeof o.lat === 'number' && typeof o.lng === 'number')
                  .map(item => (
                    <AdvancedMarker
                      key={`ongoing-${item.id}`}
                      position={{ lat: item.lat, lng: item.lng }}
                      onClick={() => setSelectedPin({ type: item.collectionType || 'complaint', data: item })}
                      title={`Ongoing Collection: ${item.id}`}
                    >
                      <Pin
                        background="#2563EB"
                        borderColor="#1E3A8A"
                        glyphColor="#FFFFFF"
                        scale={0.9}
                      />
                    </AdvancedMarker>
                  ))}

              {/* 6. Completed Collections Markers */}
              {(filterType === 'all' || filterType === 'completed') &&
                allScopedCompleted
                  .filter(o => typeof o.lat === 'number' && typeof o.lng === 'number')
                  .map(item => (
                    <AdvancedMarker
                      key={`completed-${item.id}`}
                      position={{ lat: item.lat, lng: item.lng }}
                      onClick={() => setSelectedPin({ type: item.collectionType || 'complaint', data: item })}
                      title={`Completed Collection: ${item.id}`}
                    >
                      <Pin
                        background="#059669"
                        borderColor="#064E3B"
                        glyphColor="#FFFFFF"
                        scale={0.9}
                      />
                    </AdvancedMarker>
                  ))}

              {/* 7. Staff Markers */}
              {(filterType === 'all' || filterType === 'staff') &&
                allScopedStaff.map(s => {
                  const distCoord = ALL_31_KARNATAKA_DISTRICT_COORDS[s.district] || { lat: 12.9716, lng: 77.5946 };
                  return (
                    <AdvancedMarker
                      key={`staff-${s.id}`}
                      position={{ lat: distCoord.lat + 0.015, lng: distCoord.lng + 0.015 }}
                      onClick={() => setSelectedPin({ type: 'staff', data: s })}
                      title={`Staff: ${s.name} (${s.ward})`}
                    >
                      <Pin
                        background="#7C3AED"
                        borderColor="#4C1D95"
                        glyphColor="#FFFFFF"
                        scale={0.9}
                      />
                    </AdvancedMarker>
                  );
                })}

              {/* Interactive InfoWindow on selectedPin */}
              {selectedPin && (
                <InfoWindow
                  position={
                    selectedPin.type === 'district'
                      ? { lat: selectedPin.data.lat, lng: selectedPin.data.lng }
                      : { lat: selectedPin.data.lat || 12.9716, lng: selectedPin.data.lng || 77.5946 }
                  }
                  onCloseClick={() => setSelectedPin(null)}
                >
                  <div className="p-1 text-slate-900 max-w-xs space-y-1">
                    {selectedPin.type === 'district' && (
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 uppercase">
                          <Building2 className="w-3 h-3" />
                          <span>District Headquarters</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{selectedPin.data.name}</h4>
                        <p className="text-[11px] text-slate-600">HQ: {selectedPin.data.headquarters} · {selectedPin.data.taluksCount} Taluks</p>
                        <div className="pt-1 mt-1 border-t border-slate-200 text-[10px] space-y-0.5">
                          {selectedPin.data.hasData ? (
                            <span className="font-semibold text-emerald-700 block">
                              ✓ {selectedPin.data.stats.assignedStaffCount} Staff · {selectedPin.data.stats.activeComplaintsCount} Complaints · {selectedPin.data.stats.binsCount} Bins
                            </span>
                          ) : (
                            <span className="text-slate-500 italic block">No collection data recorded</span>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedPin.type === 'complaint' && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-red-600 block">Complaint {selectedPin.data.id}</span>
                        <h4 className="font-bold text-xs text-slate-900">{selectedPin.data.wasteCategory}</h4>
                        <p className="text-[11px] text-slate-600">{selectedPin.data.street}, {selectedPin.data.ward}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {selectedPin.data.status}
                        </span>
                      </div>
                    )}

                    {selectedPin.type === 'bin' && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-blue-600 block">Smart Bin</span>
                        <h4 className="font-bold text-xs text-slate-900">{selectedPin.data.name}</h4>
                        <p className="text-[11px] text-slate-600">Fill: {selectedPin.data.currentFillLevel}% · {selectedPin.data.category}</p>
                      </div>
                    )}

                    {selectedPin.type === 'staff' && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-purple-600 block">Collection Staff</span>
                        <h4 className="font-bold text-xs text-slate-900">{selectedPin.data.name}</h4>
                        <p className="text-[11px] text-slate-600">{selectedPin.data.ward}, {selectedPin.data.district}</p>
                        <span className="text-[10px] text-slate-500">Badge: {selectedPin.data.staffBadge || 'N/A'}</span>
                      </div>
                    )}

                    {selectedPin.type === 'pickup' && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-600 block">Doorstep Pickup {selectedPin.data.id}</span>
                        <h4 className="font-bold text-xs text-slate-900">{selectedPin.data.wasteType}</h4>
                        <p className="text-[11px] text-slate-600">{selectedPin.data.address}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {selectedPin.data.status}
                        </span>
                      </div>
                    )}
                  </div>
                </InfoWindow>
              )}
            </Map>
          </div>

          {/* Map Footer Telemetry & Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-300 pt-2 px-2 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-emerald-600"></span> Districts (31)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Complaints
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Smart Bins
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Staff
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Pickups
              </span>
            </div>
            <span className="text-emerald-400 font-mono text-[10px]">
              {selectedDistrictName === 'All' ? 'Statewide (31 Districts)' : selectedDistrictName}
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: District Collection Information Panel (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 shadow-xs h-[600px] overflow-hidden">
          {/* Active Scope / Selected District Details */}
          {currentDistrictData ? (
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* District Card Header */}
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Karnataka District
                  </span>
                  <button
                    onClick={resetToKarnatakaOverview}
                    className="text-[11px] text-slate-400 hover:text-slate-700 underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {currentDistrictData.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Headquarters: <strong>{currentDistrictData.headquarters}</strong> · {currentDistrictData.taluksCount} Taluks
                </p>
              </div>

              {/* Dynamic Data check according to Requirement 8: If a district has no data, display "No collection data available" */}
              {!currentDistrictData.hasData ? (
                <div className="py-8 px-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-2.5">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Inbox className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    No collection data available
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    No assigned collection staff, active waste complaints, or doorstep pickup requests are currently recorded in the municipal database for <strong>{currentDistrictData.name}</strong>.
                  </p>
                  <div className="pt-2 text-[10px] text-slate-400">
                    GPS Coordinates: {currentDistrictData.lat.toFixed(4)}, {currentDistrictData.lng.toFixed(4)}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Real Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl">
                      <span className="text-[10px] text-purple-700 font-semibold block">Collection Staff</span>
                      <span className="text-base font-black text-purple-900">
                        {currentDistrictData.stats.assignedStaffCount}
                      </span>
                    </div>

                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="text-[10px] text-amber-700 font-semibold block">Pending Pickups</span>
                      <span className="text-base font-black text-amber-900">
                        {currentDistrictData.stats.pendingPickupsCount}
                      </span>
                    </div>

                    <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                      <span className="text-[10px] text-blue-700 font-semibold block">Ongoing</span>
                      <span className="text-base font-black text-blue-900">
                        {currentDistrictData.stats.ongoingCollectionsCount}
                      </span>
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-[10px] text-emerald-700 font-semibold block">Completed</span>
                      <span className="text-base font-black text-emerald-900">
                        {currentDistrictData.stats.completedCollectionsCount}
                      </span>
                    </div>

                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl">
                      <span className="text-[10px] text-red-700 font-semibold block">Active Complaints</span>
                      <span className="text-base font-black text-red-900">
                        {currentDistrictData.stats.activeComplaintsCount}
                      </span>
                    </div>

                    <div className="p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl">
                      <span className="text-[10px] text-cyan-700 font-semibold block">Smart Bins</span>
                      <span className="text-base font-black text-cyan-900">
                        {currentDistrictData.stats.binsCount}
                      </span>
                    </div>
                  </div>

                  {/* Tab Selector for District Real Records */}
                  <div className="flex border-b border-slate-200 text-[11px] gap-2 pt-1 font-semibold">
                    <button
                      type="button"
                      onClick={() => setActiveDistrictTab('overview')}
                      className={`pb-1.5 transition-colors cursor-pointer ${
                        activeDistrictTab === 'overview'
                          ? 'border-b-2 border-emerald-700 text-emerald-800'
                          : 'text-slate-500'
                      }`}
                    >
                      Overview
                    </button>
                    {currentDistrictData.stats.assignedStaffCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveDistrictTab('staff')}
                        className={`pb-1.5 transition-colors cursor-pointer ${
                          activeDistrictTab === 'staff'
                            ? 'border-b-2 border-emerald-700 text-emerald-800'
                            : 'text-slate-500'
                        }`}
                      >
                        Staff ({currentDistrictData.stats.assignedStaffCount})
                      </button>
                    )}
                    {currentDistrictData.stats.activeComplaintsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveDistrictTab('complaints')}
                        className={`pb-1.5 transition-colors cursor-pointer ${
                          activeDistrictTab === 'complaints'
                            ? 'border-b-2 border-emerald-700 text-emerald-800'
                            : 'text-slate-500'
                        }`}
                      >
                        Complaints ({currentDistrictData.stats.activeComplaintsCount})
                      </button>
                    )}
                    {currentDistrictData.stats.binsCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setActiveDistrictTab('bins')}
                        className={`pb-1.5 transition-colors cursor-pointer ${
                          activeDistrictTab === 'bins'
                            ? 'border-b-2 border-emerald-700 text-emerald-800'
                            : 'text-slate-500'
                        }`}
                      >
                        Bins ({currentDistrictData.stats.binsCount})
                      </button>
                    )}
                  </div>

                  {/* Tab Contents */}
                  {activeDistrictTab === 'staff' && (
                    <div className="space-y-2 text-xs">
                      {currentDistrictData.assignedStaff.map(s => (
                        <div key={s.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{s.name}</span>
                            <span className="text-[10px] text-purple-700 font-mono">{s.staffBadge || 'STAFF'}</span>
                          </div>
                          <p className="text-[11px] text-slate-600">Ward: {s.ward}</p>
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>Active Tasks: {s.activeTasks}</span>
                            <span>Completed: {s.completedTasks}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeDistrictTab === 'complaints' && (
                    <div className="space-y-2 text-xs">
                      {currentDistrictData.activeComplaints.map(c => (
                        <div key={c.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-slate-800">{c.id}</span>
                            <span className="text-[10px] font-bold text-amber-700">{c.status}</span>
                          </div>
                          <p className="text-[11px] font-semibold text-emerald-800">{c.wasteCategory}</p>
                          <p className="text-[10px] text-slate-500">{c.street}, {c.ward}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeDistrictTab === 'bins' && (
                    <div className="space-y-2 text-xs">
                      {currentDistrictData.wasteBins.map(b => (
                        <div key={b.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{b.name}</span>
                            <span className="text-emerald-700 font-mono">{b.currentFillLevel}%</span>
                          </div>
                          <p className="text-[10px] text-slate-500">{b.address}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* State Overview / Fallback info when 'All' is selected */
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Karnataka State Overview
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  All 31 Districts
                </h3>
                <p className="text-xs text-slate-500">
                  Select any district from the list or map to view its real collection metrics.
                </p>
              </div>

              {selectedPin && selectedPin.type === 'complaint' ? (
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-900">{selectedPin.data.id}</span>
                    <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded text-red-700 border border-red-200">
                      {selectedPin.data.status}
                    </span>
                  </div>
                  <p className="text-slate-800 font-semibold">{selectedPin.data.wasteCategory}</p>
                  <p className="text-slate-600">{selectedPin.data.street}, {selectedPin.data.ward}, {selectedPin.data.district}</p>
                  <button
                    onClick={() => setCurrentTab('track')}
                    className="w-full py-1.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Track Grievance →
                  </button>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 block">District Highlights:</span>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      <li>• <strong>Bengaluru Urban:</strong> Primary metropolitan solid waste hub</li>
                      <li>• <strong>Mysuru:</strong> Heritage clean city division</li>
                      <li>• <strong>Dakshina Kannada:</strong> Coastal waste management zone</li>
                      <li>• <strong>Hubballi-Dharwad:</strong> North Karnataka central junction</li>
                    </ul>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Click any marker on the Google Map or pick a district from the left panel to zoom in and inspect real assigned staff, active complaints, or doorstep pickup status.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick External Google Maps Action */}
          <div className="pt-2 border-t border-slate-100">
            <a
              href={`https://www.google.com/maps/@${center.lat},${center.lng},${zoom}z`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
