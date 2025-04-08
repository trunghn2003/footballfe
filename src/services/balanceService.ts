import api from '../config/api';
import { AxiosResponse } from 'axios';

export interface Transaction {
  id: number;
  user_id: number;
  type: 'deposit' | 'withdraw' | 'bet' | 'win';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface BalanceResponse {
  success: boolean;
  message: string | null;
  data: {
    balance: number;
  };
}

export interface TransactionResponse {
  success: boolean;
  message: string | null;
  data: {
    transactions: Transaction[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

export interface DepositRequest {
  amount: number;
  description: string;
}

export interface WithdrawRequest {
  amount: number;
  description: string;
}

const balanceService = {
  getBalance: async (): Promise<AxiosResponse<BalanceResponse>> => {
    return api.get('/balance');
  },

  deposit: async (data: DepositRequest): Promise<AxiosResponse<any>> => {
    return api.post('/balance/deposit', data);
  },

  withdraw: async (data: WithdrawRequest): Promise<AxiosResponse<any>> => {
    return api.post('/balance/withdraw', data);
  },

  getTransactions: async (limit: number = 20): Promise<AxiosResponse<TransactionResponse>> => {
    return api.get(`/balance/transactions?limit=${limit}`);
  }
};

export default balanceService; 