import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const Home = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 }
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          mb: 3
        }}
      >
        Tin tức nổi bật
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: '100%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <CardMedia
              component="img"
              height="400"
              image="https://pbs.twimg.com/media/GnPhaUPXAAE_EuG?format=jpg&name=large"
              alt="Featured news"
            />
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Tin tức gì đó
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ai hiểu sẽ hiểu thôi
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease-in-out'
              }
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image="https://statics-maker.llt-services.com/leg/images/2025/03/29/xlarge-wp/6983a089-cf90-4336-b13e-206e3812b4f9-6.webp"
              alt="News thumbnail"
            />
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Hẹ hẹ hẹ hẹ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mô tả ngắn về tin tức phụ...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
