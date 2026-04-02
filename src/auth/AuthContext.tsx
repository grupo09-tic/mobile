import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from './authStore';
import { LoginCredentials, UserFromApi } from './authService';

interface AuthContextType {
  user: UserFromApi | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (credentials: any) => Promise<void>;
  updatePassword: (credentials: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useAuthStore();

  useEffect(() => {
    authState.initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro do AuthProvider');
  }
  return context;
}
