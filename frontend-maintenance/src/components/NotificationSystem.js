import React, { useState, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentNotification, setCurrentNotification] = useState(null);

  useEffect(() => {
    // Vérifier les nouvelles notifications toutes les 30 secondes
    const interval = setInterval(checkNewNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkNewNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const newNotifications = response.data.filter(
        notification => !notifications.some(n => n.id === notification.id)
      );
      
      if (newNotifications.length > 0) {
        setNotifications(prev => [...prev, ...newNotifications]);
        showNextNotification();
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
    }
  };

  const showNextNotification = () => {
    if (notifications.length > 0 && !currentNotification) {
      setCurrentNotification(notifications[0]);
    }
  };

  const handleClose = () => {
    setCurrentNotification(null);
    setNotifications(prev => prev.slice(1));
    showNextNotification();
  };

  return (
    <Snackbar
      open={!!currentNotification}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity={currentNotification?.type || 'info'}
        sx={{ width: '100%' }}
      >
        {currentNotification?.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSystem; 