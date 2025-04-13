import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  LinearProgress,
  Chip,
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating
} from '@mui/material';
import { ArrowBack, Casino, SportsSoccer, Person } from '@mui/icons-material';
import { competitionService } from '../services/competitionService';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import MatchPrediction from "../components/match/MatchPrediction"
import FormationDisplay from "../components/match/FormationDisplay"

interface StatisticItem {
  name: string;
  home: string;
  away: string;
  compareCode: number;
  statisticsType: string;
  valueType: string;
  homeValue: number;
  awayValue: number;
  homeTotal: number | null;
  awayTotal: number | null;
  renderType: number;
  key: string;
}

interface StatisticGroup {
  groupName: string;
  statisticsItems: StatisticItem[];
}

interface StatisticPeriod {
  period: string;
  groups: StatisticGroup[];
}

interface PlayerStatistics {
  goals?: number;
  assists?: number;
  rating?: number;
  minutesPlayed?: number;
  touches?: number;
  passes?: number;
  accuratePass?: number;
  keyPass?: number;
  totalTackle?: number;
  interceptionWon?: number;
  duelWon?: number;
  duelLost?: number;
  dispossessed?: number;
  fouls?: number;
  wasFouled?: number;
  saves?: number;
  [key: string]: any;
}

interface Player {
  id: number;
  name: string;
  position: string | null;
  shirt_number: number;
  is_substitute: number;
  grid?: string;
  statistics: PlayerStatistics;
}

interface TeamLineup {
  formation: string;
  startXI: { [key: string]: Player };
  sub: { [key: string]: Player };
}

interface LineupData {
  home_lineup: TeamLineup;
  away_lineup: TeamLineup;
}

interface MatchDetail {
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
  statistics: any[];
}

interface ApiResponse {
  success: boolean;
  data: {
    fixture: any;
    statistics: any[];
    home_lineup?: TeamLineup;
    away_lineup?: TeamLineup;
  };
  message?: string;
}

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);
  const [lineup, setLineup] = useState<LineupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        setLoading(true);

        const [matchResponse, lineupResponse] = await Promise.all([
          competitionService.getMatchDetail(parseInt(id)),
          competitionService.getMatchLineup(parseInt(id))
        ]);

        if (matchResponse.data.success) {
          const responseData = matchResponse.data.data as ApiResponse['data'];
          const matchDetailData: MatchDetail = {
            fixture: responseData.fixture,
            statistics: responseData.statistics || []
          };
          setMatchDetail(matchDetailData);
        }

        if (lineupResponse.data.success) {
          setLineup(lineupResponse.data.data);
        }
      } catch (err) {
        console.error('API Error:', err);
        setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !matchDetail) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error">{error || 'Match not found'}</Typography>
      </Container>
    );
  }

  const { fixture, statistics } = matchDetail;

  const isUpcoming = fixture.status === 'SCHEDULED' || fixture.status === 'TIMED';
  const matchDate = new Date(fixture.utcDate);

  const renderScore = () => {
    if (fixture.score.fullTime.home !== null && fixture.score.fullTime.away !== null) {
      return (
        <Typography variant="h4" fontWeight="bold">
          {fixture.score.fullTime.home} - {fixture.score.fullTime.away}
        </Typography>
      );
    }
    return <Typography variant="h4" fontWeight="bold">vs</Typography>;
  };

  const renderMatchStats = () => {
    if (!matchDetail?.statistics || matchDetail.statistics.length === 0) {
      return null;
    }

    const currentPeriodStats = matchDetail.statistics.find(s => s.period === selectedPeriod);
    if (!currentPeriodStats) return null;

    return (
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedPeriod}
            onChange={(_, newValue) => setSelectedPeriod(newValue)}
            variant="fullWidth"
          >
            <Tab label="Toàn trận" value="ALL" />
            <Tab label="Hiệp 1" value="1ST" />
            <Tab label="Hiệp 2" value="2ND" />
          </Tabs>
        </Box>

        {currentPeriodStats.groups.map((group: StatisticGroup, groupIndex: number) => (
          <Box key={groupIndex} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              {group.groupName}
            </Typography>
            <Box sx={{ mt: 2 }}>
              {group.statisticsItems.map((stat: StatisticItem, index: number) => {
                const total = stat.homeValue + stat.awayValue;
                const homePercent = total === 0 ? 50 : (stat.homeValue / total) * 100;
                const awayPercent = total === 0 ? 50 : (stat.awayValue / total) * 100;

                return (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Grid container alignItems="center" spacing={2}>
                      {/* Home team stat */}
                      <Grid item xs={2} sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight="bold" color={stat.compareCode === 1 ? 'primary.main' : 'text.primary'}>
                          {stat.home}
                        </Typography>
                      </Grid>

                      {/* Progress bars */}
                      <Grid item xs={8}>
                        <Typography variant="body2" align="center" gutterBottom>
                          {stat.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ flex: 1, transform: 'scaleX(-1)' }}>
                            <LinearProgress
                              variant="determinate"
                              value={homePercent}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: stat.statisticsType === 'positive' ? '#2196f3' : '#ff9800',
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={awayPercent}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: stat.statisticsType === 'positive' ? '#4caf50' : '#f44336',
                                  borderRadius: 4,
                                },
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>

                      {/* Away team stat */}
                      <Grid item xs={2}>
                        <Typography variant="body2" fontWeight="bold" color={stat.compareCode === 2 ? 'primary.main' : 'text.primary'}>
                          {stat.away}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Paper>
    );
  };

  const renderPlayerStats = (player: Player) => {
    if (!player.statistics || Object.keys(player.statistics).length === 0) {
      return null;
    }

    const stats = player.statistics;
    return (
      <>
        {stats.rating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={stats.rating / 2} precision={0.1} readOnly size="small" />
            <Typography variant="body2">({stats.rating})</Typography>
          </Box>
        )}
        <Typography variant="body2" color="text.secondary">
          {stats.minutesPlayed}' |
          {stats.goals ? ` ${stats.goals} goals |` : ''}
          {stats.assists ? ` ${stats.assists} assists |` : ''}
          {stats.keyPass ? ` ${stats.keyPass} key passes |` : ''}
          {stats.saves ? ` ${stats.saves} saves` : ''}
        </Typography>
      </>
    );
  };

  const renderLineups = () => {
    if (!lineup) return null;

    return (
      <Paper sx={{ p: 3, mt: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab label="Formation" />
            <Tab label="Player List" />
          </Tabs>
        </Box>

        {activeTab === 0 ? (
          <FormationDisplay
            homeLineup={lineup.home_lineup}
            awayLineup={lineup.away_lineup}
          />
        ) : (
          <Grid container spacing={3}>
            {/* Home Team */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                {matchDetail?.fixture.homeTeam?.name} ({lineup.home_lineup.formation})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Stats</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(activeTab === 0 ? lineup.home_lineup.startXI : lineup.home_lineup.sub)
                      .sort((a, b) => (a.grid || '').localeCompare(b.grid || ''))
                      .map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>{player.shirt_number}</TableCell>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.position || '-'}</TableCell>
                          <TableCell>{renderPlayerStats(player)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            {/* Away Team */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom color="primary">
                {matchDetail?.fixture.awayTeam?.name} ({lineup.away_lineup.formation})
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Player</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell>Stats</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(activeTab === 0 ? lineup.away_lineup.startXI : lineup.away_lineup.sub)
                      .sort((a, b) => (a.grid || '').localeCompare(b.grid || ''))
                      .map((player) => (
                        <TableRow key={player.id}>
                          <TableCell>{player.shirt_number}</TableCell>
                          <TableCell>{player.name}</TableCell>
                          <TableCell>{player.position || '-'}</TableCell>
                          <TableCell>{renderPlayerStats(player)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </Paper>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        {isUpcoming && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Casino />}
            onClick={() => navigate(`/betting/${id}`)}
          >
            Đặt cược
          </Button>
        )}
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {fixture.competition.name}
          </Typography>

          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Chip
              label={isUpcoming ? 'Upcoming Match' : fixture.status}
              color={isUpcoming ? "info" : "default"}
              sx={{ mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              {matchDate.toLocaleDateString()} • {matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={4} textAlign="center">
              <Typography variant="h5" gutterBottom>
                {fixture.homeTeam?.name || 'TBD'}
              </Typography>
              {fixture.homeTeam?.crest && (
                <img
                  src={fixture.homeTeam.crest}
                  alt={fixture.homeTeam.name}
                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                />
              )}
            </Grid>

            <Grid item xs={12} md={4} textAlign="center">
              {renderScore()}
            </Grid>

            <Grid item xs={12} md={4} textAlign="center">
              <Typography variant="h5" gutterBottom>
                {fixture.awayTeam?.name || 'TBD'}
              </Typography>
              {fixture.awayTeam?.crest && (
                <img
                  src={fixture.awayTeam.crest}
                  alt={fixture.awayTeam.name}
                  style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                />
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {renderMatchStats()}
      {renderLineups()}

      {isUpcoming && id && (
        <MatchPrediction
          matchId={id}
          onWinProbabilityChange={(probability) => {
            console.log('Win probability changed:', probability);
          }}
        />
      )}
    </Container>
  );
};

export default MatchDetail;
