import { Router, Response } from 'express';
import { getDatabase, saveDatabase, WasteBin } from '../db.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../auth.js';

const router = Router();

// GET public waste bins and collection centers for the map
router.get('/', (req, res): void => {
  const db = getDatabase();
  const { district, ward, category } = req.query;

  let list = [...db.wasteBins];

  if (district && typeof district === 'string' && district !== 'all') {
    list = list.filter(b => b.district.toLowerCase() === district.toLowerCase());
  }

  if (ward && typeof ward === 'string' && ward !== 'all') {
    list = list.filter(b => b.ward.toLowerCase().includes(ward.toLowerCase()));
  }

  if (category && typeof category === 'string' && category !== 'all') {
    list = list.filter(b => b.category.toLowerCase() === category.toLowerCase());
  }

  res.json({ wasteBins: list });
});

// POST add new waste bin (Admin only)
router.post('/', authenticate, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { name, category, district, ward, address, lat, lng, capacityLiters } = req.body;

    if (!name || !category || !district || !ward) {
      res.status(400).json({ error: 'Please provide bin name, category, district and ward.' });
      return;
    }

    const db = getDatabase();
    const newBin: WasteBin = {
      id: `BIN-KA-${Date.now()}`,
      name: name.trim(),
      category,
      district,
      ward,
      address: address?.trim() || '',
      lat: Number(lat) || 12.9716,
      lng: Number(lng) || 77.5946,
      capacityLiters: Number(capacityLiters) || 1000,
      currentFillLevel: 0,
      lastEmptied: new Date().toLocaleString(),
      status: 'Operational'
    };

    db.wasteBins.push(newBin);
    saveDatabase(db);

    res.status(201).json({ message: 'Waste bin added successfully.', bin: newBin });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add waste bin.' });
  }
});

export default router;
