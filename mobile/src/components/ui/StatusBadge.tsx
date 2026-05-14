import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { fontFamilies } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED';

type StatusBadgeProps = {
  status: Status;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { colors, isDark } = useTheme();

  const statusBackgrounds = {
    PENDING: isDark ? 'rgba(66,165,245,0.16)' : colors.pendingLight,
    APPROVED: isDark ? 'rgba(102,187,106,0.18)' : colors.successLight,
    REJECTED: isDark ? 'rgba(239,83,80,0.18)' : colors.errorLight,
  };

  const statusStyles: Record<Status, { container: Record<string, any>; text: { color: string } }> = {
    PENDING: {
      container: { backgroundColor: statusBackgrounds.PENDING },
      text: { color: colors.pending },
    },
    APPROVED: {
      container: { backgroundColor: statusBackgrounds.APPROVED },
      text: { color: colors.success },
    },
    REJECTED: {
      container: { backgroundColor: statusBackgrounds.REJECTED },
      text: { color: colors.error },
    },
  };

  const statusIcons: Record<Status, any> = {
    PENDING: 'time-outline',
    APPROVED: 'checkmark-circle-outline',
    REJECTED: 'close-circle-outline',
  };

  const stylesByStatus = statusStyles[status];
  const iconName = statusIcons[status];
  return (
    <View style={[styles.base, stylesByStatus.container]}>
      <Ionicons name={iconName} size={14} color={stylesByStatus.text.color} style={styles.icon} />
      <Text style={[styles.text, stylesByStatus.text]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: spacing.xs,
  },
  text: {
    fontSize: 11,
    fontFamily: fontFamilies.bold,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

