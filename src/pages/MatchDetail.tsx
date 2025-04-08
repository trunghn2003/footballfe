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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { competitionService } from '../services/competitionService';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import FormationDisplay from '../components/match/FormationDisplay';
import MatchPrediction from "../components/match/MatchPrediction"

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
  const navigate = useNavigate();
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

  const { fixture, home_lineup, away_lineup } = matchDetail;

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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

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
              {isUpcoming ? (
                <Typography variant="h4">VS</Typography>
              ) : renderScore()}
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
      
      {isUpcoming && <MatchPrediction matchId={id!} />}

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
    </Container>
  );
};

export default MatchDetail;
