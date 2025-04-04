import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, LoginCredentials, LoginResponse } from '../services/authService';
import api from '../config/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string, fcm_token?: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token khi khởi động ứng dụng
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, fcm_token?: string) => {
    try {
      const response = await authService.login(email, password, fcm_token);
      if (response.data.success) {
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.data.access_token);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.data.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register(name, email, password);
      if (response.data.success) {
        // Registration successful
      } else {
        throw new Error(response.data.message || 'Đăng ký thất bại');
      }
    } catch (error) {
      throw error;
    }
  };

  if (isLoading) {
    return null; // hoặc return một loading spinner
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
