import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../theme/spacing';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  variant?: 'default' | 'warning' | 'success' | 'accent' | 'pending';
  icon?: 'check' | 'clock' | 'trending-up' | 'globe' | 'award' | 'activity';
}

const iconMap = {
  check: 'check-circle',
  clock: 'clock',
  'trending-up': 'trending-up',
  globe: 'globe',
  award: 'award',
  activity: 'activity',
};

export function AgronomistStatCard({ title, value, trend, variant = 'default', icon }: StatCardProps) {
  const { colors, shadows } = useTheme();

  const variantStyles = {
    default: { 
      backgroundColor: colors.surface, 
      borderColor: colors.border,
      iconColor: colors.primary,
    },
    warning: { 
      backgroundColor: colors.surface, 
      borderColor: colors.warning,
      iconColor: colors.warning,
    },
    success: { 
      backgroundColor: colors.surface, 
      borderColor: colors.success,
      iconColor: colors.success,
    },
    accent: { 
      backgroundColor: colors.surface, 
      borderColor: colors.accent,
      iconColor: colors.accent,
    },
    pending: {
      backgroundColor: colors.surface,
      borderColor: colors.pending,
      iconColor: colors.pending,
    },
  };

  const variant_config = variantStyles[variant];

  const dynamicStyles = StyleSheet.create({
    card: {
      flex: 1,
      padding: spacing.lg,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: variant_config.borderColor,
      backgroundColor: variant_config.backgroundColor,
      ...shadows.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.md,
      justifyContent: 'space-between',
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 11,
      lineHeight: 14,
      letterSpacing: 0.5,
      color: colors.textTertiary,
      fontWeight: '600',
      textTransform: 'uppercase',
    },
    value: {
      fontSize: 32,
      fontWeight: '600',
      lineHeight: 40,
      color: colors.text,
      marginBottom: spacing.xs,
      letterSpacing: -0.5,
    },
    trend: {
      marginTop: spacing.sm,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    trendUp: {
      color: colors.success,
    },
    trendDown: {
      color: colors.error,
    },
    iconWrapper: {
      width: 36,
      height: 36,
      borderRadius: radius.lg,
      backgroundColor: `${variant_config.iconColor}10`,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={dynamicStyles.card}>
      <View style={dynamicStyles.header}>
        <View style={dynamicStyles.titleContainer}>
          <Text style={dynamicStyles.title}>{title}</Text>
        </View>
        {icon && (
          <View style={dynamicStyles.iconWrapper}>
            <Feather 
              name={iconMap[icon] as any} 
              size={18} 
              color={variant_config.iconColor}
            />
          </View>
        )}
      </View>
      <Text style={dynamicStyles.value}>{value}</Text>
      {trend ? (
        <Text style={[dynamicStyles.trend, trend.isPositive ? dynamicStyles.trendUp : dynamicStyles.trendDown]}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% this week
        </Text>
      ) : null}
    </View>
  );
}


