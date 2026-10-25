import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Complaint, PickupRequest, AuditLog, StaffPaymentRecord } from '../types';
import {
  ShieldAlert,
  Users,
  FileText,
  BarChart3,
  Download,
  CheckCircle2,
  XCircle,
  UserPlus,
  Clock,
  ArrowRight,
  Filter,
  Layers,
  Award,
  MapPin,
  Navigation,
  Compass,
  Radio,
  ExternalLink,
  Plus,
  Tag,
  Globe,
  RefreshCw,
  Trash2,
  Truck,
  X,
  Calendar,
  CreditCard,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  History,
  RotateCcw,
  Video,
  Image as ImageIcon,
  ChevronRight,
  Search,
  TrendingUp,
  Printer,
  Route
} from 'lucide-react';
import { BackButton } from '../components/BackButton';

interface StaffItem {
  id: string;
  name: string;
  email: string;
  mobile: string;
  ward: string;
  district: string;
  activeTasks: number;
  completedTasks: number;
  points: number;
}

export const AdminDashboard: React.FC<{
  setCurrentTab: (tab: string) => void;
  onBack?: () => void;
}> = ({ setCurrentTab, onBack }) => {
  const { t } = useLanguage();
  const { user, openAuthModal } = useAuth();

  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'complaints' | 'reports' | 'payments' | 'staff' | 'categories' | 'locations' | 'audit'>('complaints');

  // Core Data
  const [stats, setStats] = useState<any>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [staffList, setStaffList] = useState<StaffItem[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [locationsData, setLocationsData] = useState<any[]>([]);
  const [paymentsList, setPaymentsList] = useState<StaffPaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Complaints & Collections Tab Controls
  const [collectionTab, setCollectionTab] = useState<'complaints' | 'pickups'>('complaints');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState('all');

  // Task Review Modal (Complaints)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [assignStaffId, setAssignStaffId] = useState('');
  const [assignPriority, setAssignPriority] = useState<'Low' | 'Medium' | 'High' | 'Emergency'>('Medium');
  const [assignDueDate, setAssignDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [reassignReason, setReassignReason] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Evidence Review Sub-Modal
  const [evidenceAction, setEvidenceAction] = useState<'approve' | 'reject' | null>(null);
  const [evidenceExplanation, setEvidenceExplanation] = useState('');

  // Reopen Task Sub-Modal
  const [isReopeningTask, setIsReopeningTask] = useState(false);
  const [reopenReasonText, setReopenReasonText] = useState('');

  // Doorstep Pickup Modal
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [pickupAssignStaffId, setPickupAssignStaffId] = useState('');
  const [pickupReassignReason, setPickupReassignReason] = useState('');

  // Staff Location Tracking Modal
  const [trackingComplaint, setTrackingComplaint] = useState<Complaint | null>(null);
  const [trackingStaffLocation, setTrackingStaffLocation] = useState<any | null>(null);
  const [isTrackingLoading, setIsTrackingLoading] = useState(false);

  // Reports Engine Filter & State
  const [reportsData, setReportsData] = useState<any>(null);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportYear, setReportYear] = useState('2026');
  const [reportMonth, setReportMonth] = useState('all');
  const [reportDistrict, setReportDistrict] = useState('all');
  const [reportWard, setReportWard] = useState('all');
  const [reportStaffId, setReportStaffId] = useState('all');
  const [reportStatus, setReportStatus] = useState('all');

  // Staff Payments Management State
  const [paymentStaffFilter, setPaymentStaffFilter] = useState('all');
  const [paymentPeriodFilter, setPaymentPeriodFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  // Payment Generator Modal
  const [isGeneratingPayment, setIsGeneratingPayment] = useState(false);
  const [payStaffId, setPayStaffId] = useState('');
  const [payPeriod, setPayPeriod] = useState('2026-10');
  const [payYear, setPayYear] = useState(2026);
  const [payMonth, setPayMonth] = useState(10);
  const [payDutyDays, setPayDutyDays] = useState(24);
  const [payDailyRate, setPayDailyRate] = useState(650);
  const [payBaseAmount, setPayBaseAmount] = useState(15600);
  const [payTaskIncentives, setPayTaskIncentives] = useState(0);
  const [payBonus, setPayBonus] = useState(0);
  const [payDeductions, setPayDeductions] = useState(780);
  const [payTotalAmount, setPayTotalAmount] = useState(14820);
  const [payStatus, setPayStatus] = useState<'Pending' | 'Approved' | 'Disbursed' | 'On Hold'>('Disbursed');
  const [payDate, setPayDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [payRef, setPayRef] = useState(`DBT-KA-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [payNotes, setPayNotes] = useState('Regular conservancy duty & verified task incentives');
  const [paymentError, setPaymentError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState('');
  const [isSuggestingPay, setIsSuggestingPay] = useState(false);

  // Edit / Disburse Payment Modal
  const [editingPayment, setEditingPayment] = useState<StaffPaymentRecord | null>(null);
  const [editPayStatus, setEditPayStatus] = useState<'Pending' | 'Approved' | 'Disbursed' | 'On Hold' | 'Cancelled'>('Disbursed');
  const [editPayDate, setEditPayDate] = useState('');
  const [editPayRef, setEditPayRef] = useState('');
  const [editPayNotes, setEditPayNotes] = useState('');

  // Staff Provisioning Modal
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffMobile, setNewStaffMobile] = useState('');
  const [newStaffPassword, setNewStaffPassword] = useState('SmartWaste@2026');
  const [showNewStaffPassword, setShowNewStaffPassword] = useState(false);
  const [newStaffWard, setNewStaffWard] = useState('Ward 151 - Koramangala');
  const [provisionError, setProvisionError] = useState('');
  const [provisionSuccess, setProvisionSuccess] = useState('');

  // Category Management State
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatBinColor, setNewCatBinColor] = useState('Standard Blue Bin');
  const [newCatBinHex, setNewCatBinHex] = useState('#0284C7');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [catActionSuccess, setCatActionSuccess] = useState('');

  // Location Hierarchy State
  const [selectedAdminDistrict, setSelectedAdminDistrict] = useState('Bengaluru Urban');
  const [newWardName, setNewWardName] = useState('');
  const [newTalukName, setNewTalukName] = useState('');
  const [locationActionSuccess, setLocationActionSuccess] = useState('');

  // Load All Admin Data
  const loadAdminData = async () => {
    const token = localStorage.getItem('smartwaste_token');
    if (!token) return;

    try {
      const [statsRes, compRes, pickRes, auditRes, catRes, locRes, payRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/complaints', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/pickups', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/audit-logs', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/categories'),
        fetch('/api/locations'),
        fetch('/api/admin/payments', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData);
        if (sData.staffMembers) setStaffList(sData.staffMembers);
      }
      if (compRes.ok) {
        const cData = await compRes.json();
        setComplaints(cData.complaints || []);
      }
      if (pickRes.ok) {
        const pData = await pickRes.json();
        setPickups(pData.pickupRequests || []);
      }
      if (auditRes.ok) {
        const aData = await auditRes.json();
        setAuditLogs(aData.auditLogs || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        if (catData.categories) setCategoriesList(catData.categories);
      }
      if (locRes.ok) {
        const locData = await locRes.json();
        if (locData.districts) setLocationsData(locData.districts);
      }
      if (payRes.ok) {
        const payData = await payRes.json();
        setPaymentsList(payData.payments || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Reports dynamically from real database records
  const fetchReports = async () => {
    const token = localStorage.getItem('smartwaste_token');
    if (!token) return;

    setReportsLoading(true);
    try {
      const params = new URLSearchParams();
      if (reportYear !== 'all') params.append('year', reportYear);
      if (reportMonth !== 'all') params.append('month', reportMonth);
      if (reportDistrict !== 'all') params.append('district', reportDistrict);
      if (reportWard !== 'all') params.append('ward', reportWard);
      if (reportStaffId !== 'all') params.append('staffId', reportStaffId);
      if (reportStatus !== 'all') params.append('status', reportStatus);

      const res = await fetch(`/api/admin/reports?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReportsData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReportsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      loadAdminData();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'reports') {
      fetchReports();
    }
  }, [activeTab, reportYear, reportMonth, reportDistrict, reportWard, reportStaffId, reportStatus]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Administrator Console Restricted</h2>
        <p className="text-xs text-slate-500">
          Only authorized Karnataka Municipal Administrative Officers (IAS / Commissioner) can access this module.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  // Handle Verify or Assign Staff
  const handleAssignStaff = async () => {
    if (!selectedComplaint || !assignStaffId) return;
    setIsUpdatingStatus(true);
    setActionError('');
    const token = localStorage.getItem('smartwaste_token');

    try {
      // Check if reassigning
      const isReassignment = !!selectedComplaint.assignedStaffId && selectedComplaint.assignedStaffId !== assignStaffId;
      if (isReassignment) {
        const res = await fetch(`/api/admin/complaints/${selectedComplaint.id}/reassign`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            toStaffId: assignStaffId,
            reason: reassignReason.trim() || 'Operational beat rebalancing by supervisor'
          })
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to reassign task.');
        }
      } else {
        const res = await fetch(`/api/complaints/${selectedComplaint.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            status: 'Assigned to Staff',
            assignedStaffId: assignStaffId,
            priority: assignPriority,
            dueDate: assignDueDate,
            notes: `Assigned to staff by administrator with ${assignPriority} priority.`
          })
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to assign staff.');
        }
      }

      setActionSuccess('Task assignment updated successfully.');
      setTimeout(() => {
        setSelectedComplaint(null);
        setReassignReason('');
        setActionSuccess('');
      }, 1200);
      loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Error updating assignment.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Evidence Approval or Rejection
  const handleEvidenceReviewSubmit = async () => {
    if (!selectedComplaint || !evidenceAction) return;

    // Strict requirement: Mandatory explanation when rejecting evidence!
    if (evidenceAction === 'reject' && (!evidenceExplanation || !evidenceExplanation.trim())) {
      setActionError('Mandatory explanation is required when rejecting work completion evidence.');
      return;
    }

    setIsUpdatingStatus(true);
    setActionError('');
    const token = localStorage.getItem('smartwaste_token');

    try {
      const res = await fetch(`/api/admin/complaints/${selectedComplaint.id}/evidence-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          action: evidenceAction,
          explanation: evidenceExplanation.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process evidence review.');
      }

      setActionSuccess(`Completion evidence ${evidenceAction === 'approve' ? 'APPROVED' : 'REJECTED'} successfully.`);
      setTimeout(() => {
        setSelectedComplaint(null);
        setEvidenceAction(null);
        setEvidenceExplanation('');
        setActionSuccess('');
      }, 1500);
      loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Evidence review failed.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Reopening Task
  const handleReopenTaskSubmit = async () => {
    if (!selectedComplaint) return;
    if (!reopenReasonText || !reopenReasonText.trim()) {
      setActionError('Please provide an administrative explanation to reopen this task.');
      return;
    }

    setIsUpdatingStatus(true);
    setActionError('');
    const token = localStorage.getItem('smartwaste_token');

    try {
      const res = await fetch(`/api/admin/complaints/${selectedComplaint.id}/reopen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason: reopenReasonText.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to reopen complaint.');
      }

      setActionSuccess('Task successfully REOPENED and field staff notified.');
      setTimeout(() => {
        setSelectedComplaint(null);
        setIsReopeningTask(false);
        setReopenReasonText('');
        setActionSuccess('');
      }, 1500);
      loadAdminData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to reopen task.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Handle Reject Complaint
  const handleRejectComplaint = async () => {
    if (!selectedComplaint || !rejectionReason.trim()) return;
    setIsUpdatingStatus(true);
    setActionError('');
    const token = localStorage.getItem('smartwaste_token');

    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: 'Rejected',
          rejectionReason,
          notes: `Complaint rejected: ${rejectionReason}`
        })
      });

      if (res.ok) {
        setSelectedComplaint(null);
        setRejectionReason('');
        loadAdminData();
      }
    } catch (err: any) {
      setActionError(err.message || 'Rejection failed.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Doorstep Pickup Assign/Reassign
  const handleAssignPickup = async () => {
    if (!selectedPickup || !pickupAssignStaffId) return;
    setIsUpdatingStatus(true);
    const token = localStorage.getItem('smartwaste_token');

    try {
      const res = await fetch(`/api/admin/pickups/${selectedPickup.id}/reassign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          toStaffId: pickupAssignStaffId,
          reason: pickupReassignReason || 'Route allocation'
        })
      });

      if (res.ok) {
        setSelectedPickup(null);
        setPickupAssignStaffId('');
        setPickupReassignReason('');
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Calculate Auto-Suggested Payment for Staff
  const handleSuggestPayment = async () => {
    if (!payStaffId) {
      setPaymentError('Please select a staff member first.');
      return;
    }

    setIsSuggestingPay(true);
    setPaymentError('');
    const token = localStorage.getItem('smartwaste_token');

    try {
      const res = await fetch(`/api/admin/payments/suggest/${payStaffId}?year=${payYear}&month=${payMonth}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to calculate payment suggestion.');

      setPayDutyDays(data.baseDutyDays);
      setPayDailyRate(data.dailyRate);
      setPayBaseAmount(data.baseAmount);
      setPayTaskIncentives(data.taskIncentiveAmount);
      setPayBonus(data.bonusAmount);
      setPayDeductions(data.deductions);
      setPayTotalAmount(data.totalAmount);
      setPayNotes(`Verified: ${data.completedComplaintsCount} complaints + ${data.completedPickupsCount} pickups cleared.`);

      if (data.hasExistingRecord) {
        setPaymentError(`Note: A verified record already exists for this period (${data.existingRecord.id} - ${data.existingRecord.status}).`);
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Calculation error.');
    } finally {
      setIsSuggestingPay(false);
    }
  };

  // Create Verified Payment Record
  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payStaffId || !payPeriod || payTotalAmount <= 0) {
      setPaymentError('Valid staff member, period, and payment amount (> 0) are required.');
      return;
    }

    const token = localStorage.getItem('smartwaste_token');
    setPaymentError('');

    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          staffId: payStaffId,
          period: payPeriod,
          year: payYear,
          month: payMonth,
          baseDutyDays: payDutyDays,
          dailyRate: payDailyRate,
          baseAmount: payBaseAmount,
          taskIncentiveAmount: payTaskIncentives,
          bonusAmount: payBonus,
          deductions: payDeductions,
          totalAmount: payTotalAmount,
          status: payStatus,
          paymentDate: payStatus === 'Disbursed' ? payDate : undefined,
          transactionRef: payStatus === 'Disbursed' ? payRef : undefined,
          notes: payNotes
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create payment record.');
      }

      setPaymentSuccess('Verified staff payment record saved and logged to State Treasury ledger.');
      setTimeout(() => {
        setIsGeneratingPayment(false);
        setPaymentSuccess('');
      }, 1500);
      loadAdminData();
    } catch (err: any) {
      setPaymentError(err.message || 'Failed to save payment record.');
    }
  };

  // Update Existing Payment Status
  const handleUpdatePaymentStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;

    const token = localStorage.getItem('smartwaste_token');
    try {
      const res = await fetch(`/api/admin/payments/${editingPayment.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          status: editPayStatus,
          paymentDate: editPayDate,
          transactionRef: editPayRef,
          notes: editPayNotes
        })
      });

      if (res.ok) {
        setEditingPayment(null);
        loadAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Live staff tracking for admin
  const openStaffTracking = async (c: Complaint) => {
    setTrackingComplaint(c);
    setIsTrackingLoading(true);
    try {
      const res = await fetch(`/api/staff/location/${c.id}`);
      const data = await res.json();
      if (res.ok && data.location) {
        setTrackingStaffLocation(data.location);
      } else {
        setTrackingStaffLocation(c.staffLocation || null);
      }
    } catch {
      setTrackingStaffLocation(c.staffLocation || null);
    } finally {
      setIsTrackingLoading(false);
    }
  };

  // CSV Export trigger
  const triggerExport = (type: 'complaints' | 'pickups' | 'payments') => {
    window.open(`/api/admin/export-csv?type=${type}`, '_blank');
  };

  // Filtered Complaints List
  const filteredComplaints = complaints.filter(c => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && !['Submitted', 'Under Review', 'Under Verification', 'Verified', 'Assigned to Staff', 'In Progress'].includes(c.status)) return false;
      if (statusFilter === 'evidence_submitted' && !(c.evidenceStatus === 'Pending Review' || (c.status === 'Resolved' && c.evidenceStatus !== 'Approved'))) return false;
      if (statusFilter === 'approved' && c.status !== 'Approved') return false;
      if (statusFilter === 'reopened' && c.status !== 'Reopened') return false;
      if (statusFilter === 'rejected' && c.status !== 'Rejected') return false;
    }
    if (selectedDistrictFilter !== 'all' && c.district.toLowerCase() !== selectedDistrictFilter.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.citizenName.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.street.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Pickups List
  const filteredPickups = pickups.filter(p => {
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending' && ['Completed', 'Cancelled'].includes(p.status)) return false;
      if (statusFilter === 'approved' && p.status !== 'Completed') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.id.toLowerCase().includes(q) ||
        p.citizenName.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.wasteType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtered Payments List
  const filteredPayments = paymentsList.filter(p => {
    if (paymentStaffFilter !== 'all' && p.staffId !== paymentStaffFilter) return false;
    if (paymentPeriodFilter !== 'all' && p.period !== paymentPeriodFilter) return false;
    if (paymentStatusFilter !== 'all' && p.status.toLowerCase() !== paymentStatusFilter.toLowerCase()) return false;
    return true;
  });

  const summary = stats?.summary || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <BackButton onClick={onBack} setCurrentTab={setCurrentTab} fallbackTab="home" />
        <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
          Executive Administrative Console · SMARTWASTE Karnataka
        </span>
      </div>

      {/* Top Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
              Karnataka Municipal Corporation Directorate
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-600 text-white font-bold font-mono">
              IAS / COMMISSIONER
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {user.name}
          </h1>
          <p className="text-xs text-slate-400">
            Supervisory Jurisdiction: State-wide Municipal Operations & Pourakarmika Registry, Karnataka
          </p>
        </div>

        {/* Global Export & Beat Route Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentTab('route-planner')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_16px_rgba(6,182,212,0.5)]"
            title="Launch SMARTWASTE Quantum Route Planner & Holomap Command"
          >
            <Route className="w-4 h-4 text-slate-950" />
            <span>QUANTUM ROUTE PLANNER</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-ping" />
          </button>
          <button
            onClick={() => triggerExport('complaints')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Complaints CSV</span>
          </button>
          <button
            onClick={() => triggerExport('pickups')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Pickups CSV</span>
          </button>
          <button
            onClick={() => triggerExport('payments')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Payments CSV</span>
          </button>
        </div>
      </div>

      {/* Admin Module Tabs */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-bold uppercase tracking-wider overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'complaints'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Complaints & Collections ({complaints.length + pickups.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'reports'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Monthly & Yearly Reports</span>
        </button>

        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'payments'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Staff Payments (Sec 4) ({paymentsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'staff'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff Roster ({staffList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'categories'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Waste Categories ({categoriesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('locations')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'locations'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Karnataka Locations ({locationsData.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeTab === 'audit'
              ? 'border-emerald-700 text-emerald-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Municipal Audit ({auditLogs.length})</span>
        </button>
      </div>

      {/* =========================================================================
          SECTION 3.A: COMPLAINT AND COLLECTION MANAGEMENT
         ========================================================================= */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          {/* Futuristic Route Command Center Card */}
          <div className="bg-[#0b1220] rounded-2xl p-5 border border-cyan-500/40 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
            <div className="space-y-1 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest uppercase font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-400/40">
                  QUANTUM FLEET DISPATCH & HOLOMAP
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[10px] font-mono text-emerald-300">ADMIN LEVEL-5 EXCLUSIVE</span>
              </div>
              <h4 className="text-base font-black text-white uppercase tracking-wide">
                SMARTWASTE Route Planner & Telemetry Bar Graphs
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                Calculate multi-stop TSP vectors, visualize live vehicle payload graphs, simulate autonomous drone dispatch, and benchmark fuel savings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab('route-planner')}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black rounded-xl text-xs font-mono flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_16px_rgba(6,182,212,0.4)] shrink-0"
            >
              <Route className="w-4 h-4 text-slate-950" />
              <span>LAUNCH ROUTE PLANNER</span>
            </button>
          </div>

          {/* Header & Sub-Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Civic Complaints & Doorstep Collection Dispatch
              </h3>
              <p className="text-xs text-slate-500">
                Assign beat officers, review completion evidence photos/videos, approve/reject work, or reopen tickets.
              </p>
            </div>

            {/* Toggle between Citizen Complaints & Doorstep Pickups */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
              <button
                onClick={() => setCollectionTab('complaints')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  collectionTab === 'complaints'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Citizen Complaints ({complaints.length})
              </button>
              <button
                onClick={() => setCollectionTab('pickups')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  collectionTab === 'pickups'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Doorstep Pickups ({pickups.length})
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search ticket ID, citizen name, ward, street..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-white"
              />
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Active / Pending Tasks</option>
                <option value="evidence_submitted">Work Completed (Pending Approval)</option>
                <option value="approved">Approved & Certified</option>
                <option value="reopened">Reopened for Rectification</option>
                <option value="rejected">Rejected Reports</option>
              </select>
            </div>

            <div>
              <select
                value={selectedDistrictFilter}
                onChange={e => setSelectedDistrictFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="all">All Districts</option>
                {locationsData.map((d: any) => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE: Citizen Complaints */}
          {collectionTab === 'complaints' && (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-3">Ticket ID</th>
                    <th className="py-3 px-3">Citizen & Phone</th>
                    <th className="py-3 px-3">Category & Qty</th>
                    <th className="py-3 px-3">Ward & Street</th>
                    <th className="py-3 px-3">Status & Evidence</th>
                    <th className="py-3 px-3">Assigned Officer</th>
                    <th className="py-3 px-3 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No complaints match your active filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map(c => {
                      const hasEvidence = (c.afterPhotos && c.afterPhotos.length > 0) || (c.evidenceVideos && c.evidenceVideos.length > 0);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">
                            <div>{c.id}</div>
                            <span className="text-[10px] text-slate-400 block font-normal">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-800">
                            <div>{c.citizenName}</div>
                            <span className="text-[11px] font-mono text-slate-500">{c.mobile}</span>
                          </td>
                          <td className="py-3 px-3 text-slate-700">
                            <span className="font-semibold block">{c.wasteCategory}</span>
                            <span className="text-[11px] text-slate-500 font-mono">~{c.quantityKg} kg</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                            <div className="font-semibold text-slate-800">{c.street}</div>
                            <span className="text-[11px] text-slate-500">{c.ward}</span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="space-y-1">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                                  c.status === 'Approved'
                                    ? 'bg-blue-100 text-blue-900'
                                    : c.status === 'Resolved'
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : c.status === 'Reopened'
                                    ? 'bg-purple-100 text-purple-900'
                                    : c.status === 'Rejected'
                                    ? 'bg-red-100 text-red-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {c.status}
                              </span>
                              {hasEvidence && (
                                <span className="block text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  <span>{c.evidenceStatus === 'Approved' ? 'Evidence Approved' : c.evidenceStatus === 'Rejected' ? 'Evidence Rejected' : 'Evidence Awaiting Review'}</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700">
                            {c.assignedStaffName ? (
                              <div>
                                <span className="font-bold text-slate-900">{c.assignedStaffName}</span>
                                {c.priority && (
                                  <span className={`block text-[10px] font-bold ${
                                    c.priority === 'High' || c.priority === 'Emergency' ? 'text-red-600' : 'text-slate-500'
                                  }`}>
                                    {c.priority} Priority
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded">
                                Unassigned
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {c.assignedStaffId && (
                                <button
                                  type="button"
                                  onClick={() => openStaffTracking(c)}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer flex items-center gap-1 transition-colors"
                                  title="View Live GPS Location"
                                >
                                  <MapPin className="w-3 h-3 text-emerald-400" />
                                  <span>Track GPS</span>
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedComplaint(c);
                                  setAssignStaffId(c.assignedStaffId || '');
                                  setAssignPriority(c.priority || 'Medium');
                                  setRejectionReason('');
                                  setReassignReason('');
                                  setActionError('');
                                  setActionSuccess('');
                                }}
                                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[11px] font-semibold cursor-pointer transition-colors"
                              >
                                Review & Manage &rarr;
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TABLE: Doorstep Collection Requests */}
          {collectionTab === 'pickups' && (
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-3">Pickup ID</th>
                    <th className="py-3 px-3">Citizen & Phone</th>
                    <th className="py-3 px-3">Waste Type & Est Qty</th>
                    <th className="py-3 px-3">Address & Slot</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Assigned Staff</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPickups.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-slate-400">
                        No doorstep collection requests found for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredPickups.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">{p.id}</td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          <div>{p.citizenName}</div>
                          <span className="text-[11px] font-mono text-slate-500">{p.mobile}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">
                          <span className="font-semibold block">{p.wasteType}</span>
                          <span className="text-[11px] text-slate-500 font-mono">~{p.estimatedQtyKg} kg</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                          <div className="font-semibold text-slate-800 truncate">{p.address}</div>
                          <span className="text-[11px] text-emerald-800 font-semibold">{p.preferredDate} ({p.preferredTimeSlot})</span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              p.status === 'Completed'
                                ? 'bg-emerald-100 text-emerald-900'
                                : p.status === 'Assigned'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-700">
                          {p.assignedStaffName || (
                            <span className="text-amber-700 font-semibold text-[11px] bg-amber-50 px-2 py-0.5 rounded">
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPickup(p);
                              setPickupAssignStaffId(p.assignedStaffId || '');
                            }}
                            className="px-3 py-1 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                          >
                            Assign / Reassign &rarr;
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 3.B: MONTHLY AND YEARLY REPORTS
         ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Reports Header & Dynamic Controls Strip */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Karnataka SMARTWASTE Executive Reports Engine
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated dynamically from real database records without simulated or hardcoded values.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Report</span>
                </button>
                <button
                  type="button"
                  onClick={fetchReports}
                  className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${reportsLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh Calculations</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Year Filter</label>
                <select
                  value={reportYear}
                  onChange={e => setReportYear(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="2026">2026 (Current)</option>
                  <option value="2025">2025</option>
                  <option value="all">All Recorded Years</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Month Filter</label>
                <select
                  value={reportMonth}
                  onChange={e => setReportMonth(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="all">All Months</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Area District</label>
                <select
                  value={reportDistrict}
                  onChange={e => {
                    setReportDistrict(e.target.value);
                    setReportWard('all');
                  }}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="all">All Districts</option>
                  {locationsData.map((d: any) => (
                    <option key={d.name} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Ward Beat</label>
                <select
                  value={reportWard}
                  onChange={e => setReportWard(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="all">All Wards</option>
                  {locationsData
                    .find(d => d.name === (reportDistrict === 'all' ? 'Bengaluru Urban' : reportDistrict))
                    ?.taluks?.[0]?.cities?.[0]?.wards?.map((w: string) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Staff Officer</label>
                <select
                  value={reportStaffId}
                  onChange={e => setReportStaffId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="all">All Field Staff</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-500 block mb-1">Task Status</label>
                <select
                  value={reportStatus}
                  onChange={e => setReportStatus(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="Resolved">Resolved / Completed</option>
                  <option value="Approved">Approved & Certified</option>
                  <option value="Submitted">Newly Submitted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Reopened">Reopened</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* KPI Summary Cards */}
          {reportsData && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Complaints</span>
                <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                  {reportsData.summary.totalComplaints}
                </span>
                <span className="text-[10px] text-slate-400">
                  {reportsData.summary.pendingComplaints} Pending
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Resolved & Approved</span>
                <span className="text-2xl font-black text-emerald-700 font-mono mt-1 block">
                  {reportsData.summary.resolvedComplaints + reportsData.summary.approvedComplaints}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {reportsData.summary.approvedComplaints} Formally Certified
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] text-purple-800 uppercase font-semibold block">Reopened / Rejected</span>
                <span className="text-2xl font-black text-purple-700 font-mono mt-1 block">
                  {reportsData.summary.reopenedComplaints + reportsData.summary.rejectedComplaints}
                </span>
                <span className="text-[10px] text-purple-600">
                  {reportsData.summary.reopenedComplaints} Under Rectification
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] text-blue-800 uppercase font-semibold block">Doorstep Collections</span>
                <span className="text-2xl font-black text-blue-700 font-mono mt-1 block">
                  {reportsData.summary.completedPickups} / {reportsData.summary.totalPickups}
                </span>
                <span className="text-[10px] text-blue-600">
                  {reportsData.summary.pendingPickups} Pending Slots
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Total Waste Cleared</span>
                <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                  {reportsData.summary.totalWasteKg} kg
                </span>
                <span className="text-[10px] text-slate-500">
                  ~{(reportsData.summary.totalWasteKg / 1000).toFixed(2)} Metric Tons
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-[10px] text-emerald-800 uppercase font-semibold block">Task Completion Rate</span>
                <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">
                  {reportsData.summary.completionRate}%
                </span>
                <span className="text-[10px] text-slate-500">
                  Avg Speed: {reportsData.summary.avgResolutionHours}
                </span>
              </div>
            </div>
          )}

          {/* Evidence Approval / Rejection Statistics Strip */}
          {reportsData && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Field Photographic & Video Evidence Review Statistics
                  </h4>
                  <p className="text-[11px] text-slate-600">
                    Audit of work completion proofs uploaded by staff officers before municipal sign-off.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">TOTAL SUBMISSIONS</span>
                  <span className="font-bold text-slate-900 text-sm">{reportsData.summary.evidenceStats.totalSubmissions}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-700 block">APPROVED</span>
                  <span className="font-bold text-emerald-800 text-sm">{reportsData.summary.evidenceStats.approved}</span>
                </div>
                <div>
                  <span className="text-[10px] text-red-600 block">REJECTED</span>
                  <span className="font-bold text-red-700 text-sm">{reportsData.summary.evidenceStats.rejected}</span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-700 block">APPROVAL RATE</span>
                  <span className="font-bold text-purple-900 text-sm">{reportsData.summary.evidenceStats.approvalRatePercent}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Visual Charts: Monthly Trend & Yearly Cleaning Performance */}
          {reportsData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Performance Trend Bar Chart */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Monthly Cleaning Performance ({reportYear})
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">12-Month Calendar Analysis</span>
                </div>

                <div className="space-y-2.5">
                  {reportsData.monthlyPerformance.map((m: any) => {
                    const maxVal = Math.max(...reportsData.monthlyPerformance.map((item: any) => item.submittedComplaints), 1);
                    const pct = Math.round((m.submittedComplaints / maxVal) * 100);
                    return (
                      <div key={m.month} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-semibold text-slate-800">{m.month}</span>
                          <span className="font-mono text-slate-500">
                            {m.resolvedComplaints}/{m.submittedComplaints} resolved ({m.completedPickups} pickups · {m.tonnageKg} kg)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden flex">
                          <div
                            className="bg-emerald-600 h-2.5"
                            style={{ width: `${m.submittedComplaints > 0 ? (m.resolvedComplaints / m.submittedComplaints) * 100 : 0}%` }}
                            title={`${m.rate}% Resolved`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Area-Wise Waste Statistics */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Area-Wise Waste Management Statistics
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">District & Beat Breakdown</span>
                </div>

                <div className="overflow-y-auto max-h-96 border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 sticky top-0 font-bold">
                      <tr>
                        <th className="p-2.5">District & Ward</th>
                        <th className="p-2.5">Complaints</th>
                        <th className="p-2.5">Cleared</th>
                        <th className="p-2.5">Tonnage (Kg)</th>
                        <th className="p-2.5 text-right">Clearance Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reportsData.areaStatistics.map((area: any) => (
                        <tr key={`${area.district}_${area.ward}`} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <span className="font-bold text-slate-900 block">{area.ward}</span>
                            <span className="text-[10px] text-slate-500">{area.district}</span>
                          </td>
                          <td className="p-2.5 font-mono">{area.total}</td>
                          <td className="p-2.5 font-mono text-emerald-700 font-bold">{area.resolved}</td>
                          <td className="p-2.5 font-mono">{area.kg}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-emerald-800">
                            {area.resolutionRate}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Staff-Wise Work Completion Performance Table */}
          {reportsData && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Staff-Wise Work-Completion & Evidence Accountability
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Individual officer resolution volume, evidence audit results, and collected tonnage metrics.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                  {reportsData.staffPerformance.length} Field Officers Active
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="p-3">Staff Officer</th>
                      <th className="p-3">Assigned Beat</th>
                      <th className="p-3">Active Tasks</th>
                      <th className="p-3">Completed Complaints</th>
                      <th className="p-3">Doorstep Pickups</th>
                      <th className="p-3">Total Diverted (Kg)</th>
                      <th className="p-3">Evidence Approved</th>
                      <th className="p-3">Evidence Rejected</th>
                      <th className="p-3 text-right">Standing</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reportsData.staffPerformance.map((staff: any) => (
                      <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-semibold text-slate-900">
                          <div>{staff.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">{staff.email}</span>
                        </td>
                        <td className="p-3 text-slate-600">
                          <div>{staff.ward}</div>
                          <span className="text-[10px] text-slate-400">{staff.district}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-700">{staff.activeComplaints}</td>
                        <td className="p-3 font-mono font-bold text-emerald-800">{staff.resolvedComplaints}</td>
                        <td className="p-3 font-mono text-slate-700">{staff.completedPickups}</td>
                        <td className="p-3 font-mono font-bold text-slate-900">{staff.totalKgCollected} kg</td>
                        <td className="p-3 font-mono text-emerald-700 font-bold">{staff.evidenceApprovedCount}</td>
                        <td className="p-3 font-mono text-red-600 font-bold">{staff.evidenceRejectedCount}</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                            {staff.points} Pts
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SECTION 4: STAFF MONTHLY AND YEARLY PAYMENT INFORMATION
         ========================================================================= */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          {/* Header & Payment Generator Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Staff Monthly & Yearly Compensation Register (Section 4)
              </h3>
              <p className="text-xs text-slate-500">
                Authorized municipal conservancy duty allowance, verified task incentives, and DBT PFMS disbursement ledger.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => triggerExport('payments')}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-600" />
                <span>Export Pay Register</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsGeneratingPayment(true);
                  setPaymentError('');
                  setPaymentSuccess('');
                  if (staffList.length > 0) setPayStaffId(staffList[0].id);
                }}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Generate / Record Staff Payment</span>
              </button>
            </div>
          </div>

          {/* Payment Summary KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">Total Disbursed (Verified)</span>
              <span className="text-xl font-black font-mono text-emerald-800 block mt-1">
                ₹{paymentsList.filter(p => p.status === 'Disbursed').reduce((acc, p) => acc + p.totalAmount, 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400">Via DBT / State Treasury</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">Pending Approvals</span>
              <span className="text-xl font-black font-mono text-amber-600 block mt-1">
                ₹{paymentsList.filter(p => ['Pending', 'Approved'].includes(p.status)).reduce((acc, p) => acc + p.totalAmount, 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400">Awaiting PFMS release</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">Duty Days Compensated</span>
              <span className="text-xl font-black font-mono text-slate-900 block mt-1">
                {paymentsList.reduce((acc, p) => acc + (p.baseDutyDays || 0), 0)} Days
              </span>
              <span className="text-[10px] text-slate-400">@ ₹650 / Day official rate</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-semibold uppercase">Verified Pay Slips</span>
              <span className="text-xl font-black font-mono text-purple-800 block mt-1">
                {paymentsList.length} Slips
              </span>
              <span className="text-[10px] text-slate-400">Tamper-evident audit trail</span>
            </div>
          </div>

          {/* Payments Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Filter by Officer</label>
              <select
                value={paymentStaffFilter}
                onChange={e => setPaymentStaffFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="all">All Field Officers</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.ward})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Filter by Month / Period</label>
              <select
                value={paymentPeriodFilter}
                onChange={e => setPaymentPeriodFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="all">All Pay Periods</option>
                <option value="2026-10">October 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-07">July 2026</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-500 block mb-1">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={e => setPaymentStatusFilter(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-xl bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="disbursed">Disbursed</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="on hold">On Hold</option>
              </select>
            </div>
          </div>

          {/* Payments Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="p-3">Slip ID & Period</th>
                  <th className="p-3">Staff Officer</th>
                  <th className="p-3">Duty Days & Rate</th>
                  <th className="p-3">Base Pay</th>
                  <th className="p-3">Task Incentives</th>
                  <th className="p-3">Net Disbursed</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Disbursement Date & Ref</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-slate-400">
                      No verified payment records match this filter. Use the button above to generate a new verified payment record.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map(pay => (
                    <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        <div>{pay.id}</div>
                        <span className="text-[11px] font-sans text-emerald-800 font-semibold">{pay.period}</span>
                      </td>
                      <td className="p-3">
                        <span className="font-bold text-slate-900 block">{pay.staffName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{pay.staffEmail}</span>
                      </td>
                      <td className="p-3 font-mono">
                        {pay.baseDutyDays} days @ ₹{pay.dailyRate}
                      </td>
                      <td className="p-3 font-mono">
                        ₹{pay.baseAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 font-mono text-emerald-700">
                        +₹{((pay.taskIncentiveAmount || 0) + (pay.bonusAmount || 0)).toLocaleString('en-IN')}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-800 text-sm">
                        ₹{pay.totalAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                      <td className="p-3 text-slate-600 font-mono text-[11px]">
                        <div>{pay.paymentDate || 'Pending'}</div>
                        <span className="text-[10px] text-slate-400 truncate block max-w-[140px]" title={pay.transactionRef}>
                          {pay.transactionRef || 'N/A'}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPayment(pay);
                            setEditPayStatus(pay.status as any);
                            setEditPayDate(pay.paymentDate || new Date().toISOString().split('T')[0]);
                            setEditPayRef(pay.transactionRef || `DBT-KA-${pay.year}-${Math.floor(100000 + Math.random() * 900000)}`);
                            setEditPayNotes(pay.notes || '');
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          Update / Disburse &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3.C: STAFF ROSTER TAB (Existing & Preserved)
         ========================================================================= */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Karnataka Municipal Staff Roster ({staffList.length} Active Officers)
              </h3>
              <p className="text-xs text-slate-500">
                Manage field personnel, assign ward jurisdiction, and provision official credentials.
              </p>
            </div>
            <button
              onClick={() => setIsAddingStaff(true)}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision New Staff</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map(s => (
              <div key={s.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{s.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold font-mono">
                    {s.points} Pts
                  </span>
                </div>
                <p className="text-slate-500 font-mono text-[11px]">{s.email}</p>
                <div className="pt-2 border-t border-slate-100 text-slate-600 space-y-1">
                  <p><span className="font-semibold text-slate-700">Assigned Beat: </span>{s.ward}</p>
                  <p><span className="font-semibold text-slate-700">Mobile: </span><span className="font-mono">{s.mobile}</span></p>
                  <div className="flex justify-between pt-1 font-mono text-[11px]">
                    <span className="text-amber-700 font-semibold">{s.activeTasks} Active</span>
                    <span className="text-emerald-700 font-semibold">{s.completedTasks} Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3.C: WASTE CATEGORIES MANAGEMENT (Existing & Preserved)
         ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Municipal Waste Categories Management ({categoriesList.length} Categories)
              </h3>
              <p className="text-xs text-slate-500">
                Configure authorized civic waste categories, color-coded bin streams, and disposal classifications available to citizens.
              </p>
            </div>
            <button
              onClick={() => setIsAddingCategory(prev => !prev)}
              className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingCategory ? 'Cancel' : 'Add New Category'}</span>
            </button>
          </div>

          {catActionSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{catActionSuccess}</span>
            </div>
          )}

          {/* Add Category Form Drawer */}
          {isAddingCategory && (
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!newCatName.trim()) return;
              const token = localStorage.getItem('smartwaste_token');
              try {
                const res = await fetch('/api/categories', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({ name: newCatName, binColor: newCatBinColor, binHex: newCatBinHex, description: newCatDesc })
                });
                if (res.ok) {
                  const data = await res.json();
                  setCategoriesList(data.categories || []);
                  setIsAddingCategory(false);
                  setNewCatName('');
                  setNewCatDesc('');
                  setCatActionSuccess('Waste category created successfully.');
                  setTimeout(() => setCatActionSuccess(''), 3000);
                }
              } catch (err) {
                console.error(err);
              }
            }} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs animate-in fade-in">
              <h4 className="font-bold text-slate-800">Add Authorized Waste Classification</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="e.g. Solar & Renewable Waste"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Bin / Vehicle Stream</label>
                  <input
                    type="text"
                    value={newCatBinColor}
                    onChange={e => setNewCatBinColor(e.target.value)}
                    placeholder="e.g. Orange Special Skip"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hex Color Code</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newCatBinHex}
                      onChange={e => setNewCatBinHex(e.target.value)}
                      className="w-8 h-8 rounded border border-slate-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={newCatBinHex}
                      onChange={e => setNewCatBinHex(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Operational Guidelines</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  placeholder="e.g. Broken solar cells, inverters, and battery units"
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  Save Category
                </button>
              </div>
            </form>
          )}

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesList.map((cat: any) => (
              <div key={cat.id || cat.name} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs flex flex-col justify-between shadow-2xs">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: cat.binHex || '#10B981' }}
                      ></span>
                      <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
                    </div>
                  </div>
                  {cat.kannadaName && (
                    <p className="text-[11px] text-emerald-800 font-medium">{cat.kannadaName}</p>
                  )}
                  <div className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                    {cat.binColor || 'Designated Collection Stream'}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed pt-1">
                    {cat.description || 'Civic waste stream regulated under Karnataka Municipal By-laws.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3.C: KARNATAKA LOCATIONS MANAGEMENT (Existing & Preserved)
         ========================================================================= */}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Karnataka Administrative Hierarchy Directory (All 31 Districts)
            </h3>
            <p className="text-xs text-slate-500">
              Maintain Karnataka districts, taluks, hoblis, municipal zones, and ward boundary datasets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
                Select District to Inspect:
              </label>
              <div className="space-y-1 max-h-96 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                {locationsData.map((d: any) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => setSelectedAdminDistrict(d.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                      selectedAdminDistrict === d.name
                        ? 'bg-emerald-800 text-white font-bold'
                        : 'hover:bg-slate-200/60 text-slate-700'
                    }`}
                  >
                    <span>{d.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">{d.taluks?.length || 0} Taluks</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              {(() => {
                const currentDist = locationsData.find(d => d.name === selectedAdminDistrict) || locationsData[0];
                return (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">
                        {currentDist?.name} Administrative Divisions
                      </h4>
                      <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                        {currentDist?.taluks?.length || 0} Taluks Configured
                      </span>
                    </div>

                    <div className="space-y-2 pt-1">
                      {currentDist?.taluks?.map((taluk: any) => (
                        <div key={taluk.name} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">Taluk: {taluk.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {taluk.cities?.[0]?.wards?.length || 0} Wards
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {taluk.cities?.[0]?.wards?.slice(0, 6).map((w: string) => (
                              <span key={w} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px]">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 3.C: MUNICIPAL AUDIT TRAIL TAB (Existing & Preserved)
         ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Municipal Compliance & Operations Audit Trail
            </h3>
            <span className="text-xs text-slate-400 font-mono">Tamper-Evident History</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Entity</th>
                  <th className="py-2.5 px-3">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      {log.actorName} ({log.actorRole})
                    </td>
                    <td className="py-2.5 px-3 text-emerald-800 font-semibold">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {log.entityType}: {log.entityId}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-sans truncate max-w-sm">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: COMPLAINT REVIEW, REASSIGNMENT, EVIDENCE APPROVAL / REJECTION
         ========================================================================= */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-y-auto p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-slate-900 text-lg">{selectedComplaint.id}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedComplaint.status === 'Approved'
                      ? 'bg-blue-100 text-blue-900'
                      : selectedComplaint.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-900'
                      : selectedComplaint.status === 'Reopened'
                      ? 'bg-purple-100 text-purple-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {selectedComplaint.status}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedComplaint(null);
                  setEvidenceAction(null);
                  setIsReopeningTask(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {actionError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{actionError}</span>
              </div>
            )}
            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Complaint Overview Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <p><strong className="text-slate-700">Citizen:</strong> {selectedComplaint.citizenName} ({selectedComplaint.mobile})</p>
                <p><strong className="text-slate-700">Category:</strong> {selectedComplaint.wasteCategory} (~{selectedComplaint.quantityKg} kg)</p>
                <p><strong className="text-slate-700">Ward & Beat:</strong> {selectedComplaint.ward}</p>
                <p><strong className="text-slate-700">Exact Street:</strong> {selectedComplaint.street}</p>
                <p><strong className="text-slate-700">Filed On:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                <p><strong className="text-slate-700">Assigned Officer:</strong> {selectedComplaint.assignedStaffName || 'Unassigned'}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-slate-700 block mb-0.5">Citizen Description:</strong>
                <p className="text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>
            </div>

            {/* Citizen Submitted Initial Photographs */}
            {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">
                  Citizen Attached Site Photo(s)
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {selectedComplaint.attachments.map((att, idx) => (
                    <a key={idx} href={att.url} target="_blank" rel="noopener noreferrer" className="shrink-0 group relative">
                      <img
                        src={att.url}
                        alt="Citizen proof"
                        className="w-24 h-24 object-cover rounded-xl border border-slate-200 group-hover:opacity-90"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">Zoom</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* WORK COMPLETION EVIDENCE REVIEW SECTION */}
            {((selectedComplaint.afterPhotos && selectedComplaint.afterPhotos.length > 0) ||
              (selectedComplaint.evidenceVideos && selectedComplaint.evidenceVideos.length > 0) ||
              selectedComplaint.status === 'Resolved' ||
              selectedComplaint.status === 'Approved') && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Work Completion Evidence Inspection
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Uploaded by Officer {selectedComplaint.completedByStaffName || selectedComplaint.assignedStaffName} at {selectedComplaint.completedAt ? new Date(selectedComplaint.completedAt).toLocaleString() : 'Completion'}.
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedComplaint.evidenceStatus === 'Approved'
                        ? 'bg-blue-100 text-blue-900'
                        : selectedComplaint.evidenceStatus === 'Rejected'
                        ? 'bg-red-100 text-red-900'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    Evidence Status: {selectedComplaint.evidenceStatus || 'Pending Review'}
                  </span>
                </div>

                {selectedComplaint.resolutionNotes && (
                  <div className="p-2.5 rounded-lg bg-white border border-emerald-200 text-xs">
                    <strong className="text-slate-700 block mb-0.5">Staff Resolution Remarks:</strong>
                    <p className="text-slate-600">{selectedComplaint.resolutionNotes}</p>
                    {selectedComplaint.actualCollectedKg && (
                      <span className="text-[11px] font-mono text-emerald-800 font-bold block mt-1">
                        Actual Waste Cleared: {selectedComplaint.actualCollectedKg} kg
                      </span>
                    )}
                  </div>
                )}

                {/* Evidence Photographs */}
                {selectedComplaint.afterPhotos && selectedComplaint.afterPhotos.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Cleared Site High-Resolution Photographs ({selectedComplaint.afterPhotos.length}):</span>
                    </span>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {selectedComplaint.afterPhotos.map((photo, pIdx) => (
                        <a key={pIdx} href={photo} target="_blank" rel="noopener noreferrer" className="shrink-0 relative group">
                          <img
                            src={photo}
                            alt={`Evidence ${pIdx + 1}`}
                            className="w-28 h-28 object-cover rounded-xl border border-slate-300 group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 rounded">Inspect</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Evidence Videos */}
                {selectedComplaint.evidenceVideos && selectedComplaint.evidenceVideos.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-indigo-700" />
                      <span>Live Site Clearance Video Recording:</span>
                    </span>
                    <div className="space-y-2">
                      {selectedComplaint.evidenceVideos.map((videoUrl, vIdx) => (
                        <video
                          key={vIdx}
                          src={videoUrl}
                          controls
                          className="w-full max-h-56 rounded-xl border border-slate-300 bg-black"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Approve / Reject Evidence Action Buttons */}
                {evidenceAction === null ? (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-emerald-200">
                    <button
                      type="button"
                      onClick={() => setEvidenceAction('reject')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Reject Evidence & Demand Re-Clean
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEvidenceAction('approve');
                        setEvidenceExplanation('Work completion evidence verified and approved by municipal supervisory administration.');
                      }}
                      className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve Completion Evidence</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-xl border border-slate-300 space-y-3 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${evidenceAction === 'approve' ? 'text-emerald-800' : 'text-red-700'}`}>
                        {evidenceAction === 'approve' ? 'Certify and Formally Approve Completion' : 'Mandatory Explanation Required for Rejection *'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEvidenceAction(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      value={evidenceExplanation}
                      onChange={e => setEvidenceExplanation(e.target.value)}
                      placeholder={
                        evidenceAction === 'reject'
                          ? 'Describe required corrective action (e.g. Cleared site photo shows lingering plastic bottles in storm drain, re-clear and re-upload proof)...'
                          : 'Optional administrative verification notes...'
                      }
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEvidenceAction(null)}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleEvidenceReviewSubmit}
                        disabled={isUpdatingStatus || (evidenceAction === 'reject' && !evidenceExplanation.trim())}
                        className={`px-4 py-1.5 text-white rounded-lg font-bold cursor-pointer disabled:opacity-50 ${
                          evidenceAction === 'approve' ? 'bg-emerald-800 hover:bg-emerald-900' : 'bg-red-600 hover:bg-red-700'
                        }`}
                      >
                        {isUpdatingStatus ? 'Processing...' : evidenceAction === 'approve' ? 'Confirm Approval' : 'Submit Rejection & Revert Task'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REOPEN INCORRECTLY COMPLETED TASK (Admin privilege) */}
            {['Resolved', 'Approved', 'Closed'].includes(selectedComplaint.status) && (
              <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold">
                    <RotateCcw className="w-4 h-4 text-purple-700" />
                    <span>Reopen Incorrectly Completed Task</span>
                  </div>
                  {!isReopeningTask && (
                    <button
                      type="button"
                      onClick={() => setIsReopeningTask(true)}
                      className="px-3 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      Reopen Ticket
                    </button>
                  )}
                </div>

                {isReopeningTask && (
                  <div className="space-y-2 pt-2 border-t border-purple-200 animate-in fade-in">
                    <label className="text-purple-900 font-semibold block">
                      Mandatory Reason for Reopening (sent to field staff and citizen): *
                    </label>
                    <input
                      type="text"
                      value={reopenReasonText}
                      onChange={e => setReopenReasonText(e.target.value)}
                      placeholder="e.g. Citizen reported residual debris, second inspection mandated..."
                      className="w-full p-2 border border-purple-300 rounded-lg bg-white text-xs"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsReopeningTask(false)}
                        className="px-3 py-1 border border-slate-300 rounded-lg text-slate-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleReopenTaskSubmit}
                        disabled={!reopenReasonText.trim() || isUpdatingStatus}
                        className="px-4 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-bold disabled:opacity-50"
                      >
                        {isUpdatingStatus ? 'Reopening...' : 'Confirm Reopen'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ASSIGN OR REASSIGN STAFF SECTION */}
            <div className="space-y-3 pt-3 border-t border-slate-200 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase tracking-wider block">
                  {selectedComplaint.assignedStaffId ? 'Reassign Staff Officer' : 'Assign Sanitation Field Staff'}
                </span>
                {selectedComplaint.assignedStaffId && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    Currently: {selectedComplaint.assignedStaffName}
                  </span>
                )}
              </div>

              {/* Safeguard Alert if Task is already Approved/Completed */}
              {['Resolved', 'Approved', 'Closed'].includes(selectedComplaint.status) && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Warning: This task has already been completed. Reassigning will notify both officers and transfer beat accountability.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-600 mb-1 font-medium">Select Staff Officer *</label>
                  <select
                    value={assignStaffId}
                    onChange={e => setAssignStaffId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="">-- Choose Field Officer --</option>
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.ward}) - {s.activeTasks} active tasks
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Priority *</label>
                  <select
                    value={assignPriority}
                    onChange={e => setAssignPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
              </div>

              {selectedComplaint.assignedStaffId && selectedComplaint.assignedStaffId !== assignStaffId && assignStaffId && (
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">Reassignment Reason *</label>
                  <input
                    type="text"
                    value={reassignReason}
                    onChange={e => setReassignReason(e.target.value)}
                    placeholder="Enter reason for reassigning beat officer..."
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleAssignStaff}
                  disabled={!assignStaffId || isUpdatingStatus}
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingStatus ? 'Updating...' : selectedComplaint.assignedStaffId ? 'Confirm Reassignment' : 'Confirm Assignment'}
                </button>
              </div>
            </div>

            {/* REASSIGNMENT & AUDIT HISTORY TRAIL */}
            {selectedComplaint.reassignmentHistory && selectedComplaint.reassignmentHistory.length > 0 && (
              <div className="space-y-1.5 pt-3 border-t border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block uppercase tracking-wide text-[11px]">
                  Reassignment Audit Trail ({selectedComplaint.reassignmentHistory.length} Events):
                </span>
                <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono text-[11px]">
                  {selectedComplaint.reassignmentHistory.map((item, rIdx) => (
                    <div key={rIdx} className="flex justify-between items-center text-slate-600">
                      <span>{new Date(item.timestamp).toLocaleDateString()}: {item.fromStaffName || 'None'} &rarr; {item.toStaffName}</span>
                      <span className="text-slate-400 font-sans italic">{item.reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REJECT WITH REASON */}
            {!['Resolved', 'Approved', 'Rejected'].includes(selectedComplaint.status) && (
              <div className="pt-3 border-t border-slate-200 text-xs space-y-2">
                <span className="font-bold text-red-700 block">Reject Complaint as Invalid / Duplicate</span>
                <input
                  type="text"
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  placeholder="Enter formal rejection justification (e.g. Private property dispute, hoax report)..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={handleRejectComplaint}
                  disabled={!rejectionReason.trim() || isUpdatingStatus}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold cursor-pointer disabled:opacity-50 text-[11px]"
                >
                  Reject Complaint
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DOORSTEP PICKUP ASSIGN / REASSIGN
         ========================================================================= */}
      {selectedPickup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900 font-mono">
                Pickup Request: {selectedPickup.id}
              </h3>
              <button
                onClick={() => setSelectedPickup(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <p><strong className="text-slate-700">Citizen:</strong> {selectedPickup.citizenName} ({selectedPickup.mobile})</p>
              <p><strong className="text-slate-700">Waste:</strong> {selectedPickup.wasteType} (~{selectedPickup.estimatedQtyKg} kg)</p>
              <p><strong className="text-slate-700">Address:</strong> {selectedPickup.address}</p>
              <p><strong className="text-slate-700">Slot:</strong> {selectedPickup.preferredDate} ({selectedPickup.preferredTimeSlot})</p>
              {selectedPickup.instructions && (
                <p><strong className="text-slate-700">Instructions:</strong> {selectedPickup.instructions}</p>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assign / Reassign Staff Officer *</label>
                <select
                  value={pickupAssignStaffId}
                  onChange={e => setPickupAssignStaffId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Choose Field Officer --</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.ward})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reassignment Reason</label>
                <input
                  type="text"
                  value={pickupReassignReason}
                  onChange={e => setPickupReassignReason(e.target.value)}
                  placeholder="e.g. Ward route optimization..."
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPickup(null)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignPickup}
                  disabled={!pickupAssignStaffId || isUpdatingStatus}
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold disabled:opacity-50"
                >
                  Confirm Pickup Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: GENERATE / RECORD STAFF PAYMENT (SECTION 4 ADMIN)
         ========================================================================= */}
      {isGeneratingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 text-xs max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Generate Verified Staff Payment Slip
                </h3>
                <p className="text-[11px] text-slate-500">
                  Karnataka Urban Local Bodies Pourakarmika Compensatory Scheme
                </p>
              </div>
              <button
                onClick={() => setIsGeneratingPayment(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {paymentError && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}
            {paymentSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{paymentSuccess}</span>
              </div>
            )}

            <form onSubmit={handleCreatePayment} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Staff Officer *</label>
                  <select
                    value={payStaffId}
                    onChange={e => setPayStaffId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.ward})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pay Period (YYYY-MM) *</label>
                  <input
                    type="month"
                    value={payPeriod}
                    onChange={e => {
                      setPayPeriod(e.target.value);
                      const [y, m] = e.target.value.split('-');
                      setPayYear(parseInt(y, 10));
                      setPayMonth(parseInt(m, 10));
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>

              {/* Auto-Calculate from actual verified DB tasks button */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
                <div className="text-[11px] text-emerald-900">
                  <span className="font-bold block">One-Click Task Calculation:</span>
                  <span>Inspects actual completed complaints & pickups in DB for this period.</span>
                </div>
                <button
                  type="button"
                  onClick={handleSuggestPayment}
                  disabled={isSuggestingPay}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {isSuggestingPay ? 'Calculating...' : 'Auto-Compute Pay'}
                </button>
              </div>

              {/* Duty Days & Rates */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duty Days</label>
                  <input
                    type="number"
                    value={payDutyDays}
                    onChange={e => {
                      const days = parseInt(e.target.value, 10) || 0;
                      setPayDutyDays(days);
                      const base = days * payDailyRate;
                      setPayBaseAmount(base);
                      const gross = base + payTaskIncentives + payBonus;
                      const ded = Math.round(gross * 0.05);
                      setPayDeductions(ded);
                      setPayTotalAmount(gross - ded);
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Daily Rate (₹)</label>
                  <input
                    type="number"
                    value={payDailyRate}
                    onChange={e => {
                      const rate = parseInt(e.target.value, 10) || 0;
                      setPayDailyRate(rate);
                      const base = payDutyDays * rate;
                      setPayBaseAmount(base);
                      const gross = base + payTaskIncentives + payBonus;
                      const ded = Math.round(gross * 0.05);
                      setPayDeductions(ded);
                      setPayTotalAmount(gross - ded);
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Base Amount (₹)</label>
                  <input
                    type="number"
                    disabled
                    value={payBaseAmount}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-slate-100 font-mono"
                  />
                </div>
              </div>

              {/* Incentives, Bonuses, Deductions */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Task Incentives (₹)</label>
                  <input
                    type="number"
                    value={payTaskIncentives}
                    onChange={e => {
                      const inc = parseInt(e.target.value, 10) || 0;
                      setPayTaskIncentives(inc);
                      const gross = payBaseAmount + inc + payBonus;
                      const ded = Math.round(gross * 0.05);
                      setPayDeductions(ded);
                      setPayTotalAmount(gross - ded);
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority Bonus (₹)</label>
                  <input
                    type="number"
                    value={payBonus}
                    onChange={e => {
                      const bon = parseInt(e.target.value, 10) || 0;
                      setPayBonus(bon);
                      const gross = payBaseAmount + payTaskIncentives + bon;
                      const ded = Math.round(gross * 0.05);
                      setPayDeductions(ded);
                      setPayTotalAmount(gross - ded);
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">PF/ESI Deductions (₹)</label>
                  <input
                    type="number"
                    value={payDeductions}
                    onChange={e => {
                      const ded = parseInt(e.target.value, 10) || 0;
                      setPayDeductions(ded);
                      setPayTotalAmount((payBaseAmount + payTaskIncentives + payBonus) - ded);
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              {/* Total Net Disbursable Amount */}
              <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <span className="font-bold text-slate-200">Total Net Disbursable Amount:</span>
                <span className="font-mono text-xl font-black text-emerald-400">₹{payTotalAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* Payment Status & Disbursement Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status *</label>
                  <select
                    value={payStatus}
                    onChange={e => setPayStatus(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Disbursed">Disbursed (Released via DBT)</option>
                    <option value="Approved">Approved (Ready for PFMS)</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Disbursement Date</label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={e => setPayDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">DBT PFMS Transaction Reference</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={e => setPayRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Administrative Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGeneratingPayment(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Record Verified Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT / DISBURSE EXISTING PAYMENT RECORD
         ========================================================================= */}
      {editingPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Payment: {editingPayment.id}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {editingPayment.staffName} · {editingPayment.period} (₹{editingPayment.totalAmount.toLocaleString('en-IN')})
                </p>
              </div>
              <button
                onClick={() => setEditingPayment(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdatePaymentStatus} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Status *</label>
                <select
                  value={editPayStatus}
                  onChange={e => setEditPayStatus(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Disbursed">Disbursed (Direct Benefit Transfer Complete)</option>
                  <option value="Approved">Approved (Certified for Treasury Release)</option>
                  <option value="Pending">Pending Audit</option>
                  <option value="On Hold">On Hold (Pending Verification)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Disbursement Date</label>
                <input
                  type="date"
                  value={editPayDate}
                  onChange={e => setEditPayDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">DBT / PFMS Transaction Ref</label>
                <input
                  type="text"
                  value={editPayRef}
                  onChange={e => setEditPayRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Audit / Correction Notes</label>
                <input
                  type="text"
                  value={editPayNotes}
                  onChange={e => setEditPayNotes(e.target.value)}
                  placeholder="e.g. Treasury release ACK received on 1st of month..."
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPayment(null)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: STAFF PROVISIONING (Existing & Preserved)
         ========================================================================= */}
      {isAddingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                Provision Municipal Staff Account
              </h3>
              <button
                onClick={() => setIsAddingStaff(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {provisionError && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg">{provisionError}</div>
            )}
            {provisionSuccess && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-lg">{provisionSuccess}</div>
            )}

            <form onSubmit={async (e) => {
              e.preventDefault();
              setProvisionError('');
              const token = localStorage.getItem('smartwaste_token');
              try {
                const res = await fetch('/api/admin/staff', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify({
                    name: newStaffName,
                    email: newStaffEmail,
                    mobile: newStaffMobile,
                    password: newStaffPassword,
                    ward: newStaffWard
                  })
                });
                const data = await res.json();
                if (res.ok) {
                  setProvisionSuccess('Staff account provisioned successfully.');
                  setTimeout(() => {
                    setIsAddingStaff(false);
                    setProvisionSuccess('');
                  }, 1500);
                  loadAdminData();
                } else {
                  setProvisionError(data.error || 'Failed to provision staff.');
                }
              } catch (err: any) {
                setProvisionError(err.message || 'Network error');
              }
            }} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={e => setNewStaffName(e.target.value)}
                  placeholder="e.g. Suresh Gowda"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={e => setNewStaffEmail(e.target.value)}
                  placeholder="suresh.gowda@smartwaste.org"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  value={newStaffMobile}
                  onChange={e => setNewStaffMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Ward / Beat *</label>
                <input
                  type="text"
                  required
                  value={newStaffWard}
                  onChange={e => setNewStaffWard(e.target.value)}
                  placeholder="Ward 151 - Koramangala"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Initial Password *</label>
                <div className="relative">
                  <input
                    type={showNewStaffPassword ? 'text' : 'password'}
                    required
                    value={newStaffPassword}
                    onChange={e => setNewStaffPassword(e.target.value)}
                    className="w-full p-2 pr-10 border border-slate-300 rounded-lg"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowNewStaffPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showNewStaffPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewStaffPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingStaff(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold cursor-pointer"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: LIVE STAFF LOCATION TRACKING ON GOOGLE MAPS
         ========================================================================= */}
      {trackingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Field Staff Live Tracking: {trackingComplaint.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-700 text-white">
                      {trackingComplaint.status}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Assigned Officer: <span className="font-bold text-white">{trackingComplaint.assignedStaffName || 'Sanitation Supervisor'}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTrackingComplaint(null);
                  setTrackingStaffLocation(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">ASSIGNED STAFF</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {trackingComplaint.assignedStaffName || 'Field Officer'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">TASK STATUS</span>
                  <span className="font-bold text-emerald-700 truncate block">
                    {trackingComplaint.status}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">ESTIMATED WASTE</span>
                  <span className="font-bold text-slate-800 font-mono truncate block">
                    ~{trackingComplaint.quantityKg} kg
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">LAST GPS PING</span>
                  <span className="font-mono text-slate-700 text-[11px] truncate block">
                    {trackingStaffLocation?.lastUpdated
                      ? new Date(trackingStaffLocation.lastUpdated).toLocaleTimeString()
                      : trackingComplaint.staffLocation?.lastUpdated
                      ? new Date(trackingComplaint.staffLocation.lastUpdated).toLocaleTimeString()
                      : 'GPS Inactive'}
                  </span>
                </div>
              </div>

              <div className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                trackingStaffLocation?.isSharing
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <div className="flex items-center gap-2">
                  <Radio className={`w-4 h-4 ${trackingStaffLocation?.isSharing ? 'animate-pulse text-emerald-600' : 'text-amber-600'}`} />
                  <span className="font-medium">
                    {trackingStaffLocation?.isSharing
                      ? `Staff member is actively broadcasting live coordinates on beat.`
                      : `Live GPS broadcast is standby or officer has not enabled background streaming.`}
                  </span>
                </div>
                {trackingStaffLocation && (
                  <span className="text-[10px] font-mono opacity-80">
                    Accuracy: ±{Math.round(trackingStaffLocation.accuracy || 10)}m
                  </span>
                )}
              </div>

              <div className="w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-slate-300 relative shadow-inner">
                <Map
                  style={{ width: '100%', height: '100%' }}
                  defaultCenter={{ lat: trackingComplaint.lat, lng: trackingComplaint.lng }}
                  center={
                    trackingStaffLocation?.lat
                      ? { lat: trackingStaffLocation.lat, lng: trackingStaffLocation.lng }
                      : { lat: trackingComplaint.lat, lng: trackingComplaint.lng }
                  }
                  zoom={15}
                  mapId="DEMO_MAP_ID"
                  internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
                  gestureHandling="greedy"
                >
                  <AdvancedMarker
                    position={{ lat: trackingComplaint.lat, lng: trackingComplaint.lng }}
                    title={`Complaint Spot: ${trackingComplaint.id}`}
                  />
                  {trackingStaffLocation?.lat && (
                    <AdvancedMarker
                      position={{ lat: trackingStaffLocation.lat, lng: trackingStaffLocation.lng }}
                      title={`Staff: ${trackingStaffLocation.staffName || 'Officer'}`}
                    />
                  )}
                </Map>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block text-[11px]">Civic Collection Address:</span>
                  <span className="font-bold text-slate-800">{trackingComplaint.street}, {trackingComplaint.ward}</span>
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${trackingComplaint.lat},${trackingComplaint.lng}${
                    trackingStaffLocation?.lat ? `&origin=${trackingStaffLocation.lat},${trackingStaffLocation.lng}` : ''
                  }`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Navigation className="w-4 h-4 text-emerald-300" />
                  <span>Navigate in Google Maps &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
