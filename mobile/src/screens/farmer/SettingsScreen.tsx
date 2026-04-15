import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function SettingsScreen() {
  const { colors, toggleTheme, isDark, theme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [renderCount, setRenderCount] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(colors.background);

  // Force re-render when theme changes
  useEffect(() => {
    setBackgroundColor(colors.background);
    setRenderCount(prev => prev + 1);
  }, [theme, isDark, colors.background]);

  const handleDarkModeToggle = async () => {
    console.log('Dark mode toggle pressed. Current isDark:', isDark);
    await toggleTheme();
  };

  const styles = StyleSheet.create({
    container: { 
      flex: 1,
      backgroundColor: backgroundColor 
    },
    scrollView: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    scrollContent: {
      padding: 16,
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

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Settings</Text>

        <View style={styles.item}>
          <Text style={styles.label}>Dark Mode</Text>
          <Switch 
            value={isDark} 
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Notifications</Text>
          <Switch 
            value={notifications} 
            onValueChange={setNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>

        <View style={styles.item}>
          <Text style={styles.label}>Language</Text>
          <Text style={styles.value}>English</Text>
        </View>
      </ScrollView>
    </View>
  );
}