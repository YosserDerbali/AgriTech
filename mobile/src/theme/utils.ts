/**
 * UI Utilities and Helper Functions
 * Common styling patterns and utilities for consistent UI across the app
 */

import { ViewStyle, TextStyle, StyleSheet } from 'react-native';
import { shadows, getColors } from './colors';
import { spacing, radius } from './spacing';
import { typography } from './typography';

/**
 * Create consistent card container styles
 * RUNTIME VERSION: accepts colors as parameter to avoid module-level theme access
 */
export const createCardStyle = (
  colors: ReturnType<typeof getColors>,
  variant: 'default' | 'elevated' | 'filled' = 'default'
): ViewStyle => {
  const baseStyle: ViewStyle = {
    borderRadius: radius['2xl'],
    overflow: 'hidden',
  };

  switch (variant) {
    case 'elevated':
      return { ...baseStyle, backgroundColor: colors.surface, ...shadows.md };
    case 'filled':
      return { ...baseStyle, backgroundColor: colors.surfaceElevated, ...shadows.xs };
    case 'default':
    default:
      return {
        ...baseStyle,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
      };
  }
};

/**
 * Create consistent gradient overlay styles
 */
export const createGradientOverlay = (opacity: number = 0.8): ViewStyle => {
  return {
    backgroundColor: `rgba(0, 0, 0, ${opacity})`,
  };
};

/**
 * Create screen container styles with colors
 * RUNTIME VERSION: accepts colors as parameter
 */
export const createScreenContainerStyle = (colors: ReturnType<typeof getColors>): ViewStyle => {
  return {
    flex: 1,
    backgroundColor: colors.background,
  };
};

/**
 * Fallback for backwards compatibility - returns a basic container
 */
export const screenContainerStyle: ViewStyle = {
  flex: 1,
  backgroundColor: '#F5F5F0', // Fallback to light mode default
};

/**
 * Common padding styles for content
 */
export const contentPaddingStyle: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.lg,
};

/**
 * Create consistent badge/chip styles
 * RUNTIME VERSION: accepts colors externally to avoid module-level access
 */
export const createChipStyle = (
  colors: ReturnType<typeof getColors>,
  bgColor?: string,
  textColor?: string
): { container: ViewStyle; text: TextStyle } => {
  return {
    container: {
      backgroundColor: bgColor ?? colors.primarySoft,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    text: {
      color: textColor ?? colors.primary,
      ...typography.caption,
    },
  };
};

/**
 * Create consistent flex layouts
 */
export const flexCenterStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
};

export const flexBetweenStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

export const flexColumnStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
};

export const flexColumnCenterStyle: ViewStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};

/**
 * Common button base styles
 */
export const buttonBaseStyle: ViewStyle = {
  borderRadius: radius.xl,
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  ...flexCenterStyle,
};

/**
 * Create consistent input field outline styles
 * RUNTIME VERSION: accepts colors as parameter
 */
export const createInputOutlineStyle = (colors: ReturnType<typeof getColors>): ViewStyle => {
  return {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  };
};

/**
 * Fallback for backwards compatibility
 */
export const inputOutlineStyle: ViewStyle = {
  borderWidth: 1,
  borderColor: '#E0E4DE',
  borderRadius: radius.lg,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  backgroundColor: '#FFFFFF',
};

/**
 * Create consistent list item styles
 * RUNTIME VERSION: accepts colors as parameter
 */
export const createListItemStyle = (colors: ReturnType<typeof getColors>): ViewStyle => {
  return {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  };
};

/**
 * Fallback for backwards compatibility
 */
export const listItemStyle: ViewStyle = {
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  borderBottomWidth: 1,
  borderBottomColor: '#EDEFE9',
};

/**
 * Create separator/divider style
 * RUNTIME VERSION: accepts colors as parameter
 */
export const createSeparatorStyle = (colors: ReturnType<typeof getColors>): ViewStyle => {
  return {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.lg,
  };
};

/**
 * Fallback for backwards compatibility
 */
export const separatorStyle: ViewStyle = {
  height: 1,
  backgroundColor: '#EDEFE9',
  marginVertical: spacing.lg,
};

/**
 * Create modal/bottom sheet backdrop style
 * RUNTIME VERSION: accepts colors as parameter
 */
export const createBackdropStyle = (colors: ReturnType<typeof getColors>): ViewStyle => {
  return {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  };
};

/**
 * Common touchable opacity feedback styles
 */
export const pressableScale = {
  activeScale: 0.97,
  inactiveScale: 1,
};

/**
 * Create responsive spacing based on screen size
 */
export const getResponsiveSpacing = (
  small: number,
  medium: number,
  large: number,
  screenWidth: number
): number => {
  if (screenWidth < 480) return small;
  if (screenWidth < 768) return medium;
  return large;
};

/**
 * Merge multiple styles while handling null/undefined
 */
export const mergeStyles = (...styles: (ViewStyle | TextStyle | undefined)[]): ViewStyle | TextStyle => {
  return Object.assign({}, ...styles.filter(Boolean));
};

/**
 * Truncate text style (overline text)
 */
export const truncateTextStyle: TextStyle = {
  ...typography.overline,
};
