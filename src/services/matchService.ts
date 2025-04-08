import { api } from './api';
import { AxiosResponse } from 'axios';
import { MatchDetailResponse, FixturesResponse } from './competitionService';

export interface MatchPredictionResponse {
  success: boolean;
  message: string | null;
  data: {
    prediction: {
      winProbability: {
        home: number;
        draw: number;
        away: number;
      };
      predictedScore: {
        home: number;
        away: number;
      };
      keyFactors: string[];
      headToHead: {
        total: number;
        homeWins: number;
        awayWins: number;
        draws: number;
      };
      recentForm: {
        home: {
          matches: number;
          wins: number;
          draws: number;
          losses: number;
          goalsFor: number;
          goalsAgainst: number;
        };
        away: {
          matches: number;
          wins: number;
          draws: number;
          losses: number;
          goalsFor: number;
          goalsAgainst: number;
        };
      };
    };
  };
}

export const matchService = {
  getMatchDetail: async (fixtureId: number): Promise<AxiosResponse<MatchDetailResponse>> => {
    return api.get(`/fixtures/${fixtureId}`);
  },

  getMatchPrediction: async (fixtureId: number): Promise<MatchPredictionResponse> => {
    const response = await api.get<MatchPredictionResponse>(`/fixtures/${fixtureId}/prediction`);
    return response.data;
  },

  getUpcomingMatches: async (page: number = 1, dateFrom?: string, dateTo?: string): Promise<FixturesResponse> => {
    const response = await api.get<FixturesResponse>('/fixtures', {
      params: {
        page,
        dateFrom,
        dateTo,
      },
    });
    return response.data;
  },

  getLiveMatches: async (): Promise<FixturesResponse> => {
    const response = await api.get<FixturesResponse>('/fixtures/live');
    return response.data;
  },

  getMatchStatistics: async (fixtureId: number) => {
    const response = await api.get(`/fixtures/${fixtureId}/statistics`);
    return response.data;
  },

  getMatchLineups: async (fixtureId: number) => {
    const response = await api.get(`/fixtures/${fixtureId}/lineups`);
    return response.data;
  },

  getMatchEvents: async (fixtureId: number) => {
    const response = await api.get(`/fixtures/${fixtureId}/events`);
    return response.data;
  },

  getMatchH2H: async (fixtureId: number) => {
    const response = await api.get(`/fixtures/${fixtureId}/h2h`);
    return response.data;
  }
}; 