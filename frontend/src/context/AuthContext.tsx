import React, { createContext, useState, useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode'; // Correction de l'importation

interface User {
  id: number;
  sub: string; // L'email de l'utilisateur
  firstname: string; // Le prénom de l'utilisateur
  lastname: string; // Le nom de l'utilisateur
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode<User>(token);
        setIsAuthenticated(true);
        setUser(decodedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    try {
      const decodedToken = jwtDecode<User>(token);
      setIsAuthenticated(true);
      setUser(decodedToken);
    } catch (error) {
      console.error("Failed to decode token on login:", error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
