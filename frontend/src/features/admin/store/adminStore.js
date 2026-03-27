import { create } from 'zustand';

export const useAdminStore = create((set) => ({
  selectedCompanyForSelection: null,
  setSelectedCompanyForSelection: (company) => set({ selectedCompanyForSelection: company }),
  isMatchingAlgorithmRunning: false,
  setMatchingAlgorithmRunning: (val) => set({ isMatchingAlgorithmRunning: val }),
}));
