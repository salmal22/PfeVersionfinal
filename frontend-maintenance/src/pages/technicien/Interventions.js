import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from '@mui/material';
import axios from 'axios';

const Interventions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [intervention, setIntervention] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    status: '',
    commentaire: '',
    actions_effectuees: '',
  });

  useEffect(() => {
    fetchIntervention();
  }, [id]);

  const fetchIntervention = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/interventions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIntervention(response.data);
      setFormData({
        status: response.data.status,
        commentaire: '',
        actions_effectuees: '',
      });
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement de l\'intervention');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/interventions/${id}/update-status`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccess('Mise à jour effectuée avec succès');
      fetchIntervention();
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'intervention');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!intervention) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Alert severity="error">Intervention non trouvée</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Détails de l'intervention
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Informations de l'intervention */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informations générales
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Portique: {intervention.portique.numero}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Type: {intervention.type}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Urgence: {intervention.urgence}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Statut actuel: {intervention.status}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Signalé par: {intervention.conducteur.nom}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date de signalement: {new Date(intervention.created_at).toLocaleString()}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {intervention.description}
            </Typography>

            {intervention.historique && intervention.historique.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Historique des mises à jour
                </Typography>
                {intervention.historique.map((entry, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">
                      {new Date(entry.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {entry.commentaire}
                    </Typography>
                  </Box>
                ))}
              </>
            )}
          </Paper>
        </Grid>

        {/* Formulaire de mise à jour */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mettre à jour l'intervention
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Nouveau statut</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      label="Nouveau statut"
                    >
                      <MenuItem value="en_cours">En cours</MenuItem>
                      <MenuItem value="en_attente">En attente</MenuItem>
                      <MenuItem value="resolue">Résolue</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="actions_effectuees"
                    label="Actions effectuées"
                    value={formData.actions_effectuees}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="commentaire"
                    label="Commentaire"
                    value={formData.commentaire}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                  >
                    Mettre à jour
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Interventions; 