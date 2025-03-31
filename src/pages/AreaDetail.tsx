import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
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
  Grid,
  Card,
  CardContent,
  CardMedia,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDebounce } from '../hooks/useDebounce';
import { competitionService, Competition } from '../services/competitionService';
import { areaService, Area } from '../services/areaService';

const AreaDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [area, setArea] = useState<Area | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchArea = async () => {
      try {
        const response = await areaService.getAreaById(Number(id));
        setArea(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải thông tin khu vực');
      }
    };

    const fetchCompetitions = async () => {
      try {
        const response = await competitionService.getCompetitions(page, debouncedSearchTerm, Number(id));
        setCompetitions(response.data.competitions);
        setTotalPages(Math.ceil(response.data.total / response.data.per_page));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể tải danh sách giải đấu');
      } finally {
        setLoading(false);
      }
    };

    fetchArea();
    fetchCompetitions();
  }, [id, page, debouncedSearchTerm]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
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
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={area?.flag || '/placeholder-flag.png'}
                alt={area?.name}
                sx={{ objectFit: 'contain', p: 2 }}
              />
              <CardContent>
                <Typography variant="h5" component="h1" gutterBottom>
                  {area?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mã khu vực: {area?.code || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
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
                    <TableCell>Mùa giải hiện tại</TableCell>
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
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AreaDetail;
