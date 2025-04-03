import { useEffect, useState } from 'react';
import api from '../config/api';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  source: string;
  thumbnail: string;
  is_published: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  competition_id: number;
}

interface NewsResponse {
  success: boolean;
  message: null | string;
  data: {
    news: NewsItem[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
    };
  };
}

const Home = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get<NewsResponse>('/news');
        setNews(response.data.data.news);
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleNewsClick = (newsId: number) => {
    navigate(`/news/${newsId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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
        {news.length > 0 && (
          <>
            <Grid item xs={12} md={8}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    transform: 'translateY(-4px)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleNewsClick(news[0].id)}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={news[0].thumbnail}
                  alt={news[0].title}
                />
                <CardContent>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {news[0].title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {news[0].source} - {new Date(news[0].published_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {news.slice(1).map((item) => (
              <Grid item xs={12} md={4} key={item.id}>
                <Card
                  sx={{
                    height: '100%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': {
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease-in-out',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => handleNewsClick(item.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.thumbnail}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.source} - {new Date(item.published_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Home;
