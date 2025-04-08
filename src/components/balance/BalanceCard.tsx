import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Button, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { AccountBalance, Add, Remove } from '@mui/icons-material';
import balanceService, { BalanceResponse } from '../../services/balanceService';

const BalanceCard = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [processing, setProcessing] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await balanceService.getBalance();
      if (response.data.success) {
        setBalance(response.data.data.balance);
        setError(null);
      } else {
        setError(response.data.message || 'Failed to fetch balance');
      }
    } catch (err) {
      setError('Error fetching balance');
      console.error('Error fetching balance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setProcessError('Please enter a valid amount');
      return;
    }

    try {
      setProcessing(true);
      setProcessError(null);
      await balanceService.deposit({
        amount: Number(amount),
        description: description || 'Deposit'
      });
      setDepositDialogOpen(false);
      setAmount('');
      setDescription('');
      fetchBalance();
    } catch (err) {
      setProcessError('Failed to process deposit');
      console.error('Error processing deposit:', err);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setProcessError('Please enter a valid amount');
      return;
    }

    if (balance !== null && Number(amount) > balance) {
      setProcessError('Insufficient balance');
      return;
    }

    try {
      setProcessing(true);
      setProcessError(null);
      await balanceService.withdraw({
        amount: Number(amount),
        description: description || 'Withdrawal'
      });
      setWithdrawDialogOpen(false);
      setAmount('');
      setDescription('');
      fetchBalance();
    } catch (err) {
      setProcessError('Failed to process withdrawal');
      console.error('Error processing withdrawal:', err);
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AccountBalance sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h6">Your Balance</Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : (
            <>
              <Typography variant="h4" sx={{ mb: 3 }}>
                {balance !== null ? formatCurrency(balance) : '0 VND'}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<Add />}
                  onClick={() => setDepositDialogOpen(true)}
                >
                  Deposit
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<Remove />}
                  onClick={() => setWithdrawDialogOpen(true)}
                  disabled={balance === null || balance <= 0}
                >
                  Withdraw
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={depositDialogOpen} onClose={() => !processing && setDepositDialogOpen(false)}>
        <DialogTitle>Deposit Money</DialogTitle>
        <DialogContent>
          {processError && <Alert severity="error" sx={{ mb: 2 }}>{processError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Amount (VND)"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={processing}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={processing}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDepositDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeposit} 
            variant="contained" 
            color="primary"
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : 'Deposit'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={withdrawDialogOpen} onClose={() => !processing && setWithdrawDialogOpen(false)}>
        <DialogTitle>Withdraw Money</DialogTitle>
        <DialogContent>
          {processError && <Alert severity="error" sx={{ mb: 2 }}>{processError}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Amount (VND)"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={processing}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description (optional)"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={processing}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handleWithdraw} 
            variant="contained" 
            color="primary"
            disabled={processing}
          >
            {processing ? <CircularProgress size={24} /> : 'Withdraw'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BalanceCard; 