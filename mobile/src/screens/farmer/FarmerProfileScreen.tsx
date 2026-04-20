import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useAppStore } from '../../stores/appStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function FarmerProfileScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { diagnoses } = useDiagnosisStore();
  const { user, logout } = useAppStore();

  // Calculate farmer stats
  const totalScans = diagnoses?.length || 0;
  const treatedCount = diagnoses?.filter(d => d.status === 'APPROVED').length || 0;
  const accuracy = totalScans > 0 ? Math.round((treatedCount / totalScans) * 100) : 92;

  const menuItems = [
    { id: 'notifications', label: 'Notifications', icon: 'bell', screen: 'Notifications' as any },
    { id: 'settings', label: 'Settings', icon: 'settings', screen: 'Settings' as any },
    { id: 'privacy', label: 'Privacy & Security', icon: 'shield', screen: 'Privacy' as any },
    { id: 'help', label: 'Help & Support', icon: 'life-buoy', screen: 'Help' as any },
  ];

  const handleMenuPress = (item: any) => {
    try {
      navigation.navigate(item.screen);
    } catch (error) {
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

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    card: {
      marginBottom: 16,
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
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
      gap: 8,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
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
    menuRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 4,
    },
    menuIcon: {
      fontSize: 16,
      marginRight: 12,
    },
    menuLabel: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    menuChevron: {
      fontSize: 20,
      color: colors.textSecondary,
    },
    menuDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    footer: {
      textAlign: 'center',
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 16,
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile</Text>

        {/* Profile Card */}
        <Card style={styles.profileCard}>
          <Text style={styles.name}>{user?.name || 'John Farmer'}</Text>
          <Text style={styles.email}>{user?.email || 'john@farm.com'}</Text>
          <View style={styles.badgesRow}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile' as any)}>
              <Text style={styles.editBadge}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Stats Row */}
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

        {/* Menu Items Card */}
        <Card style={styles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
              onPress={() => handleMenuPress(item)}
            >
              <Feather name={item.icon as any} size={20} color={colors.primary} />
              <Text style={styles.menuItemText}>{item.label}</Text>
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
