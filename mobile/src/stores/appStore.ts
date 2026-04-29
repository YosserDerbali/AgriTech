import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getClerkInstance } from '@clerk/clerk-expo';

export type UserRole = 'farmer' | 'agronomist' | 'admin';
export type ThemeMode = 'light' | 'dark';

interface UserInfo {
  id: string | number;
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
  clerkSessionId: string | null;
  
  // Theme state
  theme: ThemeMode;
  
  // Auth methods
  setRole: (role: UserRole) => void;
  setUser: (user: UserInfo | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setToken: (token: string | null) => Promise<void>;
  setClerkSession: (sessionId: string | null) => void;
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
  clerkSessionId: null,
  
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
    set({ token, isAuthenticated: Boolean(token || get().clerkSessionId) });
  },

  setClerkSession: (sessionId: string | null) => {
    set({ clerkSessionId: sessionId, isAuthenticated: Boolean(sessionId || get().token) });
  },
  
  logout: async () => {
    const clerk = getClerkInstance();

    try {
      await clerk?.signOut();
    } catch (error) {
      console.error('Failed to sign out of Clerk:', error);
    }

    await AsyncStorage.removeItem('authToken');
    set({ isAuthenticated: false, user: null, currentRole: 'farmer', token: null, clerkSessionId: null });
  },
  
  restoreToken: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        set({ token, isAuthenticated: Boolean(token || get().clerkSessionId) });
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
