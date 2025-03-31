import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Pagination,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  IconButton
} from '@mui/material';
import { competitionService, Competition } from '../services/competitionService';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../hooks/useDebounce';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Competitions = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        setLoading(true);
        const response = await competitionService.getCompetitions(page, debouncedSearchTerm);
        if (response.data.success) {
          setCompetitions(response.data.data.competitions);
          setTotalPages(Math.ceil(response.data.data.total / response.data.data.per_page));
        } else {
          setError(response.data.message || 'Không thể tải danh sách giải đấu');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải danh sách giải đấu');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [page, debouncedSearchTerm]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset về trang 1 khi tìm kiếm
  };

  const handleViewDetail = (id: number) => {
    navigate(`/competitions/${id}`);
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
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Giải đấu
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm giải đấu..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={100}>Logo</TableCell>
              <TableCell>Tên giải đấu</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Khu vực</TableCell>
              <TableCell>Mùa giải hiện tại</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {competitions.map((competition) => (
              <TableRow key={competition.id}>
                <TableCell>
                  <img
                    src={competition.emblem}
                    alt={competition.name}
                    style={{ width: 40, height: 40, objectFit: 'contain' }}
                  />
                </TableCell>
                <TableCell>{competition.name}</TableCell>
                <TableCell>{competition.code}</TableCell>
                <TableCell>
                  <Chip
                    label={competition.type === 'LEAGUE' ? 'Giải vô địch' : 'Cúp'}
                    color={competition.type === 'LEAGUE' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {competition.area.flag && (
                      <img
                        src={competition.area.flag}
                        alt={competition.area.name}
                        style={{ width: 24, height: 24, objectFit: 'contain' }}
                      />
                    )}
                    {competition.area.name}
                  </Box>
                </TableCell>
                <TableCell>
                  {competition.currentSeason ? (
                    <Box>
                      <Typography variant="body2">
                        {new Date(competition.currentSeason.start).toLocaleDateString('vi-VN')} -
                        {new Date(competition.currentSeason.end).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  ) : (
                    'Chưa có mùa giải'
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewDetail(competition.id)}
                    title="Xem chi tiết"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={4} mb={4}>
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

export default Competitions;
