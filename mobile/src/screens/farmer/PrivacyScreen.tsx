import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../../theme/colors';

export default function PrivacyScreen() {
  const handlePress = (action: string) => {
    Alert.alert(action, 'This feature will be available in the next update.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy & Security</Text>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('Change Password')}>
        <Text style={styles.text}>Change Password</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('Biometric Login')}>
        <Text style={styles.text}>Enable Biometric Login</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('Data Usage')}>
        <Text style={styles.text}>Data Usage</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('Logout all devices')}>
        <Text style={styles.text}>Logout from all devices</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
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
  text: { 
    fontSize: 16, 
    color: colors.text 
  },
  chevron: { 
    fontSize: 20, 
    color: colors.textMuted 
  },
});