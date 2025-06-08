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
  User
} from 'lucide-react';

// Service de données
class DataService {
  constructor() {
    this.ANOMALIES_KEY = 'maintenance_anomalies';
    this.NOTIFICATIONS_KEY = 'notifications_responsable';
    this.INTERVENTIONS_KEY = 'maintenance_interventions';
    this.TECHNICIENS_KEY = 'maintenance_techniciens';
    this.HISTO_KEY = 'historique_conducteur';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.ANOMALIES_KEY)) {
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
        }
      ];
      localStorage.setItem(this.ANOMALIES_KEY, JSON.stringify(initialAnomalies));
    }

    if (!localStorage.getItem(this.TECHNICIENS_KEY)) {
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
          status: 'disponible'
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
          status: 'en_intervention'
        }
      ];
      localStorage.setItem(this.TECHNICIENS_KEY, JSON.stringify(initialTechniciens));
    }

    if (!localStorage.getItem(this.INTERVENTIONS_KEY)) {
      const initialInterventions = [
        {
          id: 1,
          portique: 'P5',
          type: 'Électrique',
          urgence: 'haute',
          description: 'Réparation circuit électrique',
          statut: 'en_cours',
          status: 'en_cours',
          date: new Date().toISOString(),
          startDate: new Date().toISOString(),
          technician: 'Pierre Martin',
          technicianId: 2
        }
      ];
      localStorage.setItem(this.INTERVENTIONS_KEY, JSON.stringify(initialInterventions));
    }
  }

  getAnomalies() {
    return JSON.parse(localStorage.getItem(this.ANOMALIES_KEY) || '[]');
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

  updateAnomaly(id, updates) {
    const anomalies = this.getAnomalies();
    const index = anomalies.findIndex(a => a.id === id);
    if (index !== -1) {
      anomalies[index] = { ...anomalies[index], ...updates };
      localStorage.setItem(this.ANOMALIES_KEY, JSON.stringify(anomalies));
      
      if (updates.status) {
        this.addNotification({
          id: Date.now(),
          message: `Statut mis à jour: ${anomalies[index].title} - ${updates.status}`,
          date: new Date().toLocaleString('fr-FR'),
          type: 'status_update',
          lu: false
        });
      }
    }
  }

  getTechniciens() {
    return JSON.parse(localStorage.getItem(this.TECHNICIENS_KEY) || '[]');
  }

  getInterventions() {
    return JSON.parse(localStorage.getItem(this.INTERVENTIONS_KEY) || '[]');
  }

  addNotification(notification) {
    const notifications = JSON.parse(localStorage.getItem(this.NOTIFICATIONS_KEY) || '[]');
    notifications.unshift(notification);
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new Event('storage'));
  }

  getNotifications() {
    return JSON.parse(localStorage.getItem(this.NOTIFICATIONS_KEY) || '[]');
  }

  markNotificationAsRead(id) {
    const notifications = this.getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].lu = true;
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  }

  markAllNotificationsAsRead() {
    const notifications = this.getNotifications().map(n => ({ ...n, lu: true }));
    localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(notifications));
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
      totalInterventions: interventions.length,
      interventionsEnCours: interventions.filter(i => i.status === 'en_cours').length,
      techniciensDisponibles: techniciens.filter(t => t.status === 'disponible').length,
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

  // Charger les données
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
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Écouter les changements localStorage
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

  // Handlers
  const handleValidate = (id) => {
    dataService.updateAnomaly(id, { status: 'validee' });
    setAnomalies(dataService.getAnomalies());
    setStats(dataService.getStats());
    setSnackbar({
      open: true,
      message: 'Anomalie validée avec succès',
      type: 'success'
    });
  };

  const handleReject = (id) => {
    dataService.updateAnomaly(id, { status: 'rejetee' });
    setAnomalies(dataService.getAnomalies());
    setStats(dataService.getStats());
    setSnackbar({
      open: true,
      message: 'Anomalie rejetée',
      type: 'warning'
    });
  };

  const markAllAsRead = () => {
    dataService.markAllNotificationsAsRead();
    setNotifications(dataService.getNotifications());
    setNotifCount(0);
  };

  // Utility functions
  const getStatusColor = (status) => {
    const colors = {
      'nouvelle': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'validee': 'bg-green-100 text-green-800 border-green-200',
      'rejetee': 'bg-red-100 text-red-800 border-red-200',
      'en_cours': 'bg-blue-100 text-blue-800 border-blue-200',
      'en_attente': 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'critique': 'bg-red-500 text-white',
      'haute': 'bg-orange-500 text-white',
      'moyenne': 'bg-blue-500 text-white',
      'basse': 'bg-green-500 text-white'
    };
    return colors[priority] || 'bg-gray-500 text-white';
  };

  // Components
  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => (
    <div className={`bg-gradient-to-br from-${color}-500 to-${color}-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white bg-opacity-20 rounded-lg p-3">
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center text-sm">
            <TrendingUp size={16} className="mr-1" />
            +{trend}%
          </div>
        )}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-lg font-medium mb-1 opacity-90">{title}</div>
      <div className="text-sm opacity-70">{subtitle}</div>
    </div>
  );

  const Badge = ({ children, color = 'gray' }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      {children}
    </span>
  );

  // Tab Contents
  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={AlertTriangle}
          title="Anomalies Totales"
          value={stats.totalAnomalies || 0}
          subtitle="Toutes catégories"
          color="red"
          trend={12}
        />
        <StatCard
          icon={AlertTriangle}
          title="Nouvelles Anomalies"
          value={stats.nouvellesAnomalies || 0}
          subtitle="En attente validation"
          color="orange"
        />
        <StatCard
          icon={Users}
          title="Techniciens Dispo."
          value={stats.techniciensDisponibles || 0}
          subtitle="Prêts intervention"
          color="green"
        />
        <StatCard
          icon={Wrench}
          title="Interventions"
          value={stats.interventionsEnCours || 0}
          subtitle="En cours"
          color="blue"
        />
      </div>

      {/* Anomalies récentes */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">🚨 Anomalies Récentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anomalie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priorité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Signalée par</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {anomalies.slice(0, 5).map((anomaly) => (
                <tr key={anomaly.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{anomaly.title}</div>
                      <div className="text-sm text-gray-500">{anomaly.location}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={getPriorityColor(anomaly.priority)}>
                      {anomaly.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge color={getStatusColor(anomaly.status)}>
                      {anomaly.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium mr-3">
                        {anomaly.reportedBy?.[0] || '?'}
                      </div>
                      <div className="text-sm text-gray-900">{anomaly.reportedBy}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(anomaly.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {anomaly.status === 'nouvelle' && (
                        <>
                          <button
                            onClick={() => handleValidate(anomaly.id)}
                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Valider"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(anomaly.id)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Rejeter"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button
                        className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {anomalies.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Aucune anomalie signalée
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">🔧 Gestion des Interventions</h2>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-2" />
            Nouvelle intervention
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw size={16} className="mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Portique</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Urgence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Technicien</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {interventions.map((inter) => (
              <tr key={inter.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{inter.id}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{inter.portique}</td>
                <td className="px-6 py-4">
                  <Badge color="bg-blue-100 text-blue-800">{inter.type}</Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge color={
                    inter.urgence === 'critique' ? 'bg-red-500 text-white' :
                    inter.urgence === 'haute' ? 'bg-orange-500 text-white' :
                    'bg-blue-500 text-white'
                  }>
                    {inter.urgence}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <Badge color={getStatusColor(inter.statut)}>
                    {inter.statut}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {inter.technician && (
                      <>
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs mr-2">
                          {inter.technician[0]}
                        </div>
                        <span className="text-sm text-gray-900">{inter.technician}</span>
                      </>
                    )}
                    {!inter.technician && <span className="text-sm text-gray-500">Non assigné</span>}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <button className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 bg-gray-100 text-gray-600 rounded hover:bg-gray-200">
                      <Edit size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {interventions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">👥 Gestion des Techniciens</h2>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-2" />
            Ajouter technicien
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw size={16} className="mr-2" />
            Actualiser
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techniciens.map((tech) => (
          <div key={tech.id} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-4">
                {tech.prenom?.[0]}{tech.nom?.[0]}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{tech.prenom} {tech.nom}</h3>
                <p className="text-sm text-gray-600">{tech.specialite}</p>
              </div>
              <Badge color="bg-blue-100 text-blue-800">{tech.shift}</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div><strong>Email:</strong> {tech.email}</div>
              <div><strong>Téléphone:</strong> {tech.telephone}</div>
              <div className="flex items-center justify-between">
                <strong>Statut:</strong>
                <Badge color={
                  (tech.status === 'disponible' || tech.statut === 'actif') ? 'bg-green-100 text-green-800' :
                  tech.status === 'en_intervention' ? 'bg-orange-100 text-orange-800' :
                  'bg-red-100 text-red-800'
                }>
                  {tech.status || tech.statut}
                </Badge>
              </div>
              <div><strong>Interventions:</strong> {tech.interventions || 0}</div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                <Edit size={16} />
              </button>
              <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {techniciens.length === 0 && (
          <div className="col-span-full bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-gray-500">Aucun technicien enregistré</p>
          </div>
        )}
      </div>
    </div>
  );

  const ReportsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">📊 Rapports et Statistiques</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Répartition par type d'anomalie</h3>
          <div className="space-y-3">
            {Object.entries(stats.pannesParType || {}).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm font-medium capitalize">{type}</span>
                <Badge color="bg-blue-500 text-white">{count}</Badge>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Performance du système</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Temps de résolution moyen</p>
              <p className="text-3xl font-bold text-green-600">23 min</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Taux de résolution</p>
              <p className="text-3xl font-bold text-blue-600">94%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🏗️ Système de Maintenance Portuaire
            </h1>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setAnomalies(dataService.getAnomalies());
                  setStats(dataService.getStats());
                }}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Actualiser"
              >
                <RefreshCw size={20} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifCount}
                    </span>
                  )}
                </button>

                {/* Dropdown des notifications */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        {notifCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Tout marquer comme lu
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          Aucune notification
                        </div>
                      ) : (
                        notifications.slice(0, 10).map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notif.lu ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => {
                              if (!notif.lu) {
                                dataService.markNotificationAsRead(notif.id);
                                setNotifications(dataService.getNotifications());
                                setNotifCount(prev => Math.max(0, prev - 1));
                              }
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                !notif.lu ? 'bg-blue-500' : 'bg-gray-300'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${
                                  !notif.lu ? 'font-medium text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notif.date}
                                </p>
                                {notif.priority && (
                                  <Badge color={getPriorityColor(notif.priority)} className="mt-1">
                                    {notif.priority}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 10 && (
                      <div className="p-3 text-center border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-700">
                          Voir toutes les notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                R
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="px-6">
          <div className="flex space-x-0">
            {[
              { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
              { id: 'interventions', label: 'Interventions', icon: Wrench },
              { id: 'techniciens', label: 'Techniciens', icon: Users },
              { id: 'reports', label: 'Rapports', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  currentTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} className="mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="p-6">
        {currentTab === 'dashboard' && <DashboardContent />}
        {currentTab === 'interventions' && <InterventionsContent />}
        {currentTab === 'techniciens' && <TechniciensContent />}
        {currentTab === 'reports' && <ReportsContent />}
      </main>

      {/* Snackbar pour notifications */}
      {snackbar.open && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 ${
            snackbar.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            snackbar.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
            snackbar.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            <span>{snackbar.message}</span>
            <button
              onClick={() => setSnackbar({ ...snackbar, open: false })}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Overlay pour fermer les notifications */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

export default ResponsableDashboard;