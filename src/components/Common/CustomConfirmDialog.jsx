import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material';
import { Help as HelpIcon, Warning as WarningIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { keyframes } from '@emotion/react';

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const pulseWarning = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
`;

const pulseError = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { transform: scale(1.05); box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
`;

const CustomConfirmDialog = ({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onClose, 
  confirmText = 'Yes', 
  cancelText = 'No',
  type = 'info' // info, warning, error, success
}) => {
  
  const config = {
    info: {
      icon: <HelpIcon sx={{ fontSize: 60, color: '#3b82f6' }} />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      animation: pulseAnimation
    },
    warning: {
      icon: <WarningIcon sx={{ fontSize: 60, color: '#f59e0b' }} />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      animation: pulseWarning
    },
    error: {
      icon: <WarningIcon sx={{ fontSize: 60, color: '#ef4444' }} />,
      color: '#ef4444',
      bgColor: '#fef2f2',
      animation: pulseError
    },
    success: {
      icon: <CheckCircleIcon sx={{ fontSize: 60, color: '#10b981' }} />,
      color: '#10b981',
      bgColor: '#ecfdf5',
      animation: pulseAnimation
    }
  };

  const currentConfig = config[type] || config.info;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xs" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 3,
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          mb: 3,
          mt: 1
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: currentConfig.bgColor,
            animation: currentConfig.animation + ' 2s infinite',
          }}
        >
          {currentConfig.icon}
        </Box>
      </Box>
      
      <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem', p: 0, mb: 2, textAlign: 'center' }}>
        {title}
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, mb: 4, textAlign: 'center' }}>
        <Typography sx={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, textAlign: 'center' }}>
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: 'center', p: 0, gap: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ 
            color: '#64748b', 
            borderColor: '#cbd5e1',
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            py: 1.2,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              backgroundColor: '#f1f5f9',
              borderColor: '#94a3b8'
            }
          }}
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm}
          variant="contained" 
          disableElevation
          sx={{ 
            bgcolor: currentConfig.color, 
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            py: 1.2,
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': {
              bgcolor: currentConfig.color,
              filter: 'brightness(0.9)',
              boxShadow: '0 10px 15px -3px ' + currentConfig.color + '40'
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomConfirmDialog;
