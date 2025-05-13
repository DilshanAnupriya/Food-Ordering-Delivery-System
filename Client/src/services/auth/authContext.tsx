import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {jwtDecode} from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  logout: () => void;
  checkAuthStatus: () => void;
  getToken: () => string | null;
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
      console.log("Decoded JWT:", decoded);
      setUser(decoded);

      // Save userId separately
      if (decoded && decoded.userId) {
        localStorage.setItem('userId', decoded.userId);
      } else if (decoded && decoded.sub) {
        localStorage.setItem('userId', decoded.sub); // fallback to email
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('userId'); // Clean up just in case
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // 👈
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("restaurantId");
    sessionStorage.removeItem("orderDetails");
    sessionStorage.removeItem("orderDetail");
    sessionStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    setUser(null);
  };

  const getToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
      <AuthContext.Provider value={{ isAuthenticated, user, logout, checkAuthStatus,getToken }}>
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
