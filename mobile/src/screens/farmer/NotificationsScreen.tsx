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
import { Feather } from '@expo/vector-icons';

import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { colors } from '../../theme/colors';

import {
  getNotifications,
  deleteNotification as deleteNotificationAPI,
  markNotificationAsRead
} from '../../services/notificationAPI';

import { useNotificationStore } from '../../stores/notificationStore';
import { Notification } from '../../types/notification';



/* TIME FORMATTER */

const getRelativeTime = (date: Date): string => {

  const now = new Date();

  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return new Date(date).toLocaleDateString();

};



export default function NotificationsScreen() {

  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();

  const {
    notifications,
    setNotifications,
    markAsRead,
    removeNotification,
    setIsLoading,
    isLoading
  } = useNotificationStore();

  const [refreshing, setRefreshing] = useState(false);



  const unreadCount = notifications.filter(n => !n.read).length;



  /* LOAD NOTIFICATIONS */

  const loadNotifications = useCallback(async () => {

    try {

      setIsLoading(true);
      const data = await getNotifications();
      setNotifications(data);

    } catch (error) {

      console.log('Notification fetch error', error);

    } finally {

      setIsLoading(false);

    }

  }, []);



  /* REFRESH */

  const onRefresh = async () => {

    setRefreshing(true);

    await loadNotifications();

    setRefreshing(false);

  };



  /* LOAD ON SCREEN FOCUS */

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );



  /* MARK ALL AS READ */

  const handleMarkAllRead = () => {

    if (unreadCount === 0) return;

    Alert.alert(
      'Mark All as Read',
      `Mark all ${unreadCount} unread notifications as read?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark All',
          onPress: async () => {

            for (const n of notifications) {

              if (!n.read) {

                await markNotificationAsRead(n.id);

                markAsRead(n.id);

              }

            }

          }
        }
      ]
    );

  };



  /* HEADER BUTTON */

  useEffect(() => {

    navigation.setOptions({

      headerRight: () =>
        unreadCount > 0 ? (
          <TouchableOpacity
            onPress={handleMarkAllRead}
            style={{ marginRight: 16 }}
          >
            <Text style={{
              color: colors.primary,
              fontSize: 14,
              fontWeight: '600'
            }}>
              Mark all
            </Text>
          </TouchableOpacity>
        ) : null

    });

  }, [unreadCount]);



  /* OPEN NOTIFICATION */

  const handleNotificationPress = async (notification: Notification) => {

    if (!notification.read) {

      try {

        await markNotificationAsRead(notification.id);

        markAsRead(notification.id);

      } catch (error) {

        console.log('Mark read error', error);

      }

    }

  };



  /* DELETE */

  const handleDelete = (notification: Notification) => {

    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {

            try {

              await deleteNotificationAPI(notification.id);

              removeNotification(notification.id);

            } catch (error) {

              console.log('Delete error', error);

            }

          }
        }
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

        {notifications.length > 0 ? (

          <>
            {unreadCount > 0 && (
              <View style={styles.unreadBadgeContainer}>
                <Text style={styles.unreadBadgeText}>
                  {unreadCount} unread
                </Text>
              </View>
            )}

            {notifications.map((notification) => (

              <TouchableOpacity
                key={notification.id}
                activeOpacity={0.7}
                onPress={() => handleNotificationPress(notification)}
                onLongPress={() => handleDelete(notification)}
              >

                <Card
                  style={[
                    styles.notificationCard,
                    !notification.read && styles.unreadCard
                  ]}
                >

                  <View style={styles.notificationContent}>

                    <View style={styles.iconContainer}>
                      <Feather name="bell" size={22} color={colors.primary} />
                    </View>

                    <View style={styles.textContent}>

                      <View style={styles.titleRow}>

                        <Text
                          style={[
                            styles.notificationMessage,
                            !notification.read && styles.unreadTitle
                          ]}
                        >
                          {notification.message}
                        </Text>

                        {!notification.read && (
                          <View style={styles.unreadDot} />
                        )}

                      </View>

                      <Text style={styles.timestamp}>
                        {getRelativeTime(notification.created_at)}
                      </Text>

                    </View>

                  </View>

                </Card>

              </TouchableOpacity>

            ))}

          </>

        ) : (

          <View style={styles.emptyContainer}>

            <Feather name="bell-off" size={48} color={colors.border} />

            <Text style={styles.emptyText}>
              No notifications
            </Text>

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
    backgroundColor: '#f9f9f9'
  },

  container: {
    flex: 1
  },

  content: {
    padding: 16,
    paddingBottom: 30
  },

  unreadBadgeContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12
  },

  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500'
  },

  notificationCard: {
    marginBottom: 12
  },

  unreadCard: {
    backgroundColor: '#F0F9FF',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary
  },

  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#EEF4FF'
  },

  textContent: {
    flex: 1
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  notificationMessage: {
    fontSize: 15,
    color: colors.text,
    flex: 1
  },

  unreadTitle: {
    fontWeight: '700'
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8
  },

  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4
  },

  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 12
  },

  emptySubtext: {
    fontSize: 13,
    color: '#bbb',
    marginTop: 4,
    textAlign: 'center'
  }

});