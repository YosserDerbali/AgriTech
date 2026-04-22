/**
 * Premium Color Palettes - Role & Theme Based
 * Supports: Farmer (Green) & Agronomist (Orange) × Light & Dark modes
 */

// ============================================================================
// FARMER - LIGHT MODE (Green Primary)
// ============================================================================
export const farmerLightColors = {
  // Primary Brand Colors - Green
  primary: '#1B5E20',
  primaryLight: '#2E7D32',
  primaryDark: '#0D3B12',
  primarySoft: '#E8F5E9',
  primaryExtraLight: '#F1F8F4',

  // Accent Colors - Gold/Amber
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

// ============================================================================
// FARMER - DARK MODE (Green Primary)
// ============================================================================
export const farmerDarkColors = {
  // Primary Brand Colors - Green (lighter for contrast)
  primary: '#66BB6A',
  primaryLight: '#81C784',
  primaryDark: '#2E7D32',
  primarySoft: '#1B5E20',
  primaryExtraLight: '#0D3B12',

  // Accent Colors - Gold/Amber
  accent: '#FFB74D',
  accentLight: '#FFCA28',
  accentDark: '#FFA000',
  accentSoft: '#F57F17',

  // Neutral Colors - Dark grays
  background: '#000000',
  surfaceBackground: '#1A1F26',
  surface: '#212529',
  card: '#212529',
  surfaceElevated: '#2A3035',
  surfaceAlt: '#1E2329',

  // Text Colors - Semantic
  text: '#F5F5F5',
  textSecondary: '#BDBDBD',
  textTertiary: '#9E9E9E',
  textMuted: '#8E8E8E',
  textLight: '#757575',
  textInverse: '#0F1419',
  muted: '#9E9E9E',

  // Border Colors
  border: '#37474F',
  borderLight: '#455A64',
  borderLighter: '#546E7A',

  // Semantic Colors
  success: '#66BB6A',
  successLight: '#2E7D32',
  warning: '#FFB74D',
  warningLight: '#F57F17',
  error: '#EF5350',
  errorLight: '#C62828',
  pending: '#42A5F5',
  pendingLight: '#1565C0',

  // Interactive States
  overlay: 'rgba(0,0,0,0.8)',
  overlayLight: 'rgba(0,0,0,0.5)',
  overlayExtraLight: 'rgba(255,255,255,0.1)',

  // Gradient anchors
  gradientStart: '#66BB6A',
  gradientEnd: '#81C784',
};

// ============================================================================
// AGRONOMIST - LIGHT MODE (Orange Primary - Modern & Sophisticated)
// ============================================================================
export const agronomistLightColors = {
  // Primary Brand Colors - Refined Orange Palette
  primary: '#D97706',          // Deep, rich orange
  primaryLight: '#F59E0B',     // Medium warm orange
  primaryDark: '#B45309',      // Dark chocolate-orange
  primarySoft: '#FEF3C7',      // Soft warm cream
  primaryExtraLight: '#FEF9E7', // Extra light cream

  // Accent Colors - Sophisticated Orange Tones
  accent: '#EA580C',           // Vibrant accent orange
  accentLight: '#FB923C',      // Light accent
  accentDark: '#7C2D12',       // Deep accent
  accentSoft: '#FED7AA',       // Soft accent background

  // Neutral Colors - Warm Professional
  background: '#FAFAF8',       // Clean warm white
  surfaceBackground: '#F9F7F4', // Subtle warm tone
  surface: '#FFFFFF',          // Pure white
  card: '#FFFFFF',
  surfaceElevated: '#FFFBF5',  // Elevated warm surface
  surfaceAlt: '#F7F5F2',       // Alternate surface

  // Text Colors - Warm Neutral Hierarchy
  text: '#09090B',             // Deep charcoal
  textSecondary: '#44403C',    // Warm medium gray
  textTertiary: '#78716C',     // Warm light gray
  textMuted: '#A8A29E',        // Muted warm gray
  textLight: '#D6D3D1',        // Light warm gray
  textInverse: '#FFFFFF',      // White on dark
  muted: '#92908B',            // Muted neutral

  // Border Colors - Sophisticated
  border: '#E7E5E4',           // Warm border
  borderLight: '#F5F3F0',      // Light warm border
  borderLighter: '#FAF9F7',    // Extra light border

  // Semantic Colors
  success: '#D97706',          // Use primary for consistency
  successLight: '#FEF3C7',
  warning: '#EA580C',          // Vibrant warning
  warningLight: '#FED7AA',
  error: '#B42318',            // Deep red
  errorLight: '#FECACA',
  pending: '#0284C7',          // Blue pending
  pendingLight: '#E0F2FE',

  // Interactive States
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.15)',
  overlayExtraLight: 'rgba(0,0,0,0.06)',

  // Gradient anchors
  gradientStart: '#D97706',
  gradientEnd: '#EA580C',
};

// ============================================================================
// AGRONOMIST - DARK MODE (Orange Primary - Modern & Sophisticated)
// ============================================================================
export const agronomistDarkColors = {
  // Primary Brand Colors - Refined for Dark Mode
  primary: '#F59E0B',          // Warm orange for dark mode
  primaryLight: '#FCD34D',     // Light warm tone
  primaryDark: '#D97706',      // Deep orange reference
  primarySoft: '#78350F',      // Deep brown-orange
  primaryExtraLight: '#92400E', // Dark orange tone

  // Accent Colors - Sophisticated Orange
  accent: '#FB923C',           // Light accent for contrast
  accentLight: '#FED7AA',      // Extra light accent
  accentDark: '#EA580C',       // Dark accent
  accentSoft: '#7C2D12',       // Soft deep accent

  // Neutral Colors - Modern Dark
  background: '#101010',       // True black
  surfaceBackground: '#1F1F1F', // Dark surface
  surface: '#2D2D2D',          // Dark card
  card: '#2D2D2D',
  surfaceElevated: '#3A3A3A',  // Elevated dark
  surfaceAlt: '#242424',       // Alternate dark

  // Text Colors - Warm Neutral for Dark
  text: '#EEEBE6',             // Warm light text
  textSecondary: '#D1CCC7',    // Warm secondary
  textTertiary: '#A8A29E',     // Warm tertiary
  textMuted: '#78716C',        // Muted warm
  textLight: '#57534E',        // Light warm
  textInverse: '#09090B',      // Dark on light
  muted: '#9CA3AF',            // Neutral muted

  // Border Colors - Dark Mode
  border: '#404040',           // Medium dark border
  borderLight: '#525252',      // Light dark border
  borderLighter: '#717171',    // Lighter dark border

  // Semantic Colors
  success: '#F59E0B',          // Primary warm orange
  successLight: '#78350F',
  warning: '#FB923C',          // Light accent
  warningLight: '#7C2D12',
  error: '#EF4444',            // Bright red
  errorLight: '#7C2D2D',
  pending: '#60A5FA',          // Bright blue
  pendingLight: '#1E40AF',

  // Interactive States
  overlay: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(0,0,0,0.4)',
  overlayExtraLight: 'rgba(255,255,255,0.08)',

  // Gradient anchors
  gradientStart: '#F59E0B',
  gradientEnd: '#FB923C',
};

// ============================================================================
// HELPER FUNCTION - Get palette by role and theme
// ============================================================================
export type UserRole = 'farmer' | 'agronomist';
export type ThemeMode = 'light' | 'dark';

export const getColors = (role: UserRole, theme: ThemeMode) => {
  if (role === 'farmer' && theme === 'light') return farmerLightColors;
  if (role === 'farmer' && theme === 'dark') return farmerDarkColors;
  if (role === 'agronomist' && theme === 'light') return agronomistLightColors;
  if (role === 'agronomist' && theme === 'dark') return agronomistDarkColors;
  return farmerLightColors; // Default fallback
};

// ============================================================================
// BACKWARDS COMPATIBILITY - Default to Farmer Light
// ============================================================================
export const colors = farmerLightColors;

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

// ============================================================================
// THEME CREATION - Combines colors + shadows
// ============================================================================
export const getTheme = (role: UserRole, theme: ThemeMode) => ({
  colors: getColors(role, theme),
  shadows,
  isDark: theme === 'dark',
});

// ============================================================================
// BACKWARDS COMPATIBILITY - Default theme
// ============================================================================
export const lightTheme = {
  colors: farmerLightColors,
  shadows,
};

