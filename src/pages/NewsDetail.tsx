import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Card, 
  CardMedia, 
  CardContent, 
  Box, 
  Button,
  Divider,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Paper
} from '@mui/material';
import api from '../config/api';
import { ArrowBack, MoreVert, Send } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: number;
  name: string;
  email: string;
  favourite_teams: string;
  notification_pref: null | string;
  email_verified_at: null | string;
  fcm_token: null | string;
  created_at: string;
  updated_at: string;
}

interface Comment {
  id: number;
  user_id: number;
  news_id: number;
  parent_id: null | number;
  content: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  is_owner: boolean;
  user: User;
}

interface Team {
  id: number;
  name: string;
  short_name: string;
  crest: string;
  venue: string;
}

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
  teams: Team[];
}

interface NewsDetailResponse {
  success: boolean;
  message: null | string;
  data: {
    news: NewsItem;
    comments: Comment[];  // Comments are at this level, not inside news
  };
}

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);  // Separate state for comments
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedComment, setSelectedComment] = useState<number | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get<NewsDetailResponse>(`/news/${id}`);
        setNews(response.data.data.news);
        setComments(response.data.data.comments);  // Set comments separately
        setError(null);
      } catch (err) {
        setError('Failed to fetch news detail');
        console.error('Error fetching news detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, commentId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const handleEditComment = async () => {
    // TODO: Implement edit functionality
    handleMenuClose();
  };

  const handleDeleteComment = async () => {
    try {
      await api.delete(`/comments/${selectedComment}`);
      // Remove the deleted comment from state
      setComments(comments.filter(comment => comment.id !== selectedComment));
    } catch (error) {
      console.error('Error deleting comment:', error);
      // You might want to show an error message to the user
    }
    handleMenuClose();
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const response = await api.post(`/comments`, {
        content: newComment.trim(),
        news_id: id
      });

      if (response.data.success) {
        setComments([...comments, response.data.data]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <div className="text-red-500">{error || 'News not found'}</div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Card sx={{ mb: 4 }}>
        {news.thumbnail && (
          <CardMedia
            component="img"
            height="500"
            image={news.thumbnail}
            alt={news.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom>
            {news.title}
          </Typography>
          
          {/* Source and Date */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary">
              Source: {news.source}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Published: {new Date(news.published_at).toLocaleString()}
            </Typography>
          </Box>

          {/* Related Teams */}
          {news.teams && news.teams.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Related Teams
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {news.teams.map((team) => (
                  <Chip
                    key={team.id}
                    avatar={team.crest ? <Avatar src={team.crest} alt={team.name} /> : null}
                    label={team.short_name || team.name}
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Main Content */}
          <Typography variant="body1" sx={{ 
            whiteSpace: 'pre-wrap',
            mb: 4 
          }}>
            {news.content}
          </Typography>

          {/* Comments Section */}
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Comments ({comments.length})
          </Typography>

          <Paper 
            component="form" 
            onSubmit={handleSubmitComment}
            sx={{ 
              p: 2, 
              mb: 3,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2
            }}
            elevation={0}
            variant="outlined"
          >
            <Avatar sx={{ mt: 1 }}>
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                variant="outlined"
                size="small"
                disabled={isSubmitting}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                <Button
                  variant="contained"
                  endIcon={<Send />}
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  size="small"
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </Box>
            </Box>
          </Paper>

          {comments.length > 0 ? (
            comments.map((comment) => (
              <Card key={comment.id} sx={{ mb: 2, bgcolor: 'grey.50' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ mr: 1 }}>
                        {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {comment.user?.name || 'Anonymous User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Show menu button only if is_owner is true */}
                    {comment.is_owner && (
                      <Box>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, comment.id)}
                          aria-label="comment options"
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {comment.content}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              Be the first to comment
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Comment Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditComment}>
          Edit Comment
        </MenuItem>
        <MenuItem 
          onClick={handleDeleteComment}
          sx={{ color: 'error.main' }}
        >
          Delete Comment
        </MenuItem>
      </Menu>
    </Container>
  );
};

export default NewsDetail; 