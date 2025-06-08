import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Users,
  Wrench,
  BarChart3,
  Bell,
  RefreshCw,
  CheckCircle,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Settings,
  Home,
  Calendar,
  Clock,
  User,
  UserPlus,
  Save,
  Search,
  Filter
} from 'lucide-react';

// Service de données amélioré
class DataService {
  constructor() {
    this.ANOMALIES_KEY = 'maintenance_anomalies';
    this.NOTIFICATIONS_KEY = 'notifications_responsable';
    this.INTERVENTIONS_KEY = 'maintenance_interventions';
    this.TECHNICIENS_KEY = 'maintenance_techniciens';
    this.HISTO_KEY = 'historique_conducteur';
    this.AFFECTATIONS_KEY = 'maintenance_affectations';
    this.initializeData();
  }

  initializeData() {
    if (!this.getData(this.ANOMALIES_KEY)) {
      const initialAnomalies = [
        {
          id: 1,
          title: 'Problème électrique ascenseur',
          description: 'Court-circuit détecté sur le système d\'ascenseur',
          status: 'nouvelle',
          priority: 'haute',
          date: new Date().toISOString(),
          reportedBy: 'Ahmed Alami',
          location: 'Portique P5',
          type: 'électrique',
          detail: 'ascenseur',
          portique: { nom: 'P5' }
        },
        {
          id: 2,
          title: 'Fuite hydraulique',
          description: 'Fuite détectée sur le système hydraulique',
          status: 'validee',
          priority: 'moyenne',
          date: new Date(Date.now() - 86400000).toISOString(),
          reportedBy: 'Fatima El Mansouri',
          location: 'Portique P3',
          type: 'hydraulique',
          detail: 'fuite',
          portique: { nom: 'P3' }
        }
      ];
      this.setData(this.ANOMALIES_KEY, initialAnomalies);
    }

    if (!this.getData(this.TECHNICIENS_KEY)) {
      const initialTechniciens = [
        {
          id: 1,
          nom: 'Dubois',
          prenom: 'Jean',
          email: 'jean.dubois@company.com',
          telephone: '0612345678',
          specialite: 'Électrique',
          shift: 'matin',
          statut: 'actif',
          interventions: 0,
          status: 'disponible',
          experience: '5 ans',
          certifications: ['Habilitation électrique', 'Sécurité portuaire']
        },
        {
          id: 2,
          nom: 'Martin',
          prenom: 'Pierre',
          email: 'pierre.martin@company.com',
          telephone: '0687654321',
          specialite: 'Mécanique',
          shift: 'apres-midi',
          statut: 'actif',
          interventions: 1,
          status: 'en_intervention',
          experience: '8 ans',
          certifications: ['Mécanique industrielle', 'Grue portuaire']
        },
        {
          id: 3,
          nom: 'Bernard',
          prenom: 'Sophie',
          email: 'sophie.bernard@company.com',
          telephone: '0698765432',
          specialite: 'Hydraulique',
          shift: 'nuit',
          statut: 'actif',
          interventions: 0,
          status: 'disponible',
          experience: '3 ans',
          certifications: ['Hydraulique avancée']
        }
      ];
      this.setData(this.TECHNICIENS_KEY, initialTechniciens);
    }

    if (!this.getData(this.INTERVENTIONS_KEY)) {
      const initialInterventions = [
        {
          id: 1,
          anomalieId: null,
          portique: 'P5',
          type: 'Électrique',
          urgence: 'haute',
          description: 'Réparation circuit électrique',
          statut: 'en_cours',
          status: 'en_cours',
          date: new Date().toISOString(),
          startDate: new Date().toISOString(),
          endDate: null,
          technician: 'Pierre Martin',
          technicianId: 2,
          estimatedDuration: 120,
          actualDuration: null,
          notes: [],
          pieces: []
        }
      ];
      this.setData(this.INTERVENTIONS_KEY, initialInterventions);
    }

    if (!this.getData(this.AFFECTATIONS_KEY)) {
      this.setData(this.AFFECTATIONS_KEY, []);
    }
  }

  getData(key) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || 'null');
      return data;
    } catch {
      return null;
    }
  }

  setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getAnomalies() {
    return this.getData(this.ANOMALIES_KEY) || [];
  }

  addAnomaly(anomaly) {
    const anomalies = this.getAnomalies();
    const newAnomaly = {
      ...anomaly,
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'nouvelle',
      title: `${anomaly.type} - ${anomaly.detail}`,
      location: `Portique ${anomaly.portique.nom}`,
      reportedBy: 'Conducteur',
      priority: this.getPriorityFromType(anomaly.type)
    };
    
    anomalies.unshift(newAnomaly);
    this.setData(this.ANOMALIES_KEY, anomalies);
    
    this.addNotification({
      id: Date.now(),
      message: `🚨 Nouvelle anomalie: ${newAnomaly.title} sur ${newAnomaly.location}`,
      date: new Date().toLocaleString('fr-FR'),
      type: 'anomaly',
      priority: newAnomaly.priority,
      lu: false
    });
    
    return newAnomaly;
  }

  updateAnomaly(id, updates) {
    const anomalies = this.getAnomalies();
    const index = anomalies.findIndex(a => a.id === id);
    if (index !== -1) {
      anomalies[index] = { ...anomalies[index], ...updates };
      this.setData(this.ANOMALIES_KEY, anomalies);
      
      if (updates.status) {
        this.addNotification({
          id: Date.now(),
          message: `Statut mis à jour: ${anomalies[index].title} - ${updates.status}`,
          date: new Date().toLocaleString('fr-FR'),
          type: 'status_update',
          lu: false
        });
      }
      return anomalies[index];
    }
    return null;
  }

  deleteAnomaly(id) {
    const anomalies = this.getAnomalies();
    const filtered = anomalies.filter(a => a.id !== id);
    this.setData(this.ANOMALIES_KEY, filtered);
  }

  getTechniciens() {
    return this.getData(this.TECHNICIENS_KEY) || [];
  }

  addTechnicien(technicien) {
    const techniciens = this.getTechniciens();
    const newTechnicien = {
      ...technicien,
      id: Date.now(),
      interventions: 0,
      status: 'disponible',
      statut: 'actif'
    };
    techniciens.push(newTechnicien);
    this.setData(this.TECHNICIENS_KEY, techniciens);
    return newTechnicien;
  }

  updateTechnicien(id, updates) {
    const techniciens = this.getTechniciens();
    const index = techniciens.findIndex(t => t.id === id);
    if (index !== -1) {
      techniciens[index] = { ...techniciens[index], ...updates };
      this.setData(this.TECHNICIENS_KEY, techniciens);
      return techniciens[index];
    }
    return null;
  }

  deleteTechnicien(id) {
    const techniciens = this.getTechniciens();
    const filtered = techniciens.filter(t => t.id !== id);
    this.setData(this.TECHNICIENS_KEY, filtered);
  }

  getInterventions() {
    return this.getData(this.INTERVENTIONS_KEY) || [];
  }

  addIntervention(intervention) {
    const interventions = this.getInterventions();
    const newIntervention = {
      ...intervention,
      id: Date.now(),
      date: new Date().toISOString(),
      startDate: new Date().toISOString(),
      endDate: null,
      status: 'en_attente',
      statut: 'en_attente',
      notes: [],
      pieces: []
    };
    interventions.unshift(newIntervention);
    this.setData(this.INTERVENTIONS_KEY, interventions);
    return newIntervention;
  }

  updateIntervention(id, updates) {
    const interventions = this.getInterventions();
    const index = interventions.findIndex(i => i.id === id);
    if (index !== -1) {
      interventions[index] = { ...interventions[index], ...updates };
      this.setData(this.INTERVENTIONS_KEY, interventions);
      return interventions[index];
    }
    return null;
  }

  deleteIntervention(id) {
    const interventions = this.getInterventions();
    const filtered = interventions.filter(i => i.id !== id);
    this.setData(this.INTERVENTIONS_KEY, filtered);
  }

  affecterTechnicien(anomalieId, technicienId, priority = 'moyenne', estimatedDuration = 60) {
    const anomalie = this.getAnomalies().find(a => a.id === anomalieId);
    const technicien = this.getTechniciens().find(t => t.id === technicienId);
    
    if (!anomalie || !technicien) {
      throw new Error('Anomalie ou technicien introuvable');
    }

    const intervention = {
      anomalieId: anomalieId,
      portique: anomalie.location,
      type: anomalie.type,
      urgence: priority,
      description: `Intervention pour: ${anomalie.title}\n${anomalie.description}`,
      statut: 'assignee',
      status: 'assignee',
      technician: `${technicien.prenom} ${technicien.nom}`,
      technicianId: technicienId,
      estimatedDuration: estimatedDuration
    };

    const newIntervention = this.addIntervention(intervention);

    this.updateAnomaly(anomalieId, { 
      status: 'assignee',
      interventionId: newIntervention.id,
      technicienAffecte: `${technicien.prenom} ${technicien.nom}`
    });

    this.updateTechnicien(technicienId, { 
      status: 'assigne',
      interventions: technicien.interventions + 1 
    });

    const affectations = this.getData(this.AFFECTATIONS_KEY) || [];
    const affectation = {
      id: Date.now(),
      anomalieId,
      technicienId,
      interventionId: newIntervention.id,
      dateAffectation: new Date().toISOString(),
      statut: 'active',
      priority,
      estimatedDuration
    };
    affectations.push(affectation);
    this.setData(this.AFFECTATIONS_KEY, affectations);

    this.addNotification({
      id: Date.now(),
      message: `👨‍🔧 Technicien ${technicien.prenom} ${technicien.nom} affecté à l'anomalie: ${anomalie.title}`,
      date: new Date().toLocaleString('fr-FR'),
      type: 'affectation',
      lu: false
    });

    return { intervention: newIntervention, affectation };
  }

  getNotifications() {
    return this.getData(this.NOTIFICATIONS_KEY) || [];
  }

  addNotification(notification) {
    const notifications = this.getNotifications();
    notifications.unshift(notification);
    this.setData(this.NOTIFICATIONS_KEY, notifications);
    window.dispatchEvent(new Event('storage'));
  }

  markNotificationAsRead(id) {
    const notifications = this.getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].lu = true;
      this.setData(this.NOTIFICATIONS_KEY, notifications);
    }
  }

  markAllNotificationsAsRead() {
    const notifications = this.getNotifications().map(n => ({ ...n, lu: true }));
    this.setData(this.NOTIFICATIONS_KEY, notifications);
  }

  getPriorityFromType(type) {
    const priorities = {
      'électrique': 'haute',
      'mécanique': 'moyenne',
      'hydraulique': 'haute'
    };
    return priorities[type] || 'moyenne';
  }

  getStats() {
    const anomalies = this.getAnomalies();
    const techniciens = this.getTechniciens();
    const interventions = this.getInterventions();

    return {
      totalAnomalies: anomalies.length,
      nouvellesAnomalies: anomalies.filter(a => a.status === 'nouvelle').length,
      anomaliesValidees: anomalies.filter(a => a.status === 'validee').length,
      anomaliesAssignees: anomalies.filter(a => a.status === 'assignee').length,
      totalInterventions: interventions.length,
      interventionsEnCours: interventions.filter(i => i.status === 'en_cours').length,
      interventionsAssignees: interventions.filter(i => i.status === 'assignee').length,
      techniciensDisponibles: techniciens.filter(t => t.status === 'disponible').length,
      techniciensOccupes: techniciens.filter(t => t.status !== 'disponible').length,
      pannesParType: {
        electrique: anomalies.filter(a => a.type === 'électrique').length,
        mecanique: anomalies.filter(a => a.type === 'mécanique').length,
        hydraulique: anomalies.filter(a => a.type === 'hydraulique').length
      }
    };
  }
}

const dataService = new DataService();

const ResponsableDashboard = () => {
  // States
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [anomalies, setAnomalies] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' });
  
  // Modals
  const [showAffectationModal, setShowAffectationModal] = useState(false);
  const [showTechnicienModal, setShowTechnicienModal] = useState(false);
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [selectedAnomalie, setSelectedAnomalie] = useState(null);
  const [selectedTechnicien, setSelectedTechnicien] = useState(null);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Styles CSS
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #2563eb, #9333ea)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginRight: '1rem'
    },
    nav: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '0 1.5rem'
    },
    navTabs: {
      display: 'flex'
    },
    navTab: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      borderBottom: '2px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'none',
      border: 'none'
    },
    navTabActive: {
      borderBottomColor: '#3b82f6',
      color: '#2563eb',
      backgroundColor: '#eff6ff'
    },
    main: {
      padding: '1.5rem'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      marginBottom: '1rem'
    },
    statCard: {
      padding: '1.5rem',
      borderRadius: '0.75rem',
      color: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    button: {
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s'
    },
    buttonPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    buttonSuccess: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    buttonWarning: {
      backgroundColor: '#f59e0b',
      color: 'white'
    },
    buttonDanger: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    buttonSecondary: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db'
    },
    grid: {
      display: 'grid',
      gap: '1.5rem'
    },
    gridCols5: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
    },
    gridCols3: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      backgroundColor: 'white'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      resize: 'vertical'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      padding: '0.75rem 1.5rem',
      textAlign: 'left',
      fontSize: '0.75rem',
      fontWeight: '500',
      color: '#6b7280',
      textTransform: 'uppercase',
      borderBottom: '1px solid #e5e7eb'
    },
    tableCell: {
      padding: '1rem 1.5rem',
      borderBottom: '1px solid #e5e7eb'
    },
    tableRow: {
      transition: 'background-color 0.2s'
    },
    badge: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
    }
  };

  // Charger les données avec protection des modals
  useEffect(() => {
    const loadData = () => {
      setAnomalies(dataService.getAnomalies());
      setInterventions(dataService.getInterventions());
      setTechniciens(dataService.getTechniciens());
      setStats(dataService.getStats());
      
      const notifs = dataService.getNotifications();
      setNotifications(notifs);
      setNotifCount(notifs.filter(n => !n.lu).length);
    };

    loadData();
    
    // Auto-refresh uniquement si aucun modal n'est ouvert
    const interval = setInterval(() => {
      const isModalOpen = showAffectationModal || showTechnicienModal || showInterventionModal;
      if (!isModalOpen) {
        loadData();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [showAffectationModal, showTechnicienModal, showInterventionModal]);

  useEffect(() => {
    const handleStorageChange = () => {
      setAnomalies(dataService.getAnomalies());
      setStats(dataService.getStats());
      
      const notifs = dataService.getNotifications();
      setNotifications(notifs);
      setNotifCount(notifs.filter(n => !n.lu).length);
      
      setSnackbar({
        open: true,
        message: 'Nouvelle notification reçue !',
        type: 'info'
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handlers principaux
  const handleValidate = (id) => {
    dataService.updateAnomaly(id, { status: 'validee' });
    refreshData();
    showSnackbar('Anomalie validée avec succès', 'success');
  };

  const handleReject = (id) => {
    dataService.updateAnomaly(id, { status: 'rejetee' });
    refreshData();
    showSnackbar('Anomalie rejetée', 'warning');
  };

  const handleAffectation = (anomalieId, technicienId, priority, estimatedDuration) => {
    try {
      dataService.affecterTechnicien(anomalieId, technicienId, priority, estimatedDuration);
      refreshData();
      setShowAffectationModal(false);
      showSnackbar('Technicien affecté avec succès', 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const refreshData = () => {
    setAnomalies(dataService.getAnomalies());
    setInterventions(dataService.getInterventions());
    setTechniciens(dataService.getTechniciens());
    setStats(dataService.getStats());
  };

  const showSnackbar = (message, type) => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => setSnackbar({ open: false, message: '', type: 'info' }), 3000);
  };

  // Utility functions
  const getStatusColor = (status) => {
    const colors = {
      'nouvelle': { bg: '#fef3c7', text: '#92400e', border: '#fbbf24' },
      'validee': { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
      'assignee': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
      'rejetee': { bg: '#fee2e2', text: '#dc2626', border: '#ef4444' },
      'en_cours': { bg: '#f3e8ff', text: '#7c3aed', border: '#a855f7' },
      'terminee': { bg: '#f3f4f6', text: '#374151', border: '#6b7280' }
    };
    return colors[status] || colors['terminee'];
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'critique': '#ef4444',
      'haute': '#f97316',
      'moyenne': '#3b82f6',
      'basse': '#10b981'
    };
    return colors[priority] || '#6b7280';
  };

  const getFilteredAnomalies = () => {
    return anomalies.filter(anomalie => {
      const statusMatch = statusFilter === 'all' || anomalie.status === statusFilter;
      const priorityMatch = priorityFilter === 'all' || anomalie.priority === priorityFilter;
      const searchMatch = searchTerm === '' || 
        anomalie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anomalie.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && priorityMatch && searchMatch;
    });
  };

  // Components
  const StatCard = ({ icon: Icon, title, value, subtitle, color = '#3b82f6', trend }) => (
    <div 
      style={{
        ...styles.statCard,
        background: `linear-gradient(135deg, ${color}, ${color}dd)`
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.2)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '1rem' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '0.5rem', padding: '0.75rem' }}>
          <Icon size={24} />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
            <TrendingUp size={16} style={{ marginRight: '0.25rem' }} />
            +{trend}%
          </div>
        )}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.25rem', opacity: 0.9 }}>{title}</div>
      <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>{subtitle}</div>
    </div>
  );

  const Badge = ({ children, color }) => {
    const statusColor = getStatusColor(children);
    return (
      <span style={{
        ...styles.badge,
        backgroundColor: statusColor.bg,
        color: statusColor.text,
        border: `1px solid ${statusColor.border}`
      }}>
        {children}
      </span>
    );
  };

  const PriorityBadge = ({ children }) => {
    const color = getPriorityColor(children);
    return (
      <span style={{
        ...styles.badge,
        backgroundColor: color,
        color: 'white'
      }}>
        {children}
      </span>
    );
  };

  // Modals
  const AffectationModal = () => {
    const [formData, setFormData] = useState({
      technicienId: '',
      priority: 'moyenne',
      estimatedDuration: 60
    });

    const techniciensDisponibles = techniciens.filter(t => 
      t.status === 'disponible' && 
      (t.specialite.toLowerCase() === selectedAnomalie?.type?.toLowerCase() || selectedAnomalie?.type === 'général')
    );

    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, width: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Affecter un Technicien</h3>
            <button 
              onClick={() => setShowAffectationModal(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>
          
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
            <h4 style={{ fontWeight: '500', fontSize: '0.875rem', color: '#6b7280' }}>Anomalie sélectionnée</h4>
            <p style={{ fontWeight: '600' }}>{selectedAnomalie?.title}</p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{selectedAnomalie?.location}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Technicien
              </label>
              <select
                value={formData.technicienId}
                onChange={(e) => setFormData({...formData, technicienId: e.target.value})}
                style={styles.select}
              >
                <option value="">Sélectionner un technicien</option>
                {techniciensDisponibles.map(tech => (
                  <option key={tech.id} value={tech.id}>
                    {tech.prenom} {tech.nom} - {tech.specialite}
                  </option>
                ))}
              </select>
              {techniciensDisponibles.length === 0 && (
                <p style={{ fontSize: '0.875rem', color: '#f97316', marginTop: '0.25rem' }}>
                  Aucun technicien disponible pour ce type d'intervention
                </p>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Priorité
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                style={styles.select}
              >
                <option value="basse">Basse</option>
                <option value="moyenne">Moyenne</option>
                <option value="haute">Haute</option>
                <option value="critique">Critique</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Durée estimée (minutes)
              </label>
              <input
                type="number"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({...formData, estimatedDuration: parseInt(e.target.value)})}
                style={styles.input}
                min="15"
                step="15"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
              <button
                onClick={() => setShowAffectationModal(false)}
                style={{ ...styles.button, ...styles.buttonSecondary, flex: 1 }}
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (!formData.technicienId) {
                    showSnackbar('Veuillez sélectionner un technicien', 'error');
                    return;
                  }
                  handleAffectation(selectedAnomalie?.id, parseInt(formData.technicienId), formData.priority, formData.estimatedDuration);
                }}
                style={{ 
                  ...styles.button, 
                  ...styles.buttonPrimary, 
                  flex: 1,
                  opacity: techniciensDisponibles.length === 0 ? 0.5 : 1,
                  cursor: techniciensDisponibles.length === 0 ? 'not-allowed' : 'pointer'
                }}
                disabled={techniciensDisponibles.length === 0}
              >
                Affecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TechnicienModal = () => {
    const [formData, setFormData] = useState({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      specialite: 'Électrique',
      shift: 'matin',
      experience: '',
      certifications: ''
    });

    useEffect(() => {
      if (editMode && selectedTechnicien) {
        setFormData({
          nom: selectedTechnicien.nom || '',
          prenom: selectedTechnicien.prenom || '',
          email: selectedTechnicien.email || '',
          telephone: selectedTechnicien.telephone || '',
          specialite: selectedTechnicien.specialite || 'Électrique',
          shift: selectedTechnicien.shift || 'matin',
          experience: selectedTechnicien.experience || '',
          certifications: selectedTechnicien.certifications?.join(', ') || ''
        });
      } else {
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          specialite: 'Électrique',
          shift: 'matin',
          experience: '',
          certifications: ''
        });
      }
    }, [editMode, selectedTechnicien]);

    const handleSubmit = () => {
      if (!formData.nom || !formData.prenom || !formData.email) {
        showSnackbar('Veuillez remplir tous les champs obligatoires', 'error');
        return;
      }

      const technicienData = {
        ...formData,
        certifications: formData.certifications.split(',').map(c => c.trim()).filter(c => c)
      };

      if (editMode && selectedTechnicien) {
        dataService.updateTechnicien(selectedTechnicien.id, technicienData);
        showSnackbar('Technicien modifié avec succès', 'success');
      } else {
        dataService.addTechnicien(technicienData);
        showSnackbar('Technicien ajouté avec succès', 'success');
      }

      refreshData();
      setShowTechnicienModal(false);
      setEditMode(false);
      setSelectedTechnicien(null);
    };

    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, width: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
              {editMode ? 'Modifier Technicien' : 'Ajouter Technicien'}
            </h3>
            <button 
              onClick={() => {
                setShowTechnicienModal(false);
                setEditMode(false);
                setSelectedTechnicien(null);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  style={styles.input}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Prénom *
                </label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  style={styles.input}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={styles.input}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Spécialité
                </label>
                <select
                  value={formData.specialite}
                  onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                  style={styles.select}
                >
                  <option value="Électrique">Électrique</option>
                  <option value="Mécanique">Mécanique</option>
                  <option value="Hydraulique">Hydraulique</option>
                  <option value="Général">Général</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Équipe
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData({...formData, shift: e.target.value})}
                  style={styles.select}
                >
                  <option value="matin">Matin (6h-14h)</option>
                  <option value="apres-midi">Après-midi (14h-22h)</option>
                  <option value="nuit">Nuit (22h-6h)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Expérience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                style={styles.input}
                placeholder="ex: 5 ans"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Certifications (séparées par des virgules)
              </label>
              <textarea
                value={formData.certifications}
                onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                style={{ ...styles.textarea, minHeight: '60px' }}
                placeholder="ex: Habilitation électrique, Sécurité portuaire"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
              <button
                onClick={() => {
                  setShowTechnicienModal(false);
                  setEditMode(false);
                  setSelectedTechnicien(null);
                }}
                style={{ ...styles.button, ...styles.buttonSecondary, flex: 1 }}
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                style={{ ...styles.button, ...styles.buttonPrimary, flex: 1 }}
              >
                {editMode ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tab Contents
  const DashboardContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Stats Cards */}
      <div style={{ ...styles.grid, ...styles.gridCols5 }}>
        <StatCard
          icon={AlertTriangle}
          title="Anomalies Totales"
          value={stats.totalAnomalies || 0}
          subtitle="Toutes catégories"
          color="#ef4444"
        />
        <StatCard
          icon={AlertTriangle}
          title="Nouvelles"
          value={stats.nouvellesAnomalies || 0}
          subtitle="En attente validation"
          color="#f97316"
        />
        <StatCard
          icon={CheckCircle}
          title="Validées"
          value={stats.anomaliesValidees || 0}
          subtitle="Prêtes affectation"
          color="#10b981"
        />
        <StatCard
          icon={Users}
          title="Techniciens Libres"
          value={stats.techniciensDisponibles || 0}
          subtitle="Disponibles"
          color="#3b82f6"
        />
        <StatCard
          icon={Wrench}
          title="Interventions"
          value={stats.interventionsEnCours || 0}
          subtitle="En cours"
          color="#8b5cf6"
        />
      </div>

      {/* Filtres et recherche */}
      <div style={styles.card}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Rechercher une anomalie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.input}
            />
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} style={{ color: '#9ca3af' }} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">Tous les statuts</option>
              <option value="nouvelle">Nouvelles</option>
              <option value="validee">Validées</option>
              <option value="assignee">Assignées</option>
              <option value="rejetee">Rejetées</option>
            </select>
          </div>
          
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">Toutes priorités</option>
            <option value="critique">Critique</option>
            <option value="haute">Haute</option>
            <option value="moyenne">Moyenne</option>
            <option value="basse">Basse</option>
          </select>
        </div>
      </div>

      {/* Anomalies */}
      <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: 0 }}>
            🚨 Gestion des Anomalies
          </h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Anomalie</th>
                <th style={styles.tableHeader}>Priorité</th>
                <th style={styles.tableHeader}>Statut</th>
                <th style={styles.tableHeader}>Signalée par</th>
                <th style={styles.tableHeader}>Technicien</th>
                <th style={styles.tableHeader}>Date</th>
                <th style={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredAnomalies().map((anomaly) => (
                <tr 
                  key={anomaly.id} 
                  style={styles.tableRow}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={styles.tableCell}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                        {anomaly.title}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {anomaly.location}
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    <PriorityBadge>{anomaly.priority}</PriorityBadge>
                  </td>
                  <td style={styles.tableCell}>
                    <Badge>{anomaly.status}</Badge>
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        height: '32px',
                        width: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        marginRight: '0.75rem'
                      }}>
                        {anomaly.reportedBy?.[0] || '?'}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#111827' }}>
                        {anomaly.reportedBy}
                      </div>
                    </div>
                  </td>
                  <td style={styles.tableCell}>
                    {anomaly.technicienAffecte ? (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{
                          height: '24px',
                          width: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#10b981',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          marginRight: '0.5rem'
                        }}>
                          {anomaly.technicienAffecte[0]}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                          {anomaly.technicienAffecte}
                        </span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Non assigné</span>
                    )}
                  </td>
                  <td style={{ ...styles.tableCell, fontSize: '0.875rem', color: '#6b7280' }}>
                    {new Date(anomaly.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td style={styles.tableCell}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {anomaly.status === 'nouvelle' && (
                        <>
                          <button
                            onClick={() => handleValidate(anomaly.id)}
                            style={{
                              padding: '0.375rem',
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            title="Valider"
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bbf7d0'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dcfce7'}
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(anomaly.id)}
                            style={{
                              padding: '0.375rem',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            title="Rejeter"
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      {anomaly.status === 'validee' && (
                        <button
                          onClick={() => {
                            setSelectedAnomalie(anomaly);
                            setShowAffectationModal(true);
                          }}
                          style={{
                            padding: '0.375rem',
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          title="Affecter technicien"
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                        >
                          <UserPlus size={16} />
                        </button>
                      )}
                      <button
                        style={{
                          padding: '0.375rem',
                          backgroundColor: '#f3f4f6',
                          color: '#6b7280',
                          border: 'none',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        title="Voir détails"
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {getFilteredAnomalies().length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...styles.tableCell, textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                    {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' 
                      ? 'Aucune anomalie trouvée avec ces filtres'
                      : 'Aucune anomalie signalée'
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const InterventionsContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
          🔧 Gestion des Interventions
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setShowInterventionModal(true)}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            <Plus size={16} />
            Nouvelle intervention
          </button>
          <button 
            onClick={refreshData}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
      </div>

      <div style={{ ...styles.card, padding: 0, overflow: 'hidden' }}>
        <table style={styles.table}>
          <thead style={{ backgroundColor: '#eff6ff' }}>
            <tr>
              <th style={{ ...styles.tableHeader, color: '#1e40af' }}>ID</th>
              <th style={{ ...styles.tableHeader, color: '#1e40af' }}>Portique</th>
              <th style={{ ...styles.tableHeader, color: '#1e40af' }}>Type</th>
              <th style={{ ...styles.tableHeader, color: '#1e40af' }}>Urgence</th>
              <th style={{ ...styles.tableHeader, color: '#1e40af' }}>Statut</th>
              <th style={{ ...styles.tableHeader, color: '#1e40af' }}>Technicien</th>
              <th style={{ ...styles.tableHeader, color: '#1e40af' }}>Durée est.</th>
              <th style={{ ...styles.tableHeader, color: '#1e40af' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {interventions.map((inter) => (
              <tr 
                key={inter.id}
                style={styles.tableRow}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ ...styles.tableCell, fontSize: '0.875rem', color: '#111827' }}>
                  #{inter.id}
                </td>
                <td style={{ ...styles.tableCell, fontSize: '0.875rem', color: '#111827' }}>
                  {inter.portique}
                </td>
                <td style={styles.tableCell}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: '#dbeafe',
                    color: '#1e40af'
                  }}>
                    {inter.type}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <PriorityBadge>{inter.urgence}</PriorityBadge>
                </td>
                <td style={styles.tableCell}>
                  <Badge>{inter.statut}</Badge>
                </td>
                <td style={styles.tableCell}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {inter.technician && (
                      <>
                        <div style={{
                          height: '24px',
                          width: '24px',
                          borderRadius: '50%',
                          backgroundColor: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.75rem',
                          marginRight: '0.5rem'
                        }}>
                          {inter.technician[0]}
                        </div>
                        <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                          {inter.technician}
                        </span>
                      </>
                    )}
                    {!inter.technician && (
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Non assigné</span>
                    )}
                  </div>
                </td>
                <td style={{ ...styles.tableCell, fontSize: '0.875rem', color: '#6b7280' }}>
                  {inter.estimatedDuration ? `${inter.estimatedDuration}min` : '-'}
                </td>
                <td style={styles.tableCell}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => {
                        setSelectedIntervention(inter);
                        setShowInterventionModal(true);
                        setEditMode(true);
                      }}
                      style={{
                        padding: '0.375rem',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                      title="Voir/Modifier"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Êtes-vous sûr de vouloir supprimer cette intervention ?')) {
                          dataService.deleteIntervention(inter.id);
                          refreshData();
                          showSnackbar('Intervention supprimée', 'success');
                        }
                      }}
                      style={{
                        padding: '0.375rem',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {interventions.length === 0 && (
              <tr>
                <td colSpan={8} style={{ ...styles.tableCell, textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  Aucune intervention en cours
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const TechniciensContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
          👥 Gestion des Techniciens
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={() => setShowTechnicienModal(true)}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            <Plus size={16} />
            Ajouter technicien
          </button>
          <button 
            onClick={refreshData}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
      </div>

      <div style={{ ...styles.grid, ...styles.gridCols3 }}>
        {techniciens.map((tech) => (
          <div key={tech.id} style={{ ...styles.card, transition: 'box-shadow 0.3s' }}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                height: '48px',
                width: '48px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '500',
                marginRight: '1rem'
              }}>
                {tech.prenom?.[0]}{tech.nom?.[0]}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>
                  {tech.prenom} {tech.nom}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0' }}>
                  {tech.specialite}
                </p>
              </div>
              <span style={{
                ...styles.badge,
                backgroundColor: '#dbeafe',
                color: '#1e40af'
              }}>
                {tech.shift}
              </span>
            </div>
            
            <div style={{ fontSize: '0.875rem', marginBottom: '1rem', lineHeight: '1.5' }}>
              <div><strong>Email:</strong> {tech.email}</div>
              <div><strong>Téléphone:</strong> {tech.telephone}</div>
              <div><strong>Expérience:</strong> {tech.experience || 'Non spécifiée'}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Statut:</strong>
                <span style={{
                  ...styles.badge,
                  backgroundColor: 
                    (tech.status === 'disponible' || tech.statut === 'actif') ? '#dcfce7' :
                    tech.status === 'en_intervention' || tech.status === 'assigne' ? '#fed7aa' :
                    '#fee2e2',
                  color:
                    (tech.status === 'disponible' || tech.statut === 'actif') ? '#166534' :
                    tech.status === 'en_intervention' || tech.status === 'assigne' ? '#ea580c' :
                    '#dc2626'
                }}>
                  {tech.status === 'assigne' ? 'Assigné' : tech.status || tech.statut}
                </span>
              </div>
              <div><strong>Interventions:</strong> {tech.interventions || 0}</div>
              {tech.certifications && tech.certifications.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Certifications:</strong>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.25rem' }}>
                    {tech.certifications.map((cert, index) => (
                      <span key={index} style={{
                        ...styles.badge,
                        backgroundColor: '#dcfce7',
                        color: '#166534'
                      }}>
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button 
                onClick={() => {
                  setSelectedTechnicien(tech);
                  setEditMode(true);
                  setShowTechnicienModal(true);
                }}
                style={{
                  padding: '0.5rem',
                  color: '#1e40af',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                title="Modifier"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Edit size={16} />
              </button>
              <button 
                onClick={() => {
                  if (confirm(`Êtes-vous sûr de vouloir supprimer ${tech.prenom} ${tech.nom} ?`)) {
                    dataService.deleteTechnicien(tech.id);
                    refreshData();
                    showSnackbar('Technicien supprimé', 'success');
                  }
                }}
                style={{
                  padding: '0.5rem',
                  color: '#dc2626',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                title="Supprimer"
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {techniciens.length === 0 && (
          <div style={{ ...styles.card, textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>
            <p style={{ color: '#6b7280' }}>Aucun technicien enregistré</p>
          </div>
        )}
      </div>
    </div>
  );

  const ReportsContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
        📊 Rapports et Statistiques
      </h2>
      
      <div style={{ ...styles.grid, ...styles.gridCols3 }}>
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Répartition par type d'anomalie
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(stats.pannesParType || {}).map(([type, count]) => (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'capitalize' }}>
                  {type}
                </span>
                <span style={{
                  ...styles.badge,
                  backgroundColor: '#3b82f6',
                  color: 'white'
                }}>
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Performance du système
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Temps de résolution moyen</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>23 min</p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Taux de résolution</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>94%</p>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Statistiques techniciens
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Techniciens disponibles</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {stats.techniciensDisponibles}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Techniciens occupés</p>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>
                {stats.techniciensOccupes}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            🏗️ Système de Maintenance Portuaire
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={refreshData}
              style={{
                padding: '0.5rem',
                color: '#6b7280',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Actualiser"
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.backgroundColor = '#f3f4f6';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <RefreshCw size={20} />
            </button>
            
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  padding: '0.5rem',
                  color: '#6b7280',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = '#6b7280';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Bell size={20} />
                {notifCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    height: '20px',
                    width: '20px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontSize: '0.75rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {notifCount}
                  </span>
                )}
              </button>

              {/* Dropdown des notifications */}
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '0.5rem',
                  width: '320px',
                  backgroundColor: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  zIndex: 50
                }}>
                  <div style={{
                    padding: '1rem',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h3 style={{ fontWeight: '600', color: '#111827', margin: 0 }}>Notifications</h3>
                      {notifCount > 0 && (
                        <button
                          onClick={() => {
                            dataService.markAllNotificationsAsRead();
                            setNotifications(dataService.getNotifications());
                            setNotifCount(0);
                          }}
                          style={{
                            fontSize: '0.75rem',
                            color: '#2563eb',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ maxHeight: '384px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280' }}>
                        Aucune notification
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notif) => (
                        <div
                          key={notif.id}
                          style={{
                            padding: '1rem',
                            borderBottom: '1px solid #f3f4f6',
                            backgroundColor: !notif.lu ? '#eff6ff' : 'transparent',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onClick={() => {
                            if (!notif.lu) {
                              dataService.markNotificationAsRead(notif.id);
                              setNotifications(dataService.getNotifications());
                              setNotifCount(prev => Math.max(0, prev - 1));
                            }
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = !notif.lu ? '#eff6ff' : 'transparent'}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                            <div style={{
                              flexShrink: 0,
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: !notif.lu ? '#3b82f6' : '#d1d5db',
                              marginTop: '0.5rem'
                            }}></div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{
                                fontSize: '0.875rem',
                                fontWeight: !notif.lu ? '500' : 'normal',
                                color: !notif.lu ? '#111827' : '#374151',
                                margin: 0
                              }}>
                                {notif.message}
                              </p>
                              <p style={{
                                fontSize: '0.75rem',
                                color: '#6b7280',
                                marginTop: '0.25rem',
                                margin: 0
                              }}>
                                {notif.date}
                              </p>
                              {notif.priority && (
                                <span style={{
                                  display: 'inline-block',
                                  marginTop: '0.25rem',
                                  padding: '0.125rem 0.5rem',
                                  backgroundColor: getPriorityColor(notif.priority),
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  borderRadius: '9999px'
                                }}>
                                  {notif.priority}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 10 && (
                    <div style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      borderTop: '1px solid #e5e7eb'
                    }}>
                      <button style={{
                        fontSize: '0.875rem',
                        color: '#2563eb',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}>
                        Voir toutes les notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
          
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navTabs}>
          {[
            { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
            { id: 'interventions', label: 'Interventions', icon: Wrench },
            { id: 'techniciens', label: 'Techniciens', icon: Users },
            { id: 'reports', label: 'Rapports', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                ...styles.navTab,
                ...(currentTab === tab.id ? styles.navTabActive : { color: '#6b7280' })
              }}
              onMouseOver={(e) => {
                if (currentTab !== tab.id) {
                  e.currentTarget.style.color = '#374151';
                  e.currentTarget.style.borderBottomColor = '#d1d5db';
                }
              }}
              onMouseOut={(e) => {
                if (currentTab !== tab.id) {
                  e.currentTarget.style.color = '#6b7280';
                  e.currentTarget.style.borderBottomColor = 'transparent';
                }
              }}
            >
              <tab.icon size={16} style={{ marginRight: '0.5rem' }} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main style={styles.main}>
        {currentTab === 'dashboard' && <DashboardContent />}
        {currentTab === 'interventions' && <InterventionsContent />}
        {currentTab === 'techniciens' && <TechniciensContent />}
        {currentTab === 'reports' && <ReportsContent />}
      </main>

      {/* Modals */}
      {showAffectationModal && <AffectationModal />}
      {showTechnicienModal && <TechnicienModal />}

      {/* Snackbar pour notifications */}
      {snackbar.open && (
        <div style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 50
        }}>
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: snackbar.type === 'success' ? '#dcfce7' :
                           snackbar.type === 'warning' ? '#fef3c7' :
                           snackbar.type === 'error' ? '#fee2e2' : '#dbeafe',
            color: snackbar.type === 'success' ? '#166534' :
                   snackbar.type === 'warning' ? '#92400e' :
                   snackbar.type === 'error' ? '#dc2626' : '#1e40af',
            border: `1px solid ${snackbar.type === 'success' ? '#bbf7d0' :
                                snackbar.type === 'warning' ? '#fde68a' :
                                snackbar.type === 'error' ? '#fecaca' : '#bfdbfe'}`
          }}>
            <span>{snackbar.message}</span>
            <button
              onClick={() => setSnackbar({ ...snackbar, open: false })}
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'inherit',
                padding: '0.125rem'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Overlay pour fermer les notifications */}
      {showNotifications && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40
          }}
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default ResponsableDashboard;