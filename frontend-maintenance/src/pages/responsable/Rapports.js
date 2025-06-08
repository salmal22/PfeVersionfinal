 import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Rapports = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Rapports
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Section des rapports en cours de développement
        </Typography>
        <Typography variant="body1">
          Cette section permettra de générer et visualiser les rapports de maintenance.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Rapports;