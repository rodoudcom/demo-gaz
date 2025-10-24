import { create } from 'zustand';
import { fakeApi } from '../api/fakeApi';

export const useUserStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    role: '',
    filialeId: null,
    isActive: null,
    restrictRoles: false
  },

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const filters = get().filters;
      const data = await fakeApi.users.getAll(filters);
      set({ users: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createUser: async (data) => {
    set({ loading: true, error: null });
    try {
      const newUser = await fakeApi.users.create(data);
      set((state) => ({ 
        users: [...state.users, newUser],
        loading: false 
      }));
      return newUser;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateUser: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await fakeApi.users.update(id, data);
      set((state) => ({
        users: state.users.map(u => u.id === id ? updated : u),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await fakeApi.users.delete(id);
      set((state) => ({
        users: state.users.filter(u => u.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
