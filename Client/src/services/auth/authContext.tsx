import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  logout: () => void;
  checkAuthStatus: () => void;
}

interface DecodedToken {
  sub: string; // usually email
  userId?: string; // check if this exists
  role?: string;
  exp?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("Decoded JWT:", decoded); // 🔍 Inspect what's inside
      setUser(decoded); // This user object will be available via useAuth()
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
      <AuthContext.Provider value={{ isAuthenticated, user, logout, checkAuthStatus }}>
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
