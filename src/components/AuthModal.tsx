import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Truck,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface DistrictOption {
  name: string;
  taluks: {
    name: string;
    cities: {
      name: string;
      wards: string[];
    }[];
  }[];
}

interface AuthModalProps {
  onAuthSuccess?: (role: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onAuthSuccess }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    forgotPassword,
    resetPassword
  } = useAuth();
  const { t } = useLanguage();

  // Login & Registration fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [state] = useState('Karnataka');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [taluk, setTaluk] = useState('Bengaluru South');
  const [city, setCity] = useState('BBMP South Zone');
  const [ward, setWard] = useState('Ward 151 - Koramangala');
  const [address, setAddress] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [role, setRole] = useState<'CITIZEN' | 'STAFF' | 'ADMIN'>('CITIZEN');
  const [adminKey, setAdminKey] = useState('');
  const [staffBadge, setStaffBadge] = useState('');

  // Password visibility states (Show / Hide)
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  // Forgot / Reset Password states
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [devOtpPreview, setDevOtpPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [districtsData, setDistrictsData] = useState<DistrictOption[]>([]);

  // Fetch cascading Karnataka locations
  useEffect(() => {
    fetch('/api/locations')
      .then(res => res.json())
      .then(data => {
        if (data.districts) {
          setDistrictsData(data.districts);
        }
      })
      .catch(err => console.error('Failed to load locations', err));
  }, []);

  // Sync email into forgotEmail when opening forgot-password
  useEffect(() => {
    if (authModalMode === 'forgot-password' && email && !forgotEmail) {
      setForgotEmail(email);
    }
  }, [authModalMode, email, forgotEmail]);

  // Update taluk/ward when district changes
  const handleDistrictChange = (dName: string) => {
    setDistrict(dName);
    const foundDist = districtsData.find(d => d.name === dName);
    if (foundDist && foundDist.taluks.length > 0) {
      setTaluk(foundDist.taluks[0].name);
      if (foundDist.taluks[0].cities.length > 0) {
        setCity(foundDist.taluks[0].cities[0].name);
        if (foundDist.taluks[0].cities[0].wards.length > 0) {
          setWard(foundDist.taluks[0].cities[0].wards[0]);
        }
      }
    }
  };

  const handleTalukChange = (tName: string) => {
    setTaluk(tName);
    const foundDist = districtsData.find(d => d.name === district);
    const foundTaluk = foundDist?.taluks.find(t => t.name === tName);
    if (foundTaluk && foundTaluk.cities.length > 0) {
      setCity(foundTaluk.cities[0].name);
      if (foundTaluk.cities[0].wards.length > 0) {
        setWard(foundTaluk.cities[0].wards[0]);
      }
    }
  };

  const handleCityChange = (cName: string) => {
    setCity(cName);
    const foundDist = districtsData.find(d => d.name === district);
    const foundTaluk = foundDist?.taluks.find(t => t.name === taluk);
    const foundCity = foundTaluk?.cities.find(c => c.name === cName);
    if (foundCity && foundCity.wards.length > 0) {
      setWard(foundCity.wards[0]);
    }
  };

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Login failed. Please check your credentials.');
    } else if (onAuthSuccess && res.user) {
      onAuthSuccess(res.user.role);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (role === 'ADMIN' && !adminKey.trim()) {
      setErrorMessage('Admin registration requires a valid Department Authorization Key.');
      return;
    }

    if (role === 'STAFF' && !staffBadge.trim()) {
      setErrorMessage('Staff registration requires a Staff Employee ID / Badge Number.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the municipal terms and conditions to proceed.');
      return;
    }

    setLoading(true);
    const res = await register({
      name,
      email,
      mobile: cleanMobile,
      password,
      confirmPassword,
      role,
      adminKey: role === 'ADMIN' ? adminKey.trim() : undefined,
      staffBadge: role === 'STAFF' ? staffBadge.trim() : undefined,
      state,
      district,
      taluk,
      city,
      ward,
      address,
      agreeTerms
    });
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Registration failed');
    } else {
      setSuccessMessage(`Account registered successfully as ${role}! Opening your dashboard...`);
      setTimeout(() => {
        closeAuthModal();
        if (onAuthSuccess && res.user) {
          onAuthSuccess(res.user.role);
        }
      }, 1200);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!forgotEmail || !forgotEmail.trim()) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    const res = await forgotPassword(forgotEmail.trim());
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to send verification code. Please check your email.');
    } else {
      setResetToken(res.token || '');
      setDevOtpPreview(res.devOtp || '');
      setSuccessMessage(res.message || `Verification code sent to ${forgotEmail}.`);
      setAuthModalMode('reset-password');
    }
  };

  const handleResendOtp = async () => {
    if (!forgotEmail) return;
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);
    const res = await forgotPassword(forgotEmail.trim());
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Failed to resend code.');
    } else {
      setResetToken(res.token || '');
      setDevOtpPreview(res.devOtp || '');
      setSuccessMessage(`New 6-digit code has been sent to ${forgotEmail}.`);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanOtp = resetOtp.trim();
    if (cleanOtp.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await resetPassword({
      email: forgotEmail.trim(),
      otp: cleanOtp,
      token: resetToken,
      newPassword,
      confirmPassword: confirmNewPassword
    });
    setLoading(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Password reset failed. Please check your verification code.');
    } else {
      setSuccessMessage('Password reset successfully! Redirecting to sign in...');
      setEmail(forgotEmail.trim());
      setPassword('');
      setResetOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => {
        setAuthModalMode('login');
        setSuccessMessage('Password updated. Please sign in with your new password.');
      }, 1400);
    }
  };

  const currentDistObj = districtsData.find(d => d.name === district);
  const currentTalukObj = currentDistObj?.taluks.find(t => t.name === taluk);
  const currentCityObj = currentTalukObj?.cities.find(c => c.name === city);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">
                Official Access Portal
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              {authModalMode === 'login'
                ? 'Sign In to SMARTWASTE'
                : authModalMode === 'register'
                ? 'Register New Account'
                : authModalMode === 'forgot-password'
                ? 'Forgot Password'
                : 'Reset Password'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher / Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              authModalMode === 'login'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.login}
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              authModalMode === 'register'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {t.register}
          </button>
          {(authModalMode === 'forgot-password' || authModalMode === 'reset-password') && (
            <button
              type="button"
              className="pb-3 px-4 text-xs font-semibold border-b-2 border-emerald-600 text-emerald-800 cursor-default"
            >
              {authModalMode === 'forgot-password' ? 'Forgot Password' : 'Reset Password'}
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. LOGIN FORM */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. priyanka.shettigar@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setErrorMessage('');
                      setSuccessMessage('');
                      setAuthModalMode('forgot-password');
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowLoginPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5"
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 2. FORGOT PASSWORD REQUEST FORM */}
          {authModalMode === 'forgot-password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
                <p className="text-xs font-semibold text-slate-800">
                  Reset Your Password
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Enter the registered email address for your SMARTWASTE account. We will verify your account and send a secure 6-digit verification code.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="e.g. yourname@domain.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Sending Code...' : 'Send Verification Code'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className="w-full py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </button>
            </form>
          )}

          {/* 3. RESET PASSWORD / VERIFY OTP FORM */}
          {authModalMode === 'reset-password' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Verification Code Sent
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('forgot-password');
                      setErrorMessage('');
                      setSuccessMessage('');
                    }}
                    className="text-[11px] text-emerald-700 hover:underline cursor-pointer"
                  >
                    Change Email
                  </button>
                </div>
                <p className="text-[11px] text-slate-600">
                  Sent to <span className="font-semibold text-slate-800">{forgotEmail}</span>. Code is valid for 10 minutes.
                </p>
                {devOtpPreview && (
                  <div className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-800 font-mono">
                    <span>Dev Verification Code:</span>
                    <span className="font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                      {devOtpPreview}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit Verification Code (OTP) *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={resetOtp}
                    onChange={e => setResetOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full pl-9 pr-3 py-2 text-xs tracking-widest font-mono font-bold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showResetNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowResetNewPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5"
                    aria-label={showResetNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showResetNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showResetConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowResetConfirmPassword(prev => !prev)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5"
                    aria-label={showResetConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showResetConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  Resend Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalMode('login');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 4. REGISTER FORM */}
          {authModalMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Account Type / Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Account Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('CITIZEN');
                      setErrorMessage('');
                    }}
                    className={`py-2 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      role === 'CITIZEN'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-600/20'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-4 h-4 text-emerald-700" />
                    <span>Citizen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('STAFF');
                      setErrorMessage('');
                    }}
                    className={`py-2 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      role === 'STAFF'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-600/20'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span className="text-center leading-tight">Collection Staff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRole('ADMIN');
                      setErrorMessage('');
                    }}
                    className={`py-2 px-2 rounded-lg border text-xs font-semibold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      role === 'ADMIN'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-600/20'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              {/* Conditional Admin Security Clearance Key */}
              {role === 'ADMIN' && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                    <KeyRound className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Department Authorization Security Key *</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-tight">
                    Administrative registration is restricted to authorized municipal officers. Enter the government administrative key.
                  </p>
                  <div className="relative pt-1">
                    <input
                      type={showAdminKey ? 'text' : 'password'}
                      required
                      value={adminKey}
                      onChange={e => setAdminKey(e.target.value)}
                      placeholder="Enter Department Admin Key (e.g. SWMS-KA-ADMIN-2026)"
                      className="w-full pl-3 pr-10 py-2 text-xs border border-amber-400 bg-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowAdminKey(prev => !prev)}
                      className="absolute right-3 top-3.5 text-amber-600 hover:text-amber-800 focus:outline-none cursor-pointer"
                      aria-label={showAdminKey ? 'Hide key' : 'Show key'}
                    >
                      {showAdminKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Conditional Staff Conservancy Badge ID */}
              {role === 'STAFF' && (
                <div className="p-3 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold">
                    <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Waste Collection Staff Details *</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Staff Employee ID / Conservancy Badge Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={staffBadge}
                      onChange={e => setStaffBadge(e.target.value)}
                      placeholder="e.g. KA-BBMP-STF-104"
                      className="w-full px-3 py-2 text-xs border border-emerald-400 bg-white rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your legal name"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Password & Confirm Password with Show/Hide Eye Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-3 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowRegPassword(prev => !prev)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5"
                      aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-3 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowRegConfirmPassword(prev => !prev)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer p-0.5"
                      aria-label={showRegConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Karnataka Administrative Hierarchy */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Karnataka Residential Location Hierarchy
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[11px] text-slate-500 block">State</label>
                    <input
                      type="text"
                      disabled
                      value="Karnataka"
                      className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded text-slate-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">District *</label>
                    <select
                      value={district}
                      onChange={e => handleDistrictChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-emerald-600"
                    >
                      {districtsData.map(d => (
                        <option key={d.name} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">Taluk *</label>
                    <select
                      value={taluk}
                      onChange={e => handleTalukChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-emerald-600"
                    >
                      {currentDistObj?.taluks.map(t => (
                        <option key={t.name} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block">City / Corporation *</label>
                    <select
                      value={city}
                      onChange={e => handleCityChange(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-emerald-600"
                    >
                      {currentTalukObj?.cities.map(c => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-2">
                  <label className="text-[11px] text-slate-500 block">Ward / Locality *</label>
                  <select
                    value={ward}
                    onChange={e => setWard(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-emerald-600"
                  >
                    {currentCityObj?.wards.map(w => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-2">
                  <label className="text-[11px] text-slate-500 block">Street Address / House No.</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. #42, 6th Cross, 3rd Block"
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                />
                <label htmlFor="agreeTerms" className="text-[11px] text-slate-600 leading-tight cursor-pointer">
                  I agree to the Karnataka Municipal Solid Waste Management Rules and citizen participation guidelines.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading
                  ? 'Registering Account...'
                  : role === 'ADMIN'
                  ? 'Register as Administrator'
                  : role === 'STAFF'
                  ? 'Register as Collection Staff'
                  : 'Register as Citizen (+50 Eco-Points)'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
