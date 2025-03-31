import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';

const Matches = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Lịch thi đấu
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3].map((match) => (
          <Grid item xs={12} key={match}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="h6">Đội nhà {match}</Typography>
                    <Typography variant="body2" color="text.secondary">Sân nhà</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="h5">VS</Typography>
                    <Typography variant="body2" color="text.secondary">20:00</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center', flex: 1 }}>
                    <Typography variant="h6">Đội khách {match}</Typography>
                    <Typography variant="body2" color="text.secondary">Sân khách</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Matches;
