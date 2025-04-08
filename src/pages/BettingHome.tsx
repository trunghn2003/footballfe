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
  Divider
} from '@mui/material';
import { SportsSoccer, Casino } from '@mui/icons-material';
import { competitionService } from '../services/competitionService';

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

const BettingHome = () => {
  const [matches, setMatches] = useState<UpcomingMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpcomingMatches = async () => {
      try {
        setLoading(true);
        const response = await competitionService.getUpcomingMatches();
        if (response.data.success) {
          setMatches(response.data.data.matches);
        } else {
          setError('Không thể tải danh sách trận đấu');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải danh sách trận đấu');
        console.error('Error fetching upcoming matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingMatches();
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
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Casino sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Cá cược bóng đá
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Chọn trận đấu để xem dự đoán và đặt cược. Bạn có thể đặt cược trên kết quả trận đấu, tỷ số, số bàn thắng, và nhiều hơn nữa.
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="h5" gutterBottom>
          Trận đấu sắp diễn ra
        </Typography>
        
        {matches.length === 0 ? (
          <Alert severity="info">Không có trận đấu nào sắp diễn ra</Alert>
        ) : (
          <Grid container spacing={3}>
            {matches.map((match) => (
              <Grid item xs={12} md={6} key={match.id}>
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
      </Box>
    </Container>
  );
};

export default BettingHome; 