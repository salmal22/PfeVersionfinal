import React, { useState } from 'react';
import { IconButton, Badge, Popover, List, ListItem, ListItemText, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

const initialNotifications = [
  { id: 1, message: "Nouvelle intervention assignée", lu: false, date: new Date().toLocaleString() },
  { id: 2, message: "Votre signalement a été pris en charge", lu: true, date: new Date().toLocaleString() },
];

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, lu: true } : n));
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.filter(n => !n.lu).length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <List sx={{ minWidth: 300 }}>
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="Aucune notification" />
            </ListItem>
          )}
          {notifications.map(n => (
            <ListItem key={n.id} sx={{ bgcolor: n.lu ? '#f0f0f0' : '#e3f2fd' }}>
              <ListItemText
                primary={n.message}
                secondary={n.date}
              />
              {!n.lu && (
                <Button size="small" onClick={() => markAsRead(n.id)}>Marquer comme lu</Button>
              )}
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default NotificationBell; 