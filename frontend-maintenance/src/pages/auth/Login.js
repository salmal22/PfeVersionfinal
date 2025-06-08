import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  AccountCircle as UserIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
} from '@mui/icons-material';
import authService from '../../services/authService';
import { loginStart, loginSuccess, loginFailure } from '../../store/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error: authError } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      errors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    dispatch(loginStart());

    try {
      const result = await authService.login(formData);
      
      if (result.success) {
        if (rememberMe) {
          localStorage.setItem('rememberLogin', 'true');
        }
        
        dispatch(loginSuccess(result.user));
        
        // Rediriger vers la page appropriée selon le rôle
        switch (result.user.role) {
          case 'conducteur':
            navigate('/conducteur');
            break;
          case 'responsable':
            navigate('/responsable');
            break;
          case 'technicien':
            navigate('/technicien');
            break;
          default:
            dispatch(loginFailure('Rôle utilisateur non reconnu'));
        }
      } else {
        dispatch(loginFailure(result.error || 'Erreur de connexion. Vérifiez vos identifiants.'));
      }
    } catch (err) {
      console.error('Login error:', err);
      dispatch(loginFailure('Erreur de connexion. Veuillez réessayer.'));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/port-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        }
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid container spacing={0} sx={{ height: '80vh', minHeight: 600 }}>
          {/* Côté gauche - Branding */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.95) 0%, rgba(21, 101, 192, 0.95) 100%)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: { xs: 0, md: 0 },
                borderBottomRightRadius: { xs: 0, md: 0 },
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Logo */}
              <Box
                sx={{
                  mb: 4,
                  p: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'auto',
                  maxWidth: '80%',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                <img
                  src="/logo-marsa-maroc.png"
                  alt="Marsa Maroc"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: '60px',
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <Typography
                  variant="h4"
                  color="primary"
                  fontWeight="bold"
                  sx={{ display: 'none' }}
                >
                  MARSA MAROC
                </Typography>
              </Box>
              
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                fontWeight="300"
                textAlign="center"
                sx={{ 
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              >
                Système de Maintenance
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                sx={{ 
                  opacity: 0.9, 
                  mb: 4, 
                  maxWidth: '80%',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                }}
              >
                Plateforme de gestion des interventions portuaires
              </Typography>
            </Card>
          </Grid>

          {/* Côté droit - Formulaire */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                borderTopLeftRadius: { xs: 0, md: 0 },
                borderBottomLeftRadius: { xs: 0, md: 0 },
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <CardContent sx={{ p: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography variant="h4" component="h2" gutterBottom fontWeight="600" color="primary">
                    Connexion
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Accédez à votre espace de travail
                  </Typography>
                </Box>

                {authError && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-message': {
                        width: '100%',
                        textAlign: 'center'
                      }
                    }}
                  >
                    {authError}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Adresse email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                    placeholder="votre.email@marsamaroc.ma"
                    disabled={loading}
                  />

                  <TextField
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    error={!!fieldErrors.password}
                    helperText={fieldErrors.password}
                    variant="outlined"
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={togglePasswordVisibility}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                    placeholder="••••••••"
                    disabled={loading}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Se souvenir de moi"
                    sx={{ mb: 3 }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={<LoginIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                      boxShadow: '0 4px 16px rgba(25, 118, 210, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                        boxShadow: '0 6px 20px rgba(25, 118, 210, 0.4)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4, opacity: 0.9 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white',
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
              fontWeight: 500,
            }}
          >
            © 2025 Marsa Maroc - Tous droits réservés
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;