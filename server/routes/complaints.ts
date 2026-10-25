import { Router, Response } from 'express';
import { getDatabase, saveDatabase, Complaint, StatusHistoryItem, AuditLog, NotificationItem } from '../db.js';
import { authenticate, optionalAuthenticate, AuthenticatedRequest } from '../auth.js';

const router = Router();

// Helper to generate sequentially padded complaint ID
function generateComplaintId(existingComplaints: Complaint[]): string {
  const year = new Date().getFullYear();
  const prefix = `SW-${year}-`;
  let maxNum = 0;

  for (const c of existingComplaints) {
    if (c.id.startsWith(prefix)) {
      const numPart = parseInt(c.id.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `${prefix}${nextNum.toString().padStart(6, '0')}`;
}

// GET all complaints with role authorization & filtering
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const db = getDatabase();
  const user = req.user!;
  const { status, district, ward, category, search } = req.query;

  let results = [...db.complaints];

  if (user.role === 'CITIZEN') {
    // Citizen can only see their own complaints
    results = results.filter(c => c.citizenId === user.id);
  } else if (user.role === 'STAFF') {
    // Staff sees complaints assigned to them, or unassigned verified complaints in their ward
    results = results.filter(c => c.assignedStaffId === user.id || (c.ward === user.ward && c.status === 'Verified'));
  }
  // Admin sees all

  // Filters
  if (status && typeof status === 'string' && status !== 'all') {
    results = results.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }

  if (district && typeof district === 'string' && district !== 'all') {
    results = results.filter(c => c.district.toLowerCase() === district.toLowerCase());
  }

  if (ward && typeof ward === 'string' && ward !== 'all') {
    results = results.filter(c => c.ward.toLowerCase().includes(ward.toLowerCase()));
  }

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter(c => c.wasteCategory.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      c =>
        c.id.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.street.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q)
    );
  }

  // Sort by newest first
  results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ complaints: results, total: results.length });
});

// GET public or authenticated track by ID
router.get('/track/:id', optionalAuthenticate, (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const db = getDatabase();

  const complaint = db.complaints.find(c => c.id.toUpperCase() === id.toUpperCase());
  if (!complaint) {
    res.status(404).json({ error: `Complaint with ID '${id}' was not found in Karnataka SMARTWASTE registry.` });
    return;
  }

  // Return public tracking view (sensitive personal info masked if not owner/admin/staff)
  const isAuthorized = req.user && (req.user.id === complaint.citizenId || req.user.role === 'ADMIN' || req.user.role === 'STAFF');

  const safeComplaint = isAuthorized
    ? complaint
    : {
        ...complaint,
        mobile: complaint.mobile.replace(/(\d{2})\d{4}(\d{4})/, '$1****$2'),
        citizenName: complaint.citizenName.replace(/(?<=.).(?=.*@|.* )/g, '*')
      };

  res.json({ complaint: safeComplaint });
});

// POST submit new waste complaint (Citizens & registered users)
router.post('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const {
      wasteCategory,
      quantityKg,
      description,
      state,
      district,
      taluk,
      city,
      ward,
      street,
      lat,
      lng,
      mobile,
      attachments
    } = req.body;

    if (!wasteCategory || !description || !district || !ward || !street) {
      res.status(400).json({ error: 'Please provide all mandatory complaint fields (Category, Description, District, Ward, Street).' });
      return;
    }

    const db = getDatabase();

    // Prevent duplicate spam within 10 seconds
    const tenSecondsAgo = new Date(Date.now() - 10000).toISOString();
    const isSpam = db.complaints.some(
      c => c.citizenId === user.id && c.description === description && c.createdAt > tenSecondsAgo
    );
    if (isSpam) {
      res.status(429).json({ error: 'Duplicate complaint detected. Please wait before submitting again.' });
      return;
    }

    const complaintId = generateComplaintId(db.complaints);
    const now = new Date().toISOString();

    const initialHistory: StatusHistoryItem = {
      status: 'Submitted',
      timestamp: now,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      notes: 'Complaint registered by citizen'
    };

    const newComplaint: Complaint = {
      id: complaintId,
      citizenId: user.id,
      citizenName: user.name,
      wasteCategory,
      quantityKg: Number(quantityKg) || 5,
      description: description.trim(),
      state: state || 'Karnataka',
      district: district || user.district || 'Bengaluru Urban',
      taluk: taluk || user.taluk || '',
      city: city || user.city || '',
      ward: ward || user.ward || '',
      street: street.trim(),
      lat: Number(lat) || 12.9716,
      lng: Number(lng) || 77.5946,
      mobile: mobile || user.mobile,
      attachments: Array.isArray(attachments) ? attachments : [],
      status: 'Submitted',
      statusHistory: [initialHistory],
      createdAt: now,
      updatedAt: now,
      ...(req.body.hobli ? { hobli: req.body.hobli } : {}),
      ...(req.body.quantityBracket ? { quantityBracket: req.body.quantityBracket } : {})
    };

    db.complaints.unshift(newComplaint);

    // Reward citizen with 20 points
    const userIdx = db.users.findIndex(u => u.id === user.id);
    if (userIdx !== -1) {
      db.users[userIdx].points = (db.users[userIdx].points || 0) + 20;
      if (!db.users[userIdx].badges.includes('Active Reporter')) {
        db.users[userIdx].badges.push('Active Reporter');
      }
    }

    // Citizen notification
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: user.id,
      title: `Complaint Registered: ${complaintId}`,
      message: `Your complaint for ${wasteCategory} has been successfully recorded and queued for municipal verification. You earned 20 Eco-Points!`,
      type: 'complaint',
      link: `/track?id=${complaintId}`,
      read: false,
      createdAt: now
    });

    // Notify administrators
    const admins = db.users.filter(u => u.role === 'ADMIN');
    for (const admin of admins) {
      db.notifications.unshift({
        id: `NOTIF-${Date.now()}-${admin.id}`,
        userId: admin.id,
        title: `New Waste Report: ${complaintId}`,
        message: `${wasteCategory} (${newComplaint.quantityKg}kg) reported in ${newComplaint.district}, ${newComplaint.ward}.`,
        type: 'complaint',
        link: `/admin`,
        read: false,
        createdAt: now
      });
    }

    // Audit log
    db.auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'SUBMIT_COMPLAINT',
      entityType: 'Complaint',
      entityId: complaintId,
      details: `Citizen submitted complaint for ${wasteCategory} in ${newComplaint.ward}`,
      timestamp: now
    });

    saveDatabase(db);

    res.status(201).json({
      message: 'Waste complaint submitted successfully.',
      complaint: newComplaint
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to submit complaint.' });
  }
});

// PATCH status updates (Staff & Admin workflows)
router.patch('/:id/status', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const {
      status,
      assignedStaffId,
      priority,
      dueDate,
      rejectionReason,
      resolutionNotes,
      afterPhotos,
      actualCollectedKg,
      notes
    } = req.body;

    const db = getDatabase();
    const complaint = db.complaints.find(c => c.id === id);

    if (!complaint) {
      res.status(404).json({ error: `Complaint with ID '${id}' not found.` });
      return;
    }

    // Rule: Citizens cannot mark their own complaints as resolved or update internal status
    if (user.role === 'CITIZEN') {
      res.status(403).json({ error: 'Citizens are not authorized to modify complaint operational status.' });
      return;
    }

    const now = new Date().toISOString();

    // Staff authorization check: Staff can only update complaints assigned to them or their ward
    if (user.role === 'STAFF' && complaint.assignedStaffId && complaint.assignedStaffId !== user.id) {
      res.status(403).json({ error: 'Staff members can only update tasks assigned directly to them.' });
      return;
    }

    // If Admin is assigning staff
    if (assignedStaffId && user.role === 'ADMIN') {
      const staffUser = db.users.find(u => u.id === assignedStaffId && u.role === 'STAFF');
      if (staffUser) {
        complaint.assignedStaffId = staffUser.id;
        complaint.assignedStaffName = staffUser.name;
        complaint.status = 'Assigned to Staff';

        // Notify assigned staff
        db.notifications.unshift({
          id: `NOTIF-${Date.now()}-${staffUser.id}`,
          userId: staffUser.id,
          title: `Task Assigned: ${complaint.id}`,
          message: `Complaint at ${complaint.street}, ${complaint.ward} assigned to you with ${priority || 'Medium'} priority.`,
          type: 'complaint',
          link: '/staff',
          read: false,
          createdAt: now
        });
      }
    }

    if (priority) complaint.priority = priority;
    if (dueDate) complaint.dueDate = dueDate;
    if (rejectionReason) complaint.rejectionReason = rejectionReason;
    if (resolutionNotes) complaint.resolutionNotes = resolutionNotes;
    if (actualCollectedKg) complaint.actualCollectedKg = Number(actualCollectedKg);
    if (afterPhotos && Array.isArray(afterPhotos)) {
      complaint.afterPhotos = afterPhotos;
    }

    if (status) {
      complaint.status = status;
    }

    complaint.updatedAt = now;

    // Record history
    const historyItem: StatusHistoryItem = {
      status: complaint.status,
      timestamp: now,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      notes: notes || resolutionNotes || rejectionReason || `Status changed to ${complaint.status}`
    };
    complaint.statusHistory.push(historyItem);

    // Notify citizen about status change
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-${complaint.citizenId}`,
      userId: complaint.citizenId,
      title: `Update on ${complaint.id}: ${complaint.status}`,
      message: `Your complaint status has been updated to "${complaint.status}". ${notes ? `Note: ${notes}` : ''}`,
      type: 'complaint',
      link: `/track?id=${complaint.id}`,
      read: false,
      createdAt: now
    });

    // Audit log
    db.auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'UPDATE_COMPLAINT_STATUS',
      entityType: 'Complaint',
      entityId: complaint.id,
      details: `Status set to ${complaint.status} by ${user.role} ${user.name}`,
      timestamp: now
    });

    saveDatabase(db);

    res.json({ message: 'Complaint status updated successfully.', complaint });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update complaint status.' });
  }
});

// Citizen feedback & rating after resolution
router.post('/:id/feedback', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const { rating, comment } = req.body;

    const db = getDatabase();
    const complaint = db.complaints.find(c => c.id === id);

    if (!complaint) {
      res.status(404).json({ error: 'Complaint not found.' });
      return;
    }

    if (complaint.citizenId !== user.id && user.role !== 'ADMIN') {
      res.status(403).json({ error: 'Only the citizen who filed this complaint can submit feedback.' });
      return;
    }

    if (!['Resolved', 'Closed'].includes(complaint.status)) {
      res.status(400).json({ error: 'Feedback can only be submitted after the complaint is Resolved.' });
      return;
    }

    complaint.feedbackRating = Math.min(5, Math.max(1, Number(rating) || 5));
    complaint.feedbackComment = comment?.trim() || '';
    complaint.updatedAt = new Date().toISOString();

    // Reward citizen with 10 bonus points for feedback
    const userIdx = db.users.findIndex(u => u.id === user.id);
    if (userIdx !== -1) {
      db.users[userIdx].points = (db.users[userIdx].points || 0) + 10;
    }

    saveDatabase(db);

    res.json({ message: 'Thank you for your feedback! 10 Eco-Points added to your profile.', complaint });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save feedback.' });
  }
});

export default router;
