import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.football1.io.vn',
});

// Request interceptor - thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - xử lý lỗi token hết hạn
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Kiểm tra nếu là lỗi 500 và message là token hết hạn
      if (
        error.response.status === 500 &&
        error.response.data?.errors === "Token has expired"
      ) {
        // Xóa token và thông tin user
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Chuyển hướng về trang login và thêm thông báo
        const currentPath = window.location.pathname;
        window.location.href = `/login?expired=true&redirect=${encodeURIComponent(currentPath)}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
