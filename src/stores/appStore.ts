import { create } from 'zustand';
import {jwtDecode} from 'jwt-decode';

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
  hydrateAuth:() => void;
}
interface JwtPayload {
  id: string;
  role: UserRole;
  exp?: number;
} 

export const useAppStore = create<AppStore>((set) => ({
  currentRole: 'farmer',
  isAuthenticated: false,
  user: null,
  setRole: (role) => set({ currentRole: role }),
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
   logout: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, user: null, currentRole: 'farmer' });
  },
  hydrateAuth: () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      // Optionally check expiration
      const lowerCasedRole = decoded.role.toLowerCase() as UserRole;
      set({
        isAuthenticated: true,
        currentRole: lowerCasedRole,
        // user info from token, fallback to null
        user: {
          name: '', // can optionally fetch name from backend if needed
          email: '',
          role: decoded.role,
        },
      });
    } catch (err) {
      console.error('Invalid token', err);
      localStorage.removeItem('token');
    }
  },
}));
