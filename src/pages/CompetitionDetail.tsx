import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button
} from '@mui/material';
import { competitionService, Competition, Fixture } from '../services/competitionService';
import PublicIcon from '@mui/icons-material/Public';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const CompetitionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        setLoading(true);

        // Fetch competition details
        const competitionResponse = await competitionService.getCompetitionDetail(parseInt(id));
        if (competitionResponse.data.success) {
          setCompetition(competitionResponse.data.data);
        } else {
          setError(competitionResponse.data.message || 'Không thể tải thông tin giải đấu');
          return;
        }

        // Fetch fixtures
        const fixturesResponse = await competitionService.getFixtures(parseInt(id));
        if (fixturesResponse.data.success) {
          // Lọc các trận đấu sắp diễn ra (status: TIMED hoặc SCHEDULED)
          const upcomingFixtures = fixturesResponse.data.data.fixtures.filter(
            fixture => fixture.status === 'TIMED' || fixture.status === 'SCHEDULED'
          );
          // Sắp xếp theo ngày thi đấu
          upcomingFixtures.sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime());
          // Chỉ lấy 5 trận đấu gần nhất
          setFixtures(upcomingFixtures.slice(0, 5));
        } else {
          setError(fixturesResponse.data.message || 'Không thể tải lịch thi đấu');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleViewAllMatches = () => {
    navigate(`/competitions/${id}/matches`);
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

  if (!competition) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Không tìm thấy thông tin giải đấu
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        {/* Header Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box display="flex" justifyContent="center">
                <img
                  src={competition.emblem || ''}
                  alt={competition.name}
                  style={{ width: '150px', height: '150px', objectFit: 'contain' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="h4" gutterBottom>
                {competition.name}
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                {competition.area && (
                  <Chip
                    icon={<PublicIcon />}
                    label={competition.area.name}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {competition.type && (
                  <Chip
                    icon={<EmojiEventsIcon />}
                    label={competition.type === 'LEAGUE' ? 'Giải vô địch' : 'Cúp'}
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </Box>
              {competition.currentSeason && (
                <>
                  <Typography variant="body1" color="text.secondary">
                    Mùa giải hiện tại: {competition.currentSeason.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Thời gian: {competition.currentSeason.start ? new Date(competition.currentSeason.start).toLocaleDateString('vi-VN') : 'N/A'} - {competition.currentSeason.end ? new Date(competition.currentSeason.end).toLocaleDateString('vi-VN') : 'N/A'}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>

        {/* Fixtures Section */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5" display="flex" alignItems="center" gap={1}>
              <SportsSoccerIcon />
              Trận đấu sắp diễn ra
            </Typography>
            <Button
              variant="outlined"
              startIcon={<CalendarMonthIcon />}
              onClick={handleViewAllMatches}
            >
              Xem tất cả trận đấu
            </Button>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Vòng</TableCell>
                  <TableCell>Đội nhà</TableCell>
                  <TableCell>Tỷ số</TableCell>
                  <TableCell>Đội khách</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fixtures.map((fixture) => (
                  <TableRow key={fixture.id}>
                    <TableCell>
                      {new Date(fixture.utcDate).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>{fixture.stage}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {fixture.homeTeam?.crest && (
                          <img
                            src={fixture.homeTeam.crest}
                            alt={fixture.homeTeam.name}
                            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                          />
                        )}
                        {fixture.homeTeam?.name || 'TBD'}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {fixture.score.fullTime.home !== null && fixture.score.fullTime.away !== null
                        ? `${fixture.score.fullTime.home} - ${fixture.score.fullTime.away}`
                        : 'vs'}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        {fixture.awayTeam?.crest && (
                          <img
                            src={fixture.awayTeam.crest}
                            alt={fixture.awayTeam.name}
                            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                          />
                        )}
                        {fixture.awayTeam?.name || 'TBD'}
                      </Box>
                    </TableCell>
                    <TableCell>{fixture.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </Container>
  );
};

export default CompetitionDetail;
