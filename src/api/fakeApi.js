import { africanCountries, mockFiliales, mockRegions, mockUsers } from './mockData';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

let filiales = [...mockFiliales];
let regions = [...mockRegions];
let users = [...mockUsers];

export const fakeApi = {
  // Authentication
  auth: {
    login: async (email, password) => {
      await delay();
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }
      
      // For demo purposes, any password works
      return {
        user: {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          role: user.role,
          filialeId: user.filialeId,
        },
        token: 'fake-jwt-token-' + user.id
      };
    },
    
    logout: async () => {
      await delay(200);
      return { success: true };
    }
  },

  // Countries
  countries: {
    getAll: async () => {
      await delay();
      return africanCountries;
    }
  },

  // Filiales
  filiales: {
    getAll: async (filters = {}) => {
      await delay();
      let result = [...filiales];
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(f => 
          f.name.toLowerCase().includes(search) || 
          f.country.toLowerCase().includes(search)
        );
      }
      
      if (filters.country) {
        result = result.filter(f => f.country === filters.country);
      }
      
      return result;
    },
    
    getById: async (id) => {
      await delay();
      return filiales.find(f => f.id === id);
    },
    
    create: async (data) => {
      await delay();
      const newFiliale = {
        ...data,
        id: Math.max(...filiales.map(f => f.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      filiales.push(newFiliale);
      return newFiliale;
    },
    
    update: async (id, data) => {
      await delay();
      const index = filiales.findIndex(f => f.id === id);
      if (index === -1) throw new Error('Filiale not found');
      
      filiales[index] = { ...filiales[index], ...data };
      return filiales[index];
    },
    
    delete: async (id) => {
      await delay();
      filiales = filiales.filter(f => f.id !== id);
      return { success: true };
    }
  },

  // Regions
  regions: {
    getAll: async (filters = {}) => {
      await delay();
      let result = [...regions];
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(r => 
          r.name.toLowerCase().includes(search) || 
          r.filialeName.toLowerCase().includes(search)
        );
      }
      
      if (filters.filialeId) {
        result = result.filter(r => r.filialeId === filters.filialeId);
      }
      
      return result;
    },
    
    getById: async (id) => {
      await delay();
      return regions.find(r => r.id === id);
    },
    
    create: async (data) => {
      await delay();
      const filiale = filiales.find(f => f.id === data.filialeId);
      const newRegion = {
        ...data,
        id: Math.max(...regions.map(r => r.id)) + 1,
        filialeName: filiale?.name || '',
        createdAt: new Date().toISOString().split('T')[0]
      };
      regions.push(newRegion);
      return newRegion;
    },
    
    update: async (id, data) => {
      await delay();
      const index = regions.findIndex(r => r.id === id);
      if (index === -1) throw new Error('Region not found');
      
      const filiale = filiales.find(f => f.id === data.filialeId);
      regions[index] = { 
        ...regions[index], 
        ...data,
        filialeName: filiale?.name || regions[index].filialeName
      };
      return regions[index];
    },
    
    delete: async (id) => {
      await delay();
      regions = regions.filter(r => r.id !== id);
      return { success: true };
    }
  },

  // Users
  users: {
    getAll: async (filters = {}) => {
      await delay();
      let result = [...users];
      
      // Admin can only see Admin and Country Manager
      if (filters.restrictRoles) {
        result = result.filter(u => 
          u.role === 'Admin' || u.role === 'Country Manager'
        );
      }
      
      if (filters.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(u => 
          u.fullname.toLowerCase().includes(search) || 
          u.email.toLowerCase().includes(search) ||
          u.role.toLowerCase().includes(search)
        );
      }
      
      if (filters.role) {
        result = result.filter(u => u.role === filters.role);
      }
      
      if (filters.filialeId) {
        result = result.filter(u => u.filialeId === filters.filialeId);
      }
      
      if (typeof filters.isActive === 'boolean') {
        result = result.filter(u => u.isActive === filters.isActive);
      }
      
      return result;
    },
    
    getById: async (id) => {
      await delay();
      return users.find(u => u.id === id);
    },
    
    create: async (data) => {
      await delay();
      const filiale = filiales.find(f => f.id === data.filialeId);
      const newUser = {
        ...data,
        id: Math.max(...users.map(u => u.id)) + 1,
        filialeName: filiale?.name || 'All Filiales',
        createdAt: new Date().toISOString().split('T')[0]
      };
      users.push(newUser);
      return newUser;
    },
    
    update: async (id, data) => {
      await delay();
      const index = users.findIndex(u => u.id === id);
      if (index === -1) throw new Error('User not found');
      
      const filiale = filiales.find(f => f.id === data.filialeId);
      users[index] = { 
        ...users[index], 
        ...data,
        filialeName: filiale?.name || users[index].filialeName
      };
      return users[index];
    },
    
    delete: async (id) => {
      await delay();
      users = users.filter(u => u.id !== id);
      return { success: true };
    }
  }
};
