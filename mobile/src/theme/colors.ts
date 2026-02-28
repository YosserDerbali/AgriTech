/**
 * Premium Color Palette
 * Based on modern design standards with enhanced visual hierarchy
 */

export const colors = {
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

/**
 * Shadow System for elevation and depth
 */
export const shadows = {
  // Subtle shadow for minimal elevation
  xs: {
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  // Small shadow for cards
  sm: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  // Medium shadow for lifted components
  md: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  // Large shadow for prominent elements
  lg: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  // Extra large shadow for modals/overlays
  xl: {
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  // Soft shadow (used in UI patterns)
  soft: {
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
};

/**
 * Light mode theme (system default)
 */
export const lightTheme = {
  colors,
  shadows,
};

