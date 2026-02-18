/**
 * UI Utilities and Helper Functions
 * Common styling patterns and utilities for consistent UI across the app
 */

import { ViewStyle, TextStyle } from 'react-native';
import { colors, shadows } from './colors';
import { spacing, radius } from './spacing';
import { typography } from './typography';

/**
 * Create consistent card container styles
 */
export const createCardStyle = (
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
 * Common container styles for screens
 */
export const screenContainerStyle: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
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
 */
export const createChipStyle = (
  bgColor: string = colors.primarySoft,
  textColor: string = colors.primary
): { container: ViewStyle; text: TextStyle } => {
  return {
    container: {
      backgroundColor: bgColor,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    text: {
      color: textColor,
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
 */
export const inputOutlineStyle: ViewStyle = {
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: radius.lg,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  backgroundColor: colors.surface,
};

/**
 * Create consistent list item styles
 */
export const listItemStyle: ViewStyle = {
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.lg,
  borderBottomWidth: 1,
  borderBottomColor: colors.borderLight,
};

/**
 * Separator/Divider style
 */
export const separatorStyle: ViewStyle = {
  height: 1,
  backgroundColor: colors.borderLight,
  marginVertical: spacing.lg,
};

/**
 * Create consistent modal/bottom sheet backdrop
 */
export const backdropStyle: ViewStyle = {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: colors.overlay,
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
 * Import StyleSheet from react-native for absoluteFillObject
 */
import { StyleSheet } from 'react-native';
