import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, CircularProgress, Alert } from '@mui/material';
import BettingForm from '../components/betting/BettingForm';
import BettingHistory from '../components/betting/BettingHistory';
import MatchPrediction from '../components/match/MatchPrediction';
import { matchService } from '../services/matchService';
import { MatchDetailResponse } from '../services/competitionService';

const Betting = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [winProbability, setWinProbability] = useState<WinProbability>({
    home: 33.33,
    draw: 33.33,
    away: 33.33
  });

  useEffect(() => {
    const fetchMatch = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await matchService.getMatchDetail(parseInt(id));
        if (response.data.success) {
          // Lấy thông tin trận đấu từ response
          const matchData = response.data.data;
          setMatch({
            home_team: matchData.fixture.homeTeam?.name || 'TBD',
            away_team: matchData.fixture.awayTeam?.name || 'TBD',
            fixture: matchData.fixture
          });
        } else {
          setError('Không thể tải thông tin trận đấu');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải thông tin trận đấu');
        console.error('Error fetching match:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
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

  if (!match) {
    return (
      <Container>
        <Alert severity="info" sx={{ mt: 2 }}>
          Không tìm thấy thông tin trận đấu
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Đặt cược: {match.home_team} vs {match.away_team}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <MatchPrediction
              matchId={id || '0'}
              onWinProbabilityChange={setWinProbability}
            />
            <Box sx={{ mt: 3 }}>
              <BettingForm
                fixtureId={parseInt(id || '0')}
                homeTeam={match.home_team}
                awayTeam={match.away_team}
                winProbability={winProbability}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <BettingHistory />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Betting;
