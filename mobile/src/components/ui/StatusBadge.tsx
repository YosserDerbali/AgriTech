import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { radius, spacing } from '../../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED';

type StatusBadgeProps = {
  status: Status;
};

export function StatusBadge({ status }: StatusBadgeProps) {
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

const statusStyles: Record<Status, { container: Record<string, any>; text: { color: string } }> = {
  PENDING: {
    container: { backgroundColor: colors.pendingLight },
    text: { color: colors.pending },
  },
  APPROVED: {
    container: { backgroundColor: colors.successLight },
    text: { color: colors.success },
  },
  REJECTED: {
    container: { backgroundColor: colors.errorLight },
    text: { color: colors.error },
  },
};

const statusIcons: Record<Status, any> = {
  PENDING: 'time-outline',
  APPROVED: 'checkmark-circle-outline',
  REJECTED: 'close-circle-outline',
};
