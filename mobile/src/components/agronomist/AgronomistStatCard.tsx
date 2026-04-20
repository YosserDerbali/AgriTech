import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  variant?: 'default' | 'warning' | 'success' | 'accent';
}

export function AgronomistStatCard({ title, value, trend, variant = 'default' }: StatCardProps) {
  const { colors, shadows } = useTheme();

  const variantStyles = {
    default: {},
    warning: { backgroundColor: '#FFFBEB', borderColor: '#FCD34D' },
    success: { backgroundColor: '#ECFDF5', borderColor: '#86EFAC' },
    accent: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  };

  const dynamicStyles = StyleSheet.create({
    card: {
      flex: 1,
      padding: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      ...shadows.soft,
    },
    title: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    value: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    trend: {
      marginTop: 6,
      fontSize: 11,
    },
    trendUp: {
      color: colors.success,
    },
    trendDown: {
      color: colors.error,
    },
  });

  const variantStyle = variantStyles[variant];

  return (
    <View style={[dynamicStyles.card, variantStyle]}>
      <Text style={dynamicStyles.title}>{title}</Text>
      <Text style={dynamicStyles.value}>{value}</Text>
      {trend ? (
        <Text style={[dynamicStyles.trend, trend.isPositive ? dynamicStyles.trendUp : dynamicStyles.trendDown]}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% this week
        </Text>
      ) : null}
    </View>
  );
}


