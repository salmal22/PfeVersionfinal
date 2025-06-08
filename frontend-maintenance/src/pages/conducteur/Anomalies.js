import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Send, 
  History, 
  Phone, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Wrench, 
  Zap, 
  Droplets,
  Home,
  Clock,
  User
} from 'lucide-react';

// Service de données
class DataService {
  constructor() {
    this.ANOMALIES_KEY = 'maintenance_anomalies';
    this.NOTIFICATIONS_KEY = 'notifications_responsable';
    this.HISTO_KEY = 'historique_conducteur';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.ANOMALIES_KEY)) {
      localStorage.setItem(this.ANOMALIES_KEY, JSON.stringify([]));
    }
  }

  addAnomaly(anomaly) {
    const anomalies = JSON.parse(localStorage.getItem(this.ANOMALIES_KEY) || '[]');
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
    localStorage.setItem(this.ANOMALIES_KEY, JSON.stringify(anomalies));
    
    this.addNotification({
      id: Date.now(),
      message: `🚨 Nouvelle anomalie: ${newAnomaly.title} sur ${newAnomaly.location}`,
      date: new Date().toLocaleString('fr-FR'),
      type: 'anomaly',
      priority: newAnomaly.priority,
      lu: false
    });
    
    this.addToHistory(newAnomaly);
    return newAnomaly;
  }

  addNotification(notification) {
    const notifications = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_KEY) || '[]');
    notifications.unshift(notification);
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event('storage'));
  }

  addToHistory(anomaly) {
    const history = JSON.parse(localStorage.getItem(this.HISTO_KEY) || '[]');
    const historyItem = {
      ...anomaly,
      statut: 'en attente',
      date_debut: anomaly.date,
      date_fin: null
    };
    history.unshift(historyItem);
    localStorage.setItem(this.HISTO_KEY, JSON.stringify(history));
  }

  getHistory() {
    return JSON.parse(localStorage.getItem(this.HISTO_KEY) || '[]');
  }

  getPriorityFromType(type) {
    const priorities = {
      'électrique': 'haute',
      'mécanique': 'moyenne',
      'hydraulique': 'haute'
    };
    return priorities[type] || 'moyenne';
  }
}

const dataService = new DataService();

const ConducteurAnomalies = () => {
  const [form, setForm] = useState({
    portique: '',
    type: '',
    detail: '',
    description: '',
  });
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);

  // Styles CSS
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #fdf2f8 50%, #fef9c3 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      width: '100%',
      background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(219,234,254,0.8) 50%, rgba(252,231,243,0.8) 100%)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #bfdbfe',
      position: 'sticky',
      top: 0,
      zIndex: 20,
      backdropFilter: 'blur(12px)'
    },
    headerContent: {
      padding: '1.5rem 2rem',
      maxWidth: '80rem',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    headerIcon: {
      background: 'linear-gradient(135deg, #fbb6ce, #ef4444, #fbbf24)',
      padding: '1rem',
      borderRadius: '1.5rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      border: '1px solid rgba(255,255,255,0.6)',
      backdropFilter: 'blur(12px)'
    },
    headerTitle: {
      fontSize: '1.875rem',
      fontWeight: '800',
      color: '#312e81',
      letterSpacing: '-0.025em',
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
    },
    headerSubtitle: {
      fontSize: '1rem',
      color: '#2563eb',
      fontWeight: '500'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    statusBadge: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      background: 'linear-gradient(90deg, #dcfce7, #86efac)',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #bbf7d0'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      backgroundColor: '#16a34a',
      borderRadius: '50%',
      animation: 'pulse 2s infinite'
    },
    historyButton: {
      padding: '0.75rem',
      color: '#6366f1',
      backgroundColor: 'transparent',
      border: 'none',
      borderRadius: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    main: {
      width: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    },
    mainGrid: {
      width: '100%',
      maxWidth: '80rem',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '3rem',
      marginTop: '2.5rem',
      padding: '0 2rem'
    },
    formCard: {
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(20px)',
      borderRadius: '1.5rem',
      boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
      padding: '3rem',
      border: '1px solid #ddd6fe',
      position: 'relative',
      overflow: 'hidden'
    },
    formDecoration: {
      position: 'absolute',
      top: '-2.5rem',
      right: '-2.5rem',
      width: '10rem',
      height: '10rem',
      background: 'linear-gradient(135deg, #fbb6ce, #fef3c7, #ddd6fe)',
      borderRadius: '50%',
      opacity: 0.3,
      filter: 'blur(40px)',
      zIndex: 0
    },
    formHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2.5rem',
      position: 'relative',
      zIndex: 10
    },
    formTitle: {
      fontSize: '1.5rem',
      fontWeight: '800',
      color: '#312e81',
      letterSpacing: '-0.025em'
    },
    formContent: {
      position: 'relative',
      zIndex: 10
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2rem',
      marginBottom: '2.5rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    formGroupFull: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '2.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '700',
      color: '#1e40af',
      marginBottom: '0.5rem'
    },
    required: {
      color: '#ec4899'
    },
    select: {
      width: '100%',
      padding: '0.75rem 1.25rem',
      border: '1px solid #bfdbfe',
      borderRadius: '1rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1e3a8a',
      background: 'rgba(239,246,255,0.8)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      transition: 'all 0.2s',
      outline: 'none'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem 1.25rem',
      border: '1px solid #bfdbfe',
      borderRadius: '1rem',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1e3a8a',
      background: 'rgba(239,246,255,0.8)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      transition: 'all 0.2s',
      resize: 'none',
      outline: 'none'
    },
    submitButton: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 2rem',
      borderRadius: '1rem',
      fontSize: '1.125rem',
      fontWeight: '700',
      letterSpacing: '0.025em',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      transition: 'all 0.2s',
      border: 'none',
      cursor: 'pointer'
    },
    submitButtonActive: {
      background: 'linear-gradient(90deg, #ec4899, #ef4444, #f59e0b)',
      color: 'white'
    },
    submitButtonDisabled: {
      backgroundColor: '#e5e7eb',
      color: '#9ca3af',
      cursor: 'not-allowed'
    },
    successOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, rgba(187,247,208,0.8), rgba(220,252,231,0.8), rgba(240,253,244,0.8))',
      border: '1px solid #86efac',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(20px)',
      zIndex: 20
    },
    successContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem'
    },
    successTitle: {
      fontWeight: '600',
      color: '#14532d',
      marginBottom: '0.25rem',
      fontSize: '1.25rem'
    },
    successText: {
      color: '#166534',
      fontSize: '1rem'
    },
    sidebar: {
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem'
    },
    sidebarCard: {
      borderRadius: '1.5rem',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      padding: '2rem',
      border: '1px solid #ddd6fe',
      backdropFilter: 'blur(12px)'
    },
    userCard: {
      background: 'linear-gradient(135deg, rgba(219,234,254,0.8), rgba(255,255,255,0.8), rgba(224,231,255,0.8))'
    },
    instructionsCard: {
      background: 'linear-gradient(135deg, rgba(238,242,255,0.8), rgba(219,234,254,0.8), rgba(252,231,243,0.8))'
    },
    contactsCard: {
      background: 'linear-gradient(135deg, rgba(252,231,243,0.8), rgba(254,202,202,0.8), rgba(255,237,213,0.8))',
      border: '1px solid #fbcfe8'
    },
    historyCard: {
      background: 'rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)'
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: '700',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    userInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      fontSize: '1rem'
    },
    userInfoRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    instructions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      fontSize: '1rem',
      color: '#1e3a8a'
    },
    instructionItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.5rem'
    },
    instructionNumber: {
      width: '1.5rem',
      height: '1.5rem',
      backgroundColor: '#ec4899',
      color: 'white',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.75rem',
      fontWeight: '700',
      marginTop: '0.125rem',
      flexShrink: 0
    },
    contacts: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      fontSize: '1rem'
    },
    contactRow: {
      display: 'flex',
      justifyContent: 'space-between'
    },
    historyList: {
      maxHeight: '16rem',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    },
    historyItem: {
      border: '1px solid #fbcfe8',
      borderRadius: '0.75rem',
      padding: '1rem',
      background: 'linear-gradient(90deg, rgba(239,246,255,0.8), rgba(255,255,255,0.8), rgba(252,231,243,0.8))',
      transition: 'all 0.2s',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
      cursor: 'pointer'
    },
    historyHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.25rem'
    },
    historyTitle: {
      fontWeight: '700',
      fontSize: '1rem',
      color: '#312e81'
    },
    historyStatus: {
      padding: '0.25rem 0.75rem',
      borderRadius: '0.75rem',
      fontSize: '0.75rem',
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    historyDate: {
      fontSize: '0.75rem',
      color: '#93c5fd'
    },
    footer: {
      marginTop: '4rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: '0 2rem'
    },
    footerCard: {
      background: 'linear-gradient(90deg, rgba(219,234,254,0.8), rgba(255,255,255,0.8), rgba(252,231,243,0.8))',
      borderRadius: '1rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      padding: '1.5rem',
      border: '1px solid #ddd6fe',
      maxWidth: '32rem',
      width: '100%',
      textAlign: 'center',
      backdropFilter: 'blur(12px)'
    },
    footerTitle: {
      color: '#3730a3',
      fontSize: '1.125rem',
      fontWeight: '700'
    },
    footerSubtitle: {
      color: '#ec4899',
      fontSize: '0.875rem',
      marginTop: '0.25rem'
    },
    spinner: {
      width: '1.25rem',
      height: '1.25rem',
      border: '2px solid transparent',
      borderTop: '2px solid white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginRight: '0.5rem'
    }
  };

  // Données statiques
  const portiques = [
    { id: 1, nom: 'P5' },
    { id: 2, nom: 'P8' },
    { id: 3, nom: 'P9' },
  ];

  const details = [
    'ascenseur',
    'avant-bec', 
    'chariot',
    'headblock',
    'levage',
    'TLS',
    'spreader',
    'translation',
  ];

  const types = [
    { id: 'électrique', label: 'Électrique', icon: Zap, color: 'yellow' },
    { id: 'mécanique', label: 'Mécanique', icon: Wrench, color: 'blue' },
    { id: 'hydraulique', label: 'Hydraulique', icon: Droplets, color: 'red' }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'un délai d'envoi
    setTimeout(() => {
      const newAnomaly = {
        portique: { nom: portiques.find(p => p.id === Number(form.portique))?.nom || '' },
        type: form.type,
        detail: form.detail,
        description: form.description,
        statut: 'en attente',
        date_debut: new Date().toISOString(),
        date_fin: null,
      };

      dataService.addAnomaly(newAnomaly);
      
      setSuccess(true);
      setIsSubmitting(false);
      setForm({ portique: '', type: '', detail: '', description: '' });

      // Masquer le message de succès après 5 secondes
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const loadHistory = () => {
    setHistory(dataService.getHistory());
    setShowHistory(!showHistory);
  };

  const isFormValid = () => {
    return form.portique && form.type && form.detail && form.description.trim();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'en attente':
        return { backgroundColor: '#fef3c7', color: '#92400e' };
      case 'en cours':
        return { backgroundColor: '#dbeafe', color: '#1e40af' };
      default:
        return { backgroundColor: '#dcfce7', color: '#166534' };
    }
  };

  return (
    <div style={styles.container}>
      {/* Keyframes CSS pour les animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-in-out;
        }
      `}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <AlertTriangle style={{ color: '#b91c1c', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} size={36} />
            </div>
            <div>
              <h1 style={styles.headerTitle}>Signaler une anomalie</h1>
              <p style={styles.headerSubtitle}>Interface Conducteur – Port de Casablanca</p>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.statusBadge}>
              <div style={styles.statusDot}></div>
              <span style={{ color: '#14532d', fontSize: '0.875rem', fontWeight: '700' }}>En ligne</span>
            </div>
            <button 
              onClick={loadHistory}
              style={styles.historyButton}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#ec4899';
                e.currentTarget.style.backgroundColor = '#fdf2f8';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#6366f1';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Afficher l'historique"
            >
              <History size={28} />
            </button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.mainGrid}>
          {/* Formulaire principal */}
          <div>
            <div style={styles.formCard}>
              <div style={styles.formDecoration}></div>
              <div style={styles.formHeader}>
                <AlertTriangle style={{ color: '#ec4899' }} size={36} />
                <h2 style={styles.formTitle}>Signaler une nouvelle anomalie</h2>
              </div>
              <div style={styles.formContent}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Portique concerné <span style={styles.required}>*</span>
                    </label>
                    <select
                      name="portique"
                      value={form.portique}
                      onChange={handleChange}
                      required
                      style={styles.select}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = '2px solid #f472b6';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.outline = 'none';
                        e.currentTarget.style.borderColor = '#bfdbfe';
                      }}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'}
                    >
                      <option value="">Sélectionner un portique</option>
                      {portiques.map(p => (
                        <option key={p.id} value={p.id}>Portique {p.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Type d'anomalie <span style={styles.required}>*</span>
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                      style={styles.select}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = '2px solid #f472b6';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.outline = 'none';
                        e.currentTarget.style.borderColor = '#bfdbfe';
                      }}
                      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'}
                      onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'}
                    >
                      <option value="">Sélectionner le type</option>
                      {types.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={styles.formGroupFull}>
                  <label style={styles.label}>
                    Composant affecté <span style={styles.required}>*</span>
                  </label>
                  <select
                    name="detail"
                    value={form.detail}
                    onChange={handleChange}
                    required
                    style={styles.select}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid #f472b6';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.borderColor = '#bfdbfe';
                    }}
                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'}
                  >
                    <option value="">Sélectionner le composant</option>
                    {details.map(d => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroupFull}>
                  <label style={styles.label}>
                    Description détaillée du problème <span style={styles.required}>*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    style={styles.textarea}
                    placeholder="Décrivez précisément le problème observé, les circonstances, les symptômes..."
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid #f472b6';
                      e.currentTarget.style.borderColor = 'transparent';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = 'none';
                      e.currentTarget.style.borderColor = '#bfdbfe';
                    }}
                    onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'}
                  />
                </div>
                <div style={{ paddingTop: '1rem' }}>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isSubmitting}
                    style={{
                      ...styles.submitButton,
                      ...(isFormValid() && !isSubmitting ? styles.submitButtonActive : styles.submitButtonDisabled)
                    }}
                    onMouseOver={(e) => {
                      if (isFormValid() && !isSubmitting) {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #db2777, #dc2626, #ea580c)';
                        e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (isFormValid() && !isSubmitting) {
                        e.currentTarget.style.background = 'linear-gradient(90deg, #ec4899, #ef4444, #f59e0b)';
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={styles.spinner}></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send style={{ marginRight: '0.5rem' }} size={24} />
                        Envoyer le signalement
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* Message de succès */}
              {success && (
                <div style={styles.successOverlay} className="animate-fade-in">
                  <div style={styles.successContent}>
                    <CheckCircle style={{ color: '#16a34a', marginTop: '0.125rem' }} size={32} />
                    <div>
                      <h3 style={styles.successTitle}>✅ Signalement envoyé avec succès !</h3>
                      <p style={styles.successText}>Le responsable de maintenance a été notifié et traitera votre demande dans les plus brefs délais.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Panneau latéral */}
          <div style={styles.sidebar}>
            {/* Informations utilisateur */}
            <div style={{ ...styles.sidebarCard, ...styles.userCard }}>
              <h3 style={{ ...styles.cardTitle, color: '#1e40af' }}>
                <User style={{ color: '#3b82f6' }} size={24} />
                Votre statut
              </h3>
              <div style={styles.userInfo}>
                <div style={styles.userInfoRow}>
                  <span style={{ color: '#1e40af' }}>Conducteur :</span>
                  <span style={{ fontWeight: '700', color: '#312e81' }}>Ahmed Alami</span>
                </div>
                <div style={styles.userInfoRow}>
                  <span style={{ color: '#1e40af' }}>Shift :</span>
                  <span style={{ fontWeight: '700', color: '#312e81' }}>Matin (06:00-14:00)</span>
                </div>
                <div style={styles.userInfoRow}>
                  <span style={{ color: '#1e40af' }}>Zone :</span>
                  <span style={{ fontWeight: '700', color: '#312e81' }}>Portiques P5-P9</span>
                </div>
                <div style={styles.userInfoRow}>
                  <span style={{ color: '#1e40af' }}>Statut :</span>
                  <span style={{ display: 'flex', alignItems: 'center', color: '#059669', fontWeight: '700' }}>
                    <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', marginRight: '0.5rem' }}></div>
                    Actif
                  </span>
                </div>
              </div>
            </div>
            
            {/* Instructions */}
            <div style={{ ...styles.sidebarCard, ...styles.instructionsCard }}>
              <h3 style={{ ...styles.cardTitle, color: '#be185d' }}>
                <Info style={{ color: '#ec4899' }} size={24} />
                Instructions importantes
              </h3>
              <div style={styles.instructions}>
                <div style={styles.instructionItem}>
                  <div style={styles.instructionNumber}>1</div>
                  <div><strong>Sécurité d'abord :</strong> En cas d'urgence critique, arrêtez immédiatement l'opération</div>
                </div>
                <div style={styles.instructionItem}>
                  <div style={styles.instructionNumber}>2</div>
                  <div><strong>Description précise :</strong> Plus vous donnez de détails, plus l'intervention sera efficace</div>
                </div>
                <div style={styles.instructionItem}>
                  <div style={styles.instructionNumber}>3</div>
                  <div><strong>Suivi en temps réel :</strong> Vous serez notifié des actions entreprises</div>
                </div>
              </div>
            </div>
            
            {/* Contacts d'urgence */}
            <div style={{ ...styles.sidebarCard, ...styles.contactsCard }}>
              <h3 style={{ ...styles.cardTitle, color: '#be185d' }}>
                <Phone style={{ color: '#ec4899' }} size={24} />
                Contacts d'urgence
              </h3>
              <div style={styles.contacts}>
                <div style={styles.contactRow}>
                  <span style={{ fontWeight: '700', color: '#be185d' }}>Sécurité :</span>
                  <span style={{ color: '#be185d' }}>15</span>
                </div>
                <div style={styles.contactRow}>
                  <span style={{ fontWeight: '700', color: '#be185d' }}>Maintenance :</span>
                  <span style={{ color: '#be185d' }}>+212 5 22 XX XX XX</span>
                </div>
                <div style={styles.contactRow}>
                  <span style={{ fontWeight: '700', color: '#be185d' }}>Responsable :</span>
                  <span style={{ color: '#be185d' }}>+212 6 XX XX XX XX</span>
                </div>
              </div>
            </div>
            
            {/* Historique */}
            {showHistory && (
              <div style={{ ...styles.sidebarCard, ...styles.historyCard }} className="animate-fade-in">
                <h3 style={{ ...styles.cardTitle, color: '#5b21b6' }}>
                  <Clock style={{ color: '#ec4899' }} size={24} />
                  Historique récent
                </h3>
                <div style={styles.historyList}>
                  {history.length === 0 ? (
                    <p style={{ color: '#93c5fd', fontSize: '1rem' }}>Aucun signalement récent</p>
                  ) : (
                    history.slice(0, 5).map((item) => (
                      <div 
                        key={item.id} 
                        style={styles.historyItem}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(252,231,243,0.8)'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'linear-gradient(90deg, rgba(239,246,255,0.8), rgba(255,255,255,0.8), rgba(252,231,243,0.8))'}
                      >
                        <div style={styles.historyHeader}>
                          <span style={styles.historyTitle}>{item.title}</span>
                          <span style={{
                            ...styles.historyStatus,
                            ...getStatusStyle(item.statut)
                          }}>
                            {item.statut}
                          </span>
                        </div>
                        <p style={styles.historyDate}>{new Date(item.date_debut).toLocaleDateString('fr-FR')}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div style={styles.footer}>
          <div style={styles.footerCard}>
            <p style={styles.footerTitle}>🏗️ Port de Casablanca - Système de Maintenance Intégré v2.0</p>
            <p style={styles.footerSubtitle}>Pour toute assistance technique, contactez le support : <span style={{ textDecoration: 'underline' }}>support@port-casa.ma</span></p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConducteurAnomalies;