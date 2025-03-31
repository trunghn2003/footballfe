import api from '../config/api';
import axios from 'axios';

export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string | null;
  created_at: string;
  updated_at: string;
}

export interface AreasResponse {
  success: boolean;
  message: string | null;
  data: {
    total: number;
    current_page: number;
    per_page: number;
    areas: Area[];
  };
}

export interface AreaResponse {
  success: boolean;
  message: string | null;
  data: Area;
}

export const areaService = {
  getAreas: async (page: number = 1, name?: string) => {
    try {
      const response = await api.get<AreasResponse>('/areas', {
        params: {
          page,
          name: name || undefined,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Không thể tải danh sách khu vực');
      }
      throw error;
    }
  },

  getAreaById: async (id: number) => {
    try {
      const response = await api.get<AreaResponse>(`/areas/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Không thể tải thông tin khu vực');
      }
      throw error;
    }
  },
};
