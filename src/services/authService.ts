import api from '../config/api';
import axios from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
  // fcm_token?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    user: {
      id: number;
      name: string;
      email: string;
      created_at: string;
      updated_at: string;
    };
    token: string;
  };
}

export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>('/login', {
        email,
        password,
        // fcm_token: fcmToken,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<RegisterResponse>('/register', {
        name,
        email,
        password,
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
      }
      throw error;
    }
  },
};
