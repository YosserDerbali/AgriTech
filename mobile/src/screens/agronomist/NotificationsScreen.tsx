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

import { AgronomistStackParamList } from '../../navigation/types';
import { NotificationCard } from '../../components/ui/NotificationCard';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../theme/spacing';

import {
  getAgronomistNotifications,
  deleteNotification as deleteNotificationAPI,
  markNotificationAsRead
} from '../../services/notificationAPI';

import { useNotificationStore } from '../../stores/notificationStore';
import { Notification } from '../../types/notification';



/* TIME FORMATTER */

const getRelativeTime = (date: Date) => {

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

  const { colors, shadows } = useTheme();

  const navigation =
    useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();

  const {
    notifications,
    setNotifications,
    markAsRead,
    removeNotification,
    setIsLoading,
    isLoading
  } = useNotificationStore();

  const [refreshing, setRefreshing] = useState(false);



  /* CALCULATE UNREAD */

  const unreadCount = notifications.filter(n => !n.read).length;



  /* LOAD NOTIFICATIONS */

  const loadNotifications = useCallback(async () => {

    try {

      setIsLoading(true);

      const data = await getAgronomistNotifications();
      console.log('Fetched notifications', data);
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
            <Text style={{ color: colors.primary, fontWeight: '600' }}>
              Mark all
            </Text>
          </TouchableOpacity>
        ) : null

    });

  }, [unreadCount]);



  /* CLICK NOTIFICATION */

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

  const handleLongPress = (notification: Notification) => {

    Alert.alert(
      'Delete Notification',
      'Delete this notification?',
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



  const styles = StyleSheet.create({

    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
    },

    content: {
      padding: spacing.lg,
      paddingBottom: spacing['3xl'],
    },

    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
      gap: spacing.lg,
    },

    backButton: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },

    title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: colors.text,
      flex: 1,
    },

    spacer: {
      width: 40,
    },


    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing['5xl'],
    },

    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textSecondary,
    },

    emptySubtext: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
  });



  return (

    <SafeAreaView style={styles.safeContainer}>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={styles.title}>Notifications</Text>

          <View style={styles.spacer} />

        </View>



        {notifications.length > 0 ? (

          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              timeLabel={getRelativeTime(notification.created_at)}
              onPress={() => handleNotificationPress(notification)}
              onLongPress={() => handleLongPress(notification)}
            />
          ))

        ) : (

          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={56} color={colors.border} />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>
              Your notifications will appear here
            </Text>
          </View>

        )}

      </ScrollView>

    </SafeAreaView>

  );

}