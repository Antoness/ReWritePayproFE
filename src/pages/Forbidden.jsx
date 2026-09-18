import React from 'react';
import { Box, Typography, Button, Paper, Container, Stack } from '@mui/material';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const Forbidden = ({ permissionRequired }) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          textAlign: 'center',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backdropFilter: 'blur(10px)',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 10px 30px rgba(0,0,0,0.5)'
              : '0 10px 30px rgba(0,0,0,0.06)',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
            color: 'error.main',
          }}
        >
          <LockPersonOutlinedIcon sx={{ fontSize: 44 }} />
        </Box>

        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.5px' }}>
          403 — Akses Dibatasi
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
          Akun atau Posisi Anda saat ini tidak memiliki hak akses (*Role Privilege*) untuk membuka halaman ini.
          {permissionRequired && (
            <Typography
              component="span"
              display="block"
              variant="caption"
              sx={{ mt: 1, fontFamily: 'monospace', color: 'text.secondary', opacity: 0.8 }}
            >
              Required Privilege Key: <strong>{permissionRequired}</strong>
            </Typography>
          )}
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ px: 3, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
          >
            Kembali ke Dashboard
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default Forbidden;
