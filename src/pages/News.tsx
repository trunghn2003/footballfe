import { useEffect, useState } from 'react';
import api from '../config/api';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia,
  Box,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
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

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await api.get<NewsResponse>('/news', {
          params: {
            page,
            per_page: perPage
          }
        });
        setNews(response.data.data.news);
        setTotalPages(Math.ceil(response.data.data.pagination.total / perPage));
        setError(null);
      } catch (err) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, perPage]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handlePerPageChange = (event: SelectChangeEvent<number>) => {
    setPerPage(Number(event.target.value));
    setPage(1); // Reset to first page when changing items per page
  };

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="text-red-500">{error}</div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4 }}>
        Latest News
      </Typography>

      {/* Controls */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Per Page</InputLabel>
          <Select
            value={perPage}
            label="Per Page"
            onChange={handlePerPageChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* News Grid */}
      <Grid container spacing={3}>
        {news.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.2s ease-in-out',
                  boxShadow: 3
                }
              }}
              onClick={() => handleNewsClick(item.id)}
            >
              {item.thumbnail && (
                <CardMedia
                  component="img"
                  height="200"
                  image={item.thumbnail}
                  alt={item.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {item.source}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.published_at).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange}
          color="primary"
          size="large"
        />
      </Box>
    </Container>
  );
};

export default News;
