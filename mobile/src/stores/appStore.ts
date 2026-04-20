import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'farmer' | 'agronomist' | 'admin';
export type ThemeMode = 'light' | 'dark';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AppStore {
  // Auth state
  currentRole: UserRole;
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  
  // Theme state
  theme: ThemeMode;
  
  // Auth methods
  setRole: (role: UserRole) => void;
  setUser: (user: UserInfo | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
  restoreToken: () => Promise<void>;
  
  // Theme methods
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  restoreTheme: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Auth state - defaults
  currentRole: 'farmer',
  isAuthenticated: false,
  user: null,
  token: null,
  
  // Theme state - defaults to light
  theme: 'light',
  
  // Auth methods
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
      console.error('Failed to restore token:', e);
    }
  },
  
  // Theme methods
  setTheme: async (theme: ThemeMode) => {
    try {
      await AsyncStorage.setItem('appTheme', theme);
      set({ theme });
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  },
  
  toggleTheme: async () => {
    const currentTheme = get().theme;
    const newTheme: ThemeMode = currentTheme === 'light' ? 'dark' : 'light';
    await get().setTheme(newTheme);
  },
  
  restoreTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('appTheme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        set({ theme: savedTheme });
      }
    } catch (e) {
      console.error('Failed to restore theme:', e);
    }
  },
}));
