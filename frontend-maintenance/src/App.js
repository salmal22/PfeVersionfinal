import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/auth/Login';
import ConducteurDashboard from './pages/conducteur/Dashboard';
import ConducteurAnomalies from './pages/conducteur/Anomalies';
import ConducteurHistorique from './pages/conducteur/Historique';

import ResponsableDashboard from './pages/responsable/Dashboard';
import ResponsableInterventions from './pages/responsable/Interventions';
import ResponsableTechniciens from './pages/responsable/Techniciens';
import ResponsableRapports from './pages/responsable/Rapports';

import TechnicienDashboard from './pages/technicien/Dashboard';
import TechnicienInterventions from './pages/technicien/Interventions';

// Components
import ProtectedRoute from './components/ProtectedRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Routes Conducteur */}
          <Route path="/conducteur" element={
            <ProtectedRoute allowedRoles={['conducteur']}>
              <MainLayout role="conducteur" />
            </ProtectedRoute>
          }>
            <Route index element={<ConducteurDashboard />} />
            <Route path="dashboard" element={<ConducteurDashboard />} />
            <Route path="anomalies" element={<ConducteurAnomalies />} />
            <Route path="historique" element={<ConducteurHistorique />} />
          </Route>

          {/* Routes Responsable */}
          <Route path="/responsable" element={
            <ProtectedRoute allowedRoles={['responsable']}>
              <MainLayout role="responsable" />
            </ProtectedRoute>
          }>
            <Route index element={<ResponsableDashboard />} />
            <Route path="dashboard" element={<ResponsableDashboard />} />
            <Route path="interventions" element={<ResponsableInterventions />} />
            <Route path="techniciens" element={<ResponsableTechniciens />} />
            <Route path="rapports" element={<ResponsableRapports />} />
          </Route>

          {/* Routes Technicien */}
          <Route path="/technicien" element={
            <ProtectedRoute allowedRoles={['technicien']}>
              <MainLayout role="technicien" />
            </ProtectedRoute>
          }>
            <Route index element={<TechnicienDashboard />} />
            <Route path="dashboard" element={<TechnicienDashboard />} />
            <Route path="interventions" element={<TechnicienInterventions />} />
          </Route>

          {/* Redirections vers les dashboards */}
          <Route path="/conducteur/dashboard" element={<Navigate to="/conducteur" replace />} />
          <Route path="/responsable/dashboard" element={<Navigate to="/responsable" replace />} />
          <Route path="/technicien/dashboard" element={<Navigate to="/technicien" replace />} />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;