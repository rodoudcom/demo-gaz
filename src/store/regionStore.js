import { create } from 'zustand';
import { fakeApi } from '../api/fakeApi';

export const useRegionStore = create((set, get) => ({
  regions: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    filialeId: null
  },

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  fetchRegions: async () => {
    set({ loading: true, error: null });
    try {
      const filters = get().filters;
      const data = await fakeApi.regions.getAll(filters);
      set({ regions: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createRegion: async (data) => {
    set({ loading: true, error: null });
    try {
      const newRegion = await fakeApi.regions.create(data);
      set((state) => ({ 
        regions: [...state.regions, newRegion],
        loading: false 
      }));
      return newRegion;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateRegion: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updated = await fakeApi.regions.update(id, data);
      set((state) => ({
        regions: state.regions.map(r => r.id === id ? updated : r),
        loading: false
      }));
      return updated;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteRegion: async (id) => {
    set({ loading: true, error: null });
    try {
      await fakeApi.regions.delete(id);
      set((state) => ({
        regions: state.regions.filter(r => r.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
