import { Router, Response } from 'express';
import { getDatabase, saveDatabase, PickupRequest, PICKUP_SLOTS, AuditLog } from '../db.js';
import { authenticate, AuthenticatedRequest } from '../auth.js';

const router = Router();

function generatePickupId(existingPickups: PickupRequest[]): string {
  const year = new Date().getFullYear();
  const prefix = `PK-${year}-`;
  let maxNum = 0;

  for (const p of existingPickups) {
    if (p.id.startsWith(prefix)) {
      const numPart = parseInt(p.id.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxNum) {
        maxNum = numPart;
      }
    }
  }

  const nextNum = maxNum + 1;
  return `${prefix}${nextNum.toString().padStart(6, '0')}`;
}

// GET available slots with live capacity
router.get('/slots', (req, res): void => {
  const date = req.query.date as string;
  const db = getDatabase();

  const slotsWithAvailability = PICKUP_SLOTS.map(slot => {
    let bookedCount = 0;
    if (date) {
      bookedCount = db.pickupRequests.filter(
        p => p.preferredDate === date && p.preferredTimeSlot === slot.label && p.status !== 'Cancelled'
      ).length;
    }
    const remaining = Math.max(0, slot.maxCapacity - bookedCount);
    return {
      ...slot,
      bookedCount,
      remainingCapacity: remaining,
      isAvailable: remaining > 0
    };
  });

  res.json({ slots: slotsWithAvailability });
});

// GET all pickups
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const db = getDatabase();

  let list = [...db.pickupRequests];
  if (user.role === 'CITIZEN') {
    list = list.filter(p => p.citizenId === user.id);
  } else if (user.role === 'STAFF') {
    list = list.filter(p => p.assignedStaffId === user.id);
  }

  list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json({ pickupRequests: list });
});

// POST schedule new pickup request
router.post('/', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const user = req.user!;
    const {
      wasteType,
      estimatedQtyKg,
      address,
      lat,
      lng,
      preferredDate,
      preferredTimeSlot,
      mobile,
      instructions,
      photoUrl
    } = req.body;

    if (!wasteType || !estimatedQtyKg || !address || !preferredDate || !preferredTimeSlot) {
      res.status(400).json({ error: 'Please provide waste type, quantity, address, date and time slot.' });
      return;
    }

    const db = getDatabase();

    // Check slot capacity
    const slotConfig = PICKUP_SLOTS.find(s => s.label === preferredTimeSlot);
    const existingBookings = db.pickupRequests.filter(
      p => p.preferredDate === preferredDate && p.preferredTimeSlot === preferredTimeSlot && p.status !== 'Cancelled'
    ).length;

    const maxCap = slotConfig ? slotConfig.maxCapacity : 15;
    if (existingBookings >= maxCap) {
      res.status(400).json({ error: `Selected slot on ${preferredDate} is fully booked. Please choose another slot or date.` });
      return;
    }

    const pickupId = generatePickupId(db.pickupRequests);
    const now = new Date().toISOString();

    const newPickup: PickupRequest = {
      id: pickupId,
      citizenId: user.id,
      citizenName: user.name,
      wasteType,
      estimatedQtyKg: Number(estimatedQtyKg) || 10,
      address: address.trim(),
      lat: Number(lat) || 12.9716,
      lng: Number(lng) || 77.5946,
      preferredDate,
      preferredTimeSlot,
      mobile: mobile || user.mobile,
      instructions: instructions?.trim() || '',
      photoUrl: photoUrl || '',
      status: 'Submitted',
      createdAt: now,
      updatedAt: now
    };

    db.pickupRequests.unshift(newPickup);

    // Notification to citizen with transparent note
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      userId: user.id,
      title: `Pickup Request Booked: ${pickupId}`,
      message: `Your pickup request for ${wasteType} on ${preferredDate} (${preferredTimeSlot}) has been registered. (Note: SMS service is in-app simulation).`,
      type: 'pickup',
      link: `/track?pickupId=${pickupId}`,
      read: false,
      createdAt: now
    });

    // Audit log
    db.auditLogs.unshift({
      id: `AUDIT-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'BOOK_PICKUP',
      entityType: 'PickupRequest',
      entityId: pickupId,
      details: `Booked pickup for ${wasteType} on ${preferredDate}`,
      timestamp: now
    });

    saveDatabase(db);

    res.status(201).json({
      message: 'Pickup request scheduled successfully.',
      pickupRequest: newPickup,
      smsDeliveryNotice: 'In-app notification sent. SMS Gateway is running in local municipal simulation mode.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to book pickup request.' });
  }
});

// PATCH update pickup status
router.patch('/:id/status', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const user = req.user!;
    const { status, assignedStaffId, completionNotes } = req.body;

    const db = getDatabase();
    const pickup = db.pickupRequests.find(p => p.id === id);

    if (!pickup) {
      res.status(404).json({ error: `Pickup request '${id}' not found.` });
      return;
    }

    if (user.role === 'CITIZEN' && status !== 'Cancelled') {
      res.status(403).json({ error: 'Citizens can only cancel their own pickup requests.' });
      return;
    }

    if (user.role === 'CITIZEN' && pickup.citizenId !== user.id) {
      res.status(403).json({ error: 'Unauthorized.' });
      return;
    }

    const now = new Date().toISOString();

    if (assignedStaffId && user.role === 'ADMIN') {
      const staff = db.users.find(u => u.id === assignedStaffId && u.role === 'STAFF');
      if (staff) {
        pickup.assignedStaffId = staff.id;
        pickup.assignedStaffName = staff.name;
        pickup.status = 'Assigned';
      }
    }

    if (status) pickup.status = status;
    if (completionNotes) pickup.completionNotes = completionNotes;
    pickup.updatedAt = now;

    // Notification to citizen
    db.notifications.unshift({
      id: `NOTIF-${Date.now()}-${pickup.citizenId}`,
      userId: pickup.citizenId,
      title: `Pickup ${pickup.id} Updated: ${pickup.status}`,
      message: `Your pickup scheduled for ${pickup.preferredDate} is now "${pickup.status}".`,
      type: 'pickup',
      link: `/track?pickupId=${pickup.id}`,
      read: false,
      createdAt: now
    });

    saveDatabase(db);

    res.json({ message: 'Pickup status updated.', pickupRequest: pickup });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update pickup.' });
  }
});

export default router;
