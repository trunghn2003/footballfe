import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';

const Teams = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Đội bóng
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((team) => (
          <Grid item xs={12} sm={6} md={4} key={team}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={`https://source.unsplash.com/random/400x300/?soccer-team,${team}`}
                alt="Team logo"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Đội bóng {team}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Thông tin ngắn về đội bóng {team}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Xem chi tiết
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Teams;
