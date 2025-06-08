// Mock data for the maintenance system
const mockUsers = [
  {
    id: 1,
    email: 'conducteur@marsamaroc.ma',
    password: 'password123',
    role: 'conducteur',
    name: 'Ahmed Conducteur',
    department: 'Transport'
  },
  {
    id: 2,
    email: 'responsable@marsamaroc.ma',
    password: 'password123',
    role: 'responsable',
    name: 'Fatima Responsable',
    department: 'Maintenance'
  },
  {
    id: 3,
    email: 'technicien@marsamaroc.ma',
    password: 'password123',
    role: 'technicien',
    name: 'Karim Technicien',
    department: 'Maintenance'
  }
];

const mockAnomalies = [
  {
    id: 1,
    title: 'Panne moteur',
    description: 'Le moteur ne démarre pas correctement',
    status: 'en_cours',
    priority: 'haute',
    date: '2024-03-15',
    location: 'Zone A',
    reportedBy: 'Ahmed Conducteur',
    assignedTo: 'Karim Technicien'
  },
  {
    id: 2,
    title: 'Fuite d\'huile',
    description: 'Fuite d\'huile détectée sous le véhicule',
    status: 'nouvelle',
    priority: 'moyenne',
    date: '2024-03-14',
    location: 'Zone B',
    reportedBy: 'Ahmed Conducteur',
    assignedTo: null
  }
];

const mockInterventions = [
  {
    id: 1,
    anomalyId: 1,
    title: 'Réparation moteur',
    description: 'Remplacement des pièces défectueuses',
    status: 'en_cours',
    startDate: '2024-03-15',
    endDate: null,
    technician: 'Karim Technicien',
    priority: 'haute'
  }
];

const mockTechniciens = [
  {
    id: 1,
    name: 'Karim Technicien',
    email: 'technicien@marsamaroc.ma',
    speciality: 'Mécanique',
    status: 'disponible',
    currentInterventions: 1
  }
];

// Helper functions to work with localStorage
const getStoredData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize mock data in localStorage if not exists
const initializeMockData = () => {
  if (!getStoredData('mockUsers')) setStoredData('mockUsers', mockUsers);
  if (!getStoredData('mockAnomalies')) setStoredData('mockAnomalies', mockAnomalies);
  if (!getStoredData('mockInterventions')) setStoredData('mockInterventions', mockInterventions);
  if (!getStoredData('mockTechniciens')) setStoredData('mockTechniciens', mockTechniciens);
};

// Call initialization
initializeMockData();

export {
  getStoredData,
  setStoredData,
  mockUsers,
  mockAnomalies,
  mockInterventions,
  mockTechniciens
}; 