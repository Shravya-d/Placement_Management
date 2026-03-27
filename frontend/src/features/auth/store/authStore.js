import { create } from 'zustand';

import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user, 
        role: user?.role || user?.adminDetails?.role || user?.studentData?.role || null 
      }),
      logout: () => set({ user: null, isAuthenticated: false, role: null })
    }),
    {
      name: 'placementsync-auth-storage',
    }
  )
);
