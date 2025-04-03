import api from '../config/api';

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary: string;
  thumbnail: string;
  published_at: string;
  author: string;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface NewsResponse {
  success: boolean;
  message: string | null;
  data: {
    news: NewsArticle[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
    }
  };
}

export interface NewsDetailResponse {
  success: boolean;
  message: string | null;
  data: NewsArticle;
}

export const newsService = {
  getLatestNews: async (page: number = 1) => {
    try {
      const response = await api.get<NewsResponse>('/news', {
        params: { page }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  },

  getNewsById: async (id: number) => {
    try {
      const response = await api.get<NewsDetailResponse>(`/news/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching news detail:', error);
      throw error;
    }
  }
};
