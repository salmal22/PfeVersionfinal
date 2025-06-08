import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Dashboard, Assignment, Group, Assessment, Notifications } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SideMenu = () => {
  const navigate = useNavigate();
  return (
    <Drawer variant="permanent" sx={{ width: 220, flexShrink: 0, [`& .MuiDrawer-paper`]: { width: 220, boxSizing: 'border-box' } }}>
      <Toolbar />
      <List>
        <ListItem button onClick={() => navigate('/responsable')}>
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button onClick={() => navigate('/responsable/interventions')}>
          <ListItemIcon><Assignment /></ListItemIcon>
          <ListItemText primary="Interventions" />
        </ListItem>
        <ListItem button onClick={() => navigate('/responsable/techniciens')}>
          <ListItemIcon><Group /></ListItemIcon>
          <ListItemText primary="Techniciens" />
        </ListItem>
        <ListItem button onClick={() => navigate('/responsable/rapports')}>
          <ListItemIcon><Assessment /></ListItemIcon>
          <ListItemText primary="Rapports" />
        </ListItem>
        <ListItem button onClick={() => navigate('/responsable/notifications')}>
          <ListItemIcon><Notifications /></ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideMenu; 