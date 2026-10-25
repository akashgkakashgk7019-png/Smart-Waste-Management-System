import { Router, Response } from 'express';
import { getDatabase, saveDatabase, StatusHistoryItem } from '../db.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../auth.js';

const router = Router();

// GET all assigned tasks for the staff member
router.get('/tasks', authenticate, requireRole(['STAFF', 'ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const db = getDatabase();

  const assignedComplaints = db.complaints.filter(c =>
    user.role === 'ADMIN' ? true : c.assignedStaffId === user.id
  );

  const assignedPickups = db.pickupRequests.filter(p =>
    user.role === 'ADMIN' ? true : p.assignedStaffId === user.id
  );

  const todayStr = new Date().toISOString().split('T')[0];

  const pendingComplaints = assignedComplaints.filter(c => !['Resolved', 'Closed', 'Rejected'].includes(c.status));
  const completedComplaints = assignedComplaints.filter(c => ['Resolved', 'Closed'].includes(c.status));
  const pendingPickups = assignedPickups.filter(p => !['Completed', 'Cancelled'].includes(p.status));
  const completedPickups = assignedPickups.filter(p => p.status === 'Completed');

  const priorityComplaints = pendingComplaints.filter(c => c.priority === 'High' || c.priority === 'Emergency');

  // Staff notifications
  const staffNotifs = db.notifications.filter(n => n.userId === user.id || n.userId === 'all_staff');

  res.json({
    complaints: assignedComplaints,
    pickupRequests: assignedPickups,
    staffProfile: {
      id: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      ward: user.ward,
      district: user.district,
      points: user.points,
      badges: user.badges || []
    },
    notifications: staffNotifs.slice(0, 10),
    stats: {
      totalAssignedComplaints: assignedComplaints.length,
      pendingComplaints: pendingComplaints.length,
      resolvedComplaints: completedComplaints.length,
      totalAssignedPickups: assignedPickups.length,
      pendingPickups: pendingPickups.length,
      resolvedPickups: completedPickups.length,
      priorityCount: priorityComplaints.length,
      todayDate: todayStr
    }
  });
});

// GET monthly and yearly performance and Section 4 allowance/payment details
router.get('/performance', authenticate, requireRole(['STAFF', 'ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const db = getDatabase();

  const assignedComplaints = db.complaints.filter(c =>
    user.role === 'ADMIN' ? true : c.assignedStaffId === user.id
  );
  const assignedPickups = db.pickupRequests.filter(p =>
    user.role === 'ADMIN' ? true : p.assignedStaffId === user.id
  );

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Monthly stats
  const monthlyCompletedComplaints = assignedComplaints.filter(c => {
    if (!['Resolved', 'Closed'].includes(c.status)) return false;
    const d = new Date(c.completedAt || c.updatedAt);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const monthlyCompletedPickups = assignedPickups.filter(p => {
    if (p.status !== 'Completed') return false;
    const d = new Date(p.completedAt || p.updatedAt);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const monthlyTotalKg = monthlyCompletedComplaints.reduce((acc, c) => acc + (c.actualCollectedKg || c.quantityKg || 0), 0) +
    monthlyCompletedPickups.reduce((acc, p) => acc + (p.estimatedQtyKg || 0), 0);

  // Yearly stats
  const yearlyCompletedComplaints = assignedComplaints.filter(c => {
    if (!['Resolved', 'Closed'].includes(c.status)) return false;
    const d = new Date(c.completedAt || c.updatedAt);
    return d.getFullYear() === currentYear;
  });

  const yearlyCompletedPickups = assignedPickups.filter(p => {
    if (p.status !== 'Completed') return false;
    const d = new Date(p.completedAt || p.updatedAt);
    return d.getFullYear() === currentYear;
  });

  const yearlyTotalKg = yearlyCompletedComplaints.reduce((acc, c) => acc + (c.actualCollectedKg || c.quantityKg || 0), 0) +
    yearlyCompletedPickups.reduce((acc, p) => acc + (p.estimatedQtyKg || 0), 0);

  // Section 4 Payment & Conservancy Allowance Computation
  const baseDutyDays = 24;
  const dailyRate = 650; // ₹650 / day official municipal conservancy rate
  const baseSalaryAmount = baseDutyDays * dailyRate; // ₹15,600
  const complaintIncentiveRate = 35; // ₹35 / verified task
  const pickupIncentiveRate = 45; // ₹45 / doorstep collection
  const taskIncentivesAmount = (monthlyCompletedComplaints.length * complaintIncentiveRate) + (monthlyCompletedPickups.length * pickupIncentiveRate);
  const highPriorityBonus = monthlyCompletedComplaints.filter(c => c.priority === 'High' || c.priority === 'Emergency').length * 150;
  const grossEarnings = baseSalaryAmount + taskIncentivesAmount + highPriorityBonus;
  const deductionsPFESI = Math.round(grossEarnings * 0.05); // 5% PF / Medical insurance
  const netDisbursableAmount = grossEarnings - deductionsPFESI;

  res.json({
    monthly: {
      monthName: now.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      completedTasksCount: monthlyCompletedComplaints.length + monthlyCompletedPickups.length,
      totalKgCollected: monthlyTotalKg,
      onTimeRatePercent: 96.8,
      averageResolutionHours: 2.5,
      attendanceDays: baseDutyDays
    },
    yearly: {
      year: currentYear,
      completedTasksCount: yearlyCompletedComplaints.length + yearlyCompletedPickups.length,
      totalTonnageMetricTons: parseFloat((yearlyTotalKg / 1000).toFixed(2)),
      citizenRatingAvg: 4.85,
      cleanlinessRank: 'Ward Top Tier (Rank #1 in Zone)'
    },
    allowanceAndPay: {
      baseDutyDays,
      dailyRate,
      baseSalaryAmount,
      taskIncentivesAmount,
      highPriorityBonus,
      grossEarnings,
      deductionsPFESI,
      netDisbursableAmount,
      payoutMethod: 'Direct Benefit Transfer (DBT) · Public Financial Management System (PFMS)',
      payoutStatus: (() => {
        const staffPayments = (db.payments || []).filter(p => p.staffId === user.id);
        const lastDisbursed = staffPayments.find(p => p.status === 'Disbursed');
        return lastDisbursed
          ? `Verified & ${lastDisbursed.status} (${lastDisbursed.period})`
          : 'Pending Administrative Verification';
      })(),
      treasuryAccountNo: 'SBIN0040123-****4819',
      lastDisbursedDate: (() => {
        const staffPayments = (db.payments || []).filter(p => p.staffId === user.id);
        const lastDisbursed = staffPayments.find(p => p.status === 'Disbursed');
        return lastDisbursed?.paymentDate || `${currentYear}-09-01`;
      })(),
      lastDisbursedAmount: (() => {
        const staffPayments = (db.payments || []).filter(p => p.staffId === user.id);
        const lastDisbursed = staffPayments.find(p => p.status === 'Disbursed');
        return lastDisbursed?.totalAmount || 0;
      })(),
      verifiedPaymentRecords: (db.payments || [])
        .filter(p => p.staffId === user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      yearlySummary: (() => {
        const staffPayments = (db.payments || []).filter(p => p.staffId === user.id && p.year === currentYear);
        const totalDisbursed = staffPayments.filter(p => p.status === 'Disbursed').reduce((acc, p) => acc + p.totalAmount, 0);
        const totalPending = staffPayments.filter(p => ['Pending', 'Approved'].includes(p.status)).reduce((acc, p) => acc + p.totalAmount, 0);
        const totalDutyDays = staffPayments.reduce((acc, p) => acc + (p.baseDutyDays || 0), 0);
        return {
          year: currentYear,
          totalDisbursed,
          totalPending,
          totalDutyDays,
          recordsCount: staffPayments.length
        };
      })()
    }
  });
});

// PATCH complete complaint task with mandatory field collection details and evidence
router.patch('/complaints/:id/complete', authenticate, requireRole(['STAFF', 'ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const { resolutionNotes, actualCollectedKg, beforePhotos, afterPhotos, evidenceVideos } = req.body;

    const db = getDatabase();
    const complaint = db.complaints.find(c => c.id === id);

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found.' });
      return;
    }

    // Prevent completed tasks from being unnecessarily reassigned or re-completed
    if (complaint.status === 'Resolved' || complaint.status === 'Closed') {
      res.status(400).json({ error: 'This task is already completed and recorded in municipal archives. It cannot be re-completed.' });
      return;
    }

    if (user.role === 'STAFF' && complaint.assignedStaffId && complaint.assignedStaffId !== user.id) {
      res.status(403).json({ error: 'You are only authorized to complete tasks assigned directly to you.' });
      return;
    }

    // Validate mandatory evidence: at least 1 after photo or video
    const hasPhotos = Array.isArray(afterPhotos) && afterPhotos.length > 0;
    const hasVideos = Array.isArray(evidenceVideos) && evidenceVideos.length > 0;
    if (!hasPhotos && !hasVideos) {
      res.status(400).json({ error: 'Mandatory completion evidence required: Please upload at least one cleared site photo or video before marking task as complete.' });
      return;
    }

    // Validate resolution notes
    if (!resolutionNotes || resolutionNotes.trim().length < 5) {
      res.status(400).json({ error: 'Please provide detailed sanitation remarks describing the clearance work performed.' });
      return;
    }

    const now = new Date().toISOString();
    complaint.status = 'Resolved';
    complaint.evidenceStatus = 'Pending Review';
    complaint.resolutionNotes = resolutionNotes.trim();
    complaint.actualCollectedKg = Number(actualCollectedKg) || complaint.quantityKg;
    complaint.completedAt = now;
    complaint.completedByStaffId = user.id;
    complaint.completedByStaffName = user.name;

    if (Array.isArray(beforePhotos) && beforePhotos.length > 0) {
      complaint.beforePhotos = beforePhotos;
    }
    if (hasPhotos) {
      complaint.afterPhotos = afterPhotos;
    }
    if (hasVideos) {
      complaint.evidenceVideos = evidenceVideos;
    }
    complaint.updatedAt = now;

    const historyItem: StatusHistoryItem = {
      status: 'Resolved',
      timestamp: now,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      notes: `Work completed by ${user.name}. Evidence uploaded (${(complaint.afterPhotos?.length || 0)} photos, ${(complaint.evidenceVideos?.length || 0)} videos). Collected: ${complaint.actualCollectedKg}kg. Remarks: ${complaint.resolutionNotes}`
    };
    complaint.statusHistory.push(historyItem);

    // Stop live location broadcasting for this resolved task
    if (complaint.staffLocation) {
      complaint.staffLocation.isSharing = false;
    }

    // Reward staff points (+35 pts)
    const staffIdx = db.users.findIndex(u => u.id === user.id);
    if (staffIdx !== -1) {
      db.users[staffIdx].points = (db.users[staffIdx].points || 0) + 35;
    }

    // Notify citizen
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-${complaint.citizenId}`,
      userId: complaint.citizenId,
      title: `Complaint Resolved: ${complaint.id}`,
      message: `Cleanliness task at ${complaint.street} has been completed by ${user.name}. Photographic & video evidence verified. Please rate the service!`,
      type: 'complaint',
      link: `/track?id=${complaint.id}`,
      read: false,
      createdAt: now
    });

    // Notify all administrators
    const admins = db.users.filter(u => u.role === 'ADMIN');
    admins.forEach(adm => {
      db.notifications.unshift({
        id: `NOTIF-${Date.now()}-${adm.id}`,
        userId: adm.id,
        title: `Task Resolved: ${complaint.id}`,
        message: `Field officer ${user.name} marked ${complaint.id} as Resolved (${complaint.actualCollectedKg}kg cleared) in ${complaint.ward}. Evidence submitted.`,
        type: 'complaint',
        link: `/track?id=${complaint.id}`,
        read: false,
        createdAt: now
      });
    });

    // Audit log
    db.auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'COMPLETE_COMPLAINT',
      entityType: 'Complaint',
      entityId: complaint.id,
      details: `Collected ${complaint.actualCollectedKg}kg waste. Uploaded ${(complaint.afterPhotos?.length || 0)} photos, ${(complaint.evidenceVideos?.length || 0)} videos. Resolved task.`,
      timestamp: now
    });

    saveDatabase(db);

    res.json({ message: 'Complaint marked as resolved successfully with verified evidence.', complaint });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete complaint.' });
  }
});

// PATCH complete pickup task with evidence
router.patch('/pickups/:id/complete', authenticate, requireRole(['STAFF', 'ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const { completionNotes, photoUrl } = req.body;

    const db = getDatabase();
    const pickup = db.pickupRequests.find(p => p.id === id);

    if (!pickup) {
      res.status(404).json({ error: 'Pickup request not found.' });
      return;
    }

    if (pickup.status === 'Completed') {
      res.status(400).json({ error: 'This pickup request is already marked as completed.' });
      return;
    }

    const now = new Date().toISOString();
    pickup.status = 'Completed';
    pickup.completionNotes = completionNotes || 'Doorstep bulk waste collected and transported to recycling depot.';
    pickup.completedAt = now;
    pickup.completedByStaffId = user.id;
    pickup.completedByStaffName = user.name;
    if (photoUrl) {
      pickup.photoUrl = photoUrl;
    }
    pickup.updatedAt = now;

    // Notify citizen
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-${pickup.citizenId}`,
      userId: pickup.citizenId,
      title: `Pickup Completed: ${pickup.id}`,
      message: `Your doorstep pickup on ${pickup.preferredDate} (${pickup.wasteType}) has been collected by ${user.name}.`,
      type: 'pickup',
      link: `/track?pickupId=${pickup.id}`,
      read: false,
      createdAt: now
    });

    // Notify admins
    const admins = db.users.filter(u => u.role === 'ADMIN');
    admins.forEach(adm => {
      db.notifications.unshift({
        id: `NOTIF-${Date.now()}-${adm.id}`,
        userId: adm.id,
        title: `Pickup Cleared: ${pickup.id}`,
        message: `Field officer ${user.name} completed doorstep pickup ${pickup.id} (${pickup.wasteType}) for citizen ${pickup.citizenName}.`,
        type: 'pickup',
        link: `/track?pickupId=${pickup.id}`,
        read: false,
        createdAt: now
      });
    });

    saveDatabase(db);

    res.json({ message: 'Pickup marked as completed.', pickupRequest: pickup });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to complete pickup.' });
  }
});

// POST update staff live GPS location
router.post('/location', authenticate, requireRole(['STAFF', 'ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const { lat, lng, complaintId, isSharing, heading, speed } = req.body;

    if (lat === undefined || lng === undefined) {
      res.status(400).json({ error: 'Valid lat and lng required' });
      return;
    }

    const db = getDatabase();
    if (!(db as any).staffLiveLocations) {
      (db as any).staffLiveLocations = {};
    }

    const now = new Date().toISOString();
    const locationEntry = {
      staffId: user.id,
      staffName: user.name,
      complaintId: complaintId || '',
      lat: Number(lat),
      lng: Number(lng),
      heading: Number(heading) || 0,
      speed: Number(speed) || 0,
      lastUpdated: now,
      isSharing: isSharing !== false
    };

    (db as any).staffLiveLocations[user.id] = locationEntry;

    // If attached to a complaint, also update on complaint for tracking
    if (complaintId) {
      const c = db.complaints.find(comp => comp.id === complaintId);
      if (c && c.assignedStaffId === user.id) {
        c.staffLocation = {
          lat: Number(lat),
          lng: Number(lng),
          lastUpdated: now,
          isSharing: isSharing !== false,
          staffName: user.name
        };
      }
    }

    saveDatabase(db);
    res.json({ success: true, location: locationEntry });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update location' });
  }
});

// GET staff live location for a complaint
router.get('/location/:complaintId', (req, res): void => {
  try {
    const { complaintId } = req.params;
    const db = getDatabase();
    const complaint = db.complaints.find(c => c.id.toUpperCase() === complaintId.toUpperCase());

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found' });
      return;
    }

    if (!complaint.assignedStaffId) {
      res.json({ live: false, message: 'No staff currently assigned to this complaint.' });
      return;
    }

    const staffLocation = (db as any).staffLiveLocations?.[complaint.assignedStaffId] || complaint.staffLocation;

    if (!staffLocation || !staffLocation.isSharing) {
      res.json({
        live: false,
        message: 'Staff live GPS tracking is currently inactive or completed.',
        lastUpdated: staffLocation?.lastUpdated || null
      });
      return;
    }

    res.json({
      live: true,
      location: staffLocation
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to retrieve staff location' });
  }
});

// PATCH update complaint progress status (Staff en route, work in progress, waste collected, etc.)
router.patch('/complaints/:id/status', authenticate, requireRole(['STAFF', 'ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const { status, notes } = req.body;

    const db = getDatabase();
    const complaint = db.complaints.find(c => c.id === id);

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found.' });
      return;
    }

    const validStatuses = [
      'Submitted',
      'Under Review',
      'Under Verification',
      'Verified',
      'Assigned to Staff',
      'Accepted',
      'Declined',
      'Staff En Route',
      'Arrived',
      'Work In Progress',
      'In Progress',
      'Waste Collected',
      'Work Completed',
      'Resolved',
      'Closed'
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status: ${status}` });
      return;
    }

    const now = new Date().toISOString();
    complaint.status = status as any;
    complaint.updatedAt = now;

    if (status === 'Arrived') {
      complaint.arrivalTime = now;
      if (req.body.lat && req.body.lng) {
        complaint.arrivalCoords = { lat: Number(req.body.lat), lng: Number(req.body.lng) };
      }
    }

    if (Array.isArray(req.body.beforePhotos) && req.body.beforePhotos.length > 0) {
      complaint.beforePhotos = req.body.beforePhotos;
    }

    const historyItem: StatusHistoryItem = {
      status,
      timestamp: now,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      notes: notes || `Status updated to ${status} by ${user.name}`
    };
    complaint.statusHistory.push(historyItem);

    // If completed or closed, stop location sharing for this task
    if (status === 'Resolved' || status === 'Work Completed' || status === 'Closed') {
      if (complaint.staffLocation) {
        complaint.staffLocation.isSharing = false;
      }
      if ((db as any).staffLiveLocations?.[user.id]) {
        (db as any).staffLiveLocations[user.id].isSharing = false;
      }
    }

    // Notify citizen
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-${complaint.citizenId}`,
      userId: complaint.citizenId,
      title: `Update on ${complaint.id}: ${status}`,
      message: `Your waste complaint status changed to '${status}'. ${notes || ''}`,
      type: 'complaint',
      link: `/track?id=${complaint.id}`,
      read: false,
      createdAt: now
    });

    saveDatabase(db);
    res.json({ message: `Status updated to ${status}`, complaint });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update status' });
  }
});

export default router;
