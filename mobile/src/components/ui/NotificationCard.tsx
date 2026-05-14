import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Card } from './Card';
import { Notification } from '../../types/notification';
import { spacing, radius } from '../../theme/spacing';

type NotificationCardProps = {
  notification: Notification;
  timeLabel: string;
  onPress: () => void;
  onLongPress?: () => void;
};

export function NotificationCard({ notification, timeLabel, onPress, onLongPress }: NotificationCardProps) {
  const { colors } = useTheme();
  const unread = !notification.read;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.touchable}
    >
      <View style={[styles.outer, { backgroundColor: colors.surface }]}> 
        <View style={[styles.accentStripe, { backgroundColor: unread ? colors.primary : colors.border }]} />
        <Card style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.contentRow}>
            <View style={[styles.iconContainer, { backgroundColor: unread ? colors.primaryExtraLight : colors.surfaceAlt }]}> 
              <Feather name="bell" size={20} color={unread ? colors.primary : colors.textSecondary} />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.message, { color: colors.text }]} numberOfLines={2}>
                {notification.message}
              </Text>
              <View style={styles.metaRow}>
                <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{timeLabel}</Text>
                {unread && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
              </View>
            </View>
          </View>
        </Card>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: spacing.lg,
  },
  outer: {
    flexDirection: 'row',
    borderRadius: radius['2xl'],
    overflow: 'hidden',
  },
  accentStripe: {
    width: 4,
  },
  card: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 0,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
});