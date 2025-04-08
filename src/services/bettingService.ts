import api from '../config/api';
import { AxiosResponse } from 'axios';

export interface Bet {
  id: number;
  user_id: number;
  fixture_id: number;
  bet_type: 'WIN' | 'DRAW' | 'LOSS' | 'SCORE';
  predicted_score?: {
    home: number;
    away: number;
  };
  amount: number;
  odds: number;
  potential_win: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'CANCELLED';
  result: string | null;
  created_at: string;
  updated_at: string;
  fixture?: {
    id: number;
    competition_id: number;
    season_id: number;
    utc_date: string;
    status: string;
    matchday: number;
    stage: string;
    group: string | null;
    last_updated: string;
    home_team_id: string;
    away_team_id: string;
    winner: string | null;
    duration: string;
    full_time_home_score: number | null;
    full_time_away_score: number | null;
    half_time_home_score: number | null;
    half_time_away_score: number | null;
    extra_time_home_score: number | null;
    extra_time_away_score: number | null;
    penalties_home_score: number | null;
    penalties_away_score: number | null;
    venue: string | null;
    created_at: string;
    updated_at: string;
  };
}

export interface BettingHistoryResponse {
  success: boolean;
  message: string | null;
  data: Bet[];
}

export interface PlaceBetRequest {
  fixture_id: number;
  bet_type: 'WIN' | 'DRAW' | 'LOSS' | 'SCORE';
  amount: number;
  predicted_score?: {
    home: number;
    away: number;
  };
}

const bettingService = {
  placeBet: async (data: PlaceBetRequest): Promise<AxiosResponse<any>> => {
    return api.post('/betting/place-bet', data);
  },

  getBettingHistory: async (page: number = 1): Promise<AxiosResponse<BettingHistoryResponse>> => {
    return api.get('/betting/history', {
      params: { page }
    });
  },

  processBetResults: async (fixtureId: number): Promise<AxiosResponse<any>> => {
    return api.post(`/betting/process-results/${fixtureId}`);
  }
};

export default bettingService;
