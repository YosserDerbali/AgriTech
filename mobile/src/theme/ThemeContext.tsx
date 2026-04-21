import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, shadows } from './colors';

type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primarySoft: string;
  primaryExtraLight: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  accentSoft: string;
  background: string;
  surfaceBackground: string;
  surface: string;
  card: string;
  surfaceElevated: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textLight: string;
  textInverse: string;
  muted: string;
  border: string;
  borderLight: string;
  borderLighter: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  error: string;
  destructive: string;
  errorLight: string;
  pending: string;
  pendingLight: string;
  overlay: string;
  overlayLight: string;
  overlayExtraLight: string;
  gradientStart: string;
  gradientEnd: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  shadows: typeof shadows;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('darkMode');
      if (savedTheme !== null) {
        setMode(savedTheme === 'true' ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    AsyncStorage.setItem('darkMode', String(newMode === 'dark'));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
    AsyncStorage.setItem('darkMode', String(newMode === 'dark'));
  };

  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, shadows, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};