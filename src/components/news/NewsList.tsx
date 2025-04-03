import { useState, useEffect } from 'react';
import { Grid, Box, Typography, Pagination, CircularProgress, Alert, Container } from '@mui/material';
import NewsCard from './NewsCard';
import { newsService, NewsArticle } from '../../services/newsService';

interface NewsListProps {
  title?: string;
  maxItems?: number;
  showPagination?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({
  title = 'Tin tức mới nhất',
  maxItems = 6,
  showPagination = true
}) => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsService.getLatestNews(page);

        if (response.success) {
          setNews(response.data.news.slice(0, maxItems));
          setTotalPages(Math.ceil(response.data.pagination.total / response.data.pagination.per_page));
        } else {
          setError(response.message || 'Không thể tải tin tức');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải tin tức');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, maxItems]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (news.length === 0) {
    return (
      <Box my={4} textAlign="center">
        <Typography variant="subtitle1" color="text.secondary">
          Không có tin tức nào
        </Typography>
      </Box>
    );
  }

  return (
    <Container>
      {title && (
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4, mb: 3 }}>
          {title}
        </Typography>
      )}

      <Grid container spacing={3}>
        {news.map(article => (
          <Grid item xs={12} sm={6} md={4} key={article.id}>
            <NewsCard article={article} />
          </Grid>
        ))}
      </Grid>

      {showPagination && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4} mb={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Container>
  );
};

export default NewsList;
