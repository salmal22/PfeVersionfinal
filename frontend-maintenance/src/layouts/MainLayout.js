import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemButton,
  useTheme,
  useMediaQuery,
  Tooltip,
  Chip,
  Paper,
  Fade,
  Slide,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Build as BuildIcon,
  ExitToApp as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import NotificationSystem from '../components/NotificationSystem';

const DRAWER_WIDTH = 280;

const MainLayout = ({ role }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Load user data from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(prev => !prev);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getMenuItems = () => {
    const menuItems = [];
    
    if (role === 'conducteur') {
      menuItems.push({
        text: 'Signaler une anomalie',
        icon: <BuildIcon />,
        path: '/conducteur/anomalies'
      });
    }
    
    // Add more role-based menu items here as needed
    
    return menuItems;
  };

  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${firstInitial}${lastInitial}` || 'U';
  };

  const getUserDisplayName = () => {
    if (!userData) return 'Utilisateur';
    const { firstName, lastName, email, name } = userData;
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    if (name) {
      return name;
    }
    if (email) {
      return email.split('@')[0];
    }
    return 'Utilisateur';
  };

  const getRoleColor = () => {
    switch (role) {
      case 'conducteur':
        return '#2196F3'; // Blue
      case 'technicien':
        return '#FF9800'; // Orange
      case 'responsable':
        return '#4CAF50'; // Green
      default:
        return '#757575'; // Grey
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case 'conducteur':
        return 'Conducteur';
      case 'technicien':
        return 'Technicien';
      case 'responsable':
        return 'Responsable';
      default:
        return 'Utilisateur';
    }
  };

  const drawer = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.1)',
        zIndex: 0,
      }
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Toolbar sx={{ 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          py: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <DashboardIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, letterSpacing: '0.5px' }}>
                MarsaMaroc
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                Gestion des Portiques
              </Typography>
            </Box>
          </Box>
        </Toolbar>

        {/* User Info Section */}
        <Box sx={{ 
          p: 2.5, 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          bgcolor: 'rgba(255,255,255,0.05)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              {userData?.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              ) : (
                getInitials(userData?.firstName, userData?.lastName)
              )}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'white',
                  fontSize: '0.95rem',
                  lineHeight: 1.2,
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                {getUserDisplayName()}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: 0.8, 
                  fontSize: '0.8rem',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap'
                }}
              >
                {userData?.email || 'Aucun email'}
              </Typography>
            </Box>
          </Box>
          <Chip
            label={getRoleLabel()}
            size="small"
            sx={{
              bgcolor: getRoleColor(),
              color: 'white',
              fontWeight: 600,
              fontSize: '0.75rem',
              height: 24,
              borderRadius: '12px',
              '& .MuiChip-label': {
                px: 1.5,
              },
            }}
          />
        </Box>
        
        <List sx={{ flexGrow: 1, pt: 2, px: 1 }}>
          {getMenuItems().map((item, index) => (
            <Fade in={true} timeout={300 + index * 100} key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    minHeight: 52,
                    px: 2.5,
                    py: 1.5,
                    borderRadius: 2,
                    mx: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      transform: 'translateX(4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    },
                    '&:active': {
                      transform: 'translateX(2px)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: 44,
                    color: 'rgba(255,255,255,0.9)',
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.3rem',
                    }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      letterSpacing: '0.3px',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Fade>
          ))}
        </List>
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mx: 2 }} />
        
        <List sx={{ pb: 2, px: 1 }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 52,
                px: 2.5,
                py: 1.5,
                borderRadius: 2,
                mx: 1,
                mt: 1,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                  transform: 'translateX(4px)',
                  boxShadow: '0 4px 12px rgba(244, 67, 54, 0.3)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 44, 
                color: '#ff6b6b',
                '& .MuiSvgIcon-root': {
                  fontSize: '1.3rem',
                }
              }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Déconnexion"
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.3px',
                  color: '#ff6b6b',
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleProfileMenuClose}
      onClick={handleProfileMenuClose}
      TransitionComponent={Fade}
      PaperProps={{
        elevation: 16,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 8px 32px rgba(0,0,0,0.12))',
          mt: 1.5,
          minWidth: 240,
          borderRadius: 3,
          border: '1px solid rgba(0,0,0,0.05)',
          '& .MuiAvatar-root': {
            width: 36,
            height: 36,
            ml: -0.5,
            mr: 1.5,
          },
          '&:before': {
            content: '""',
            display: 'block',
            position: 'absolute',
            top: 0,
            right: 14,
            width: 12,
            height: 12,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
            border: '1px solid rgba(0,0,0,0.05)',
            borderBottom: 'none',
            borderRight: 'none',
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ 
        px: 3, 
        py: 2.5, 
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: getRoleColor(),
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {userData?.avatar ? (
              <img 
                src={userData.avatar} 
                alt="Profile" 
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              getInitials(userData?.firstName, userData?.lastName)
            )}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem' }}>
              {getUserDisplayName()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
              {userData?.email || 'Aucun email'}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={getRoleLabel()}
          size="small"
          sx={{
            bgcolor: getRoleColor(),
            color: 'white',
            fontWeight: 600,
            fontSize: '0.75rem',
            height: 26,
            borderRadius: '13px',
          }}
        />
      </Box>
      
      <MenuItem 
        onClick={handleProfileClick}
        sx={{ 
          py: 1.5, 
          px: 3,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(103, 126, 234, 0.08)',
            transform: 'translateX(4px)',
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 44 }}>
          <PersonIcon fontSize="small" sx={{ color: getRoleColor() }} />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Profil
        </Typography>
      </MenuItem>
      
      <MenuItem 
        onClick={handleSettingsClick}
        sx={{ 
          py: 1.5, 
          px: 3,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(103, 126, 234, 0.08)',
            transform: 'translateX(4px)',
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 44 }}>
          <SettingsIcon fontSize="small" sx={{ color: getRoleColor() }} />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Paramètres
        </Typography>
      </MenuItem>
      
      <Divider sx={{ my: 1 }} />
      
      <MenuItem 
        onClick={handleLogout} 
        sx={{ 
          py: 1.5, 
          px: 3,
          color: 'error.main',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(244, 67, 54, 0.08)',
            transform: 'translateX(4px)',
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 44 }}>
          <LogoutIcon fontSize="small" color="error" />
        </ListItemIcon>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Déconnexion
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              bgcolor: 'rgba(103, 126, 234, 0.1)',
              '&:hover': {
                bgcolor: 'rgba(103, 126, 234, 0.2)',
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Indicateur de statut en ligne */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              bgcolor: 'rgba(76, 175, 80, 0.1)',
              px: 2,
              py: 0.5,
              borderRadius: 2,
              border: '1px solid rgba(76, 175, 80, 0.2)',
            }}>
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#4CAF50',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)',
                  },
                  '70%': {
                    boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
                  },
                  '100%': {
                    boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)',
                  },
                },
              }} />
              <Typography variant="caption" sx={{ 
                color: '#4CAF50', 
                fontWeight: 600,
                fontSize: '0.75rem',
              }}>
                En ligne
              </Typography>
            </Box>

            {/* Icône de notifications */}
            <Tooltip title="Notifications" arrow>
              <IconButton
                size="small"
                sx={{
                  bgcolor: 'rgba(103, 126, 234, 0.1)',
                  color: getRoleColor(),
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(103, 126, 234, 0.2)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <NotificationsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Profil utilisateur" arrow>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ 
                  p: 0.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  }
                }}
                aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: getRoleColor(),
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    }
                  }}
                >
                  {userData?.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                    />
                  ) : (
                    getInitials(userData?.firstName, userData?.lastName)
                  )}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {profileMenu}
      
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="navigation menu"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundImage: 'none',
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: DRAWER_WIDTH,
              backgroundImage: 'none',
              border: 'none',
              boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          bgcolor: '#f8fafc',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(103, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none',
            zIndex: 0,
          }
        }}
      >
        <Toolbar sx={{ minHeight: 72 }} />
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Slide direction="up" in={true} timeout={500}>
            <div>
              <Outlet />
            </div>
          </Slide>
        </Box>
      </Box>
      
      <NotificationSystem />
    </Box>
  );
};

export default MainLayout;