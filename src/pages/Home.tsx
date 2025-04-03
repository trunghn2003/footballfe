import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NewsList from '../components/news/NewsList';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          backgroundColor: 'grey.800',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url(https://source.unsplash.com/random?football)`,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.4)',
          }}
        />
        <Grid container>
          <Grid item md={6}>
            <Box
              sx={{
                position: 'relative',
                p: { xs: 3, md: 6 },
                pr: { md: 0 },
                minHeight: 400,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                Chào mừng đến với Football App
              </Typography>
              <Typography variant="h5" color="inherit" paragraph>
                Theo dõi các giải đấu, lịch thi đấu và tin tức bóng đá mới nhất từ khắp nơi trên thế giới.
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Button variant="contained" size="large" onClick={() => navigate('/competitions')}>
                  Khám phá các giải đấu
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Latest News Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h2">
            Tin tức mới nhất
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/news')}
          >
            Xem tất cả
          </Button>
        </Box>
        <NewsList title="" showPagination={false} maxItems={3} />
      </Box>

      {/* Upcoming Matches Section */}
      <Box sx={{ mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            Trận đấu sắp diễn ra
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/matches')}
          >
            Xem tất cả
          </Button>
        </Box>
        {/* Upcoming matches content would go here */}
      </Box>
    </Container>
  );
};

export default Home;
