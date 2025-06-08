import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Build as BuildIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [interventions, setInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInterventions();
  }, []);

  const fetchInterventions = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await axios.get(
        `http://localhost:8000/api/interventions/technicien/${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setInterventions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des interventions');
      setLoading(false);
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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Statistiques rapides */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Interventions en cours
              </Typography>
              <Typography variant="h4">
                {interventions.filter((i) => i.status === 'en_cours').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Interventions résolues aujourd'hui
              </Typography>
              <Typography variant="h4">
                {interventions.filter(
                  (i) =>
                    i.status === 'resolue' &&
                    new Date(i.updated_at).toDateString() === new Date().toDateString()
                ).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Interventions en attente
              </Typography>
              <Typography variant="h4">
                {interventions.filter((i) => i.status === 'en_attente').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Liste des interventions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Mes interventions
            </Typography>
            <Grid container spacing={2}>
              {interventions.map((intervention) => (
                <Grid item xs={12} md={6} key={intervention.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6">
                          Portique {intervention.portique.numero}
                        </Typography>
                        <Chip
                          label={intervention.urgence}
                          color={getUrgenceColor(intervention.urgence)}
                          size="small"
                        />
                      </Box>
                      <Typography color="textSecondary" gutterBottom>
                        Type: {intervention.type}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {intervention.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="textSecondary">
                          Signalé le: {new Date(intervention.created_at).toLocaleString()}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => window.location.href = `/technicien/interventions/${intervention.id}`}
                        >
                          Voir les détails
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 