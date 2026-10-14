import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  signInWithGooglePopup,
  loginWithEmail,
  registerWithEmail,
  signOutFromFirebase,
  onAuthChange,
} from '../lib/firebase';

const ADMIN_SESSION_KEY = 'jatriq_admin_session';

const ADMIN_EMAILS_ENV = import.meta.env.VITE_ADMIN_EMAILS || '';
const ADMIN_WHITELIST = ADMIN_EMAILS_ENV
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

export const checkIsAdminEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  // Fail-closed: an empty or missing whitelist must never grant admin access
  if (ADMIN_WHITELIST.length === 0) return false;
  return ADMIN_WHITELIST.includes(normalized);
};

interface AdminAuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  authLoading: boolean;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmailPass: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmailPass: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  login: (username: string, pass: string) => { success: boolean; error?: string };
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isDemoAuth, setIsDemoAuth] = useState<boolean>(() => {
    // Strictly restrict demo authentication to development mode
    if (!import.meta.env.DEV) return false;
    try {
      return sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setCurrentUser(user);
      if (user) {
        const isAuthorized = checkIsAdminEmail(user.email);
        setIsAdmin(isAuthorized);
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsub();
  }, []);

  // Google Sign In
  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = await signInWithGooglePopup();
      const isAuthorized = checkIsAdminEmail(user.email);
      if (!isAuthorized) {
        return {
          success: false,
          error: `Account (${user.email}) is not authorized for Admin access. Contact the agency administrator.`,
        };
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      return { success: false, error: err.message || 'Google sign-in failed' };
    }
  };

  // Email/Password Login
  const loginWithEmailPass = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = await loginWithEmail(email.trim(), pass);
      const isAuthorized = checkIsAdminEmail(user.email);
      if (!isAuthorized) {
        return {
          success: false,
          error: `Account (${user.email}) is not authorized for Admin access.`,
        };
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Email sign-in error:', err);
      return { success: false, error: err.message || 'Invalid credentials or user not found' };
    }
  };

  // Email/Password Registration
  const registerWithEmailPass = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const user = await registerWithEmail(email.trim(), pass);
      const isAuthorized = checkIsAdminEmail(user.email);
      if (!isAuthorized) {
        return {
          success: false,
          error: `Account created for ${user.email}, but this email is not on the admin whitelist.`,
        };
      }
      return { success: true };
    } catch (err: any) {
      console.warn('Email registration error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  // Demo Login (Explicitly restricted to local development only)
  const login = (username: string, pass: string): { success: boolean; error?: string } => {
    if (!import.meta.env.DEV) {
      return {
        success: false,
        error: 'Demonstration login is disabled in production. Please sign in with an authorized administrator account.',
      };
    }
    if (username.trim() === 'admin' && pass.trim() === 'admin') {
      setIsDemoAuth(true);
      try {
        sessionStorage.setItem(ADMIN_SESSION_KEY, 'true');
      } catch {
        // ignore
      }
      return { success: true };
    }
    return {
      success: false,
      error: 'Invalid demonstration credentials. Use username: "admin" and password: "admin".',
    };
  };

  // Unified Logout
  const logout = async () => {
    setIsDemoAuth(false);
    setIsAdmin(false);
    setCurrentUser(null);
    try {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
    } catch {
      // ignore
    }
    try {
      await signOutFromFirebase();
    } catch (err) {
      console.warn('Signout error:', err);
    }
  };

  const isAuthenticated = (import.meta.env.DEV && isDemoAuth) || (Boolean(currentUser) && isAdmin);

  return (
    <AdminAuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        isAdmin,
        authLoading,
        loginWithGoogle,
        loginWithEmailPass,
        registerWithEmailPass,
        login,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
