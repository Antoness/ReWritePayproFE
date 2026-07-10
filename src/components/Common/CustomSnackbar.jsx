import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const CustomSnackbar = ({ open, message, severity = 'success', onClose, autoHideDuration = 4000 }) => {
  return (
    <Snackbar 
      open={open} 
      autoHideDuration={autoHideDuration} 
      onClose={onClose} 
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: '100%', borderRadius: 2, boxShadow: 3 }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
