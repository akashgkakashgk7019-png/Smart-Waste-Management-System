export type Role = 'CITIZEN' | 'STAFF' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
  state: string;
  district: string;
  taluk: string;
  city: string;
  ward: string;
  address: string;
  points: number;
  badges: string[];
  staffBadgeNumber?: string;
  employeeId?: string;
  createdAt: string;
}

export interface ComplaintAttachment {
  url: string;
  type: string;
  name: string;
}

export interface StatusHistoryItem {
  status: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  notes?: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  citizenName: string;
  wasteCategory: string;
  quantityKg: number;
  description: string;
  state: string;
  district: string;
  taluk: string;
  city: string;
  ward: string;
  street: string;
  lat: number;
  lng: number;
  mobile: string;
  attachments: ComplaintAttachment[];
  status:
    | 'Submitted'
    | 'Under Review'
    | 'Under Verification'
    | 'Verified'
    | 'Assigned to Staff'
    | 'Accepted'
    | 'Declined'
    | 'Staff En Route'
    | 'Arrived'
    | 'Work In Progress'
    | 'In Progress'
    | 'Waste Collected'
    | 'Work Completed'
    | 'Resolved'
    | 'Approved'
    | 'Closed'
    | 'Rejected'
    | 'Reopened';
  statusHistory: StatusHistoryItem[];
  assignedStaffId?: string;
  assignedStaffName?: string;
  staffLocation?: {
    lat: number;
    lng: number;
    lastUpdated: string;
    isSharing: boolean;
    staffName?: string;
    accuracy?: number;
    heading?: number;
    speed?: number;
  };
  hobli?: string;
  quantityBracket?: string;
  locationSource?: 'gps' | 'manual' | 'map_pin';
  priority?: 'Low' | 'Medium' | 'High' | 'Emergency';
  dueDate?: string;
  rejectionReason?: string;
  declineReason?: string;
  arrivalTime?: string;
  arrivalCoords?: { lat: number; lng: number };
  resolutionNotes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  evidenceVideos?: string[];
  evidenceStatus?: 'Pending Review' | 'Approved' | 'Rejected';
  evidenceReviewNotes?: string;
  reopenedReason?: string;
  reassignmentHistory?: Array<{
    fromStaffId?: string;
    fromStaffName?: string;
    toStaffId: string;
    toStaffName: string;
    reason: string;
    timestamp: string;
    adminName: string;
  }>;
  actualCollectedKg?: number;
  feedbackRating?: number;
  feedbackComment?: string;
  completedAt?: string;
  completedByStaffId?: string;
  completedByStaffName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PickupRequest {
  id: string; // e.g. PK-2026-000001
  citizenId: string;
  citizenName: string;
  wasteType: string;
  estimatedQtyKg: number;
  address: string;
  lat: number;
  lng: number;
  preferredDate: string;
  preferredTimeSlot: string;
  mobile: string;
  instructions: string;
  photoUrl?: string;
  status: 'Submitted' | 'Scheduled' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedStaffId?: string;
  assignedStaffName?: string;
  completionNotes?: string;
  completedAt?: string;
  completedByStaffId?: string;
  completedByStaffName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WasteBin {
  id: string;
  name: string;
  category: 'Wet' | 'Dry' | 'Hazardous' | 'E-Waste' | 'Mixed';
  district: string;
  ward: string;
  address: string;
  lat: number;
  lng: number;
  capacityLiters: number;
  currentFillLevel: number;
  lastEmptied: string;
  status: 'Operational' | 'Near Full' | 'Maintenance';
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'complaint' | 'pickup' | 'quiz' | 'system';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface WasteCategoryDetail {
  id: string;
  name: string;
  kannadaName: string;
  hindiName: string;
  binColor: string;
  binHex: string;
  iconName: string;
  description: string;
  examples: string[];
  segregationMethod: string;
  doNotMix: string[];
  safeHandling: string;
  recyclingMethod: string;
  municipalDisclaimer: string;
}

export interface StaffLiveLocation {
  staffId: string;
  staffName: string;
  complaintId?: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  accuracy?: number;
  lastUpdated: string;
  isSharing: boolean;
}

export interface CityOrTown {
  name: string;
  wards: string[];
}

export interface HobliOption {
  name: string;
  cities: CityOrTown[];
}

export interface TalukOption {
  name: string;
  hoblis?: HobliOption[];
  cities: CityOrTown[];
}

export interface DistrictOption {
  name: string;
  taluks: TalukOption[];
}

export interface StaffPaymentRecord {
  id: string; // e.g. "PAY-2026-0001"
  staffId: string;
  staffName: string;
  staffEmail: string;
  period: string; // e.g. "2026-10" or "October 2026"
  year: number;
  month: number; // 1-12
  baseDutyDays: number;
  dailyRate: number;
  baseAmount: number;
  taskIncentiveAmount: number;
  bonusAmount: number;
  deductions: number;
  totalAmount: number;
  status: 'Pending' | 'Approved' | 'Disbursed' | 'On Hold' | 'Cancelled';
  paymentDate?: string;
  paymentMethod?: string;
  transactionRef?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByAdminId: string;
  createdByAdminName: string;
}

export interface StaffPaymentSummary {
  year: number;
  totalDisbursed: number;
  totalPending: number;
  totalDutyDays: number;
  recordsCount: number;
}
