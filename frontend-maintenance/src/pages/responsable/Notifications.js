import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, List, ListItem, ListItemText, Button, Chip } from '@mui/material';

const NOTIF_KEY = 'notifications_responsable';

const NotificationsResponsable = () => {
  const [notifications, setNotifications] = useState([]);

  // Chargement initial
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
    setNotifications(saved);
  }, []);

  // Synchronisation temps réel entre onglets + intervalle
  useEffect(() => {
    const updateNotifications = () => {
      const saved = JSON.parse(localStorage.getItem(NOTIF_KEY) || '[]');
      setNotifications(saved);
    };
    window.addEventListener('storage', updateNotifications);
    const interval = setInterval(updateNotifications, 2000);
    return () => {
      window.removeEventListener('storage', updateNotifications);
      clearInterval(interval);
    };
  }, []);

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, lu: true }));
    setNotifications(updated);
    localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">Notifications reçues</Typography>
          <Button variant="outlined" onClick={markAllAsRead}>Tout marquer comme lu</Button>
        </Box>
        <List>
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="Aucune notification reçue" />
            </ListItem>
          )}
          {notifications.map(n => (
            <ListItem key={n.id} sx={{ bgcolor: n.lu ? '#f0f0f0' : '#e3f2fd', mb: 1, borderRadius: 2 }}>
              <ListItemText
                primary={n.message}
                secondary={n.date}
              />
              <Chip label={n.lu ? 'Lue' : 'Non lue'} color={n.lu ? 'success' : 'warning'} size="small" />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default NotificationsResponsable; 