import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { spacing, radius } from '../../theme/spacing';

export default function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const [notifications, setNotifications] = React.useState(true);
  const [emailUpdates, setEmailUpdates] = React.useState(true);
  const [offlineMode, setOfflineMode] = React.useState(false);

  const handleDarkModeToggle = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  const settingGroups = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          value: notifications,
          onToggle: setNotifications,
          icon: 'bell',
        },
        {
          id: 'email',
          label: 'Email Updates',
          value: emailUpdates,
          onToggle: setEmailUpdates,
          icon: 'mail',
        },
      ],
    },
    {
      title: 'Display',
      items: [
        {
          id: 'dark',
          label: 'Dark Mode',
          value: theme === 'dark',
          onToggle: handleDarkModeToggle,
          icon: 'moon',
        },
      ],
    },
    {
      title: 'Offline',
      items: [
        {
          id: 'offline',
          label: 'Offline Mode',
          value: offlineMode,
          onToggle: setOfflineMode,
          icon: 'wifi-off',
        },
      ],
    },
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
    settingGroup: {
      marginBottom: spacing['3xl'],
    },
    groupTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    settingItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    editProfileCard: {
      marginBottom: spacing.xl,
    },
    editProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      gap: spacing.lg,
    },
    editProfileContent: {
      flex: 1,
    },
    editProfileTitle: {
      fontSize: 17,
      fontWeight: '700',
      lineHeight: 23,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    editProfileSubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
  });

  const staticStyles = StyleSheet.create({
    settingItemLast: {
      borderBottomWidth: 0,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView
        style={dynamicStyles.container}
        contentContainerStyle={dynamicStyles.content}
      >
        <View style={dynamicStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={dynamicStyles.title}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Edit Profile Button */}
        <Card style={dynamicStyles.editProfileCard}>
          <TouchableOpacity
            style={dynamicStyles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Feather name="edit-3" size={20} color={colors.primary} />
            <View style={dynamicStyles.editProfileContent}>
              <Text style={dynamicStyles.editProfileTitle}>Edit Profile</Text>
              <Text style={dynamicStyles.editProfileSubtitle}>Update your personal information</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.border} />
          </TouchableOpacity>
        </Card>

        {settingGroups.map((group) => (
          <View key={group.title} style={dynamicStyles.settingGroup}>
            <Text style={dynamicStyles.groupTitle}>{group.title}</Text>
            <Card>
              {group.items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    dynamicStyles.settingItem,
                    index < group.items.length - 1 && dynamicStyles.settingItemBorder,
                  ]}
                >
                  <View style={dynamicStyles.settingContent}>
                    <Feather name={item.icon as any} size={20} color={colors.primary} />
                    <Text style={dynamicStyles.settingLabel}>{item.label}</Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: colors.borderLight, true: colors.primary + '40' }}
                    thumbColor={item.value ? colors.primary : colors.border}
                  />
                </View>
              ))}
            </Card>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}