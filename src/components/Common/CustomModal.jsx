import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton, Box } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const CustomModal = ({ open, onClose, title, children, actions, maxWidth = 'sm' }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      disableRestoreFocus
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            bgcolor: 'background.paper',
            backgroundImage: 'none'
          }
        }
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography component="div" sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'text.primary' }}>
          {title}
        </Typography>
        {onClose ? (
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: '20px !important' }}>
        {children}
      </DialogContent>
      {actions && (
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CustomModal;
