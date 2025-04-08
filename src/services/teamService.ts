import api from '../config/api';
import { AxiosResponse } from 'axios';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface TeamResponse {
  success: boolean;
  message: string | null;
  data: Team;
}

const teamService = {
  getTeam: async (id: string): Promise<AxiosResponse<TeamResponse>> => {
    return api.get(`/teams/${id}`);
  }
};

export default teamService;
