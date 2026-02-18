import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { colors, shadows } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
type CardPadding = 'xs' | 'sm' | 'md' | 'lg';

type CardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  padding?: CardPadding;
  onPress?: () => void;
  disabled?: boolean;
};

export function Card({ children, style, variant = 'default', padding = 'md', onPress, disabled }: CardProps) {
  const variantStyles = cardVariants[variant];
  const paddingStyle = paddingPresets[padding];

  if (onPress) {
    return (
      <View
        style={[
          styles.base,
          variantStyles,
          paddingStyle,
          disabled && styles.disabled,
          style,
        ]}
      >
        <View
          onTouchEnd={onPress}
          accessible
          accessibilityRole="button"
          accessibilityState={{ disabled }}
        >
          {children}
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.base,
        variantStyles,
        paddingStyle,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius['2xl'],
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});

const cardVariants: Record<CardVariant, ViewStyle> = {
  default: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  elevated: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    ...shadows.md,
  },
  outlined: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  filled: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius['2xl'],
    ...shadows.xs,
  },
};

const paddingPresets: Record<CardPadding, ViewStyle> = {
  xs: {
    padding: spacing.sm,
  },
  sm: {
    padding: spacing.md,
  },
  md: {
    padding: spacing.lg,
  },
  lg: {
    padding: spacing.xl,
  },
};
