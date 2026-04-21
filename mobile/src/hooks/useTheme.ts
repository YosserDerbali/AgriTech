import { useAppStore } from '../stores/appStore';
import { getTheme, getColors, UserRole, ThemeMode } from '../theme/colors';

export interface Theme {
  colors: ReturnType<typeof getColors>;
  shadows: any;
  isDark: boolean;
  theme: ThemeMode;
  role: UserRole;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  restoreTheme: () => Promise<void>;
}

/**
 * Custom hook to access theme colors and methods
 * Automatically switches colors based on current role and theme mode
 * 
 * Usage:
 *   const { colors, isDark, toggleTheme } = useTheme();
 *   
 * Returns different palettes based on:
 *   - currentRole: 'farmer' (green) or 'agronomist' (orange)
 *   - theme: 'light' or 'dark'
 */
export const useTheme = (): Theme => {
  const currentRole = useAppStore((state) => state.currentRole);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);
  const restoreTheme = useAppStore((state) => state.restoreTheme);

  // Map admin to farmer to ensure valid role is used
  const role: UserRole = currentRole === 'admin' ? 'farmer' : currentRole;

  // Get the theme object which includes colors and shadows
  const themeObject = getTheme(role, theme);

  return {
    colors: themeObject.colors,
    shadows: themeObject.shadows,
    isDark: themeObject.isDark,
    theme,
    role,
    setTheme,
    toggleTheme,
    restoreTheme,
  };
};
