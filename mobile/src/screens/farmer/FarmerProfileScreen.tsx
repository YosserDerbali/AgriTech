import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
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

export default function FarmerProfileScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { diagnoses } = useDiagnosisStore();
  const { user, logout } = useAppStore();
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  const totalScans = diagnoses?.length || 0;
  const treatedCount = diagnoses?.filter(d => d.status === 'APPROVED').length || 0;
  const accuracy = totalScans > 0 ? Math.round((treatedCount / totalScans) * 100) : 92;

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const menuItems = [
    { id: 'notifications', label: 'Notifications', icon: 'bell', screen: 'Notifications' as any },
    { id: 'settings', label: 'Settings', icon: 'settings', screen: 'Settings' as any },
    { id: 'privacy', label: 'Privacy & Security', icon: 'shield', screen: 'Privacy' as any },
    { id: 'help', label: 'Help & Support', icon: 'life-buoy', screen: 'Help' as any },
  ];

  const handleMenuPress = (item: any) => {
    try {
      navigation.navigate(item.screen);
    } catch {
      Alert.alert('Coming Soon', `${item.label} will be available soon.`);
    }
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Logged out', 'Logged out successfully.');
    navigation.reset({
      index: 0,
      routes: [{ name: 'FarmerTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <Card style={styles.profileCard}>
          <Text style={styles.name}>{user?.name || 'John Farmer'}</Text>
          <Text style={styles.email}>{user?.email || 'john@farm.com'}</Text>
        </Card>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{totalScans}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{treatedCount}</Text>
            <Text style={styles.statLabel}>Treated</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <Card style={styles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
              onPress={() => handleMenuPress(item)}
            >
              <Feather name={item.icon as any} size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>{item.label}</Text>

              {item.id === 'notifications' && unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}

              <Feather name="chevron-right" size={20} color={colors.border} />
            </TouchableOpacity>
          ))}
        </Card>

        <Button title="Log Out" variant="outline" onPress={handleLogout} />

        <Text style={styles.footer}>AgriScan v1.0.0 · Made with 🌱 for farmers</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
      paddingBottom: 30,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
    },
    profileCard: {
      marginBottom: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
    },
    email: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 10,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginHorizontal: 4,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    card: {
      marginBottom: 12,
    },
    menuItem: {
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    menuItemText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
    badge: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 6,
      paddingVertical: 2,
      minWidth: 20,
      alignItems: 'center',
      marginRight: 8,
    },
    badgeText: {
      color: '#fff',
      fontSize: 10,
      fontWeight: 'bold',
    },
    footer: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 16,
    },
  });