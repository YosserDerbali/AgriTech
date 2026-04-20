import React from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { Card } from '../../components/ui/Card';
import { Feather } from '@expo/vector-icons';

export default function PrivacyScreen() {
  const navigation = useNavigation();

  const privacyItems = [
    { id: 'password', label: 'Change Password', icon: 'lock', action: 'Change Password' },
    { id: 'biometric', label: 'Enable Biometric Login', icon: 'fingerprint', action: 'Biometric Login' },
    { id: 'data', label: 'Data Usage', icon: 'database', action: 'Data Usage' },
    { id: 'logout', label: 'Logout from all devices', icon: 'log-out', action: 'Logout all devices' },
  ];

  const handlePress = (action: string) => {
    Alert.alert(action, 'This feature will be available in the next update.');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Privacy & Security</Text>
          <View style={{ width: 24 }} />
        </View>

        <Card style={styles.card}>
          {privacyItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.item, index === privacyItems.length - 1 && styles.itemLast]}
              onPress={() => handlePress(item.action)}
            >
              <View style={styles.itemLeft}>
                <Feather name={item.icon as any} size={20} color={colors.primary} />
                <Text style={styles.text}>{item.label}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.border} />
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
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
  card: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    fontSize: 15,
    color: colors.text,
  },
});