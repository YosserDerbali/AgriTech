import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { colors, roleColors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();

  const notifications = [
    {
      id: '1',
      title: 'New Diagnosis Submitted',
      description: 'John Farmer submitted a new tomato plant diagnosis',
      timestamp: '2 hours ago',
      icon: 'alert-circle',
      color: '#FF6B6B',
    },
    {
      id: '2',
      title: 'Article Published',
      description: 'Your article "Fungal Disease Management" was published',
      timestamp: '1 day ago',
      icon: 'check-circle',
      color: '#51CF66',
    },
    {
      id: '3',
      title: 'User Feedback',
      description: 'Maria Fields rated your diagnosis 5 stars',
      timestamp: '2 days ago',
      icon: 'star',
      color: '#FFD93D',
    },
    {
      id: '4',
      title: 'Queue Update',
      description: '3 new pending diagnoses are waiting for review',
      timestamp: '3 days ago',
      icon: 'inbox',
      color: '#4299E1',
    },
  ];

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>

        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card key={notification.id} style={styles.notificationCard}>
              <View style={styles.notificationContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${notification.color}20` },
                  ]}
                >
                  <Feather name={notification.icon as any} size={24} color={notification.color} />
                </View>
                <View style={styles.textContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationDescription}>{notification.description}</Text>
                  <Text style={styles.timestamp}>{notification.timestamp}</Text>
                </View>
              </View>
            </Card>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        )}
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
  notificationCard: {
    marginBottom: 12,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12,
  },
});
