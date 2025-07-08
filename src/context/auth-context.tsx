
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = (userData: User, token: string) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(token);
    // In a real app, you'd store the token securely (e.g., in an httpOnly cookie)
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    // Clear the token from storage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
