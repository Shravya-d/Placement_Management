import { create } from 'zustand';

export const useStudentStore = create((set) => ({
  selectedCompanyId: null,
  setSelectedCompanyId: (id) => set({ selectedCompanyId: id }),
  applicationFilter: 'all',
  setApplicationFilter: (filter) => set({ applicationFilter: filter })
}));
