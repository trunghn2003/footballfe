import axios from 'axios';

export const API_URL = 'https://api.football1.io.vn/api';

// Tạo instance axios với config mặc định
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Thêm interceptor để tự động thêm token vào headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
