import { Router, Response } from 'express';
import { getDatabase, saveDatabase } from '../db.js';
import { authenticate, AuthenticatedRequest } from '../auth.js';

const router = Router();
router.use(authenticate);

// GET notifications for logged in user
router.get('/', (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const db = getDatabase();

  const userNotifs = db.notifications.filter(n => n.userId === user.id);
  const unreadCount = userNotifs.filter(n => !n.read).length;

  res.json({
    notifications: userNotifs.slice(0, 50),
    unreadCount
  });
});

// PATCH mark single notification as read
router.patch('/:id/read', (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const user = req.user!;
  const db = getDatabase();

  const notif = db.notifications.find(n => n.id === id && n.userId === user.id);
  if (notif) {
    notif.read = true;
    saveDatabase(db);
  }

  res.json({ success: true });
});

// PATCH mark all as read
router.patch('/read-all', (req: AuthenticatedRequest, res: Response): void => {
  const user = req.user!;
  const db = getDatabase();

  for (const n of db.notifications) {
    if (n.userId === user.id) {
      n.read = true;
    }
  }

  saveDatabase(db);
  res.json({ success: true });
});

export default router;
