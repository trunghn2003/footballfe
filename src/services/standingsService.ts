import api from '../config/api';

export interface TeamStanding {
  id: number;
  competition_id: number;
  season_id: number;
  matchday: number;
  stage: string;
  type: string;
  group: string | null;
  team_id: number;
  position: number;
  played_games: number;
  form: string;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  created_at: string;
  updated_at: string;
  team: {
    id: number;
    area_id: number;
    name: string;
    short_name: string;
    tla: string;
    crest: string;
    address: string | null;
    website: string;
    founded: number;
    club_colors: string | null;
    venue: string;
    last_updated: string;
    created_at: string;
    updated_at: string;
  };
}

export interface StandingsResponse {
  success: boolean;
  message: string | null;
  data: TeamStanding[];
}

export const standingsService = {
  getStandings: async (competitionId: number): Promise<StandingsResponse> => {
    try {
      const response = await api.get<StandingsResponse>('/standings', {
        params: { competition_id: competitionId }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching standings:', error);
      throw error;
    }
  }
};
