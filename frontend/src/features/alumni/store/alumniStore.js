import { create } from 'zustand';

export const useAlumniStore = create((set) => ({
  networkFilter: 'all',
  setNetworkFilter: (filter) => set({ networkFilter: filter }),
}));
