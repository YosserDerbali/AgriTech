import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../stores/appStore';
import { useTheme } from '../../hooks/useTheme';
import { useDiagnosisStore } from '../../stores/diagnosisStore';

type MenuItem = {
  label: string;
  screen?: 'Settings' | 'Privacy' | 'Help'; // Explicitly define the screens
  icon: string;
};

const menuItems: MenuItem[] = [
  { label: 'Notifications', screen: undefined, icon: '🔔' },
  { label: 'Settings', screen: 'Settings', icon: '⚙️' },
  { label: 'Privacy & Security', screen: 'Privacy', icon: '🔒' },
  { label: 'Help & Support', screen: 'Help', icon: '❓' },
];

export default function FarmerProfileScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { user, logout } = useAppStore();
  const { diagnoses } = useDiagnosisStore();

  const handleMenuClick = (item: MenuItem) => {
    if (item.screen) {
      try {
        // Navigate based on the screen name
        if (item.screen === 'Settings') {
          navigation.navigate('Settings');
        } else if (item.screen === 'Privacy') {
          navigation.navigate('Privacy');
        } else if (item.screen === 'Help') {
          navigation.navigate('Help');
        }
      } catch (error) {
        console.error('Navigation error:', error);
        Alert.alert('Error', 'Unable to navigate to ' + item.label);
      }
    } else {
      Alert.alert(item.label, 'Ready for backend integration.');
    }
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Logged out', 'Logged out successfully.');
    // Reset navigation to the tabs
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
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        <Card style={styles.card}>
          <Text style={styles.name}>{user?.name || 'Farmer User'}</Text>
          <Text style={styles.email}>{user?.email || 'farmer@example.com'}</Text>
          <Button 
            title="Edit" 
            variant="outline" 
            onPress={() => Alert.alert('Edit profile', 'Coming soon.')} 
          />
        </Card>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{diagnoses?.length || 0}</Text>
            <Text style={styles.statLabel}>Total Scans</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{diagnoses?.filter(d => d.status === 'APPROVED').length || 0}</Text>
            <Text style={styles.statLabel}>Treated</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>92%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        <Card style={styles.card}>
          {menuItems.map((item, index) => (
            <View key={item.label}>
              <TouchableOpacity 
                style={styles.menuRow} 
                onPress={() => handleMenuClick(item)} 
                activeOpacity={0.7}
              >
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </View>
          ))}
        </Card>

        <Button 
          title="Log Out" 
          variant="outline" 
          onPress={handleLogout} 
        />

        <Text style={styles.footer}>AgriScan v1.0.0 · Made with 🌱 for farmers</Text>
      </ScrollView>
    </SafeAreaView>
  );
}