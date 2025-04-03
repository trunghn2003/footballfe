import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import { competitionService, Competition } from '../services/competitionService';
import PublicIcon from '@mui/icons-material/Public';

const Competitions = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const response = await competitionService.getFeaturedCompetitions();
        if (response.success) {
          setCompetitions(response.data.competitions);
        } else {
          setError(response.message || 'Failed to fetch competitions');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch competitions');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const handleCompetitionClick = (id: number) => {
    navigate(`/competitions/${id}`);
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

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Featured Competitions
      </Typography>
      <Grid container spacing={3}>
        {competitions.map((competition) => (
          <Grid item xs={12} sm={6} md={4} key={competition.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => handleCompetitionClick(competition.id)}
            >
              <CardMedia
                component="img"
                height="140"
                image={competition.emblem}
                alt={competition.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {competition.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PublicIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {competition.area.name}
                  </Typography>
                </Box>
                <Chip
                  label={competition.type}
                  size="small"
                  color={competition.type === 'LEAGUE' ? 'primary' : 'secondary'}
                  sx={{ mt: 1 }}
                />
                {competition.currentSeason && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Season: {competition.currentSeason.name}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Competitions;
