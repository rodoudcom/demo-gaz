export const africanCountries = [
  { id: 1, name: 'Algeria', code: 'DZ' },
  { id: 2, name: 'Angola', code: 'AO' },
  { id: 3, name: 'Benin', code: 'BJ' },
  // ... (keep all countries same)
  { id: 54, name: 'Zimbabwe', code: 'ZW' }
];

export const mockFiliales = [
  { id: 1, name: 'Pledge West Africa', country: 'Nigeria', createdAt: '2024-01-15' },
  { id: 2, name: 'Pledge North Africa', country: 'Algeria', createdAt: '2024-02-20' },
  { id: 3, name: 'Pledge East Africa', country: 'Kenya', createdAt: '2024-03-10' },
  { id: 4, name: 'Pledge Central Africa', country: 'Cameroon', createdAt: '2024-04-05' },
  { id: 5, name: 'Pledge South Africa', country: 'South Africa', createdAt: '2024-05-12' },
];

export const mockRegions = [
  { id: 1, name: 'Lagos Region', filialeId: 1, filialeName: 'Pledge West Africa', createdAt: '2024-01-20' },
  { id: 2, name: 'Abuja Region', filialeId: 1, filialeName: 'Pledge West Africa', createdAt: '2024-01-25' },
  { id: 3, name: 'Algiers Region', filialeId: 2, filialeName: 'Pledge North Africa', createdAt: '2024-02-25' },
  { id: 4, name: 'Nairobi Region', filialeId: 3, filialeName: 'Pledge East Africa', createdAt: '2024-03-15' },
  { id: 5, name: 'Douala Region', filialeId: 4, filialeName: 'Pledge Central Africa', createdAt: '2024-04-10' },
  { id: 6, name: 'Johannesburg Region', filialeId: 5, filialeName: 'Pledge South Africa', createdAt: '2024-05-15' },
];

export const mockUsers = [
  { 
    id: 1, 
    fullname: 'John Admin', 
    email: 'admin@pledge.com', 
    role: 'Admin', 
    filialeId: null,
    filialeName: 'All Filiales',
    isActive: true, 
    createdAt: '2024-01-01' 
  },
  { 
    id: 2, 
    fullname: 'Sarah Country Manager', 
    email: 'sarah.cm@pledge.com', 
    role: 'Country Manager', 
    filialeId: 1,
    filialeName: 'Pledge West Africa',
    isActive: true, 
    createdAt: '2024-01-15' 
  },
  { 
    id: 3, 
    fullname: 'Mike Commercial', 
    email: 'mike.commercial@pledge.com', 
    role: 'Commercial', 
    filialeId: 1,
    filialeName: 'Pledge West Africa',
    isActive: true, 
    createdAt: '2024-02-10' 
  },
  { 
    id: 4, 
    fullname: 'Alice Distributor', 
    email: 'alice.dist@pledge.com', 
    role: 'Distributor', 
    filialeId: 2,
    filialeName: 'Pledge North Africa',
    isActive: true, 
    createdAt: '2024-02-20' 
  },
  { 
    id: 5, 
    fullname: 'Bob Shop Manager', 
    email: 'bob.shop@pledge.com', 
    role: 'Shop', 
    filialeId: 3,
    filialeName: 'Pledge East Africa',
    isActive: false, 
    createdAt: '2024-03-05' 
  },
];
