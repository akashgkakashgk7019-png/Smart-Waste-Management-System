import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './server/routes/auth.ts';
import complaintRoutes from './server/routes/complaints.ts';
import pickupRoutes from './server/routes/pickups.ts';
import staffRoutes from './server/routes/staff.ts';
import adminRoutes from './server/routes/admin.ts';
import locationRoutes from './server/routes/locations.ts';
import categoryRoutes from './server/routes/categories.ts';
import binRoutes from './server/routes/bins.ts';
import quizRoutes from './server/routes/quiz.ts';
import notificationRoutes from './server/routes/notifications.ts';
import { getDatabase } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Structured logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.url.startsWith('/api')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    }
  });
  next();
});

// JSON body parsing with reasonable payload limits for photo uploads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static assets from public folder
app.use(express.static(path.resolve(__dirname, 'public')));
app.use('/assets', express.static(path.resolve(__dirname, 'public/assets')));

// Initialize DB schema & seed on startup
getDatabase();

// Base64 file upload helper for complaint evidence
app.post('/api/upload', (req: Request, res: Response): void => {
  try {
    const { data, filename, type } = req.body;
    if (!data) {
      res.status(400).json({ error: 'No file data received' });
      return;
    }

    // Validate mime type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/webm', 'video/quicktime'];
    const mimeMatch = data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!mimeMatch || !validMimes.includes(mimeMatch[1])) {
      res.status(400).json({ error: 'Invalid file format. Only JPEG, PNG, WEBP, and MP4/WEBM videos under 15MB are permitted.' });
      return;
    }

    // Returns data URI for persistent in-memory/JSON storage
    res.json({
      url: data,
      name: filename || 'evidence-photo.jpg',
      type: mimeMatch[1]
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'File upload failed' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/pickups', pickupRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/bins', binRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'SMARTWASTE Karnataka Municipal Engine',
    version: '2026.1.0',
    timestamp: new Date().toISOString()
  });
});

// Strict API 404 handler - guarantees JSON response and never returns HTML for any API route
app.all('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    error: `API endpoint not found: ${req.method} ${req.originalUrl || req.url}`
  });
});

// Centralized error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SMARTWASTE Server Error]', err);
  if (res.headersSent) {
    return next(err);
  }
  const status = typeof err.status === 'number' ? err.status : typeof err.statusCode === 'number' ? err.statusCode : 500;
  res.status(status).json({
    error: err.message || 'Internal server error occurred in SMARTWASTE portal.'
  });
});

// Mounting Vite in development or static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SMARTWASTE Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
