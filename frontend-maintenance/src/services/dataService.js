import { getStoredData, setStoredData } from './mockData';

const dataService = {
  // Anomalies
  getAnomalies: () => {
    return getStoredData('mockAnomalies') || [];
  },

  createAnomaly: (anomaly) => {
    const anomalies = getStoredData('mockAnomalies') || [];
    const newAnomaly = {
      ...anomaly,
      id: anomalies.length + 1,
      date: new Date().toISOString().split('T')[0],
      status: 'nouvelle'
    };
    anomalies.push(newAnomaly);
    setStoredData('mockAnomalies', anomalies);
    return newAnomaly;
  },

  updateAnomaly: (id, updates) => {
    const anomalies = getStoredData('mockAnomalies') || [];
    const index = anomalies.findIndex(a => a.id === id);
    if (index !== -1) {
      anomalies[index] = { ...anomalies[index], ...updates };
      setStoredData('mockAnomalies', anomalies);
      return anomalies[index];
    }
    return null;
  },

  // Interventions
  getInterventions: () => {
    return getStoredData('mockInterventions') || [];
  },

  createIntervention: (intervention) => {
    const interventions = getStoredData('mockInterventions') || [];
    const newIntervention = {
      ...intervention,
      id: interventions.length + 1,
      startDate: new Date().toISOString().split('T')[0],
      status: 'en_cours'
    };
    interventions.push(newIntervention);
    setStoredData('mockInterventions', interventions);
    return newIntervention;
  },

  updateIntervention: (id, updates) => {
    const interventions = getStoredData('mockInterventions') || [];
    const index = interventions.findIndex(i => i.id === id);
    if (index !== -1) {
      interventions[index] = { ...interventions[index], ...updates };
      setStoredData('mockInterventions', interventions);
      return interventions[index];
    }
    return null;
  },

  // Techniciens
  getTechniciens: () => {
    return getStoredData('mockTechniciens') || [];
  },

  updateTechnicien: (id, updates) => {
    const techniciens = getStoredData('mockTechniciens') || [];
    const index = techniciens.findIndex(t => t.id === id);
    if (index !== -1) {
      techniciens[index] = { ...techniciens[index], ...updates };
      setStoredData('mockTechniciens', techniciens);
      return techniciens[index];
    }
    return null;
  },

  // Dashboard Stats
  getDashboardStats: () => {
    const anomalies = getStoredData('mockAnomalies') || [];
    const interventions = getStoredData('mockInterventions') || [];
    
    return {
      totalAnomalies: anomalies.length,
      anomaliesEnCours: anomalies.filter(a => a.status === 'en_cours').length,
      anomaliesNouvelles: anomalies.filter(a => a.status === 'nouvelle').length,
      totalInterventions: interventions.length,
      interventionsEnCours: interventions.filter(i => i.status === 'en_cours').length,
      interventionsTerminees: interventions.filter(i => i.status === 'terminee').length
    };
  }
};

export default dataService; 