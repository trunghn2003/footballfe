import api from '../config/api';
import { AxiosResponse } from 'axios';

export interface Ranking {
  id: number;
  name: string;
  email: string;
  net_winnings: string;
  gross_winnings: string;
  total_bet_amount: string;
  total_wins: string;
  total_losses: string;
  total_bets: number;
  win_rate: number;
  rank: number;
}

export interface RankingResponse {
  success: boolean;
  message: string | null;
  data: Ranking[];
}

const rankingService = {
  getRankings: async (): Promise<AxiosResponse<RankingResponse>> => {
    return api.get('/betting/rankings');
  }
};

export default rankingService;
