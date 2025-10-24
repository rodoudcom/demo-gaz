import { create } from 'zustand';
import { fakeApi } from '../api/fakeApi';

export const useFilialeStore = create((set, get) => ({
  filiales: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    country: ''
  },

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  fetchFiliales: async () => {
    set({ loading: true, error: null });
    try {
      const filters = get().filters;
      const data = await fakeApi.filiales.getAll(filters);
      set({ filiales: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createFiliale: async (data) => {
    set({ loading: true, error: null });
    try {
      const newFiliale = await fakeApi.filiales.create(data);
      set((state) => ({ 
        filiales: [...state.filiales, newFiliale],
        loading: false 
      }));
      return newFiliale;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateFiliale: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await fakeApi.filiales.update(id, data);
      set((state) => ({
        filiales: state.filiales.map(f => f.id === id ? updated : f),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteFiliale: async (id) => {
    set({ loading: true, error: null });
    try {
      await fakeApi.filiales.delete(id);
      set((state) => ({
        filiales: state.filiales.filter(f => f.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
