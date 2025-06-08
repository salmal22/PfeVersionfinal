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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Interventions = () => {
  const [interventions, setInterventions] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({
    techniciens: [],
    commentaire: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [interventionsRes, techniciensRes] = await Promise.all([
        axios.get('http://localhost:8000/api/interventions', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:8000/api/users?role=technicien', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setInterventions(interventionsRes.data);
      setTechniciens(techniciensRes.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  };

  const handleOpenDialog = (intervention, type) => {
    setSelectedIntervention(intervention);
    setDialogType(type);
    setOpenDialog(true);
    setFormData({
      techniciens: [],
      commentaire: '',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedIntervention(null);
    setDialogType('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignTechniciens = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/interventions/${selectedIntervention.id}/assigner-techniciens`,
        {
          techniciens: formData.techniciens,
          commentaire: formData.commentaire,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError('Erreur lors de l\'affectation des techniciens');
    }
  };

  const handleMarkAsResolved = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/interventions/${selectedIntervention.id}/marquer-resolue`,
        {
          commentaire: formData.commentaire,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleCloseDialog();
      fetchData();
    } catch (err) {
      setError('Erreur lors de la résolution de l\'intervention');
    }
  };

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

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des interventions
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Portique</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Urgence</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Techniciens</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {interventions.map((intervention) => (
              <TableRow key={intervention.id}>
                <TableCell>
                  {new Date(intervention.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>Portique {intervention.portique.numero}</TableCell>
                <TableCell>{intervention.type}</TableCell>
                <TableCell>
                  <Chip
                    label={intervention.urgence}
                    color={getUrgenceColor(intervention.urgence)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={intervention.status}
                    color={getStatusColor(intervention.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {intervention.techniciens?.map((tech) => (
                    <Chip
                      key={tech.id}
                      label={tech.nom}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Tooltip title="Voir les détails">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(intervention, 'view')}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  {intervention.status === 'en_attente' && (
                    <Tooltip title="Affecter des techniciens">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(intervention, 'assign')}
                      >
                        <AssignmentIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  {intervention.status === 'en_cours' && (
                    <Tooltip title="Marquer comme résolue">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(intervention, 'resolve')}
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'view' && 'Détails de l\'intervention'}
          {dialogType === 'assign' && 'Affecter des techniciens'}
          {dialogType === 'resolve' && 'Marquer comme résolue'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedIntervention && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Description: {selectedIntervention.description}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Signalé par: {selectedIntervention.conducteur.nom}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date de signalement: {new Date(selectedIntervention.created_at).toLocaleString()}
              </Typography>
            </Box>
          )}
          {(dialogType === 'assign' || dialogType === 'resolve') && (
            <Box sx={{ mt: 2 }}>
              {dialogType === 'assign' && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Techniciens</InputLabel>
                  <Select
                    multiple
                    name="techniciens"
                    value={formData.techniciens}
                    onChange={handleFormChange}
                    label="Techniciens"
                  >
                    {techniciens.map((tech) => (
                      <MenuItem key={tech.id} value={tech.id}>
                        {tech.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              <TextField
                fullWidth
                multiline
                rows={4}
                name="commentaire"
                label="Commentaire"
                value={formData.commentaire}
                onChange={handleFormChange}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          {dialogType === 'assign' && (
            <Button onClick={handleAssignTechniciens} variant="contained">
              Affecter
            </Button>
          )}
          {dialogType === 'resolve' && (
            <Button onClick={handleMarkAsResolved} variant="contained">
              Marquer comme résolue
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Interventions; 