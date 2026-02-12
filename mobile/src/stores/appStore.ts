import { create } from 'zustand';

export type UserRole = 'farmer' | 'agronomist' | 'admin';

interface UserInfo {
  name: string;
  email: string;
  role: UserRole;
}

interface AppStore {
  currentRole: UserRole;
  isAuthenticated: boolean;
  user: UserInfo | null;
  setRole: (role: UserRole) => void;
  setUser: (user: UserInfo | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentRole: 'farmer',
  isAuthenticated: false,
  user: null,
  setRole: (role) => set({ currentRole: role }),
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  logout: () => set({ isAuthenticated: false, user: null, currentRole: 'farmer' }),
}));
