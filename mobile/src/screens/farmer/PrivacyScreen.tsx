import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import { useAppStore } from '../../stores/appStore';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { logout } = useAppStore();

  const handleChangePassword = () => {
    navigation.navigate('ChangePassword');
  };

  const handleBiometricLogin = () => {
    Alert.alert('Coming Soon', 'Biometric login will be available soon.');
  };

  const handleDataUsage = () => {
    Alert.alert('Data Usage', 'Your data usage information will appear here.');
  };

  const handleLogoutAll = () => {
    Alert.alert(
      'Logout from all devices',
      'Are you sure you want to logout from all devices?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            Alert.alert('Logged out', 'You have been logged out from all devices.');
          }
        },
      ]
    );
  };

  const menuItems = [
    { id: 'changePassword', label: 'Change Password', icon: 'lock', onPress: handleChangePassword },
    { id: 'biometric', label: 'Enable Biometric Login', icon: 'fingerprint', onPress: handleBiometricLogin },
    { id: 'dataUsage', label: 'Data Usage', icon: 'database', onPress: handleDataUsage },
    { id: 'logoutAll', label: 'Logout from all devices', icon: 'log-out', onPress: handleLogoutAll, destructive: true },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.menuItemLast,
              item.destructive && styles.destructiveItem
            ]}
            onPress={item.onPress}
          >
            <Feather name={item.icon as any} size={20} color={item.destructive ? '#FF6B6B' : colors.primary} />
            <Text style={[styles.menuItemText, item.destructive && styles.destructiveText]}>
              {item.label}
            </Text>
            <Feather name="chevron-right" size={20} color={colors.border} />
          </TouchableOpacity>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  destructiveItem: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  destructiveText: {
    color: '#FF6B6B',
  },
});
