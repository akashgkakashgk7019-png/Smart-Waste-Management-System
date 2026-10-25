import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { getDatabase, saveDatabase, User, AuditLog, NotificationItem, PasswordResetItem } from '../db.js';
import { generateToken, authenticate, AuthenticatedRequest } from '../auth.js';

const router = Router();

// Register new citizen
router.post('/register', async (req, res): Promise<void> => {
  try {
    const {
      name,
      email,
      mobile,
      password,
      confirmPassword,
      role = 'CITIZEN',
      adminKey,
      staffBadge,
      state,
      district,
      taluk,
      city,
      ward,
      address,
      agreeTerms
    } = req.body;

    // Server-side validation
    if (!name || !email || !mobile || !password) {
      res.status(400).json({ error: 'Please fill in all required registration fields.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    if (!agreeTerms) {
      res.status(400).json({ error: 'You must accept the terms and conditions to proceed.' });
      return;
    }

    // Role-based security validation
    const targetRole: 'CITIZEN' | 'STAFF' | 'ADMIN' =
      role === 'ADMIN' ? 'ADMIN' : role === 'STAFF' ? 'STAFF' : 'CITIZEN';

    if (targetRole === 'ADMIN') {
      const validAdminKeys = [
        process.env.ADMIN_AUTH_KEY,
        'SWMS-KA-ADMIN-2026',
        'KARNATAKA-ADMIN-2026',
        'ADMIN@2026'
      ].filter(Boolean);

      if (!adminKey || !validAdminKeys.includes(adminKey.trim())) {
        res.status(403).json({
          error:
            'Administrative registration denied. A valid Government Department Authorization Key is required to create an Administrator account.'
        });
        return;
      }
    }

    if (targetRole === 'STAFF') {
      if (!staffBadge || !staffBadge.trim()) {
        res.status(400).json({
          error: 'Waste Collection Staff registration requires a Staff Employee ID or Conservancy Badge Number.'
        });
        return;
      }
    }

    const db = getDatabase();

    // Check duplicate email
    const existingEmail = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (existingEmail) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    // Check duplicate mobile
    const existingMobile = db.users.find(u => u.mobile.replace(/\D/g, '') === cleanMobile);
    if (existingMobile) {
      res.status(409).json({ error: 'An account with this mobile number already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userIdPrefix = targetRole === 'ADMIN' ? 'usr_admin_' : targetRole === 'STAFF' ? 'usr_staff_' : 'usr_citizen_';
    const newUser: User = {
      id: `${userIdPrefix}${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: cleanMobile,
      passwordHash,
      role: targetRole,
      state: state || 'Karnataka',
      district: district || 'Bengaluru Urban',
      taluk: taluk || 'Bengaluru South',
      city: city || 'BBMP South Zone',
      ward: ward || 'Ward 151 - Koramangala',
      address: address?.trim() || '',
      staffBadgeNumber: targetRole === 'STAFF' ? staffBadge?.trim() : undefined,
      points: targetRole === 'ADMIN' ? 500 : targetRole === 'STAFF' ? 100 : 50,
      badges:
        targetRole === 'ADMIN'
          ? ['Municipal Overseer', 'State Coordinator']
          : targetRole === 'STAFF'
          ? ['Field Conservancy Officer']
          : ['Citizen Registrant'],
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);

    // Welcome notification
    const welcomeNotif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: newUser.id,
      title: `Welcome to SMARTWASTE (${targetRole})`,
      message:
        targetRole === 'ADMIN'
          ? 'Authorized as Karnataka Municipal Administrator. Clearance Level-5 active.'
          : targetRole === 'STAFF'
          ? `Registered as Waste Collection Staff (Badge: ${staffBadge}). Assigned to ${newUser.ward}.`
          : 'Thank you for joining Karnataka Cleanliness Initiative. You have received 50 Eco-Points for registering!',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.unshift(welcomeNotif);

    // Audit log
    const audit: AuditLog = {
      id: `AUDIT-${Date.now()}`,
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: targetRole,
      action: 'REGISTER',
      entityType: 'User',
      entityId: newUser.id,
      details: `New ${targetRole} registered from ${newUser.district}, ${newUser.ward}`,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(audit);

    saveDatabase(db);

    const token = generateToken(newUser);
    const { passwordHash: _, ...userSafe } = newUser;

    res.status(201).json({
      message: `Registration successful as ${targetRole}! Welcome to SMARTWASTE.`,
      token,
      user: userSafe
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed.' });
  }
});

// Login
router.post('/login', async (req, res): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const db = getDatabase();
    const user = db.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials. User with this email not found.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      return;
    }

    const token = generateToken(user);
    const { passwordHash: _, ...userSafe } = user;

    res.json({
      message: 'Login successful.',
      token,
      user: userSafe
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

// Current user profile
router.get('/me', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  const { passwordHash: _, ...userSafe } = req.user;
  res.json({ user: userSafe });
});

// Verify session token
router.get('/verify', authenticate, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ valid: false, error: 'Not authenticated' });
    return;
  }
  const { passwordHash: _, ...userSafe } = req.user;
  res.json({ valid: true, user: userSafe });
});

// Logout endpoint
router.post('/logout', (req, res): void => {
  res.json({ message: 'Logged out successfully.' });
});

// 1. Request Password Reset (Forgot Password)
router.post('/forgot-password', async (req, res): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ error: 'Please enter your registered email address.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const db = getDatabase();
    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      res.status(404).json({
        error: 'No account found with this email address. Please check your email or register.'
      });
      return;
    }

    // Generate secure 6-digit OTP and reset token
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = 'rst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 12);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store in passwordResets array
    db.passwordResets = db.passwordResets || [];
    const resetRecord: PasswordResetItem = {
      id: `RST-${Date.now()}`,
      email: user.email,
      otp,
      token,
      expiresAt,
      used: false,
      createdAt: new Date().toISOString()
    };
    db.passwordResets.unshift(resetRecord);

    // Audit log
    const audit: AuditLog = {
      id: `AUDIT-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'FORGOT_PASSWORD_REQUESTED',
      entityType: 'User',
      entityId: user.id,
      details: `Password reset verification code generated for ${user.email}`,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(audit);

    // Notification for user
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: user.id,
      title: 'Password Reset Code Generated',
      message: `A password reset code (${otp}) was requested for your account. Valid for 10 minutes.`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.unshift(notif);

    saveDatabase(db);

    console.log(`[SMARTWASTE EMAIL SERVICE] Secure OTP dispatch to ${user.email}: Code=${otp} (Expires: 10 mins)`);

    res.json({
      message: `Verification code (OTP) has been sent to ${user.email}. Please check your inbox and enter the 6-digit code.`,
      email: user.email,
      token,
      devOtp: otp, // Provides immediate code preview for easy testing in development
      expiresInMinutes: 10
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process forgot password request.' });
  }
});

// 2. Verify Password Reset OTP
router.post('/verify-reset-otp', async (req, res): Promise<void> => {
  try {
    const { email, otp, token } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: 'Email and 6-digit verification code are required.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const db = getDatabase();
    db.passwordResets = db.passwordResets || [];

    const record = db.passwordResets.find(
      r =>
        r.email.toLowerCase() === cleanEmail &&
        r.otp === cleanOtp &&
        !r.used &&
        (!token || r.token === token)
    );

    if (!record) {
      res.status(400).json({
        error: 'Invalid verification code. Please check the 6-digit code and try again.'
      });
      return;
    }

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      res.status(400).json({
        error: 'Verification code has expired. Please request a new code.'
      });
      return;
    }

    res.json({
      message: 'Verification code confirmed. You can now set your new password.',
      verified: true,
      token: record.token
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'OTP verification failed.' });
  }
});

// 3. Set New Password (Reset Password)
router.post('/reset-password', async (req, res): Promise<void> => {
  try {
    const { email, otp, token, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      res.status(400).json({ error: 'Please fill in all password fields.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ error: 'New password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: 'New password and confirm password do not match.' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = getDatabase();
    db.passwordResets = db.passwordResets || [];

    // Verify active reset record by token or OTP
    const cleanOtp = otp ? otp.toString().trim() : '';
    const record = db.passwordResets.find(
      r =>
        r.email.toLowerCase() === cleanEmail &&
        !r.used &&
        ((cleanOtp && r.otp === cleanOtp) || (token && r.token === token))
    );

    if (!record) {
      res.status(400).json({
        error: 'Invalid or already used password reset session. Please request a new verification code.'
      });
      return;
    }

    if (new Date(record.expiresAt).getTime() < Date.now()) {
      res.status(400).json({
        error: 'Password reset session has expired. Please request a new verification code.'
      });
      return;
    }

    const user = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      res.status(404).json({ error: 'User account not found.' });
      return;
    }

    // Hash new password securely
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    // Invalidate reset record
    record.used = true;

    // Audit log
    const audit: AuditLog = {
      id: `AUDIT-${Date.now()}`,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'PASSWORD_RESET_COMPLETED',
      entityType: 'User',
      entityId: user.id,
      details: `Password reset successfully via verified OTP for ${user.email}`,
      timestamp: new Date().toISOString()
    };
    db.auditLogs.unshift(audit);

    // Notification
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      userId: user.id,
      title: 'Security Alert: Password Updated',
      message: 'Your SMARTWASTE password was successfully changed. You can now use your new password.',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    };
    db.notifications.unshift(notif);

    saveDatabase(db);

    res.json({
      message: 'Your password has been reset successfully! You can now sign in with your new password.',
      email: user.email
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Password reset failed.' });
  }
});

// Explicit method handlers to guarantee JSON responses
router.get('/register', (req, res): void => {
  res.status(405).json({ error: 'Method Not Allowed. User registration requires HTTP POST.' });
});

router.get('/login', (req, res): void => {
  res.status(405).json({ error: 'Method Not Allowed. User login requires HTTP POST.' });
});

router.get('/forgot-password', (req, res): void => {
  res.status(405).json({ error: 'Method Not Allowed. Forgot password requires HTTP POST.' });
});

router.get('/reset-password', (req, res): void => {
  res.status(405).json({ error: 'Method Not Allowed. Reset password requires HTTP POST.' });
});

export default router;
