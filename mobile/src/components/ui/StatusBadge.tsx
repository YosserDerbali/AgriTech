import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

type Status = 'PENDING' | 'APPROVED' | 'REJECTED';

type StatusBadgeProps = {
  status: Status;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const stylesByStatus = statusStyles[status];
  return (
    <View style={[styles.base, stylesByStatus.container]}>
      <Text style={[styles.text, stylesByStatus.text]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

const statusStyles = {
  PENDING: {
    container: { backgroundColor: '#FEF3C7' },
    text: { color: '#92400E' },
  },
  APPROVED: {
    container: { backgroundColor: '#DCFCE7' },
    text: { color: '#166534' },
  },
  REJECTED: {
    container: { backgroundColor: '#FEE2E2' },
    text: { color: '#991B1B' },
  },
};
