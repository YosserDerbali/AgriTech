import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { typography, fontFamilies } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';

type BadgeVariant = 'default' | 'outline' | 'secondary' | 'success' | 'warning' | 'error' | 'pending';

type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
};

export function Badge({ label, variant = 'default', style, icon }: BadgeProps) {
  const { colors } = useTheme();

  const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
    default: {
      container: {
        backgroundColor: colors.primarySoft,
      },
      text: { color: colors.primary },
    },
    secondary: {
      container: {
        backgroundColor: colors.accentSoft,
      },
      text: { color: colors.accent },
    },
    outline: {
      container: {
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
      },
      text: { color: colors.text },
    },
    success: {
      container: {
        backgroundColor: colors.successLight,
      },
      text: { color: colors.success },
    },
    warning: {
      container: {
        backgroundColor: colors.warningLight,
      },
      text: { color: colors.warning },
    },
    error: {
      container: {
        backgroundColor: colors.errorLight,
      },
      text: { color: colors.error },
    },
    pending: {
      container: {
        backgroundColor: colors.pendingLight,
      },
      text: { color: colors.pending },
    },
  };

  const stylesByVariant = variantStyles[variant];
  return (
    <View style={[styles.base, stylesByVariant.container, Boolean(icon) ? styles.withIcon : undefined, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text style={[styles.text, stylesByVariant.text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  withIcon: {
    paddingLeft: spacing.sm,
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  text: {
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 16,
  },
});
