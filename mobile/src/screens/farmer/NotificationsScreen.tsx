import React, { useState, useCallback, useEffect } from 'react';
import { 
  ScrollView, 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  RefreshControl,
  Alert 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import { useNotificationStore } from '../../stores/notificationStore';

// Helper to get icon based on notification type
const getIconForType = (type: string): { name: string; color: string } => {
  switch (type) {
    case 'DIAGNOSIS_APPROVED':
      return { name: 'check-circle', color: '#51CF66' };
    case 'DIAGNOSIS_REJECTED':
      return { name: 'x-circle', color: '#FF6B6B' };
    case 'DIAGNOSIS_SUBMITTED':
      return { name: 'upload-cloud', color: '#4299E1' };
    case 'ARTICLE_PUBLISHED':
      return { name: 'book-open', color: '#FFD93D' };
    case 'FEEDBACK_RECEIVED':
      return { name: 'star', color: '#FFB347' };
    case 'QUEUE_UPDATE':
      return { name: 'inbox', color: '#9C88FF' };
    default:
      return { name: 'bell', color: colors.primary };
  }
};

// Format relative time
const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export default function NotificationsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotificationStore();
  
  const [refreshing, setRefreshing] = useState(false);

  // Set up the header right button
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => 
        unreadCount > 0 ? (
          <TouchableOpacity onPress={handleMarkAllRead} style={{ marginRight: 16 }}>
            <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '500' }}>Mark all</Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, unreadCount]);

  const loadNotifications = async () => {
    await fetchNotifications();
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (notification.type === 'DIAGNOSIS_APPROVED' && notification.metadata.diagnosisId) {
      navigation.navigate('DiagnosisDetail', { id: notification.metadata.diagnosisId });
    } else if (notification.type === 'ARTICLE_PUBLISHED' && notification.metadata.articleId) {
      navigation.navigate('ArticleDetail', { id: notification.metadata.articleId });
    }
  };

  const handleLongPress = (notification: any) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteNotification(notification.id)
        },
      ]
    );
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    Alert.alert(
      'Mark All as Read',
      `Mark all ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''} as read?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark All', onPress: () => markAllAsRead() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {isLoading && notifications.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Feather name="loader" size={32} color={colors.primary} />
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length > 0 ? (
          <>
            {unreadCount > 0 && (
              <View style={styles.unreadBadgeContainer}>
                <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
              </View>
            )}
            {notifications.map((notification) => {
              const { name: iconName, color: iconColor } = getIconForType(notification.type);
              return (
                <TouchableOpacity
                  key={notification.id}
                  onPress={() => handleNotificationPress(notification)}
                  onLongPress={() => handleLongPress(notification)}
                  activeOpacity={0.7}
                  delayLongPress={500}
                >
                  <Card 
                    style={[
                      styles.notificationCard,
                      !notification.isRead && styles.unreadCard,
                    ]}
                  >
                    <View style={styles.notificationContent}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: `${iconColor}20` },
                        ]}
                      >
                        <Feather name={iconName as any} size={24} color={iconColor} />
                      </View>
                      <View style={styles.textContent}>
                        <View style={styles.titleRow}>
                          <Text style={[
                            styles.notificationTitle,
                            !notification.isRead && styles.unreadTitle,
                          ]}>
                            {notification.title}
                          </Text>
                          {!notification.isRead && <View style={styles.unreadDot} />}
                        </View>
                        <Text style={styles.notificationDescription}>
                          {notification.message}
                        </Text>
                        <Text style={styles.timestamp}>
                          {getRelativeTime(notification.created_at)}
                        </Text>
                      </View>
                      <TouchableOpacity 
                        onPress={() => deleteNotification(notification.id)}
                        style={styles.deleteButton}
                      >
                        <Feather name="x" size={16} color="#999" />
                      </TouchableOpacity>
                    </View>
                  </Card>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="bell-off" size={48} color={colors.border} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              When you receive notifications, they'll appear here
            </Text>
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
    paddingBottom: 30,
  },
  unreadBadgeContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  notificationCard: {
    marginBottom: 12,
  },
  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
    color: colors.text,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
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
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  loadingText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
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
  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 4,
    textAlign: 'center',
  },
});