/**
 * Premium Color Palette
 * Based on modern design standards with enhanced visual hierarchy
 */

export const lightColors = {
  // Primary Brand Colors - Enhanced Green
  primary: '#1B5E20',
  primaryLight: '#2E7D32',
  primaryDark: '#0D3B12',
  primarySoft: '#E8F5E9',
  primaryExtraLight: '#F1F8F4',

  // Accent Colors - Premium Gold/Amber
  accent: '#F9A825',
  accentLight: '#FDD835',
  accentDark: '#F57C00',
  accentSoft: '#FFF8E1',

  // Neutral Colors - Professional Grays
  background: '#F5F5F0',
  surfaceBackground: '#FAFAF7',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  surfaceElevated: '#FAFAF7',
  surfaceAlt: '#F9F9F6',

  // Text Colors - Semantic
  text: '#1A1A1A',
  textSecondary: '#5C6B5E',
  textTertiary: '#8E9A8F',
  textMuted: '#A8B8AA',
  textLight: '#D0D8D2',
  textInverse: '#FFFFFF',
  muted: '#9CA3AF',
  
  // Border Colors
  border: '#E0E4DE',
  borderLight: '#EDEFE9',
  borderLighter: '#F5F5F5',

  // Semantic Colors
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#F57F17',
  warningLight: '#FFF8E1',
  error: '#C62828',
  destructive: '#C62828',
  errorLight: '#FFEBEE',
  pending: '#1565C0',
  pendingLight: '#E3F2FD',

  // Interactive States
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.2)',
  overlayExtraLight: 'rgba(0,0,0,0.08)',

  // Gradient anchors
  gradientStart: '#1B5E20',
  gradientEnd: '#2E7D32',
};

export const darkColors = {
  // Primary Brand Colors - Enhanced Green (adjusted for dark mode)
  primary: '#4CAF50',
  primaryLight: '#66BB6A',
  primaryDark: '#2E7D32',
  primarySoft: '#1B5E20',
  primaryExtraLight: '#0D3B12',

  // Accent Colors - Premium Gold/Amber
  accent: '#F9A825',
  accentLight: '#FDD835',
  accentDark: '#F57C00',
  accentSoft: '#332A1A',

  // Neutral Colors - Professional Grays (dark mode)
  background: '#121212',
  surfaceBackground: '#1E1E1E',
  surface: '#2C2C2C',
  card: '#2C2C2C',
  surfaceElevated: '#383838',
  surfaceAlt: '#252525',

  // Text Colors - Semantic (dark mode)
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#8A8A8A',
  textMuted: '#6A6A6A',
  textLight: '#4A4A4A',
  textInverse: '#1A1A1A',
  muted: '#666666',
  
  // Border Colors (dark mode)
  border: '#3D3D3D',
  borderLight: '#353535',
  borderLighter: '#2A2A2A',

  // Semantic Colors (dark mode adjusted)
  success: '#4CAF50',
  successLight: '#1B5E20',
  warning: '#FFB300',
  warningLight: '#332A1A',
  error: '#EF5350',
  destructive: '#EF5350',
  errorLight: '#3B1A1A',
  pending: '#42A5F5',
  pendingLight: '#1A2A3B',

  // Interactive States (dark mode)
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',
  overlayExtraLight: 'rgba(255,255,255,0.08)',

  // Gradient anchors
  gradientStart: '#4CAF50',
  gradientEnd: '#2E7D32',
};

/**
 * Shadow System for elevation and depth (works for both themes)
 */
export const shadows = {
  xs: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

// Default export for backward compatibility
export const colors = lightColors;