// src/services/authService.js
import { getStoredData, setStoredData } from './mockData';

const authService = {
  login: async (credentials) => {
    try {
      const users = getStoredData('mockUsers');
      const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
      
      if (user) {
        // Remove password from user object before storing
        const { password, ...userWithoutPassword } = user;
        
        // Store user in localStorage
        setStoredData('currentUser', userWithoutPassword);
        
        return {
          success: true,
          user: userWithoutPassword
        };
      }
      
      return {
        success: false,
        error: 'Email ou mot de passe incorrect'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Une erreur est survenue lors de la connexion'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    return { success: true };
  },

  getCurrentUser: () => {
    return getStoredData('currentUser');
  },

  isAuthenticated: () => {
    return !!getStoredData('currentUser');
  }
};

export default authService;