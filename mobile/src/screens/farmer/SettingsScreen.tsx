import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../theme/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { useSettingsStore } from '../../stores/settingsStore';

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { colors, mode, setTheme } = useTheme();
  
  const {
    pushNotifications,
    emailUpdates,
    offlineMode,
    isLoading,
    loadSettings,
    setPushNotifications,
    setEmailUpdates,
    setOfflineMode,
  } = useSettingsStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const handleDarkModeToggle = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const settingGroups = [
    {
      title: 'PREFERENCES',
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          value: pushNotifications,
          onToggle: setPushNotifications,
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
      title: 'DISPLAY',
      items: [
        {
          id: 'dark',
          label: 'Dark Mode',
          value: mode === 'dark',
          onToggle: handleDarkModeToggle,
          icon: 'moon',
        },
      ],
    },
    {
      title: 'OFFLINE',
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

  return (
    <SafeAreaView style={[styles.safeContainer, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card style={[styles.editProfileCard, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Feather name="edit-3" size={20} color={colors.primary} />
            <View style={styles.editProfileContent}>
              <Text style={[styles.editProfileTitle, { color: colors.text }]}>Edit Profile</Text>
              <Text style={[styles.editProfileSubtitle, { color: colors.textSecondary }]}>Update your personal information</Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.border} />
          </TouchableOpacity>
        </Card>

        {settingGroups.map((group) => (
          <View key={group.title} style={styles.settingGroup}>
            <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>{group.title}</Text>
            <Card style={{ backgroundColor: colors.surface }}>
              {group.items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.settingItem,
                    index < group.items.length - 1 && [styles.settingItemBorder, { borderBottomColor: colors.border }],
                  ]}
                >
                  <View style={styles.settingContent}>
                    <Feather name={item.icon as any} size={20} color={colors.primary} />
                    <Text style={[styles.settingLabel, { color: colors.text }]}>{item.label}</Text>
                  </View>
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#ccc', true: colors.primary + '40' }}
                    thumbColor={item.value ? colors.primary : '#999'}
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

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  editProfileSubtitle: {
    fontSize: 12,
  },
});