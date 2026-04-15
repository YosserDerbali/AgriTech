import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function HelpScreen() {
  const { colors } = useTheme();

  const handleFAQ = () => {
    Alert.alert('FAQ', 'Frequently asked questions will appear here soon.');
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@agriscan.com').catch(() => {
      Alert.alert('Error', 'Could not open email app');
    });
  };

  const handleReportProblem = () => {
    Alert.alert('Report a Problem', 'Please describe your issue and we will get back to you soon.');
  };

  const handleAbout = () => {
    Alert.alert(
      'About AgriScan', 
      'AgriScan v1.0.0\n\nHelping farmers diagnose crop diseases with AI.\n\nMade with 🌱 for farmers'
    );
  };

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help & Support</Text>

      <TouchableOpacity style={styles.item} onPress={handleFAQ}>
        <Text style={styles.text}>FAQ</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.item}
        onPress={handleContactSupport}
      >
        <Text style={styles.text}>Contact Support</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleReportProblem}>
        <Text style={styles.text}>Report a Problem</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleAbout}>
        <Text style={styles.text}>About AgriScan</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    </View>
  );
}