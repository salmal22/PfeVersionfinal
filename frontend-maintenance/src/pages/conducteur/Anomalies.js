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

// Service de données (même que précédemment)
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

  const getTypeIcon = (type) => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.icon : Wrench;
  };

  const getTypeColor = (type) => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.color : 'gray';
  };

  const isFormValid = () => {
    return form.portique && form.type && form.detail && form.description.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-blue-50 to-indigo-100 shadow-lg border-b border-blue-200 sticky top-0 z-20">
        <div className="px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-tr from-pink-200 via-red-300 to-red-500 p-3 rounded-2xl shadow-lg">
                <AlertTriangle className="text-red-700" size={30} />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-indigo-900 tracking-tight drop-shadow-sm">Signaler une anomalie</h1>
                <p className="text-sm text-blue-600 font-medium">Interface Conducteur – Port de Casablanca</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-200 to-green-400 px-3 py-1 rounded-full shadow-md">
                <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-green-900 text-sm font-bold">En ligne</span>
              </div>
              <button 
                onClick={loadHistory}
                className="p-2 text-indigo-500 hover:text-pink-600 hover:bg-pink-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                aria-label="Afficher l'historique"
              >
                <History size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        {/* Message de succès */}
        {success && (
          <div className="mb-6 bg-gradient-to-r from-green-200 via-green-100 to-green-50 border border-green-300 rounded-2xl p-4 shadow-xl transform transition-all duration-500 scale-100 animate-fade-in">
            <div className="flex items-start space-x-3">
              <CheckCircle className="text-green-600 mt-0.5" size={28} />
              <div>
                <h3 className="font-semibold text-green-900 mb-1 text-lg">
                  ✅ Signalement envoyé avec succès !
                </h3>
                <p className="text-green-800 text-sm">
                  Le responsable de maintenance a été notifié et traitera votre demande dans les plus brefs délais.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Formulaire principal */}
          <div className="lg:col-span-2">
            <div className="bg-white bg-opacity-90 rounded-3xl shadow-2xl p-10 border border-blue-100">
              <div className="flex items-center space-x-3 mb-8">
                <AlertTriangle className="text-pink-500" size={32} />
                <h2 className="text-xl font-extrabold text-indigo-900 tracking-tight">
                  Signaler une nouvelle anomalie
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Portique et Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-bold text-blue-700 mb-2">
                      Portique concerné <span className="text-pink-500">*</span>
                    </label>
                    <select
                      name="portique"
                      value={form.portique}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all bg-blue-50 text-blue-900 font-semibold shadow-sm"
                    >
                      <option value="">Sélectionner un portique</option>
                      {portiques.map(p => (
                        <option key={p.id} value={p.id}>
                          Portique {p.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-blue-700 mb-2">
                      Type d'anomalie <span className="text-pink-500">*</span>
                    </label>
                    <select
                      name="type"
                      value={form.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all bg-blue-50 text-blue-900 font-semibold shadow-sm"
                    >
                      <option value="">Sélectionner le type</option>
                      {types.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Composant affecté */}
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2">
                    Composant affecté <span className="text-pink-500">*</span>
                  </label>
                  <select
                    name="detail"
                    value={form.detail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all bg-blue-50 text-blue-900 font-semibold shadow-sm"
                  >
                    <option value="">Sélectionner le composant</option>
                    {details.map(d => (
                      <option key={d} value={d}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-bold text-blue-700 mb-2">
                    Description détaillée du problème <span className="text-pink-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all resize-none bg-blue-50 text-blue-900 font-semibold shadow-sm"
                    placeholder="Décrivez précisément le problème observé, les circonstances, les symptômes..."
                  />
                </div>

                {/* Boutons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={!isFormValid() || isSubmitting}
                    className={`flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 text-lg tracking-wide focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2
                      ${isFormValid() && !isSubmitting
                        ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 hover:from-pink-600 hover:to-yellow-500 text-white hover:shadow-2xl transform hover:-translate-y-0.5'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2" size={24} />
                        Envoyer le signalement
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-10">
            {/* Informations utilisateur */}
            <div className="bg-gradient-to-br from-blue-100 via-white to-indigo-100 rounded-3xl shadow-xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold mb-4 flex items-center text-blue-800">
                <User className="mr-2 text-blue-500" size={24} />
                Votre statut
              </h3>
              <div className="space-y-3 text-base">
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Conducteur :</span>
                  <span className="font-bold text-indigo-900">Ahmed Alami</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Shift :</span>
                  <span className="font-bold text-indigo-900">Matin (06:00-14:00)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Zone :</span>
                  <span className="font-bold text-indigo-900">Portiques P5-P9</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-700">Statut :</span>
                  <span className="flex items-center text-green-700 font-bold">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Actif
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-indigo-50 via-blue-100 to-pink-100 rounded-3xl p-6 border border-blue-100 shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-pink-700 flex items-center">
                <Info className="mr-2" size={24} />
                Instructions importantes
              </h3>
              <div className="space-y-3 text-base text-blue-900">
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <div>
                    <strong>Sécurité d'abord :</strong> En cas d'urgence critique, arrêtez immédiatement l'opération
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <div>
                    <strong>Description précise :</strong> Plus vous donnez de détails, plus l'intervention sera efficace
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <div>
                    <strong>Suivi en temps réel :</strong> Vous serez notifié des actions entreprises
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts d'urgence */}
            <div className="bg-gradient-to-br from-pink-100 via-red-100 to-orange-100 border border-pink-200 rounded-3xl p-6 shadow-lg">
              <h3 className="text-lg font-bold mb-4 text-pink-900 flex items-center">
                <Phone className="mr-2" size={24} />
                Contacts d'urgence
              </h3>
              <div className="space-y-2 text-base">
                <div className="flex justify-between">
                  <span className="font-bold text-pink-800">Sécurité :</span>
                  <span className="text-pink-700">15</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-pink-800">Maintenance :</span>
                  <span className="text-pink-700">+212 5 22 XX XX XX</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-pink-800">Responsable :</span>
                  <span className="text-pink-700">+212 6 XX XX XX XX</span>
                </div>
              </div>
            </div>

            {/* Historique */}
            {showHistory && (
              <div className="bg-white bg-opacity-90 rounded-3xl shadow-xl p-6 border border-blue-100 animate-fade-in">
                <h3 className="text-lg font-bold mb-4 flex items-center text-indigo-700">
                  <Clock className="mr-2 text-pink-500" size={24} />
                  Historique récent
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className="text-blue-400 text-base">Aucun signalement récent</p>
                  ) : (
                    history.slice(0, 5).map((item) => (
                      <div key={item.id} className="border border-pink-100 rounded-xl p-3 bg-gradient-to-r from-blue-50 via-white to-pink-50 hover:bg-pink-50 transition-colors duration-200 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-indigo-900">{item.title}</span>
                          <span className={`px-2 py-1 rounded text-xs font-extrabold uppercase tracking-wide shadow-md
                            ${item.statut === 'en attente' ? 'bg-yellow-200 text-yellow-900' :
                              item.statut === 'en cours' ? 'bg-blue-200 text-blue-900' :
                              'bg-green-200 text-green-900'}`}
                          >
                            {item.statut}
                          </span>
                        </div>
                        <p className="text-xs text-blue-400">
                          {new Date(item.date_debut).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-100 via-white to-pink-100 rounded-2xl shadow-lg p-4 border border-blue-100">
            <p className="text-indigo-700 text-base font-bold">
              🏗️ Port de Casablanca - Système de Maintenance Intégré v2.0
            </p>
            <p className="text-pink-500 text-xs mt-1">
              Pour toute assistance technique, contactez le support : <span className="underline">support@port-casa.ma</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConducteurAnomalies;