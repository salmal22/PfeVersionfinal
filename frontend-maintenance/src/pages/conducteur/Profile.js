import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button } from '@mui/material';

const initialProfile = {
  name: 'Conducteur Test',
  email: 'conducteur@marsamaroc.ma',
  shift: 'Matin',
  phone: '0600000000'
};

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [edit, setEdit] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setEdit(false);
    // Optionnel : sauvegarder dans localStorage
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom>Mon Profil</Typography>
        <TextField
          label="Nom"
          name="name"
          value={profile.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!edit}
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!edit}
        />
        <TextField
          label="Téléphone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!edit}
        />
        <TextField
          label="Shift"
          name="shift"
          value={profile.shift}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!edit}
        />
        <Box sx={{ mt: 2 }}>
          {edit ? (
            <Button variant="contained" onClick={handleSave}>Enregistrer</Button>
          ) : (
            <Button variant="outlined" onClick={() => setEdit(true)}>Modifier</Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Profile; 