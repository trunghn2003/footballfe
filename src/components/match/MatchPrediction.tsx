import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper
} from '@mui/material';
import api from '../../config/api';

interface WinProbability {
  away: number;
  draw: number;
  home: number;
}

interface PredictedScore {
  away: number;
  home: number;
}

interface Prediction {
  success: boolean;
  win_probability: WinProbability;
  predicted_score: PredictedScore;
  key_factors: string[];
  confidence_level: number;
  raw_response: string;
}

interface TeamStats {
  id: string;
  name: string;
  wins: number;
  draws: number;
  losses: number;
  away_wins: number;
  goals_for: number;
  home_wins: number;
  away_draws: number;
  home_draws: number;
  away_losses: number;
  home_losses: number;
  goals_against: number;
  total_matches: number;
  away_goals_for: number;
  home_goals_for: number;
  away_goals_against: number;
  home_goals_against: number;
}

interface RecentMatch {
  date: string;
  score: {
    away: number;
    home: number;
  };
  away_team: string;
  home_team: string;
  competition: string;
}

interface AnalysisData {
  head_to_head: {
    team1: TeamStats;
    team2: TeamStats;
  };
  upcoming_match: {
    date: string;
    away_team: string;
    home_team: string;
    competition: string;
  };
  away_team_recent: RecentMatch[];
  home_team_recent: RecentMatch[];
}

interface PredictionResponse {
  success: boolean;
  prediction: Prediction;
  analysis_data: AnalysisData;
}

interface MatchPredictionProps {
  matchId: string;
  onWinProbabilityChange: (prob: WinProbability) => void;
}

const MatchPrediction = ({ matchId, onWinProbabilityChange }: MatchPredictionProps) => {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ success: boolean; data: PredictionResponse }>(`/fixtures/predict/${matchId}`);
        setPrediction(response.data.data.prediction);
        setAnalysisData(response.data.data.analysis_data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch match prediction');
        console.error('Error fetching match prediction:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [matchId]);

  useEffect(() => {
    if (prediction?.win_probability) {
      onWinProbabilityChange(prediction.win_probability);
    }
  }, [prediction, onWinProbabilityChange]);

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error || !prediction || !analysisData) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography color="error">{error || 'Prediction data not available'}</Typography>
      </Box>
    );
  }

  const { win_probability, predicted_score, key_factors, confidence_level } = prediction;
  const { head_to_head, upcoming_match, away_team_recent, home_team_recent } = analysisData;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Match Prediction
      </Typography>

      <Grid container spacing={3}>
        {/* Win Probability */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Win Probability
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{upcoming_match.home_team}</Typography>
                  <Typography variant="body2">{win_probability.home}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={win_probability.home}
                  color="primary"
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Draw</Typography>
                  <Typography variant="body2">{win_probability.draw}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={win_probability.draw}
                  color="secondary"
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{upcoming_match.away_team}</Typography>
                  <Typography variant="body2">{win_probability.away}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={win_probability.away}
                  color="error"
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                  {predicted_score.home} - {predicted_score.away}
                </Typography>
                <Chip
                  label={`Confidence: ${confidence_level}%`}
                  color={confidence_level > 70 ? "success" : confidence_level > 50 ? "warning" : "error"}
                  sx={{ mt: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Key Factors */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Key Factors
              </Typography>
              <List>
                {key_factors.map((factor, index) => (
                  <ListItem key={index} sx={{ display: 'block', mb: 1 }}>
                    <ListItemText
                      primary={factor.replace(/\*\*/g, '')}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: factor.includes('**') ? 'bold' : 'normal'
                        }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Head to Head */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Head to Head
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle1">{head_to_head.team1.name}</Typography>
                    <Typography variant="h4" color="primary">{head_to_head.team1.wins}</Typography>
                    <Typography variant="body2">Wins</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle1">Draws</Typography>
                    <Typography variant="h4" color="secondary">{head_to_head.team1.draws}</Typography>
                    <Typography variant="body2">Total Matches: {head_to_head.team1.total_matches}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="subtitle1">{head_to_head.team2.name}</Typography>
                    <Typography variant="h4" color="error">{head_to_head.team2.wins}</Typography>
                    <Typography variant="body2">Wins</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {upcoming_match.home_team} Recent Form
              </Typography>
              <List>
                {home_team_recent.map((match, index) => (
                  <ListItem key={index} divider={index < home_team_recent.length - 1}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">
                            {match.home_team === upcoming_match.home_team ? match.away_team : match.home_team}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {match.score.home} - {match.score.away}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(match.date).toLocaleDateString()} • {match.competition}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {upcoming_match.away_team} Recent Form
              </Typography>
              <List>
                {away_team_recent.map((match, index) => (
                  <ListItem key={index} divider={index < away_team_recent.length - 1}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2">
                            {match.home_team === upcoming_match.away_team ? match.away_team : match.home_team}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {match.score.home} - {match.score.away}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(match.date).toLocaleDateString()} • {match.competition}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MatchPrediction;
