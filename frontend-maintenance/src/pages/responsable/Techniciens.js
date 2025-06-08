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
  Grid,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import axios from 'axios';

const Techniciens = () => {
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTechnicien, setSelectedTechnicien] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [formData, setFormData] = useState({
    date_debut: '',
    date_fin: '',
    type: '',
    commentaire: '',
  });

  useEffect(() => {
    fetchTechniciens();
  }, []);

  const fetchTechniciens = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/users?role=technicien', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechniciens(response.data);
      setLoading(false);
    } catch (err) {
      setError('Erreur lors du chargement des techniciens');
      setLoading(false);
    }
  };

  const handleOpenDialog = (technicien, type) => {
    setSelectedTechnicien(technicien);
    setDialogType(type);
    setOpenDialog(true);
    setFormData({
      date_debut: '',
      date_fin: '',
      type: '',
      commentaire: '',
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTechnicien(null);
    setDialogType('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddConge = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8000/api/conges`,
        {
          user_id: selectedTechnicien.id,
          ...formData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleCloseDialog();
      fetchTechniciens();
    } catch (err) {
      setError('Erreur lors de l\'ajout du congé');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible':
        return 'success';
      case 'en_intervention':
        return 'warning';
      case 'en_conge':
        return 'error';
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
        Gestion des techniciens
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
              <TableCell>Nom</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Interventions en cours</TableCell>
              <TableCell>Congés</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {techniciens.map((technicien) => (
              <TableRow key={technicien.id}>
                <TableCell>{technicien.nom}</TableCell>
                <TableCell>{technicien.email}</TableCell>
                <TableCell>
                  <Chip
                    label={technicien.status}
                    color={getStatusColor(technicien.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {technicien.interventions_en_cours?.map((intervention) => (
                    <Chip
                      key={intervention.id}
                      label={`Portique ${intervention.portique.numero}`}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  {technicien.conges?.map((conge) => (
                    <Chip
                      key={conge.id}
                      label={`${new Date(conge.date_debut).toLocaleDateString()} - ${new Date(
                        conge.date_fin
                      ).toLocaleDateString()}`}
                      size="small"
                      sx={{ mr: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>
                  <Tooltip title="Voir les détails">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(technicien, 'view')}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ajouter un congé">
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(technicien, 'conge')}
                    >
                      <EventIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === 'view' && 'Détails du technicien'}
          {dialogType === 'conge' && 'Ajouter un congé'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'view' && selectedTechnicien && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Nom: {selectedTechnicien.nom}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Email: {selectedTechnicien.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Statut: {selectedTechnicien.status}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Interventions en cours: {selectedTechnicien.interventions_en_cours?.length || 0}
              </Typography>
            </Box>
          )}
          {dialogType === 'conge' && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="date_debut"
                    label="Date de début"
                    value={formData.date_debut}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    name="date_fin"
                    label="Date de fin"
                    value={formData.date_fin}
                    onChange={handleFormChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Type de congé</InputLabel>
                    <Select
                      name="type"
                      value={formData.type}
                      onChange={handleFormChange}
                      label="Type de congé"
                    >
                      <MenuItem value="conges_payes">Congés payés</MenuItem>
                      <MenuItem value="maladie">Maladie</MenuItem>
                      <MenuItem value="formation">Formation</MenuItem>
                      <MenuItem value="autre">Autre</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    name="commentaire"
                    label="Commentaire"
                    value={formData.commentaire}
                    onChange={handleFormChange}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          {dialogType === 'conge' && (
            <Button onClick={handleAddConge} variant="contained">
              Ajouter
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Techniciens; 