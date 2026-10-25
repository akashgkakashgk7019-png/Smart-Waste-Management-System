import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  role: 'CITIZEN' | 'STAFF' | 'ADMIN';
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
  id: string; // e.g. SW-2026-000001
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
  currentFillLevel: number; // 0 to 100
  lastEmptied: string;
  status: 'Operational' | 'Near Full' | 'Maintenance';
}

export interface QuizAttempt {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: string;
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

export interface StaffPaymentRecord {
  id: string; // e.g. "PAY-2026-0001"
  staffId: string;
  staffName: string;
  staffEmail: string;
  period: string; // e.g. "2026-10" or "October 2026"
  year: number;
  month: number;
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

export interface PasswordResetItem {
  id: string;
  email: string;
  otp: string;
  token: string;
  expiresAt: string;
  used: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  complaints: Complaint[];
  pickupRequests: PickupRequest[];
  wasteBins: WasteBin[];
  quizAttempts: QuizAttempt[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  payments: StaffPaymentRecord[];
  passwordResets: PasswordResetItem[];
}

// Initial structured Karnataka locations dataset
export const KARNATAKA_LOCATIONS = {
  state: 'Karnataka',
  districts: [
    {
      name: 'Bengaluru Urban',
      taluks: [
        {
          name: 'Bengaluru North',
          cities: [
            {
              name: 'BBMP North Zone',
              wards: [
                'Ward 1 - Kempegowda Ward (Yelahanka)',
                'Ward 2 - Chowdeshwari',
                'Ward 8 - Kodigehalli',
                'Ward 18 - Radhakrishna Temple',
                'Ward 35 - Aramane Nagar (Sadashivanagar)',
                'Ward 45 - Malleshwaram'
              ]
            }
          ]
        },
        {
          name: 'Bengaluru South',
          cities: [
            {
              name: 'BBMP South Zone',
              wards: [
                'Ward 143 - Visvesvarapuram',
                'Ward 144 - Siddapura',
                'Ward 150 - Bellandur',
                'Ward 151 - Koramangala',
                'Ward 167 - Jayanagar East',
                'Ward 177 - JP Nagar'
              ]
            }
          ]
        },
        {
          name: 'Bengaluru East',
          cities: [
            {
              name: 'BBMP East Zone',
              wards: [
                'Ward 79 - Sarvagnanagar',
                'Ward 80 - Hoysala Nagar (Indiranagar)',
                'Ward 82 - Halasuru',
                'Ward 85 - Doddanekkundi',
                'Ward 112 - Domlur'
              ]
            }
          ]
        },
        {
          name: 'Anekal',
          cities: [
            {
              name: 'Anekal Town',
              wards: [
                'Ward 1 - Old Town',
                'Ward 3 - Market Area',
                'Ward 7 - Electronic City Phase 1',
                'Ward 8 - Jigani Industrial Area'
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Mysuru',
      taluks: [
        {
          name: 'Mysuru Urban',
          cities: [
            {
              name: 'Mysuru City Corporation',
              wards: [
                'Ward 12 - Chamundipuram',
                'Ward 24 - Kuvempunagar',
                'Ward 31 - Saraswathipuram',
                'Ward 40 - Gokulam',
                'Ward 52 - Vijayanagar 2nd Stage'
              ]
            }
          ]
        },
        {
          name: 'Nanjangud',
          cities: [
            {
              name: 'Nanjangud Town',
              wards: ['Ward 3 - Temple Road', 'Ward 5 - Industrial Area', 'Ward 9 - Bazaar Street']
            }
          ]
        }
      ]
    },
    {
      name: 'Mangaluru (Dakshina Kannada)',
      taluks: [
        {
          name: 'Mangaluru',
          cities: [
            {
              name: 'Mangaluru City Corporation',
              wards: [
                'Ward 14 - Kadri South',
                'Ward 22 - Bejai',
                'Ward 28 - Mannagudda',
                'Ward 35 - Hampankatta',
                'Ward 42 - Pandeshwar'
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Hubballi-Dharwad',
      taluks: [
        {
          name: 'Hubballi Urban',
          cities: [
            {
              name: 'Hubballi-Dharwad Municipal Corp',
              wards: [
                'Ward 15 - Vidyanagar',
                'Ward 21 - Keshwapur',
                'Ward 33 - Bhavani Nagar',
                'Ward 48 - Station Road'
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Belagavi',
      taluks: [
        {
          name: 'Belagavi Urban',
          cities: [
            {
              name: 'Belagavi City Corporation',
              wards: [
                'Ward 10 - Tilakwadi',
                'Ward 18 - Camp Area',
                'Ward 25 - Shahapur',
                'Ward 32 - Vadgaon'
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'Tumakuru',
      taluks: [
        {
          name: 'Tumakuru Urban',
          cities: [
            {
              name: 'Tumakuru City Corporation',
              wards: [
                'Ward 5 - SIT Extension',
                'Ward 12 - Ashok Nagar',
                'Ward 18 - Kyatsandra',
                'Ward 22 - Mandipet'
              ]
            }
          ]
        }
      ]
    }
  ]
};

// Available daily pickup slots with citizen capacity
export const PICKUP_SLOTS = [
  { id: 'SLOT-1', label: '07:00 AM - 09:00 AM (Early Morning)', maxCapacity: 15 },
  { id: 'SLOT-2', label: '09:00 AM - 11:30 AM (Morning)', maxCapacity: 20 },
  { id: 'SLOT-3', label: '01:30 PM - 03:30 PM (Afternoon)', maxCapacity: 15 },
  { id: 'SLOT-4', label: '04:00 PM - 06:00 PM (Evening)', maxCapacity: 20 }
];

let cachedDb: DatabaseSchema | null = null;

export function getDatabase(): DatabaseSchema {
  if (cachedDb) return cachedDb;

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      cachedDb = JSON.parse(data);
      if (!cachedDb!.payments) {
        cachedDb!.payments = [];
        saveDatabase(cachedDb!);
      }
      if (!cachedDb!.passwordResets) {
        cachedDb!.passwordResets = [];
        saveDatabase(cachedDb!);
      }
      return cachedDb!;
    } catch (err) {
      console.error('Failed reading database, re-initializing', err);
    }
  }

  // Seed default data
  cachedDb = createInitialSeed();
  saveDatabase(cachedDb);
  return cachedDb;
}

export function saveDatabase(db: DatabaseSchema): void {
  cachedDb = db;
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

function createInitialSeed(): DatabaseSchema {
  const wasteBins: WasteBin[] = [
    {
      id: 'BIN-BLR-01',
      name: 'Koramangala BDA Complex Smart Bin',
      category: 'Wet',
      district: 'Bengaluru Urban',
      ward: 'Ward 151 - Koramangala',
      address: 'BDA Complex Main Entrance, Koramangala 4th Block',
      lat: 12.9348,
      lng: 77.6267,
      capacityLiters: 1100,
      currentFillLevel: 45,
      lastEmptied: '2026-03-14 07:30 AM',
      status: 'Operational'
    },
    {
      id: 'BIN-BLR-02',
      name: 'Indiranagar 100ft Road Recycling Station',
      category: 'Dry',
      district: 'Bengaluru Urban',
      ward: 'Ward 80 - Hoysala Nagar (Indiranagar)',
      address: 'Near 12th Main Junction, 100ft Road',
      lat: 12.9719,
      lng: 77.6412,
      capacityLiters: 1100,
      currentFillLevel: 78,
      lastEmptied: '2026-03-13 06:45 PM',
      status: 'Near Full'
    },
    {
      id: 'BIN-BLR-03',
      name: 'Malleshwaram 8th Cross E-Waste Drop Box',
      category: 'E-Waste',
      district: 'Bengaluru Urban',
      ward: 'Ward 45 - Malleshwaram',
      address: 'Opposite Malleshwaram Grounds, 8th Cross',
      lat: 13.0031,
      lng: 77.5694,
      capacityLiters: 500,
      currentFillLevel: 30,
      lastEmptied: '2026-03-10 11:00 AM',
      status: 'Operational'
    },
    {
      id: 'BIN-MYS-01',
      name: 'Mysuru Kuvempunagar Civic Amenity Bin',
      category: 'Dry',
      district: 'Mysuru',
      ward: 'Ward 24 - Kuvempunagar',
      address: 'Near Kuvempunagar Post Office, Mysuru',
      lat: 12.2958,
      lng: 76.6394,
      capacityLiters: 800,
      currentFillLevel: 55,
      lastEmptied: '2026-03-14 06:15 AM',
      status: 'Operational'
    },
    {
      id: 'BIN-IXE-01',
      name: 'Mangaluru Kadri Park Organic Bin',
      category: 'Wet',
      district: 'Mangaluru (Dakshina Kannada)',
      ward: 'Ward 14 - Kadri South',
      address: 'Kadri Park Main Gate, Mangaluru',
      lat: 12.8797,
      lng: 74.8560,
      capacityLiters: 1000,
      currentFillLevel: 62,
      lastEmptied: '2026-03-14 08:00 AM',
      status: 'Operational'
    }
  ];

  return {
    users: [],
    complaints: [],
    pickupRequests: [],
    wasteBins,
    quizAttempts: [],
    notifications: [],
    auditLogs: [],
    payments: [],
    passwordResets: []
  };
}
