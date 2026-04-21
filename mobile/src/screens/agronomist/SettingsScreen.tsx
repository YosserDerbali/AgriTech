import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { colors, shadows, isDark, toggleTheme, theme } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(colors.background);

  // Update background color when theme changes
  useEffect(() => {
    setBackgroundColor(colors.background);
  }, [theme, colors.background]);

  // Use isDark state from theme hook instead of local state
  const handleDarkModeToggle = () => {
    toggleTheme();
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
          value: isDark,
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

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    content: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    settingGroup: {
      marginBottom: 24,
    },
    groupTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 12,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    settingItem: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
    },
    settingItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    settingLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    editProfileCard: {
      marginBottom: 20,
    },
    editProfileButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      gap: 12,
    },
    editProfileContent: {
      flex: 1,
    },
    editProfileTitle: {
      fontSize: 17,
      fontWeight: '700',
      lineHeight: 23,
      color: colors.text,
      marginBottom: 4,
    },
    editProfileSubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Edit Profile Button */}
        <Card style={styles.editProfileCard}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Feather name="edit-3" size={20} color={colors.primary} />
            <View style={styles.editProfileContent}>
              <Text style={styles.editProfileTitle}>Edit Profile</Text>
              <Text style={styles.editProfileSubtitle}>Update your personal information</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.border} />
          </TouchableOpacity>
        </Card>

        {settingGroups.map((group) => (
          <View key={group.title} style={styles.settingGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <Card>
              {group.items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.settingItem,
                    index < group.items.length - 1 && styles.settingItemBorder,
                  ]}
                >
                  <View style={styles.settingContent}>
                    <Feather name={item.icon as any} size={20} color={colors.primary} />
                    <Text style={styles.settingLabel}>{item.label}</Text>
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
