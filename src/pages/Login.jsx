import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Paper, Typography, TextField, Button, 
  InputAdornment, IconButton, Checkbox, FormControlLabel, Link,
  Alert, Snackbar
} from '@mui/material';
import { 
  Person as UserIcon, 
  Lock as LockIcon, 
  Visibility, VisibilityOff
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Ambil status autentikasi dari Redux
  const { isAuthenticated } = useSelector((state) => state.auth);

  // REDIRECT JIKA SUDAH LOGIN (Mencegah tombol Back/Next balik ke Login)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      const { token } = response.data;

      // Update Redux State (Slice akan otomatis extract info dari JWT)
      dispatch(login({ token }));

      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.05)', zIndex: 0 }} />
      <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(168, 85, 247, 0.05)', zIndex: 0 }} />

      <Container maxWidth="xs" sx={{ zIndex: 1 }}>
        <Paper elevation={0} className="glass-card" sx={{ p: 5, borderRadius: 4, textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img src="/favicon.svg" alt="PayPro Logo" style={{ width: 64, height: 64 }} />
          </Box>

          <Typography variant="h4" sx={{ mb: 1, fontWeight: 800 }}>Welcome Back</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Please enter your details to sign in to PayPro</Typography>

          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px' }}>{error}</Alert>}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <UserIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  )
                }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, mb: 3 }}>
              <FormControlLabel control={<Checkbox size="small" color="primary" />} label={<Typography variant="body2">Remember me</Typography>} />
              <Link href="#" variant="body2" sx={{ fontWeight: 600, textDecoration: 'none' }}>Forgot Password?</Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem', borderRadius: '10px' }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Typography variant="body2" sx={{ mt: 4 }}>Don't have an account? <Link href="#" sx={{ fontWeight: 600, textDecoration: 'none' }}>Create Account</Link></Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
