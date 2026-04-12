import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function SettingsScreen() {
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.item}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch 
          value={isDark} 
          onValueChange={setIsDark}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface} // Changed from colors.white to colors.surface
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Notifications</Text>
        <Switch 
          value={notifications} 
          onValueChange={setNotifications}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface} // Changed from colors.white to colors.surface
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Language</Text>
        <Text style={styles.value}>English</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: colors.background 
  },
  title: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 20,
    color: colors.text 
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  label: { 
    fontSize: 16, 
    color: colors.text 
  },
  value: { 
    fontSize: 14, 
    color: colors.textMuted 
  },
});