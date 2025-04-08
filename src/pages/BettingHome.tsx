import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Paper,
  Skeleton
} from '@mui/material';
import { SportsSoccer, Casino, History } from '@mui/icons-material';
import { competitionService } from '../services/competitionService';
import bettingService from '../services/bettingService';
import teamService from '../services/teamService';
import { Team } from '../services/teamService';

interface UpcomingMatch {
  id: number;
  competition: {
    id: number;
    name: string;
    emblem: string;
  };
  utcDate: string;
  status: string;
  homeTeam: {
    id: number;
    name: string;
    crest: string;
  };
  awayTeam: {
    id: number;
    name: string;
    crest: string;
  };
}

interface BettingHistory {
  id: number;
  user_id: number;
  fixture_id: number;
  bet_type: 'WIN' | 'LOSS' | 'SCORE' | 'DRAW';
  predicted_score: {
    home: number;
    away: number;
  } | null;
  amount: number;
  odds: number;
  potential_win: number;
  status: 'PENDING' | 'WON' | 'LOST';
  result: string | null;
  created_at: string;
  updated_at: string;
  fixture: {
    id: number;
    competition_id: number;
    season_id: number;
    utc_date: string;
    status: string;
    matchday: number;
    stage: string;
    home_team_id: string;
    away_team_id: string;
    winner: string | null;
    duration: string;
    full_time_home_score: number | null;
    full_time_away_score: number | null;
  };
}

interface TeamCache {
  [key: string]: Team;
}

const BettingHome = () => {
  const [matches, setMatches] = useState<UpcomingMatch[]>([]);
  const [bettingHistory, setBettingHistory] = useState<BettingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teamCache, setTeamCache] = useState<TeamCache>({});
  const navigate = useNavigate();

  const fetchTeamInfo = async (teamId: string) => {
    if (teamCache[teamId]) return teamCache[teamId];

    try {
      const response = await teamService.getTeam(teamId);
      if (response?.data?.success) {
        const team = response.data.data;
        setTeamCache(prev => ({ ...prev, [teamId]: team }));
        return team;
      }
    } catch (err) {
      console.error(`Error fetching team ${teamId}:`, err);
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch upcoming matches
        const matchesResponse = await competitionService.getUpcomingMatches();
        if (matchesResponse?.data?.success && Array.isArray(matchesResponse.data.data?.fixtures)) {
          setMatches(matchesResponse.data.data.fixtures.map(fixture => {
            if (!fixture || typeof fixture !== 'object') {
              console.warn('Invalid fixture data:', fixture);
              return null;
            }

            return {
              id: fixture.id || 0,
              competition: {
                id: fixture.competition?.id || 0,
                name: fixture.competition?.name || 'Unknown Competition',
                emblem: fixture.competition?.emblem || ''
              },
              utcDate: fixture.utcDate || new Date().toISOString(),
              status: fixture.status || 'UNKNOWN',
              homeTeam: {
                id: fixture.homeTeam?.id || 0,
                name: fixture.homeTeam?.name || 'Unknown Team',
                crest: fixture.homeTeam?.crest || ''
              },
              awayTeam: {
                id: fixture.awayTeam?.id || 0,
                name: fixture.awayTeam?.name || 'Unknown Team',
                crest: fixture.awayTeam?.crest || ''
              }
            };
          }).filter(match => match !== null) as UpcomingMatch[]);
        } else {
          console.error('Invalid response format:', matchesResponse);
          setError('Không thể tải danh sách trận đấu - Dữ liệu không hợp lệ');
        }

        // Fetch betting history
        const historyResponse = await bettingService.getBettingHistory();
        if (historyResponse?.data?.success) {
          setBettingHistory(historyResponse.data.data);

          // Fetch team information for all unique teams
          const teamIds = new Set<string>();
          historyResponse.data.data.forEach(bet => {
            if (bet.fixture) {
              teamIds.add(bet.fixture.home_team_id);
              teamIds.add(bet.fixture.away_team_id);
            }
          });

          const teamPromises = Array.from(teamIds).map(id => fetchTeamInfo(id));
          await Promise.all(teamPromises);
        } else {
          console.error('Invalid betting history format:', historyResponse);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getBetTypeText = (type: string) => {
    switch (type) {
      case 'WIN':
        return 'Đội thắng';
      case 'LOSS':
        return 'Đội thua';
      case 'DRAW':
        return 'Hòa';
      case 'SCORE':
        return 'Tỷ số';
      default:
        return type;
    }
  };

  const getTeamName = (teamId: string) => {
    return teamCache[teamId]?.name || 'Đang tải...';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const getBetStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'success';
      case 'lost':
        return 'error';
      default:
        return 'warning';
    }
  };

  const getBetStatusText = (status: string) => {
    switch (status) {
      case 'won':
        return 'Thắng';
      case 'lost':
        return 'Thua';
      default:
        return 'Đang chờ';
    }
  };

  const getBetValueText = (bet: BettingHistory) => {
    if (bet.bet_type === 'SCORE' && bet.predicted_score) {
      return `${bet.predicted_score.home} - ${bet.predicted_score.away}`;
    }
    return '';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Casino sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Cá cược bóng đá
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Upcoming Matches Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SportsSoccer sx={{ mr: 1 }} />
                <Typography variant="h5">Trận đấu sắp diễn ra</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {matches.length === 0 ? (
                <Alert severity="info">Không có trận đấu nào sắp diễn ra</Alert>
              ) : (
                <Grid container spacing={3}>
                  {matches.map((match) => (
                    <Grid item xs={12} lg={6} key={match.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            {match.competition.emblem && (
                              <img
                                src={match.competition.emblem}
                                alt={match.competition.name}
                                style={{ width: 24, height: 24, marginRight: 8 }}
                              />
                            )}
                            <Typography variant="subtitle2" color="text.secondary">
                              {match.competition.name}
                            </Typography>
                          </Box>

                          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                            {formatDate(match.utcDate)}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Typography variant="body1" fontWeight="bold">
                                {match.homeTeam.name}
                              </Typography>
                              {match.homeTeam.crest && (
                                <img
                                  src={match.homeTeam.crest}
                                  alt={match.homeTeam.name}
                                  style={{ width: 40, height: 40, marginTop: 8 }}
                                />
                              )}
                            </Box>

                            <Box sx={{ mx: 2, textAlign: 'center' }}>
                              <Typography variant="h6">VS</Typography>
                            </Box>

                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                              <Typography variant="body1" fontWeight="bold">
                                {match.awayTeam.name}
                              </Typography>
                              {match.awayTeam.crest && (
                                <img
                                  src={match.awayTeam.crest}
                                  alt={match.awayTeam.name}
                                  style={{ width: 40, height: 40, marginTop: 8 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Casino />}
                            onClick={() => navigate(`/betting/${match.id}`)}
                          >
                            Đặt cược
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>

          {/* Betting History Section */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <History sx={{ mr: 1 }} />
                <Typography variant="h5">Lịch sử cá cược</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {bettingHistory.length === 0 ? (
                <Alert severity="info">Chưa có lịch sử cá cược</Alert>
              ) : (
                <Box>
                  {bettingHistory.map((bet) => (
                    <Card key={bet.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="subtitle1" color="text.secondary">
                            {formatDate(bet.created_at)}
                          </Typography>
                          <Chip
                            label={getBetStatusText(bet.status.toLowerCase())}
                            color={getBetStatusColor(bet.status.toLowerCase())}
                            size="small"
                          />
                        </Box>

                        <Box sx={{ mb: 2 }}>
                          <Typography variant="h6" gutterBottom>
                            {getTeamName(bet.fixture?.home_team_id || '')} vs {getTeamName(bet.fixture?.away_team_id || '')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Loại cược: {getBetTypeText(bet.bet_type)}
                            {bet.predicted_score && (
                              <span> ({bet.predicted_score.home} - {bet.predicted_score.away})</span>
                            )}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Số tiền cược:
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {formatMoney(bet.amount)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Tiền thắng:
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="success.main">
                              {formatMoney(bet.potential_win)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Tỷ lệ cược:
                            </Typography>
                            <Typography variant="body1" fontWeight="bold">
                              {bet.odds}
                            </Typography>
                          </Box>
                        </Box>

                        {bet.result && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              Kết quả: {bet.result}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BettingHome;
