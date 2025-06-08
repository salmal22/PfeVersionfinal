import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip, Stack, Tooltip, Avatar } from '@mui/material';
import { CheckCircle, Cancel, Build } from '@mui/icons-material';
import dataService from '../../services/dataService';

const statusColors = {
  nouvelle: 'default',
  validee: 'success',
  rejetee: 'error',
  en_cours: 'warning',
};

const priorityColors = {
  haute: 'error',
  moyenne: 'warning',
  basse: 'success',
};

const Pannes = () => {
  const [pannes, setPannes] = useState([]);

  useEffect(() => {
    setPannes(dataService.getAnomalies());
  }, []);

  const handleValidate = (id) => {
    dataService.updateAnomaly(id, { status: 'validee' });
    setPannes(dataService.getAnomalies());
  };

  const handleReject = (id) => {
    dataService.updateAnomaly(id, { status: 'rejetee' });
    setPannes(dataService.getAnomalies());
  };

  const handleCreateIntervention = (anomaly) => {
    // TODO: Open a modal/form to create intervention for this anomaly
    alert('Créer intervention pour: ' + anomaly.title);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h5" mb={2} fontWeight={600}>Liste des Pannes Signalées</Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table size="small" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell>ID</TableCell>
              <TableCell>Titre</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Priorité</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Signalée par</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pannes.map((panne) => (
              <TableRow key={panne.id} hover sx={{ transition: 'background 0.2s' }}>
                <TableCell>{panne.id}</TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{panne.title}</TableCell>
                <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{panne.description}</TableCell>
                <TableCell>
                  <Chip label={panne.status} color={statusColors[panne.status] || 'default'} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={panne.priority} color={priorityColors[panne.priority] || 'default'} size="small" />
                </TableCell>
                <TableCell>{panne.date}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 24, height: 24, fontSize: 14 }}>
                      {panne.reportedBy ? panne.reportedBy[0] : '?'}
                    </Avatar>
                    <Typography variant="body2">{panne.reportedBy || 'N/A'}</Typography>
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {panne.status === 'nouvelle' && (
                      <Tooltip title="Valider">
                        <span>
                          <Button size="small" color="success" variant="contained" onClick={() => handleValidate(panne.id)} startIcon={<CheckCircle />}>
                            Valider
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                    {panne.status === 'nouvelle' && (
                      <Tooltip title="Rejeter">
                        <span>
                          <Button size="small" color="error" variant="outlined" onClick={() => handleReject(panne.id)} startIcon={<Cancel />}>
                            Rejeter
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                    {panne.status === 'validee' && (
                      <Tooltip title="Créer une intervention">
                        <span>
                          <Button size="small" color="primary" variant="contained" onClick={() => handleCreateIntervention(panne)} startIcon={<Build />}>
                            Intervention
                          </Button>
                        </span>
                      </Tooltip>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {pannes.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">Aucune panne signalée</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Pannes; 