import React from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { spacing, radius } from '../../theme/spacing';
import { useAppStore } from '../../stores/appStore';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
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
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: colors.text,
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
    destructiveMenuItemIcon: {
      backgroundColor: '#FF6B6B20',
    },
    destructiveText: {
      color: '#FF6B6B',
    },
    destructiveBadge: {
      marginTop: spacing.md,
      borderTopWidth: 1.5,
      borderTopColor: '#FF6B6B40',
    },
  });

  const staticStyles = StyleSheet.create({
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    card: {
      marginBottom: spacing.lg,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
        <View style={dynamicStyles.header}>
          <TouchableOpacity style={staticStyles.headerButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={dynamicStyles.title}>Privacy & Security</Text>
          <View style={{ width: 40 }} />
        </View>

        <Card style={staticStyles.card}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                dynamicStyles.menuItem,
                index === menuItems.length - 1 && staticStyles.menuItemLast,
                item.destructive && dynamicStyles.destructiveBadge
              ]}
              onPress={item.onPress}
              activeOpacity={0.6}
            >
              <View style={[dynamicStyles.menuItemIcon, item.destructive && dynamicStyles.destructiveMenuItemIcon]}>
                <Feather
                  name={item.icon as any}
                  size={18}
                  color={item.destructive ? '#FF6B6B' : colors.primary}
                />
              </View>
              <Text style={[dynamicStyles.menuItemText, item.destructive && dynamicStyles.destructiveText]}>
                {item.label}
              </Text>
              <Feather
                name="chevron-right"
                size={20}
                color={item.destructive ? '#FF6B6B' : colors.borderLight}
              />
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
