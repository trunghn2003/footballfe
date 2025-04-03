import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Avatar
} from '@mui/material';
import { standingsService, TeamStanding } from '../../services/standingsService';

// Define styles for different positions
const getPositionStyle = (position: number, totalTeams: number) => {
  // Champions League (top 4)
  if (position <= 4) {
    return { borderLeft: '4px solid #1E88E5', backgroundColor: 'rgba(30, 136, 229, 0.05)' };
  }
  // Europa League (5-6)
  if (position <= 6) {
    return { borderLeft: '4px solid #43A047', backgroundColor: 'rgba(67, 160, 71, 0.05)' };
  }
  // Conference League (7)
  if (position === 7) {
    return { borderLeft: '4px solid #7B1FA2', backgroundColor: 'rgba(123, 31, 162, 0.05)' };
  }
  // Relegation zone (bottom 3)
  if (position > totalTeams - 3) {
    return { borderLeft: '4px solid #E53935', backgroundColor: 'rgba(229, 57, 53, 0.05)' };
  }
  return {};
};

// Component to display form (W,D,L) with colors
const FormDisplay = ({ form }: { form: string }) => {
  if (!form) return null;

  const formArray = form.split(',');

  return (
    <Box display="flex" gap={0.5}>
      {formArray.map((result, index) => {
        let color = '';
        let backgroundColor = '';

        switch (result) {
          case 'W':
            color = '#fff';
            backgroundColor = '#43A047';
            break;
          case 'D':
            color = '#fff';
            backgroundColor = '#FB8C00';
            break;
          case 'L':
            color = '#fff';
            backgroundColor = '#E53935';
            break;
          default:
            color = 'inherit';
            backgroundColor = 'inherit';
        }

        return (
          <Tooltip key={index} title={result === 'W' ? 'Thắng' : result === 'D' ? 'Hòa' : 'Thua'}>
            <Box
              sx={{
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color,
                backgroundColor,
                borderRadius: '50%',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}
            >
              {result}
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};

interface StandingsTableProps {
  competitionId: number;
  title?: string;
}

const StandingsTable: React.FC<StandingsTableProps> = ({
  competitionId,
  title = 'Bảng xếp hạng'
}) => {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true);
        const response = await standingsService.getStandings(competitionId);

        if (response.success) {
          setStandings(response.data);
        } else {
          setError(response.message || 'Không thể tải bảng xếp hạng');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Lỗi khi tải bảng xếp hạng');
      } finally {
        setLoading(false);
      }
    };

    fetchStandings();
  }, [competitionId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (standings.length === 0) {
    return (
      <Alert severity="info" sx={{ my: 2 }}>
        Không có dữ liệu bảng xếp hạng
      </Alert>
    );
  }

  const totalTeams = standings.length;

  return (
    <Box sx={{ mt: 3 }}>
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell width={50}>#</TableCell>
              <TableCell>Đội</TableCell>
              <TableCell align="center">Trận</TableCell>
              <TableCell align="center">Thắng</TableCell>
              <TableCell align="center">Hòa</TableCell>
              <TableCell align="center">Thua</TableCell>
              <TableCell align="center">Bàn thắng</TableCell>
              <TableCell align="center">Bàn thua</TableCell>
              <TableCell align="center">Hiệu số</TableCell>
              <TableCell align="center">Điểm</TableCell>
              <TableCell align="center">Phong độ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {standings.map((row) => (
              <TableRow
                key={row.team_id}
                hover
                sx={{
                  ...getPositionStyle(row.position, totalTeams),
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell component="th" scope="row" align="center" sx={{ fontWeight: 'bold' }}>
                  {row.position}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      src={row.team.crest}
                      alt={row.team.name}
                      sx={{ width: 24, height: 24 }}
                      variant="square"
                    />
                    <Typography variant="body2">{row.team.short_name || row.team.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">{row.played_games}</TableCell>
                <TableCell align="center">{row.won}</TableCell>
                <TableCell align="center">{row.draw}</TableCell>
                <TableCell align="center">{row.lost}</TableCell>
                <TableCell align="center">{row.goals_for}</TableCell>
                <TableCell align="center">{row.goals_against}</TableCell>
                <TableCell align="center" sx={{
                  color: row.goal_difference > 0 ? 'success.main' :
                         row.goal_difference < 0 ? 'error.main' : 'text.secondary',
                  fontWeight: 'medium'
                }}>
                  {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>{row.points}</TableCell>
                <TableCell align="center">
                  <FormDisplay form={row.form} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#1E88E5', borderRadius: 1 }} />
          <Typography variant="caption">UEFA Champions League</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#43A047', borderRadius: 1 }} />
          <Typography variant="caption">UEFA Europa League</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#7B1FA2', borderRadius: 1 }} />
          <Typography variant="caption">UEFA Conference League</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 12, height: 12, backgroundColor: '#E53935', borderRadius: 1 }} />
          <Typography variant="caption">Xuống hạng</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default StandingsTable;
