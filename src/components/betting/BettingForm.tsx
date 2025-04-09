import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { SportsSoccer } from '@mui/icons-material';
import bettingService from '../../services/bettingService';
import balanceService from '../../services/balanceService';

interface BettingFormProps {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  winProbability: {
    home: number;
    draw: number;
    away: number;
  };
}

const BettingForm = ({ fixtureId, homeTeam, awayTeam, winProbability }: BettingFormProps) => {
  const [betType, setBetType] = useState<'WIN' | 'DRAW' | 'LOSS' | 'SCORE'>('WIN');
  const [amount, setAmount] = useState<string>('');
  const [homeScore, setHomeScore] = useState<string>('');
  const [awayScore, setAwayScore] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [potentialWin, setPotentialWin] = useState<number>(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    calculatePotentialWin();
  }, [betType, amount]);

  const fetchBalance = async () => {
    try {
      const response = await balanceService.getBalance();
      if (response.data.success) {
        setBalance(response.data.data.balance);
      }
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const calculatePotentialWin = () => {
    if (!amount || isNaN(Number(amount))) {
      setPotentialWin(0);
      return;
    }

    const amountNum = Number(amount);
    let multiplier = 1;

    switch (betType) {
      case 'WIN':
        multiplier = 100 / winProbability.home;
        break;
      case 'DRAW':
        multiplier = 100 / winProbability.draw;
        break;
      case 'LOSS':
        multiplier = 100 / winProbability.away;
        break;
      case 'SCORE':
        multiplier = 5;
        break;
    }

    multiplier = Math.round(multiplier * 100) / 100;
    setPotentialWin(amountNum * multiplier);
  };

  const handlePlaceBet = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Validate input
      if (!amount || isNaN(Number(amount)) || Number(amount) < 10000 || Number(amount) > 10000000) {
        setError('Số tiền cược phải từ 10,000đ đến 10,000,000đ');
        setLoading(false);
        return;
      }

      if (betType === 'SCORE' && (!homeScore || !awayScore || isNaN(Number(homeScore)) || isNaN(Number(awayScore)))) {
        setError('Vui lòng nhập tỷ số hợp lệ');
        setLoading(false);
        return;
      }

      if (Number(amount) > balance) {
        setError('Số dư không đủ để đặt cược');
        setLoading(false);
        return;
      }

      // Prepare bet data
      const betData: any = {
        fixture_id: fixtureId,
        bet_type: betType,
        amount: Number(amount)
      };

      if (betType === 'SCORE') {
        betData.predicted_score = {
          home: Number(homeScore),
          away: Number(awayScore)
        };
      }

      // Place bet
      const response = await bettingService.placeBet(betData);

      if (response.data.success) {
        setSuccess('Đặt cược thành công!');
        // Reset form
        setAmount('');
        setHomeScore('');
        setAwayScore('');
        // Refresh balance
        fetchBalance();
      } else {
        setError(response.data.message || 'Đặt cược thất bại');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đã xảy ra lỗi khi đặt cược');
      console.error('Error placing bet:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SportsSoccer sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h6">Đặt cược</Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Số dư hiện tại: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance)}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Loại cược</InputLabel>
              <Select
                value={betType}
                label="Loại cược"
                onChange={(e) => setBetType(e.target.value as 'WIN' | 'DRAW' | 'LOSS' | 'SCORE')}
              >
                <MenuItem value="WIN">Thắng nhà</MenuItem>
                <MenuItem value="DRAW">Hòa</MenuItem>
                <MenuItem value="LOSS">Thắng khách</MenuItem>
                <MenuItem value="SCORE">Tỷ số</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {betType === 'SCORE' && (
            <>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tỷ số nhà"
                  type="number"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tỷ số khách"
                  type="number"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Số tiền cược"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">₫</InputAdornment>,
                inputProps: { min: 10000, max: 1000000000 }
              }}
              helperText="Từ 10,000đ đến 1,000,000,000đ"
            />
          </Grid>

          {potentialWin > 0 && (
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                Tiền thắng tiềm năng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(potentialWin)}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handlePlaceBet}
              disabled={loading || !amount || (betType === 'SCORE' && (!homeScore || !awayScore))}
            >
              {loading ? <CircularProgress size={24} /> : 'Đặt cược'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BettingForm;
