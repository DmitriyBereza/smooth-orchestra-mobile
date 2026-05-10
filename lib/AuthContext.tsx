import React, { createContext, useContext, useEffect, useState } from 'react';
import { loadToken, loadServerUrl, saveToken, saveServerUrl, clearAll } from './auth';
import { configure, setOnUnauthorized, post, ApiError } from './api';
import type { LoginResponse } from './types';

interface AuthContextValue {
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (serverUrl: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const token = await loadToken();
        const serverUrl = await loadServerUrl();
        if (token && serverUrl) {
          configure(serverUrl, token);
          setIsAuthenticated(true);
        }
      } finally {
        setIsLoading(false);
      }
    }

    setOnUnauthorized(() => {
      signOut();
    });

    init();
  }, []);

  async function signIn(serverUrl: string, email: string, password: string): Promise<void> {
    // Configure with empty token for the login POST (no auth needed)
    configure(serverUrl, '');

    const response = await post<LoginResponse>('/api/mobile/auth/login', {
      username: email,
      password,
    });

    await saveToken(response.token);
    await saveServerUrl(serverUrl);
    configure(serverUrl, response.token);
    setIsAuthenticated(true);
  }

  async function signOut(): Promise<void> {
    await clearAll();
    configure('', '');
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
