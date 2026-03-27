import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  theme: 'dark' // strictly dark as per prompt
}));
