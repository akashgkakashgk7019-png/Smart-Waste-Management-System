import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';

export type AuthModalMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  register: (userData: any) => Promise<{ success: boolean; user?: UserProfile; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; token?: string; devOtp?: string; error?: string }>;
  verifyResetOtp: (email: string, otp: string, token?: string) => Promise<{ success: boolean; message?: string; token?: string; error?: string }>;
  resetPassword: (payload: { email: string; otp?: string; token?: string; newPassword: string; confirmPassword: string }) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: (initialMode?: AuthModalMode) => void;
  closeAuthModal: () => void;
  authModalMode: AuthModalMode;
  setAuthModalMode: (mode: AuthModalMode) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smartwaste_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('login');

  const fetchProfile = useCallback(async (jwtToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          Accept: 'application/json'
        }
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data && data.user) {
          setUser(data.user);
          return;
        }
      }
      // Token expired, invalid or non-JSON returned
      localStorage.removeItem('smartwaste_token');
      setToken(null);
      setUser(null);
    } catch (err) {
      console.error('Error fetching auth user profile:', err);
      localStorage.removeItem('smartwaste_token');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchProfile(token);
    } else {
      setIsLoading(false);
    }
  }, [token, fetchProfile]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      } else {
        const text = await res.text();
        console.warn('Non-JSON response from /api/auth/login:', res.status, text.slice(0, 80));
      }

      if (!res.ok) {
        const errorMessage =
          data?.error ||
          data?.message ||
          (res.status === 401
            ? 'Invalid email or password. Please verify your credentials.'
            : res.status === 404
            ? 'Authentication service not reachable. Please check connection.'
            : `Authentication failed (Status ${res.status}). Please try again.`);
        return { success: false, error: errorMessage };
      }

      if (!data || !data.token) {
        return {
          success: false,
          error: 'Authentication server did not return valid session tokens. Please retry.'
        };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('smartwaste_token', data.token);
      setIsAuthModalOpen(false);
      return { success: true, user: data.user };
    } catch (err: any) {
      console.error('Login exception:', err);
      const isJsonError = err?.message?.includes('JSON') || err?.message?.includes('token');
      return {
        success: false,
        error: isJsonError
          ? 'Server connection error. Please verify backend service and retry.'
          : err.message || 'Network connection failed during login.'
      };
    }
  };

  const register = async (userData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      } else {
        const text = await res.text();
        console.warn('Non-JSON response from /api/auth/register:', res.status, text.slice(0, 80));
      }

      if (!res.ok) {
        const errorMessage =
          data?.error ||
          data?.message ||
          (res.status === 409
            ? 'An account with this email or phone number is already registered.'
            : res.status === 403
            ? 'Administrative authorization required for Admin account registration.'
            : res.status === 404
            ? 'Registration API endpoint not found. Please verify server connection.'
            : `Registration failed (Status ${res.status}). Please check your input and try again.`);
        return { success: false, error: errorMessage };
      }

      if (!data || !data.token) {
        return {
          success: false,
          error: 'Registration server did not return valid session tokens. Please retry.'
        };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('smartwaste_token', data.token);
      return { success: true, user: data.user };
    } catch (err: any) {
      console.error('Registration exception:', err);
      const isJsonError = err?.message?.includes('JSON') || err?.message?.includes('token');
      return {
        success: false,
        error: isJsonError
          ? 'Server connection error: received invalid response format. Please verify server status and try again.'
          : err.message || 'Network connection failed during registration. Please try again.'
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        return {
          success: false,
          error:
            data?.error ||
            data?.message ||
            (res.status === 404
              ? 'No account was found registered with this email address.'
              : `Forgot password request failed (Status ${res.status}).`)
        };
      }

      return {
        success: true,
        message: data?.message || 'Password reset verification code has been dispatched.',
        token: data?.token,
        devOtp: data?.devOtp
      };
    } catch (err: any) {
      console.error('Forgot password exception:', err);
      return {
        success: false,
        error: err.message || 'Network error requesting password reset.'
      };
    }
  };

  const verifyResetOtp = async (email: string, otp: string, token?: string) => {
    try {
      const res = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ email, otp, token })
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        return {
          success: false,
          error: data?.error || 'Invalid or expired verification code.'
        };
      }

      return {
        success: true,
        message: data?.message || 'Code verified successfully.',
        token: data?.token
      };
    } catch (err: any) {
      console.error('Verify reset OTP exception:', err);
      return {
        success: false,
        error: err.message || 'Network error verifying code.'
      };
    }
  };

  const resetPassword = async (payload: {
    email: string;
    otp?: string;
    token?: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = null;

      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch {
          data = null;
        }
      }

      if (!res.ok) {
        return {
          success: false,
          error: data?.error || 'Failed to update password.'
        };
      }

      return {
        success: true,
        message: data?.message || 'Password has been updated successfully.'
      };
    } catch (err: any) {
      console.error('Reset password exception:', err);
      return {
        success: false,
        error: err.message || 'Network error resetting password.'
      };
    }
  };

  const logout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }).catch(() => {});
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('smartwaste_token');
  };

  const refreshUser = async () => {
    if (token) {
      await fetchProfile(token);
    }
  };

  const openAuthModal = (initialMode: AuthModalMode = 'login') => {
    setAuthModalMode(initialMode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        forgotPassword,
        verifyResetOtp,
        resetPassword,
        logout,
        refreshUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authModalMode,
        setAuthModalMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
