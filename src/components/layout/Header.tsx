import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Home, SportsSoccer, EmojiEvents } from '@mui/icons-material';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigation = (path: string) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ width: '100%' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { sm: 'none' } }}
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Football News
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/')}
              sx={{
                color: location.pathname === '/' ? 'primary.light' : 'inherit',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Trang chủ
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/news')}
              sx={{
                color: location.pathname === '/news' ? 'primary.light' : 'inherit',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Tin tức
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/matches')}
              sx={{
                color: location.pathname === '/matches' ? 'primary.light' : 'inherit',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Trận đấu
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/teams')}
              sx={{
                color: location.pathname === '/teams' ? 'primary.light' : 'inherit',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Đội bóng
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/areas')}
              sx={{
                color: location.pathname === '/areas' ? 'primary.light' : 'inherit',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Khu vực
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/competitions')}
              sx={{
                color: location.pathname === '/competitions' ? 'primary.light' : 'inherit',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Giải đấu
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/ranking')}
              sx={{
                color: location.pathname === '/ranking' ? 'primary.light' : 'inherit',
                '&:hover': { color: 'primary.light' }
              }}
            >
              Bảng xếp hạng
            </Button>
            {isAuthenticated && (
              <Button
                color="inherit"
                onClick={() => navigate('/betting')}
                sx={{
                  color: location.pathname.startsWith('/betting') ? 'primary.light' : 'inherit',
                  '&:hover': { color: 'primary.light' }
                }}
              >
                Cá cược
              </Button>
            )}
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, ml: 2 }}>
            {isAuthenticated ? (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  '&:hover': { color: 'error.light' }
                }}
              >
                Đăng xuất
              </Button>
            ) : (
              <Button
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  color: location.pathname === '/login' ? 'primary.light' : 'inherit',
                  '&:hover': { color: 'primary.light' }
                }}
              >
                Đăng nhập
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ display: { xs: 'block', sm: 'none' } }}
      >
        <MenuItem onClick={() => handleNavigation('/')}>Trang chủ</MenuItem>
        <MenuItem onClick={() => handleNavigation('/news')}>Tin tức</MenuItem>
        <MenuItem onClick={() => handleNavigation('/matches')}>Trận đấu</MenuItem>
        <MenuItem onClick={() => handleNavigation('/teams')}>Đội bóng</MenuItem>
        <MenuItem onClick={() => handleNavigation('/areas')}>Khu vực</MenuItem>
        <MenuItem onClick={() => handleNavigation('/competitions')}>Giải đấu</MenuItem>
        <MenuItem onClick={() => handleNavigation('/ranking')}>
          <ListItemIcon>
            <EmojiEvents fontSize="small" />
          </ListItemIcon>
          <ListItemText>Bảng xếp hạng</ListItemText>
        </MenuItem>
        {isAuthenticated && (
          <MenuItem onClick={() => handleNavigation('/betting')}>Cá cược</MenuItem>
        )}
        {isAuthenticated ? (
          <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
        ) : (
          <MenuItem onClick={() => handleNavigation('/login')}>Đăng nhập</MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;
