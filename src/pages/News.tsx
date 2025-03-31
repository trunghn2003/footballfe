import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';

const News = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tin tức bóng đá
      </Typography>
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/random/400x300/?football,${item}`}
                alt="News thumbnail"
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h2">
                  Tiêu đề tin tức {item}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mô tả ngắn về tin tức {item}...
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Đọc thêm
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default News;
