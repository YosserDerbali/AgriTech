import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAppStore } from '../../stores/appStore';
import { colors } from '../../theme/colors';

const menuItems = ['Notifications', 'Settings', 'Privacy & Security', 'Help & Support'];

export default function FarmerProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { user, logout } = useAppStore();

  const handleMenuClick = (label: string) => {
    Alert.alert(label, 'Ready for backend integration.');
  };

  const handleLogout = () => {
    logout();
    Alert.alert('Logged out', 'Logged out successfully.');
    navigation.navigate('FarmerTabs', { screen: 'FarmerHome' } as never);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <Card style={styles.card}>
        <Text style={styles.name}>{user?.name || 'Farmer User'}</Text>
        <Text style={styles.email}>{user?.email || 'farmer@example.com'}</Text>
        <Button title="Edit" variant="outline" onPress={() => Alert.alert('Edit profile', 'Coming soon.')} />
      </Card>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Treated</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>92%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
      </View>

      <Card style={styles.card}>
        {menuItems.map((item) => (
          <Text key={item} style={styles.menuItem} onPress={() => handleMenuClick(item)}>
            {item}
          </Text>
        ))}
      </Card>

      <Button title="Log Out" variant="outline" onPress={handleLogout} />

      <Text style={styles.footer}>AgriScan v1.0.0 · Made with 🌱 for farmers</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
    color: colors.muted,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
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
    color: colors.muted,
  },
  menuItem: {
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  footer: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
    marginTop: 16,
  },
});
