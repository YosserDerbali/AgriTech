import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'farmer' | 'agronomist' | 'admin';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AppStore {
  currentRole: UserRole;
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  setRole: (role: UserRole) => void;
  setUser: (user: UserInfo | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set) => ({
  currentRole: 'farmer',
  isAuthenticated: false,
  user: null,
  token: null,
  setRole: (role) => set({ currentRole: role }),
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setToken: async (token: string | null) => {
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      await AsyncStorage.removeItem('authToken');
    }
    set({ token });
  },
  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    set({ isAuthenticated: false, user: null, currentRole: 'farmer', token: null });
  },
  restoreToken: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        set({ token, isAuthenticated: true });
      }
    } catch (e) {
      console.error('Failed to restore token');
    }
  },
}));
