import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Button,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HISTO_KEY = 'historique_conducteur';

const getInitialHistorique = () => {
  const saved = localStorage.getItem(HISTO_KEY);
  if (saved) return JSON.parse(saved);
  return [
    {
      id: 1,
      portique: { nom: 'Portique A' },
      type: 'électrique',
      detail: 'ascenseur',
      description: 'Problème ascenseur',
      statut: 'résolu',
      date_debut: new Date().toISOString(),
      date_fin: new Date().toISOString(),
    },
    {
      id: 2,
      portique: { nom: 'Portique B' },
      type: 'mécanique',
      detail: 'chariot',
      description: 'Problème chariot',
      statut: 'en attente',
      date_debut: new Date().toISOString(),
      date_fin: null,
    },
  ];
};

const Historique = () => {
  const [historique, setHistorique] = useState(getInitialHistorique());
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(HISTO_KEY, JSON.stringify(historique));
  }, [historique]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'en_cours':
        return 'warning';
      case 'resolue':
        return 'success';
      case 'en_attente':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'en_cours':
        return <BuildIcon />;
      case 'resolue':
        return <CheckCircleIcon />;
      case 'en_attente':
        return <ScheduleIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getUrgenceColor = (urgence) => {
    switch (urgence) {
      case 'critique':
        return 'error';
      case 'haute':
        return 'warning';
      case 'moyenne':
        return 'info';
      case 'basse':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => navigate('/conducteur/anomalies')}
        >
          Signaler une anomalie
        </Button>
      </Box>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Historique des anomalies</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Portique</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Détail</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Statut</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historique.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{new Date(item.date_debut).toLocaleDateString()}</TableCell>
                  <TableCell>{item.portique.nom}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.detail}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.statut}
                      color={
                        item.statut === 'résolu'
                          ? 'success'
                          : item.statut === 'en cours'
                          ? 'info'
                          : 'warning'
                      }
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default Historique; 