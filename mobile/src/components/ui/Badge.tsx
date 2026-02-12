import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

type BadgeProps = {
  label: string;
  variant?: 'default' | 'outline' | 'secondary';
  style?: ViewStyle;
};

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const stylesByVariant = variantStyles[variant];
  return (
    <View style={[styles.base, stylesByVariant.container, style]}>
      <Text style={[styles.text, stylesByVariant.text]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

const variantStyles = {
  default: {
    container: { backgroundColor: colors.primarySoft },
    text: { color: colors.primary },
  },
  outline: {
    container: { borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent' },
    text: { color: colors.muted },
  },
  secondary: {
    container: { backgroundColor: '#E2E8F0' },
    text: { color: colors.text },
  },
};
