import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export const NotificationAlert = ({ open, handleClose, severity, message }) => {
    console.log("Function Called");
    
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000} 
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MuiAlert onClose={handleClose} severity={severity} sx={{ width: '100%',fontSize:"20px" }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
};
