import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { NewsArticle } from '../../services/newsService';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={article.thumbnail || 'https://via.placeholder.com/300x180?text=No+Image'}
        alt={article.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
          {truncateText(article.title, 60)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            {formatDate(article.published_at)}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" paragraph>
          {truncateText(article.summary || article.content, 120)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          onClick={() => navigate(`/news/${article.id}`)}
        >
          Xem thêm
        </Button>
      </CardActions>
    </Card>
  );
};

export default NewsCard;
