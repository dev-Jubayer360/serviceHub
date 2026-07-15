'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'provider' | 'admin';
  image?: string;
  phone?: string;
  provider?: string;
  token?: string;
  rating?: number;
  address?: any;
  addresses?: {
    city?: string;
    isDefault?: boolean;
    [key: string]: any;
  }[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for user data on initial load
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUserStr = localStorage.getItem('user');

      if (storedToken && storedUserStr) {
        try {
          const storedUser = JSON.parse(storedUserStr);
          setToken(storedToken);
          setUser(storedUser);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    if (userData.token) {
      setToken(userData.token);
      localStorage.setItem('token', userData.token);
    }
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    // Call backend logout first while token is still in localStorage
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
      <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
