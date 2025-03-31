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
  InputAdornment
} from '@mui/material';
import { areaService, Area } from '../services/areaService';
import PublicIcon from '@mui/icons-material/Public';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../hooks/useDebounce';

const Areas = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await areaService.getAreas(page, debouncedSearchTerm);
        setAreas(response.data.areas);
        setTotalPages(Math.ceil(response.data.total / response.data.per_page));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách khu vực');
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, [page, debouncedSearchTerm]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleRowClick = (id: number) => {
    navigate(`/areas/${id}`);
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
        Khu vực
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm khu vực..."
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
              <TableCell width={100}>Cờ</TableCell>
              <TableCell>Tên khu vực</TableCell>
              <TableCell>Mã</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {areas.map((area) => (
              <TableRow
                key={area.id}
                onClick={() => handleRowClick(area.id)}
                sx={{ cursor: 'pointer', '&:hover': { backgroundColor: 'action.hover' } }}
              >
                <TableCell>
                  {area.flag ? (
                    <img
                      src={area.flag}
                      alt={area.name}
                      style={{ width: 40, height: 40, objectFit: 'contain' }}
                    />
                  ) : (
                    <Box display="flex" alignItems="center" justifyContent="center" width={40} height={40}>
                      <PublicIcon color="action" />
                    </Box>
                  )}
                </TableCell>
                <TableCell>{area.name}</TableCell>
                <TableCell>{area.code || 'N/A'}</TableCell>
                <TableCell>{new Date(area.created_at).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{new Date(area.updated_at).toLocaleDateString('vi-VN')}</TableCell>
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

export default Areas;
