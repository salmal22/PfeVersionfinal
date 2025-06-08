import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Camera,
  FileText,
  Play,
  Pause,
  Square,
  MapPin,
  Calendar,
  Star,
  MessageSquare,
  Phone,
  Mail,
  Settings,
  LogOut,
  Bell,
  RefreshCw,
  Filter,
  Search,
  Plus,
  X,
  Save,
  Eye,
  Download,
  Upload
} from 'lucide-react';

// Service de données pour technicien
class TechnicienDataService {
  constructor() {
    this.ANOMALIES_KEY = 'maintenance_anomalies';
    this.INTERVENTIONS_KEY = 'maintenance_interventions';
    this.TECHNICIENS_KEY = 'maintenance_techniciens';
    this.AFFECTATIONS_KEY = 'maintenance_affectations';
    this.NOTES_KEY = 'intervention_notes';
    this.PHOTOS_KEY = 'intervention_photos';
    this.TECHNICIEN_ID = this.getCurrentTechnicienId();
  }

  getCurrentTechnicienId() {
    return 2; // Pierre Martin par défaut
  }

  getData(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
      return null;
    }
  }

  setData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  }

  getMesInterventions() {
    const interventions = this.getData(this.INTERVENTIONS_KEY) || [];
    return interventions.filter(inter => inter.technicianId === this.TECHNICIEN_ID);
  }

  getInterventionsAvecDetails() {
    const interventions = this.getMesInterventions();
    const anomalies = this.getData(this.ANOMALIES_KEY) || [];
    const notes = this.getData(this.NOTES_KEY) || [];
    const photos = this.getData(this.PHOTOS_KEY) || [];

    return interventions.map(inter => {
      const anomalie = anomalies.find(a => a.id === inter.anomalieId);
      const interNotes = notes.filter(n => n.interventionId === inter.id);
      const interPhotos = photos.filter(p => p.interventionId === inter.id);

      return {
        ...inter,
        anomalie,
        notes: interNotes,
        photos: interPhotos
      };
    });
  }

  updateIntervention(id, updates) {
    const interventions = this.getData(this.INTERVENTIONS_KEY) || [];
    const index = interventions.findIndex(i => i.id === id);
    
    if (index !== -1) {
      interventions[index] = { 
        ...interventions[index], 
        ...updates,
        lastUpdate: new Date().toISOString()
      };
      this.setData(this.INTERVENTIONS_KEY, interventions);

      this.updateTechnicienStatus();
      return interventions[index];
    }
    return null;
  }

  startIntervention(interventionId) {
    const updates = {
      status: 'en_cours',
      statut: 'en_cours',
      startTime: new Date().toISOString()
    };
    
    const result = this.updateIntervention(interventionId, updates);
    
    const techniciens = this.getData(this.TECHNICIENS_KEY) || [];
    const techIndex = techniciens.findIndex(t => t.id === this.TECHNICIEN_ID);
    if (techIndex !== -1) {
      techniciens[techIndex].status = 'en_intervention';
      this.setData(this.TECHNICIENS_KEY, techniciens);
    }

    this.addNote(interventionId, 'Intervention démarrée', 'system');
    return result;
  }

  pauseIntervention(interventionId) {
    const updates = {
      status: 'en_pause',
      statut: 'en_pause',
      pauseTime: new Date().toISOString()
    };
    
    this.addNote(interventionId, 'Intervention mise en pause', 'system');
    return this.updateIntervention(interventionId, updates);
  }

  completeIntervention(interventionId, notes = '', pieces = [], tempsReel = null) {
    const updates = {
      status: 'terminee',
      statut: 'terminee',
      endTime: new Date().toISOString(),
      completionNotes: notes,
      piecesUtilisees: pieces,
      actualDuration: tempsReel
    };
    
    const result = this.updateIntervention(interventionId, updates);
    
    const anomalies = this.getData(this.ANOMALIES_KEY) || [];
    const intervention = this.getData(this.INTERVENTIONS_KEY).find(i => i.id === interventionId);
    if (intervention && intervention.anomalieId) {
      const anomalieIndex = anomalies.findIndex(a => a.id === intervention.anomalieId);
      if (anomalieIndex !== -1) {
        anomalies[anomalieIndex].status = 'resolue';
        this.setData(this.ANOMALIES_KEY, anomalies);
      }
    }

    this.updateTechnicienStatus();
    this.addNote(interventionId, `Intervention terminée. ${notes}`, 'completion');
    return result;
  }

  updateTechnicienStatus() {
    const mesInterventions = this.getMesInterventions();
    const hasActiveIntervention = mesInterventions.some(i => 
      i.status === 'en_cours' || i.status === 'en_pause'
    );

    const techniciens = this.getData(this.TECHNICIENS_KEY) || [];
    const techIndex = techniciens.findIndex(t => t.id === this.TECHNICIEN_ID);
    
    if (techIndex !== -1) {
      techniciens[techIndex].status = hasActiveIntervention ? 'en_intervention' : 'disponible';
      this.setData(this.TECHNICIENS_KEY, techniciens);
    }
  }

  addNote(interventionId, content, type = 'user') {
    const notes = this.getData(this.NOTES_KEY) || [];
    const newNote = {
      id: Date.now(),
      interventionId,
      content,
      type,
      timestamp: new Date().toISOString(),
      technicienId: this.TECHNICIEN_ID
    };
    
    notes.push(newNote);
    this.setData(this.NOTES_KEY, notes);
    return newNote;
  }

  addPhoto(interventionId, photoData, description = '') {
    const photos = this.getData(this.PHOTOS_KEY) || [];
    const newPhoto = {
      id: Date.now(),
      interventionId,
      data: photoData,
      description,
      timestamp: new Date().toISOString(),
      technicienId: this.TECHNICIEN_ID
    };
    
    photos.push(newPhoto);
    this.setData(this.PHOTOS_KEY, photos);
    return newPhoto;
  }

  getMonProfil() {
    const techniciens = this.getData(this.TECHNICIENS_KEY) || [];
    return techniciens.find(t => t.id === this.TECHNICIEN_ID);
  }

  updateProfil(updates) {
    const techniciens = this.getData(this.TECHNICIENS_KEY) || [];
    const index = techniciens.findIndex(t => t.id === this.TECHNICIEN_ID);
    
    if (index !== -1) {
      techniciens[index] = { ...techniciens[index], ...updates };
      this.setData(this.TECHNICIENS_KEY, techniciens);
      return techniciens[index];
    }
    return null;
  }

  getStatsTechnicien() {
    const interventions = this.getMesInterventions();
    const today = new Date().toDateString();
    
    return {
      totalInterventions: interventions.length,
      interventionsEnCours: interventions.filter(i => i.status === 'en_cours').length,
      interventionsEnAttente: interventions.filter(i => i.status === 'assignee').length,
      interventionsTerminees: interventions.filter(i => i.status === 'terminee').length,
      interventionsAujourdhui: interventions.filter(i => 
        new Date(i.date).toDateString() === today
      ).length,
      tempsTotal: this.calculateTotalTime(interventions),
      moyenneIntervention: this.calculateAverageTime(interventions)
    };
  }

  calculateTotalTime(interventions) {
    let total = 0;
    interventions.forEach(inter => {
      if (inter.actualDuration) {
        total += inter.actualDuration;
      } else if (inter.startTime && inter.endTime) {
        const start = new Date(inter.startTime);
        const end = new Date(inter.endTime);
        total += (end - start) / (1000 * 60);
      }
    });
    return Math.round(total);
  }

  calculateAverageTime(interventions) {
    const completed = interventions.filter(i => i.status === 'terminee');
    if (completed.length === 0) return 0;
    
    const total = this.calculateTotalTime(completed);
    return Math.round(total / completed.length);
  }
}

const technicienService = new TechnicienDataService();

const TechnicienDashboard = () => {
  const [currentTab, setCurrentTab] = useState('interventions');
  const [interventions, setInterventions] = useState([]);
  const [profil, setProfil] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [selectedIntervention, setSelectedIntervention] = useState(null);
  
  const [notifications, setNotifications] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      loadData();
      showSnackbar('Nouvelles données reçues', 'info');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadData = () => {
    setInterventions(technicienService.getInterventionsAvecDetails());
    setProfil(technicienService.getMonProfil());
    setStats(technicienService.getStatsTechnicien());
    
    const newAssignments = technicienService.getMesInterventions().filter(
      i => i.status === 'assignee' && !i.notificationSent
    );
    
    if (newAssignments.length > 0) {
      setNotifications(prev => [
        ...prev,
        ...newAssignments.map(inter => ({
          id: inter.id,
          message: `Nouvelle intervention assignée: ${inter.description}`,
          time: new Date().toLocaleTimeString('fr-FR'),
          type: 'assignment'
        }))
      ]);
    }
  };

  const showSnackbar = (message, type = 'info') => {
    setSnackbar({ open: true, message, type });
    setTimeout(() => setSnackbar({ open: false, message: '', type: 'info' }), 3000);
  };

  const handleStartIntervention = (interventionId) => {
    try {
      technicienService.startIntervention(interventionId);
      loadData();
      showSnackbar('Intervention démarrée', 'success');
    } catch (error) {
      showSnackbar('Erreur lors du démarrage', 'error');
    }
  };

  const handlePauseIntervention = (interventionId) => {
    try {
      technicienService.pauseIntervention(interventionId);
      loadData();
      showSnackbar('Intervention mise en pause', 'warning');
    } catch (error) {
      showSnackbar('Erreur lors de la mise en pause', 'error');
    }
  };

  const handleCompleteIntervention = (interventionId, notes, pieces, tempsReel) => {
    try {
      technicienService.completeIntervention(interventionId, notes, pieces, tempsReel);
      loadData();
      setShowCompletionModal(false);
      showSnackbar('Intervention terminée avec succès', 'success');
    } catch (error) {
      showSnackbar('Erreur lors de la finalisation', 'error');
    }
  };

  const getFilteredInterventions = () => {
    return interventions.filter(inter => {
      const statusMatch = statusFilter === 'all' || inter.status === statusFilter;
      const searchMatch = searchTerm === '' || 
        inter.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inter.portique?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return statusMatch && searchMatch;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'assignee': '#dbeafe',
      'en_cours': '#dcfce7',
      'en_pause': '#fef3c7',
      'terminee': '#f3f4f6'
    };
    return colors[status] || '#f3f4f6';
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

  const formatDuration = (minutes) => {
    if (!minutes) return '-';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

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
      padding: '1rem 1.5rem'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(to right, #2563eb, #10b981)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginRight: '1rem'
    },
    badge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500'
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
      transition: 'all 0.2s'
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
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
    buttonSecondary: {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: '1px solid #d1d5db'
    },
    grid: {
      display: 'grid',
      gap: '1.5rem'
    },
    gridCols4: {
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
    },
    gridCols2: {
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
    textarea: {
      width: '100%',
      padding: '0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      resize: 'vertical'
    }
  };

  // Components
  const StatCard = ({ icon: Icon, title, value, subtitle, color = '#3b82f6' }) => (
    <div style={{
      ...styles.statCard,
      background: `linear-gradient(135deg, ${color}, ${color}dd)`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '0.5rem' }}>
        <Icon size={24} />
        <span style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</span>
      </div>
      <div style={{ fontSize: '1.125rem', fontWeight: '500' }}>{title}</div>
      <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>{subtitle}</div>
    </div>
  );

  const Badge = ({ children, color = '#6b7280' }) => (
    <span style={{
      ...styles.badge,
      backgroundColor: color + '20',
      color: color,
      border: `1px solid ${color}30`
    }}>
      {children}
    </span>
  );

  // Modal pour les détails d'intervention
  const InterventionDetailModal = () => {
    if (!selectedIntervention) return null;

    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, width: '800px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Détails de l'intervention</h3>
            <button onClick={() => setShowInterventionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>

          <div style={styles.grid}>
            <div>
              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Informations générales</h4>
                <div style={{ fontSize: '0.875rem', lineHeight: '1.5' }}>
                  <div><strong>ID:</strong> #{selectedIntervention.id}</div>
                  <div><strong>Portique:</strong> {selectedIntervention.portique}</div>
                  <div><strong>Type:</strong> {selectedIntervention.type}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>Urgence:</strong>
                    <Badge color={getPriorityColor(selectedIntervention.urgence)}>
                      {selectedIntervention.urgence}
                    </Badge>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong>Statut:</strong>
                    <Badge color={selectedIntervention.status === 'en_cours' ? '#10b981' : '#6b7280'}>
                      {selectedIntervention.status}
                    </Badge>
                  </div>
                  <div><strong>Durée estimée:</strong> {formatDuration(selectedIntervention.estimatedDuration)}</div>
                  {selectedIntervention.actualDuration && (
                    <div><strong>Durée réelle:</strong> {formatDuration(selectedIntervention.actualDuration)}</div>
                  )}
                </div>
              </div>

              <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Description</h4>
                <p style={{ fontSize: '0.875rem', color: '#374151' }}>{selectedIntervention.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {selectedIntervention.status === 'assignee' && (
                  <button
                    onClick={() => handleStartIntervention(selectedIntervention.id)}
                    style={{ ...styles.button, ...styles.buttonSuccess }}
                  >
                    <Play size={16} />
                    Démarrer
                  </button>
                )}
                
                {selectedIntervention.status === 'en_cours' && (
                  <>
                    <button
                      onClick={() => handlePauseIntervention(selectedIntervention.id)}
                      style={{ ...styles.button, ...styles.buttonWarning }}
                    >
                      <Pause size={16} />
                      Pause
                    </button>
                    <button
                      onClick={() => {
                        setShowCompletionModal(true);
                        setShowInterventionModal(false);
                      }}
                      style={{ ...styles.button, ...styles.buttonPrimary }}
                    >
                      <CheckCircle size={16} />
                      Terminer
                    </button>
                  </>
                )}

                <button
                  onClick={() => setShowNoteModal(true)}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                >
                  <MessageSquare size={16} />
                  Ajouter note
                </button>
                
                <button
                  onClick={() => setShowPhotoModal(true)}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                >
                  <Camera size={16} />
                  Photo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal pour ajouter une note
  const NoteModal = () => {
    const [noteContent, setNoteContent] = useState('');

    const handleAddNote = () => {
      if (noteContent.trim() && selectedIntervention) {
        technicienService.addNote(selectedIntervention.id, noteContent.trim());
        loadData();
        setShowNoteModal(false);
        setNoteContent('');
        showSnackbar('Note ajoutée', 'success');
      }
    };

    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, width: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Ajouter une note</h3>
            <button onClick={() => setShowNoteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Décrivez l'état de l'intervention, les problèmes rencontrés..."
              style={{ ...styles.textarea, minHeight: '120px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => setShowNoteModal(false)}
              style={{ ...styles.button, ...styles.buttonSecondary, flex: 1 }}
            >
              Annuler
            </button>
            <button
              onClick={handleAddNote}
              style={{ ...styles.button, ...styles.buttonPrimary, flex: 1 }}
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modal pour terminer intervention
  const CompletionModal = () => {
    const [completionData, setCompletionData] = useState({
      notes: '',
      pieces: '',
      tempsReel: selectedIntervention?.estimatedDuration || 60
    });

    const handleComplete = () => {
      if (selectedIntervention) {
        const pieces = completionData.pieces.split(',').map(p => p.trim()).filter(p => p);
        handleCompleteIntervention(
          selectedIntervention.id,
          completionData.notes,
          pieces,
          completionData.tempsReel
        );
      }
    };

    return (
      <div style={styles.modal}>
        <div style={{ ...styles.modalContent, width: '500px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Terminer l'intervention</h3>
            <button onClick={() => setShowCompletionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Notes de fin d'intervention
              </label>
              <textarea
                value={completionData.notes}
                onChange={(e) => setCompletionData({...completionData, notes: e.target.value})}
                placeholder="Résumé des actions effectuées, état final..."
                style={{ ...styles.textarea, minHeight: '80px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Pièces utilisées (séparées par des virgules)
              </label>
              <input
                type="text"
                value={completionData.pieces}
                onChange={(e) => setCompletionData({...completionData, pieces: e.target.value})}
                placeholder="ex: Fusible 20A, Joint hydraulique..."
                style={styles.input}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Temps réel passé (minutes)
              </label>
              <input
                type="number"
                value={completionData.tempsReel}
                onChange={(e) => setCompletionData({...completionData, tempsReel: parseInt(e.target.value)})}
                style={styles.input}
                min="1"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem' }}>
              <button
                onClick={() => setShowCompletionModal(false)}
                style={{ ...styles.button, ...styles.buttonSecondary, flex: 1 }}
              >
                Annuler
              </button>
              <button
                onClick={handleComplete}
                style={{ ...styles.button, ...styles.buttonSuccess, flex: 1 }}
              >
                Terminer
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Contenu principal des interventions
  const InterventionsContent = () => (
    <div>
      {/* Stats Cards */}
      <div style={{ ...styles.grid, ...styles.gridCols4, marginBottom: '1.5rem' }}>
        <StatCard
          icon={Wrench}
          title="En cours"
          value={stats.interventionsEnCours || 0}
          subtitle="Interventions actives"
          color="#10b981"
        />
        <StatCard
          icon={Clock}
          title="En attente"
          value={stats.interventionsEnAttente || 0}
          subtitle="À traiter"
          color="#3b82f6"
        />
        <StatCard
          icon={CheckCircle}
          title="Terminées"
          value={stats.interventionsTerminees || 0}
          subtitle="Complétées"
          color="#6b7280"
        />
        <StatCard
          icon={Calendar}
          title="Aujourd'hui"
          value={stats.interventionsAujourdhui || 0}
          subtitle="Interventions du jour"
          color="#8b5cf6"
        />
      </div>

      {/* Filtres */}
      <div style={{ ...styles.card, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Search size={16} style={{ color: '#9ca3af' }} />
            <input
              type="text"
              placeholder="Rechercher..."
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
              style={styles.input}
            >
              <option value="all">Tous les statuts</option>
              <option value="assignee">Assignées</option>
              <option value="en_cours">En cours</option>
              <option value="en_pause">En pause</option>
              <option value="terminee">Terminées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des interventions */}
      <div>
        {getFilteredInterventions().map((inter) => (
          <div key={inter.id} style={{ ...styles.card, marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', margin: 0 }}>
                    #{inter.id} - {inter.portique}
                  </h3>
                  <Badge color={getPriorityColor(inter.urgence)}>
                    {inter.urgence}
                  </Badge>
                  <Badge color={inter.status === 'en_cours' ? '#10b981' : '#6b7280'}>
                    {inter.status}
                  </Badge>
                </div>
                
                <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>{inter.description}</p>
                
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} />
                    Estimé: {formatDuration(inter.estimatedDuration)}
                  </span>
                  {inter.actualDuration && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <CheckCircle size={14} />
                      Réel: {formatDuration(inter.actualDuration)}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    {new Date(inter.date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {inter.status === 'assignee' && (
                  <button
                    onClick={() => handleStartIntervention(inter.id)}
                    style={{ ...styles.button, ...styles.buttonSuccess }}
                  >
                    <Play size={16} />
                    Démarrer
                  </button>
                )}
                
                {inter.status === 'en_cours' && (
                  <>
                    <button
                      onClick={() => handlePauseIntervention(inter.id)}
                      style={{ ...styles.button, ...styles.buttonWarning }}
                    >
                      <Pause size={16} />
                      Pause
                    </button>
                    <button
                      onClick={() => {
                        setSelectedIntervention(inter);
                        setShowCompletionModal(true);
                      }}
                      style={{ ...styles.button, ...styles.buttonPrimary }}
                    >
                      <CheckCircle size={16} />
                      Terminer
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => {
                    setSelectedIntervention(inter);
                    setShowInterventionModal(true);
                  }}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                >
                  <Eye size={16} />
                  Détails
                </button>
              </div>
            </div>

            {/* Barre de progression pour interventions en cours */}
            {inter.status === 'en_cours' && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  <span>Progression</span>
                  <span>En cours...</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '9999px', height: '8px' }}>
                  <div style={{ 
                    backgroundColor: '#10b981', 
                    height: '8px', 
                    borderRadius: '9999px', 
                    width: '45%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                </div>
              </div>
            )}
          </div>
        ))}

        {getFilteredInterventions().length === 0 && (
          <div style={{ ...styles.card, textAlign: 'center', padding: '2rem' }}>
            <Wrench size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
            <p style={{ color: '#6b7280' }}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Aucune intervention trouvée avec ces filtres'
                : 'Aucune intervention assignée'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Contenu du profil
  const ProfilContent = () => (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>
        👤 Mon Profil
      </h2>
      
      {profil && (
        <div style={{ ...styles.grid, ...styles.gridCols2 }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Informations personnelles
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                height: '64px',
                width: '64px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.25rem',
                marginRight: '1rem'
              }}>
                {profil.prenom?.[0]}{profil.nom?.[0]}
              </div>
              <div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                  {profil.prenom} {profil.nom}
                </h4>
                <p style={{ color: '#6b7280' }}>{profil.specialite}</p>
                <Badge color="#3b82f6">{profil.shift}</Badge>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ color: '#9ca3af', marginRight: '0.75rem' }} />
                <span>{profil.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Phone size={16} style={{ color: '#9ca3af', marginRight: '0.75rem' }} />
                <span>{profil.telephone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Star size={16} style={{ color: '#9ca3af', marginRight: '0.75rem' }} />
                <span>Expérience: {profil.experience || 'Non spécifiée'}</span>
              </div>
            </div>

            {profil.certifications && profil.certifications.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <h5 style={{ fontWeight: '500', marginBottom: '0.5rem' }}>Certifications</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {profil.certifications.map((cert, index) => (
                    <Badge key={index} color="#10b981">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={styles.card}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Mes statistiques
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Total interventions</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                  {stats.totalInterventions}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Temps total</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                  {formatDuration(stats.tempsTotal)}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Temps moyen</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#f97316' }}>
                  {formatDuration(stats.moyenneIntervention)}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                <span style={{ fontWeight: '500' }}>Statut actuel</span>
                <Badge color={
                  profil.status === 'disponible' ? '#10b981' :
                  profil.status === 'en_intervention' ? '#f97316' :
                  '#ef4444'
                }>
                  {profil.status === 'en_intervention' ? 'En intervention' : 
                   profil.status === 'disponible' ? 'Disponible' : profil.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 style={styles.title}>
              🔧 Dashboard Technicien
            </h1>
            {profil && (
              <Badge color={
                profil.status === 'disponible' ? '#10b981' :
                profil.status === 'en_intervention' ? '#f97316' :
                '#ef4444'
              }>
                {profil.status === 'en_intervention' ? 'En intervention' : 
                 profil.status === 'disponible' ? 'Disponible' : profil.status}
              </Badge>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={loadData}
              style={{ ...styles.button, ...styles.buttonSecondary }}
              title="Actualiser"
            >
              <RefreshCw size={20} />
            </button>
            
            <div style={{ position: 'relative' }}>
              <button style={{ ...styles.button, ...styles.buttonSecondary, position: 'relative' }}>
                <Bell size={20} />
                {notifications.length > 0 && (
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
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
            
            {profil && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  height: '32px',
                  width: '32px',
                  backgroundColor: '#3b82f6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '500'
                }}>
                  {profil.prenom?.[0]}{profil.nom?.[0]}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  {profil.prenom} {profil.nom}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navTabs}>
          {[
            { id: 'interventions', label: 'Mes Interventions', icon: Wrench },
            { id: 'profil', label: 'Mon Profil', icon: User }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              style={{
                ...styles.navTab,
                ...(currentTab === tab.id ? styles.navTabActive : {})
              }}
            >
              <tab.icon size={16} style={{ marginRight: '0.5rem' }} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Contenu principal */}
      <main style={styles.main}>
        {currentTab === 'interventions' && <InterventionsContent />}
        {currentTab === 'profil' && <ProfilContent />}
      </main>

      {/* Modals */}
      {showInterventionModal && <InterventionDetailModal />}
      {showNoteModal && <NoteModal />}
      {showCompletionModal && <CompletionModal />}

      {/* Snackbar */}
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
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicienDashboard;