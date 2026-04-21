import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { useTheme } from '../../hooks/useTheme';
import { Card } from '../../components/ui/Card';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { colors, toggleTheme, isDark } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);

  const styles = StyleSheet.create({
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
    editProfileRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    editProfileIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primarySoft,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    editProfileContent: {
      flex: 1,
    },
    editProfileTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    editProfileSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    card: {
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 12,
      letterSpacing: 0.5,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    settingLabel: {
      fontSize: 15,
      color: colors.text,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 4,
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

        {/* Edit Profile Row */}
        <TouchableOpacity
          style={styles.editProfileRow}
          onPress={() => navigation.navigate('EditProfile' as any)}
        >
          <View style={styles.editProfileIcon}>
            <Feather name="user" size={24} color={colors.primary} />
          </View>
          <View style={styles.editProfileContent}>
            <Text style={styles.editProfileTitle}>Edit Profile</Text>
            <Text style={styles.editProfileSubtitle}>Update your personal information</Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.border} />
        </TouchableOpacity>

        {/* Preferences Section */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="bell" size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="mail" size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Email Updates</Text>
            </View>
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </Card>

        {/* Display Section */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>DISPLAY</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="moon" size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </Card>

        {/* Offline Section */}
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>OFFLINE</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Feather name="download-cloud" size={20} color={colors.primary} />
              <Text style={styles.settingLabel}>Offline Mode</Text>
            </View>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
