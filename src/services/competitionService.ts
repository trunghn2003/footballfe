import api from '../config/api';
import axios from 'axios';
import { AxiosResponse } from 'axios';

export interface Area {
  id: number;
  name: string;
  code: string | null;
  flag: string | null;
}

export interface Season {
  id: number;
  name: string | null;
  start: string | null;
  end: string | null;
  competitionName: string | null;
}

export interface Team {
  id: number;
  area_id: number;
  name: string;
  short_name: string | null;
  tla: string | null;
  crest: string | null;
  address: string | null;
  website: string | null;
  founded: number | null;
  club_colors: string | null;
  venue: string | null;
  last_updated: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
  area: {
    id: number;
    name: string;
    code: string | null;
    flag: string;
  };
  currentSeason: {
    id: number;
    name: string;
    start: string;
    end: string;
    competitionName: string;
  };
}

export interface CompetitionsResponse {
  success: boolean;
  message: string | null;
  data: {
    total: number;
    current_page: number;
    per_page: number;
    competitions: Competition[];
  };
}

export interface CompetitionDetailResponse {
  success: boolean;
  message: string | null;
  data: Competition;
}

export interface TeamsResponse {
  success: boolean;
  message: string | null;
  data: {
    teams: Team[];
  };
}

export interface Score {
  winner: string | null;
  duration: string;
  fullTime: {
    home: number | null;
    away: number | null;
  };
  halfTime: {
    home: number | null;
    away: number | null;
  };
  extraTime: {
    home: number | null;
    away: number | null;
  };
  penalties: {
    home: number | null;
    away: number | null;
  };
}

export interface Fixture {
  id: number;
  competition: Competition;
  utcDate: string;
  status: string;
  matchday: number;
  stage: string;
  group: string | null;
  homeTeam: Team | null;
  awayTeam: Team | null;
  score: Score;
}

export interface FixturesResponse {
  success: boolean;
  message: string | null;
  data: {
    fixtures: Fixture[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
    };
  };
}

export interface MatchDetailResponse {
  success: boolean;
  message: string | null;
  data: {
    fixture: {
      id: number;
      competition: {
        id: number;
        name: string;
        code: string;
        type: string;
        emblem: string;
        area: {
          id: number;
          name: string;
          code: string | null;
          flag: string;
        };
        currentSeason: {
          id: number;
          name: string;
          start: string;
          end: string;
          competitionName: string;
        };
      };
      utcDate: string;
      status: string;
      matchday: number;
      stage: string;
      group: string | null;
      homeTeam: any | null;
      awayTeam: any | null;
      score: {
        winner: string | null;
        duration: string;
        fullTime: {
          home: number | null;
          away: number | null;
        };
        halfTime: {
          home: number | null;
          away: number | null;
        };
        extraTime: {
          home: number | null;
          away: number | null;
        };
        penalties: {
          home: number | null;
          away: number | null;
        };
      };
    };
    home_lineup: {
      formation: string;
      startXI: {
        [key: string]: {
          id: number;
          position: string | null;
          name: string;
          shirt_number: number;
          is_substitute: number;
          grid?: string;
        };
      };
      sub: {
        [key: string]: {
          id: number;
          position: string | null;
          name: string;
          shirt_number: number;
          is_substitute: number;
        };
      };
    };
    away_lineup: {
      formation: string;
      startXI: {
        [key: string]: {
          id: number;
          position: string | null;
          name: string;
          shirt_number: number;
          is_substitute: number;
          grid?: string;
        };
      };
      sub: {
        [key: string]: {
          id: number;
          position: string | null;
          name: string;
          shirt_number: number;
          is_substitute: number;
        };
      };
    };
  };
}

export interface FeaturedCompetitionsResponse {
  success: boolean;
  message: string | null;
  data: {
    competitions: Competition[];
    total: number;
  };
}

export const competitionService = {
  getCompetitions: async (page: number = 1, name?: string) => {
    try {
      const response = await api.get<CompetitionsResponse>('/competitions', {
        params: {
          page,
          name,
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách giải đấu');
      }
      throw error;
    }
  },

  getCompetitionDetail: async (id: number) => {
    try {
      const response = await api.get<CompetitionDetailResponse>(`/competitions/${id}`);
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy thông tin giải đấu');
      }
      throw error;
    }
  },

  getTeamsByCompetition: async (competitionId: number) => {
    try {
      const response = await api.get<TeamsResponse>('/teams', {
        params: {
          competition_id: competitionId,
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy danh sách đội bóng');
      }
      throw error;
    }
  },

  getFixtureByDate: async (competitionId: number, page: number = 1, dateFrom?: string, dateTo?: string) => {
    try {
      const response = await api.get<FixturesResponse>(`/fixtures/competition/season`, {
        params: {
          competition: competitionId,
          page,
          dateFrom,
          dateTo,
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch thi đấu');
      }
      throw error;
    }
  },
  getFixtures: async (competitionId: number, page: number = 1, dateFrom?: string, dateTo?: string) => {
    try {
      const response = await api.get<FixturesResponse>(`/fixtures`, {
        params: {
          competition_id: competitionId,
          page,
          dateFrom,
          dateTo,
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Lỗi khi lấy lịch thi đấu');
      }
      throw error;
    }
  },

  getMatchDetail: async (fixtureId: number): Promise<AxiosResponse<MatchDetailResponse>> => {
    return api.get(`/fixtures/${fixtureId}`);
  },

  getFeaturedCompetitions: async (): Promise<FeaturedCompetitionsResponse> => {
    const response = await api.get<FeaturedCompetitionsResponse>('/featured/competitions');
    return response.data;
  },

  getCompetitionById: async (id: number): Promise<Competition> => {
    const response = await api.get<{ data: Competition }>(`/competitions/${id}`);
    return response.data.data;
  }
};
