/**
 * Typography System
 * Consistent text styles across the application
 */
import { TextStyle } from 'react-native';

/**
 * Font families - Using Inter font family for professional appearance
 * Available weights: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
 */
export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

/**
 * Typography scale - Following a 8pt scaling system for consistency
 */
export const typography: Record<string, TextStyle> = {
  // Display sizes - For main headings
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
  },
  displaySmall: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
  },

  // Heading sizes - For section headers
  heading1: {
    fontSize: 25,
    lineHeight: 32,
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
  },
  heading2: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
  },
  heading3: {
    fontSize: 20,
    lineHeight: 26,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },
  heading4: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },
  heading5: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },

  // Body sizes - For content
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
  },
  bodyLargeMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
  },
  bodyLargeSemibold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },

  body: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
  },
  bodySemibold: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },

  // Small body sizes
  small: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
  },
  smallMedium: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
  },
  smallSemibold: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },

  // Extra small - For captions and badges
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
  },
  captionMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
  },
  captionSemibold: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },

  // Extra extra small - For labels
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  // Button text - Consistent for all buttons
  buttonLarge: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },
  buttonMedium: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },
  buttonSmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },

  // Tab text
  tabActive: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },
  tabInactive: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.medium,
    fontWeight: '500',
  },
};

/**
 * Presets for common text combinations
 */
export const textPresets = {
  // Headers with greeting
  greeting: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
  },
  greetingName: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
  },

  // Card titles
  cardTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },
  cardSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
  },

  // Link text
  link: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },

  // Stat number
  statNumber: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.regular,
    fontWeight: '400',
  },

  // Badge text
  badge: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },
};
