import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip, 
  CircularProgress, 
  Alert,
  Pagination,
  Divider
} from '@mui/material';
import { EmojiEvents, SportsSoccer } from '@mui/icons-material';
import bettingService from '../../services/bettingService';

const BettingHistory = () => {
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchBettingHistory();
  }, [page]);

  const fetchBettingHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bettingService.getBettingHistory(page);
      
      if (response.data.success) {
        setBets(response.data.data || []);
        // Nếu API không trả về thông tin phân trang, mặc định là 1 trang
        setTotalPages(1);
      } else {
        setError('Failed to fetch betting history');
        setBets([]);
      }
    } catch (err) {
      setError('An error occurred while fetching betting history');
      console.error('Error fetching betting history:', err);
      setBets([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBetTypeLabel = (betType: string) => {
    switch (betType) {
      case 'SCORE':
        return 'Tỷ số';
      case 'WIN':
        return 'Thắng nhà';
      case 'DRAW':
        return 'Hòa';
      case 'LOSS':
        return 'Thắng khách';
      default:
        return betType;
    }
  };

  const getBetPrediction = (bet: any) => {
    switch (bet.bet_type) {
      case 'SCORE':
        return `${bet.predicted_score.home} - ${bet.predicted_score.away}`;
      case 'WIN':
        return 'Thắng nhà';
      case 'DRAW':
        return 'Hòa';
      case 'LOSS':
        return 'Thắng khách';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'WON':
        return 'success';
      case 'LOST':
        return 'error';
      case 'CANCELLED':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Đang chờ';
      case 'WON':
        return 'Thắng';
      case 'LOST':
        return 'Thua';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiEvents sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6">Lịch sử đặt cược</Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : !bets || bets.length === 0 ? (
          <Alert severity="info">Không có lịch sử đặt cược</Alert>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Trận đấu</TableCell>
                    <TableCell>Loại cược</TableCell>
                    <TableCell>Dự đoán</TableCell>
                    <TableCell>Số tiền</TableCell>
                    <TableCell>Tỷ lệ</TableCell>
                    <TableCell>Tiền thắng</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Ngày đặt</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bets.map((bet) => (
                    <TableRow key={bet.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SportsSoccer sx={{ mr: 1, fontSize: 20 }} />
                          <Typography variant="body2">
                            {bet.fixture?.home_team_id || 'TBD'} vs {bet.fixture?.away_team_id || 'TBD'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getBetTypeLabel(bet.bet_type)}</TableCell>
                      <TableCell>{getBetPrediction(bet)}</TableCell>
                      <TableCell>{formatCurrency(bet.amount)}</TableCell>
                      <TableCell>{bet.odds}</TableCell>
                      <TableCell>{formatCurrency(bet.potential_win)}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(bet.status)} 
                          color={getStatusColor(bet.status) as any} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{formatDate(bet.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BettingHistory; 