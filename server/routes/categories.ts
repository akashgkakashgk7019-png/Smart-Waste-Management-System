import { Router, Response } from 'express';
import { getDatabase, saveDatabase } from '../db.js';
import { authenticate, requireRole, AuthenticatedRequest } from '../auth.js';

const router = Router();

// Default baseline categories
export const DEFAULT_CATEGORIES = [
  { id: 'household-waste', name: 'Household Waste', binColor: 'Mixed Household Bins', binHex: '#0284C7' },
  { id: 'plastic-waste', name: 'Plastic Waste', binColor: 'Blue Bin', binHex: '#0284C7' },
  { id: 'paper-cardboard', name: 'Paper and Cardboard', binColor: 'Blue Bin (Dry Stream)', binHex: '#3B82F6' },
  { id: 'wet-waste', name: 'Organic / Wet Waste', binColor: 'Green Bin', binHex: '#16A34A' },
  { id: 'construction-waste', name: 'Construction and Demolition (C&D) Waste', binColor: 'Dedicated C&D Skip', binHex: '#78716C' },
  { id: 'e-waste', name: 'E-Waste (Electronic Waste)', binColor: 'Black Bin / Authorized Center', binHex: '#475569' },
  { id: 'biomedical-waste', name: 'Medical / Biomedical Waste', binColor: 'Yellow / Red Biohazard', binHex: '#B91C1C' },
  { id: 'domestic-hazardous', name: 'Hazardous Waste (Chemicals/Poisons)', binColor: 'Red Bin / Hazardous Box', binHex: '#DC2626' },
  { id: 'garden-waste', name: 'Garden and Green Waste', binColor: 'Burlap Sack / Green Collection', binHex: '#15803D' },
  { id: 'industrial-waste', name: 'Industrial Waste', binColor: 'Industrial Yellow/Orange Skip', binHex: '#D97706' },
  { id: 'roadside-garbage', name: 'Roadside Garbage / Litter Heap', binColor: 'Street Litter Cleanup', binHex: '#EF4444' },
  { id: 'overflowing-bins', name: 'Overflowing Public Waste Bin', binColor: 'Public Bin Clearance', binHex: '#F59E0B' },
  { id: 'illegal-dumping', name: 'Illegal Dumping Site / Blackspot', binColor: 'Enforcement Red Alert', binHex: '#991B1B' },
  { id: 'bulky-waste', name: 'Bulky Waste', binColor: 'On-Demand Doorstep Collection', binHex: '#4B5563' },
  { id: 'mixed-waste', name: 'Other / Mixed Waste (Reject Stream)', binColor: 'Black Bin (Reject / Inerts)', binHex: '#1E293B' }
];

// GET categories
router.get('/', (req, res): void => {
  const db = getDatabase();
  const categories = (db as any).categories && (db as any).categories.length > 0 ? (db as any).categories : DEFAULT_CATEGORIES;
  res.json({ categories });
});

// POST add new category (Admin only)
router.post('/', authenticate, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { name, binColor, binHex, description } = req.body;
    if (!name || !name.trim()) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }
    const db = getDatabase();
    if (!(db as any).categories) {
      (db as any).categories = [...DEFAULT_CATEGORIES];
    }
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newCat = {
      id,
      name: name.trim(),
      binColor: binColor || 'Standard Bin',
      binHex: binHex || '#10B981',
      description: description || ''
    };
    (db as any).categories.push(newCat);
    saveDatabase(db);
    res.json({ message: 'Category added successfully', category: newCat, categories: (db as any).categories });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to add category' });
  }
});

// DELETE category (Admin only)
router.delete('/:id', authenticate, requireRole(['ADMIN']), (req: AuthenticatedRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const db = getDatabase();
    if (!(db as any).categories) {
      (db as any).categories = [...DEFAULT_CATEGORIES];
    }
    (db as any).categories = (db as any).categories.filter((c: any) => c.id !== id);
    saveDatabase(db);
    res.json({ message: 'Category deleted successfully', categories: (db as any).categories });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete category' });
  }
});

export default router;
