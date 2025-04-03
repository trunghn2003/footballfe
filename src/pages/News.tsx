import { Container, Box, Typography } from '@mui/material';
import NewsList from '../components/news/NewsList';

const News = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textAlign: 'center',
            mb: 4
          }}
        >
          Tin Tức Bóng Đá
        </Typography>

        <NewsList title="" showPagination={true} maxItems={9} />
      </Box>
    </Container>
  );
};

export default News;
