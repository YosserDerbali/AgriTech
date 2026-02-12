import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, shadows } from '../../theme/colors';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; isPositive: boolean };
  variant?: 'default' | 'warning' | 'success' | 'accent';
}

export function AgronomistStatCard({ title, value, trend, variant = 'default' }: StatCardProps) {
  const variantStyle = variantStyles[variant];

  return (
    <View style={[styles.card, variantStyle]}> 
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      {trend ? (
        <Text style={[styles.trend, trend.isPositive ? styles.trendUp : styles.trendDown]}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% this week
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    ...shadows.soft,
  },
  title: {
    fontSize: 12,
    color: colors.muted,
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
    color: colors.destructive,
  },
});

const variantStyles = {
  default: {},
  warning: { backgroundColor: '#FFFBEB', borderColor: '#FCD34D' },
  success: { backgroundColor: '#ECFDF5', borderColor: '#86EFAC' },
  accent: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
};
