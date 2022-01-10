import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, PrimaryGoal } from '@/types/user';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storage';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string, goal?: PrimaryGoal) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true); // default true for immediate demo exploration
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function initSession() {
      try {
        await storageService.seedInitialDataIfFirstTime();
        const session = await authService.checkSession();
        if (session.isAuthenticated && session.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else {
          // If no token exists yet, provide demo user default
          const defaultUser = await storageService.getUserProfile();
          setUser(defaultUser);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn('[AuthProvider] Initialization error:', e);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    const res = await authService.login(email, pass);
    setIsLoading(false);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  };

  const register = async (name: string, email: string, pass: string, goal?: PrimaryGoal) => {
    setIsLoading(true);
    const res = await authService.register(name, email, pass, goal);
    setIsLoading(false);
    if (res.success && res.user) {
      setUser(res.user);
      setIsAuthenticated(true);
      return { success: true };
    }
    return { success: false, error: res.error || 'Registration failed' };
  };

  const logout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile: UserProfile = { ...user, ...updated };
    setUser(newProfile);
    await storageService.saveUserProfile(newProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
