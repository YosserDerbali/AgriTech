import { create } from 'zustand';

export type UserRole = 'farmer' | 'agronomist' | 'admin';

interface AppStore {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentRole: 'farmer',
  setRole: (role) => set({ currentRole: role }),
}));
