import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const CustomModal = ({ open, onClose, title, children, maxWidth = "sm" }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={maxWidth} 
      fullWidth 
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
          {title}
        </Typography>
        {onClose ? (
          <IconButton onClick={onClose} size="small" sx={{ color: '#64748b' }}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: '24px !important' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CustomModal;
