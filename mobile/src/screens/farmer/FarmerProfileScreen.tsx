import React, { useEffect, useMemo } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { FarmerStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useAppStore } from '../../stores/appStore';
import { useNotificationStore } from '../../stores/notificationStore';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { spacing, radius } from '../../theme/spacing';



export default function FarmerProfileScreen() {

  const { colors, shadows } = useTheme();
  const dynamicStyles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing['3xl'],
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: colors.text,
      marginBottom: spacing.xl,
    },
    name: {
      fontSize: 22,
      fontWeight: '800',
      lineHeight: 28,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    email: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
    },
    badgeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    badge: {
      backgroundColor: colors.primary,
      color: colors.textInverse,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 16,
    },
    badgeMuted: {
      backgroundColor: colors.borderLight,
      color: colors.text,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
      color: colors.text,
      marginBottom: spacing.md,
      marginTop: spacing.lg,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      marginVertical: spacing.lg,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius['2xl'],
      padding: spacing.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '800',
      lineHeight: 30,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: 12,
      lineHeight: 16,
      color: colors.textSecondary,
      fontWeight: '600',
      textAlign: 'center',
    },
    aboutText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
    },
    menuItem: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      fontSize: 14,
      color: colors.text,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    menuItemText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      lineHeight: 21,
      color: colors.text,
    },
    menuItemIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.primarySoft,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const staticStyles = StyleSheet.create({
    profileCard: {
      marginBottom: spacing.lg,
    },
    card: {
      marginBottom: spacing.lg,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    signOutButton: {
      marginTop: spacing.lg,
    },
  });

  const navigation =
    useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();

  const { diagnoses } = useDiagnosisStore();
  const { user, logout, isAuthenticated } = useAppStore();

  const { notifications } = useNotificationStore();

  /* UNREAD COUNT (DERIVED STATE) */

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const totalScans = diagnoses?.length || 0;

  const treatedCount =
    diagnoses?.filter(d => d.status === 'APPROVED').length || 0;

  const accuracy =
    totalScans > 0 ? Math.round((treatedCount / totalScans) * 100) : 92;

  const menuItems = [
    { id: 'notifications', label: 'Notifications', icon: 'bell', onPress: () => navigation.navigate('Notifications') },
    { id: 'settings', label: 'Settings', icon: 'settings', onPress: () => navigation.navigate('Settings') },
    { id: 'privacy', label: 'Privacy & Security', icon: 'shield', onPress: () => navigation.navigate('Privacy' as any) },
    { id: 'help', label: 'Help & Support', icon: 'life-buoy', onPress: () => navigation.navigate('Help' as any) },
  ];

  const handleLogout = () => {
    logout();
    Alert.alert('Signed out', 'Logged out successfully.');
    navigation.navigate('FarmerTabs', { screen: 'FarmerDashboard' } as never);
  };

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Profile</Text>

        <Card style={staticStyles.profileCard}>
          <Text style={dynamicStyles.name}>
            {user?.name || 'John Farmer'}
          </Text>
          <Text style={dynamicStyles.email}>
            {user?.email || 'john@farm.com'}
          </Text>
          <View style={dynamicStyles.badgeContainer}>
            <Text style={dynamicStyles.badge}>Active Farmer</Text>
            <Text style={dynamicStyles.badgeMuted}>Verified</Text>
          </View>
        </Card>

        <View style={dynamicStyles.statsRow}>
          <View style={dynamicStyles.statBox}>
            <Feather name="activity" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
            <Text style={dynamicStyles.statValue}>{totalScans}</Text>
            <Text style={dynamicStyles.statLabel}>Total Scans</Text>
          </View>

          <View style={dynamicStyles.statBox}>
            <Feather name="check-circle" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
            <Text style={dynamicStyles.statValue}>{treatedCount}</Text>
            <Text style={dynamicStyles.statLabel}>Treated</Text>
          </View>

          <View style={dynamicStyles.statBox}>
            <Feather name="trending-up" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
            <Text style={dynamicStyles.statValue}>{accuracy}%</Text>
            <Text style={dynamicStyles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <Card style={staticStyles.card}>
          <Text style={dynamicStyles.sectionTitle}>About</Text>
          <Text style={dynamicStyles.aboutText}>
            Dedicated to providing the best care for your crops. Using AgriScan to monitor plant health
            and prevent diseases before they spread.
          </Text>
        </Card>

        <Card style={staticStyles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[dynamicStyles.menuItem, index === menuItems.length - 1 && staticStyles.menuItemLast]}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <View style={dynamicStyles.menuItemIcon}>
                <Feather name={item.icon as any} size={18} color={colors.primary} />
              </View>
              <Text style={dynamicStyles.menuItemText}>{item.label}</Text>
              {item.id === 'notifications' && unreadCount > 0 && (
                <View style={dynamicStyles.badge}>
                  <Text style={{ color: colors.textInverse, fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
              <Feather name="chevron-right" size={20} color={colors.borderLight} />
            </TouchableOpacity>
          ))}
        </Card>

        <View style={staticStyles.signOutButton}>
          <Button title="Log Out" variant="outline" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}