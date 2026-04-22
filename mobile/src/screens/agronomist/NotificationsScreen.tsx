import React from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AgronomistStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../theme/spacing';

export default function NotificationsScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();

  const notifications = [
    {
      id: '1',
      title: 'New Diagnosis Submitted',
      description: 'John Farmer submitted a new tomato plant diagnosis',
      timestamp: '2 hours ago',
      icon: 'alert-circle',
      color: colors.error,
      bgColor: colors.errorLight,
    },
    {
      id: '2',
      title: 'Article Published',
      description: 'Your article "Fungal Disease Management" was published',
      timestamp: '1 day ago',
      icon: 'check-circle',
      color: colors.success,
      bgColor: colors.successLight,
    },
    {
      id: '3',
      title: 'User Feedback',
      description: 'Maria Fields rated your diagnosis 5 stars',
      timestamp: '2 days ago',
      icon: 'star',
      color: colors.warning,
      bgColor: colors.warningLight,
    },
    {
      id: '4',
      title: 'Queue Update',
      description: '3 new pending diagnoses are waiting for review',
      timestamp: '3 days ago',
      icon: 'inbox',
      color: colors.pending,
      bgColor: colors.pendingLight,
    },
  ];

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing['3xl'],
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
      gap: spacing.lg,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: colors.text,
      flex: 1,
    },
    spacer: {
      width: 40,
    },
    notificationCard: {
      marginBottom: spacing.lg,
    },
    notificationContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.lg,
    },
    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: radius.lg,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    textContent: {
      flex: 1,
      justifyContent: 'center',
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: '700',
      lineHeight: 22,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    notificationDescription: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    timestamp: {
      fontSize: 12,
      lineHeight: 16,
      color: colors.textMuted,
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing['5xl'],
    },
    emptyIcon: {
      marginBottom: spacing.lg,
      opacity: 0.5,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 24,
      color: colors.textSecondary,
    },
    emptySubtext: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textMuted,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.6}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          <View style={styles.spacer} />
        </View>

        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { 
                      backgroundColor: notification.bgColor,
                      borderColor: notification.color,
                    },
                  ]}
                >
                  <Feather name={notification.icon as any} size={24} color={notification.color} />
                </View>
                <View style={styles.textContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationDescription}>{notification.description}</Text>
                  <Text style={styles.timestamp}>{notification.timestamp}</Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Feather name="inbox" size={56} color={colors.border} />
            </View>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>Your notifications will appear here</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
