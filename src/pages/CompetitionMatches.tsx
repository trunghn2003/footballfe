import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Button,
  IconButton,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { competitionService, Competition, Fixture } from '../services/competitionService';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

interface GroupedFixtures {
  [key: string]: {
    [key: string]: Fixture[];
  };
}

const getOrdinalSuffix = (day: number): string => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = day % 100;
  return day + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getMonthAbbreviation = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short' });
};

const getMonthRange = (year: number, month: number) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);
  return {
    dateFrom: formatDate(startDate),
    dateTo: formatDate(endDate)
  };
};

const CompetitionMatches = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [competition, setCompetition] = useState<Competition | null>(null);
  const [fixtures, setFixtures] = useState<GroupedFixtures>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<string | false>(false);
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());

  const months = [
    { value: 0, label: 'Jan' },
    { value: 1, label: 'Feb' },
    { value: 2, label: 'Mar' },
    { value: 3, label: 'Apr' },
    { value: 4, label: 'May' },
    { value: 5, label: 'Jun' },
    { value: 6, label: 'Jul' },
    { value: 7, label: 'Aug' },
    { value: 8, label: 'Sep' },
    { value: 9, label: 'Oct' },
    { value: 10, label: 'Nov' },
    { value: 11, label: 'Dec' }
  ];

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

        // Get date range for selected month
        const { dateFrom, dateTo } = getMonthRange(selectedYear, selectedMonth);

        // Fetch fixtures with date range
        const fixturesResponse = await competitionService.getFixtureByDate(parseInt(id), 1, dateFrom, dateTo);
        if (fixturesResponse.data.success) {
          // Nhóm các trận đấu theo tháng và ngày
          const groupedFixtures = fixturesResponse.data.data.fixtures.reduce((acc: GroupedFixtures, fixture) => {
            const date = new Date(fixture.utcDate);
            const monthKey = `${date.getFullYear()} ${months[date.getMonth()].label}`;
            const dayKey = formatDate(date);

            if (!acc[monthKey]) {
              acc[monthKey] = {};
            }
            if (!acc[monthKey][dayKey]) {
              acc[monthKey][dayKey] = [];
            }
            acc[monthKey][dayKey].push(fixture);
            return acc;
          }, {});

          // Sắp xếp các trận đấu trong mỗi ngày theo thời gian
          Object.keys(groupedFixtures).forEach(month => {
            Object.keys(groupedFixtures[month]).forEach(day => {
              groupedFixtures[month][day].sort((a, b) =>
                new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
              );
            });
          });

          setFixtures(groupedFixtures);
          // Tự động mở tháng hiện tại
          const currentMonthKey = `${selectedYear} ${months[selectedMonth].label}`;
          setExpandedMonth(currentMonthKey);
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
  }, [id, selectedMonth, selectedYear]);

  const handleMonthChange = (month: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedMonth(isExpanded ? month : false);
  };

  const handleMonthSelect = (monthValue: number) => {
    setSelectedMonth(monthValue);
  };

  const handleYearChange = (increment: number) => {
    setSelectedYear(prev => prev + increment);
  };

  const handleMatchClick = (fixtureId: number) => {
    navigate(`/matches/${fixtureId}`);
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
          <Box display="flex" alignItems="center" gap={2}>
            <img
              src={competition.emblem || ''}
              alt={competition.name}
              style={{ width: '80px', height: '80px', objectFit: 'contain' }}
            />
            <Box>
              <Typography variant="h4" gutterBottom>
                {competition.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                Lịch thi đấu mùa giải {competition.currentSeason?.name || 'N/A'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Month and Year Filter */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={2}>
            {/* Year Navigation */}
            <Box display="flex" alignItems="center" justifyContent="center" gap={2}>
              <IconButton onClick={() => handleYearChange(-1)}>
                <ChevronLeftIcon />
              </IconButton>
              <Typography variant="h6">{selectedYear}</Typography>
              <IconButton onClick={() => handleYearChange(1)}>
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Month Selection */}
            <Box display="flex" gap={1} justifyContent="center" flexWrap="wrap">
              {months.map((month) => (
                <Button
                  key={month.value}
                  variant={selectedMonth === month.value ? "contained" : "outlined"}
                  onClick={() => handleMonthSelect(month.value)}
                  size="small"
                >
                  {month.label}
                </Button>
              ))}
            </Box>
          </Stack>
        </Paper>

        {/* Fixtures Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom display="flex" alignItems="center" gap={1}>
            <SportsSoccerIcon />
            Tất cả trận đấu
          </Typography>
          {Object.entries(fixtures).map(([month, days]) => (
            <Accordion
              key={month}
              expanded={expandedMonth === month}
              onChange={handleMonthChange(month)}
              sx={{ mb: 1 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">{month}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {Object.entries(days).map(([day, dayFixtures]) => (
                  <Box key={day} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {day}
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Giờ</TableCell>
                            <TableCell>Vòng</TableCell>
                            <TableCell>Đội nhà</TableCell>
                            <TableCell>Tỷ số</TableCell>
                            <TableCell>Đội khách</TableCell>
                            <TableCell>Trạng thái</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dayFixtures.map((fixture) => (
                            <TableRow
                              key={fixture.id}
                              onClick={() => handleMatchClick(fixture.id)}
                              sx={{
                                cursor: 'pointer',
                                '&:hover': {
                                  backgroundColor: 'action.hover'
                                }
                              }}
                            >
                              <TableCell>
                                {new Date(fixture.utcDate).toLocaleTimeString('vi-VN', {
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
                                      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
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
                                      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
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
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default CompetitionMatches;
