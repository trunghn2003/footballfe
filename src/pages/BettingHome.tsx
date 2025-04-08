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
  Paper
} from '@mui/material';
import { SportsSoccer, Casino, History } from '@mui/icons-material';
import { competitionService } from '../services/competitionService';
import bettingService from '../services/bettingService';

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

const BettingHome = () => {
  const [matches, setMatches] = useState<UpcomingMatch[]>([]);
  const [bettingHistory, setBettingHistory] = useState<BettingHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const transformBettingHistory = (apiData: any[]): BettingHistory[] => {
    return apiData.map(bet => ({
      ...bet,
      predicted_score: bet.predicted_score || null
    }));
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
          setBettingHistory(transformBettingHistory(historyResponse.data.data));
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

  const getBetTypeText = (type: string) => {
    switch (type) {
      case 'WIN':
        return 'Đội thắng';
      case 'LOSS':
        return 'Đội thua';
      case 'SCORE':
        return 'Tỷ số';
      default:
        return type;
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
                        <Typography variant="subtitle1" gutterBottom>
                          Trận {bet.fixture.home_team_id} vs {bet.fixture.away_team_id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                          {formatDate(bet.created_at)}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            Loại cược: {getBetTypeText(bet.bet_type)}
                          </Typography>
                          {bet.bet_type === 'SCORE' && (
                            <Typography variant="body2">
                              Dự đoán: {getBetValueText(bet)}
                            </Typography>
                          )}
                          <Typography variant="body2">
                            Số tiền: {formatMoney(bet.amount)}
                          </Typography>
                          <Typography variant="body2">
                            Tỷ lệ cược: {bet.odds}
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            Tiền thắng: {formatMoney(bet.potential_win)}
                          </Typography>
                          {bet.result && (
                            <Typography variant="body2" color="text.secondary">
                              Kết quả: {bet.result}
                            </Typography>
                          )}
                        </Box>
                        <Box sx={{ mt: 2 }}>
                          <Chip
                            label={getBetStatusText(bet.status.toLowerCase())}
                            color={getBetStatusColor(bet.status.toLowerCase())}
                            size="small"
                          />
                        </Box>
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
