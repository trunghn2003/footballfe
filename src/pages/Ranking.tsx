import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Grid
} from '@mui/material';
import { EmojiEvents, TrendingUp, TrendingDown, Casino } from '@mui/icons-material';
import rankingService from '../services/rankingService';
import type { Ranking } from '../services/rankingService';

const Ranking = () => {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await rankingService.getRankings();
        if (response?.data?.success) {
          setRankings(response.data.data);
        } else {
          setError('Không thể tải bảng xếp hạng');
        }
      } catch (err) {
        console.error('Error fetching rankings:', err);
        setError('Đã xảy ra lỗi khi tải bảng xếp hạng');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const formatMoney = (amount: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(amount));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EmojiEvents sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Bảng xếp hạng
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Top 3 Players */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
              {rankings.slice(0, 3).map((player, index) => (
                <Paper
                  key={player.id}
                  elevation={3}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    width: 250,
                    position: 'relative',
                    bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                    color: 'black',
                    borderRadius: '16px',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: 'transform 0.2s'
                    }
                  }}
                >
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 2,
                      bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                      color: 'black',
                      fontSize: '2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h6" gutterBottom>
                    {player.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatMoney(player.net_winnings)}
                  </Typography>
                  <Chip
                    label={`Tỷ lệ thắng: ${player.win_rate.toFixed(2)}%`}
                    color="default"
                    sx={{ mt: 1 }}
                  />
                </Paper>
              ))}
            </Box>
          </Grid>

          {/* Full Rankings Table */}
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Hạng</TableCell>
                    <TableCell>Tên người chơi</TableCell>
                    <TableCell align="right">Số tiền thắng ròng</TableCell>
                    <TableCell align="right">Tổng số tiền thắng</TableCell>
                    <TableCell align="right">Tổng số tiền cược</TableCell>
                    <TableCell align="right">Số lần thắng</TableCell>
                    <TableCell align="right">Số lần thua</TableCell>
                    <TableCell align="right">Tổng số lần cược</TableCell>
                    <TableCell align="right">Tỷ lệ thắng</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankings.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell>
                        <Chip
                          label={`#${player.rank}`}
                          color={player.rank <= 3 ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {Number(player.net_winnings) > 0 ? (
                            <TrendingUp sx={{ color: 'success.main', mr: 1 }} />
                          ) : Number(player.net_winnings) < 0 ? (
                            <TrendingDown sx={{ color: 'error.main', mr: 1 }} />
                          ) : null}
                          {formatMoney(player.net_winnings)}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatMoney(player.gross_winnings)}</TableCell>
                      <TableCell align="right">{formatMoney(player.total_bet_amount)}</TableCell>
                      <TableCell align="right">{player.total_wins}</TableCell>
                      <TableCell align="right">{player.total_losses}</TableCell>
                      <TableCell align="right">{player.total_bets}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${player.win_rate.toFixed(2)}%`}
                          color={player.win_rate >= 50 ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Ranking;
