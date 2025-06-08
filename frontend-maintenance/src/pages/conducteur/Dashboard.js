import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Avatar,
  IconButton,
  Fab,
  Button,
  Tooltip,
  Divider,
  LinearProgress,
  Badge,
  Chip,
} from '@mui/material';
import {
  ReportProblem as ReportIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Assignment as AssignmentIcon,
  AddAlert as AlertIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Build as BuildIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../../components/NotificationBell';

const ConducteurDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = { id: 1, name: 'Conducteur Test', email: 'conducteur@marsamaroc.ma' };
  const currentShift = getCurrentShift();
  const currentDate = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  function getCurrentShift() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return { name: 'Matin', icon: '🌅', color: '#FFA726' };
    if (hour >= 14 && hour < 22) return { name: 'Après-midi', icon: '☀️', color: '#FF7043' };
    return { name: 'Nuit', icon: '🌙', color: '#5C6BC0' };
  }

  useEffect(() => {
    setStats({
      total: 5,
      enAttente: 2,
      enCours: 1,
      resolues: 2,
      thisWeek: 1,
    });
    setRecentActivity([
      { id: 1, created_at: new Date().toISOString(), type: 'électrique', detail: 'ascenseur', statut: 'en attente' },
      { id: 2, created_at: new Date().toISOString(), type: 'mécanique', detail: 'chariot', statut: 'en cours' },
      { id: 3, created_at: new Date().toISOString(), type: 'hydraulique', detail: 'levage', statut: 'résolu' },
    ]);
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 3, 
      bgcolor: '#f8f9fa',
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Header professionnel */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'rgba(255,255,255,0.1)',
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          }
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                width: 80, 
                height: 80,
                border: '3px solid rgba(255,255,255,0.3)'
              }}
            >
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h3" gutterBottom fontWeight="300">
              Bonjour, {user.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                {currentShift.icon} Shift {currentShift.name}
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {currentDate}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              Interface Conducteur - Système de Maintenance Marsa Maroc
            </Typography>
          </Grid>
          <Grid item>
            <NotificationBell />
          </Grid>
        </Grid>
      </Paper>

      {/* Bouton principal de signalement */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper
            elevation={4}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(211, 47, 47, 0.3)',
              }
            }}
            onClick={() => navigate('/conducteur/anomalies')}
          >
            <CardContent sx={{ p: 4 }}>
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ReportIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Typography variant="h4" color="white" gutterBottom fontWeight="500">
                    Signaler une Anomalie
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    Signalez rapidement un problème au responsable de maintenance
                  </Typography>
                </Grid>
                <Grid item>
                  <IconButton
                    size="large"
                    sx={{ 
                      color: 'white', 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    <AlertIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>

      {/* Statistiques avancées */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="600">
                    {stats.total || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Total signalées
                  </Typography>
                </Box>
                <TimelineIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
              {stats.thisWeek > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    +{stats.thisWeek} cette semaine
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ed6c02 0%, #e65100 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="600">
                    {stats.enAttente || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    En attente
                  </Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
              {stats.enAttente > 0 && (
                <LinearProgress 
                  variant="determinate" 
                  value={75} 
                  sx={{ 
                    mt: 2, 
                    bgcolor: 'rgba(255,255,255,0.3)',
                    '& .MuiLinearProgress-bar': { bgcolor: 'white' }
                  }} 
                />
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #0288d1 0%, #0277bd 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="600">
                    {stats.enCours || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    En cours
                  </Typography>
                </Box>
                <BuildIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
              {stats.enCours > 0 && (
                <Typography variant="caption" sx={{ mt: 2, opacity: 0.8 }}>
                  Intervention active
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} md={3}>
          <Card 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h3" fontWeight="600">
                    {stats.resolues || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Résolues
                  </Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.7 }} />
              </Box>
              {stats.total > 0 && (
                <Typography variant="caption" sx={{ mt: 2, opacity: 0.8 }}>
                  {((stats.resolues / stats.total) * 100).toFixed(0)}% résolues
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions et activité récente */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600" color="text.primary">
              Actions rapides
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<HistoryIcon />}
                  onClick={() => navigate('/conducteur/historique')}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    borderColor: '#1976d2',
                    color: '#1976d2',
                    '&:hover': {
                      bgcolor: '#1976d2',
                      color: 'white',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Consulter l'historique
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  startIcon={<AssignmentIcon />}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    borderColor: '#666',
                    color: '#666',
                    '&:hover': {
                      bgcolor: '#666',
                      color: 'white',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Guide d'utilisation
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3, 
              borderRadius: 3,
              bgcolor: 'white',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="600" color="text.primary">
              Activité récente
            </Typography>
            {recentActivity.length > 0 ? (
              <Box sx={{ mt: 2 }}>
                {recentActivity.map((item, index) => (
                  <Box 
                    key={item.id} 
                    sx={{ 
                      py: 2,
                      borderBottom: index < recentActivity.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(item.created_at).toLocaleDateString('fr-FR')}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {item.type} - {item.detail}
                    </Typography>
                    <Tooltip title={`Statut: ${item.statut}`}>
                      <Chip 
                        label={item.statut} 
                        size="small"
                        color={
                          item.statut === 'résolu' ? 'success' :
                          item.statut === 'en cours' ? 'info' : 'warning'
                        }
                      />
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Aucune activité récente
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="error"
        size="large"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)',
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 8px 20px rgba(211, 47, 47, 0.3)',
          },
          transition: 'all 0.3s'
        }}
        onClick={() => navigate('/conducteur/anomalies')}
      >
        <ReportIcon />
      </Fab>
    </Box>
  );
};

export default ConducteurDashboard;