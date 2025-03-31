import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { competitionService } from '../services/competitionService';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FormationDisplay from '../components/match/FormationDisplay';

interface Player {
  id: number;
  position: string | null;
  name: string;
  shirt_number: number;
  is_substitute: number;
  grid?: string;
}

interface Lineup {
  formation: string;
  startXI: {
    [key: string]: Player;
  };
  sub: {
    [key: string]: Player;
  };
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
  home_lineup: Lineup;
  away_lineup: Lineup;
}

const MatchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatchDetail = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const response = await competitionService.getMatchDetail(parseInt(id));
        if (response.data.success) {
          setMatchDetail(response.data.data);
        } else {
          setError(response.data.message || 'Không thể tải thông tin trận đấu');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetail();
  }, [id]);

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

  if (!matchDetail) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Không tìm thấy thông tin trận đấu
        </Alert>
      </Container>
    );
  }

  const { fixture, home_lineup, away_lineup } = matchDetail;

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

  const renderLineup = (lineup: Lineup, isHome: boolean) => {
    const players = Object.values(lineup.startXI);
    const substitutes = Object.values(lineup.sub);

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          {isHome ? 'Đội nhà' : 'Đội khách'} - Sơ đồ {lineup.formation}
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Số</TableCell>
                <TableCell>Vị trí</TableCell>
                <TableCell>Cầu thủ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.shirt_number}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Dự bị
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Số</TableCell>
                <TableCell>Cầu thủ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {substitutes.map((player) => (
                <TableRow key={player.id}>
                  <TableCell>{player.shirt_number}</TableCell>
                  <TableCell>{player.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {/* Header Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src={fixture.competition.emblem}
              alt={fixture.competition.name}
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <Box>
              <Typography variant="h4" gutterBottom>
                {fixture.competition.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Vòng {fixture.matchday} - {fixture.stage}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Match Info */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6">
                  {fixture.homeTeam?.name || 'TBD'}
                </Typography>
                {fixture.homeTeam?.crest && (
                  <img
                    src={fixture.homeTeam.crest}
                    alt={fixture.homeTeam.name}
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                {renderScore()}
                <Typography variant="subtitle1" color="text.secondary">
                  {new Date(fixture.utcDate).toLocaleString('vi-VN', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}
                </Typography>
                <Chip
                  label={fixture.status}
                  color={fixture.status === 'FINISHED' ? 'success' : 'primary'}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="h6">
                  {fixture.awayTeam?.name || 'TBD'}
                </Typography>
                {fixture.awayTeam?.crest && (
                  <img
                    src={fixture.awayTeam.crest}
                    alt={fixture.awayTeam.name}
                    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Lineups */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom display="flex" alignItems="center" gap={1}>
            <SportsSoccerIcon />
            Đội hình thi đấu
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Formation Display */}
          <FormationDisplay
            homeLineup={home_lineup}
            awayLineup={away_lineup}
          />

          {/* Detailed Lineups */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {renderLineup(home_lineup, true)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderLineup(away_lineup, false)}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default MatchDetail;
