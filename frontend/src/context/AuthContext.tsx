import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '../services/api';
// Correction de la syntaxe d'importation pour jwt-decode (importation par défaut)
import jwtDecode from 'jwt-decode';

// 1. Définition des types
interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  sub: string; 
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (details: any) => Promise<void>;
  logout: () => void;
}

// 2. Création et EXPORTATION du contexte
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Création du Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      try {
        const decodedToken: User = jwtDecode(token);
        
        // @ts-ignore
        if (decodedToken.exp * 1000 > Date.now()) {
          setUser(decodedToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          logout();
        }
      } catch (error) {
        console.error("Invalid token found in storage", error);
        logout();
      }
    }
  }, [token]);

  const login = async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
  };

  const register = async (details: any) => {
    const response = await api.post('/auth/register', details);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setToken(token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. Hook personnalisé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
