import { create } from 'zustand';
import * as notificationAPI from '../services/notificationAPI';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  metadata: Record<string, any>;
  isRead: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  isLoading: boolean;
  error: string | null;
  
  fetchNotifications: (limit?: number, offset?: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  total: 0,
  isLoading: false,
  error: null,
  
  fetchNotifications: async (limit = 50, offset = 0) => {
    set({ isLoading: true, error: null });
    try {
      const response = await notificationAPI.getNotifications(limit, offset);
      set({
        notifications: response.data.notifications,
        total: response.data.total,
        unreadCount: response.data.unreadCount,
        isLoading: false,
      });
    } catch (error: any) {
      console.error('Fetch notifications error:', error);
      set({ error: error.message || 'Failed to fetch notifications', isLoading: false });
    }
  },
  
  fetchUnreadCount: async () => {
    try {
      const count = await notificationAPI.getUnreadCount();
      set({ unreadCount: count });
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error);
    }
  },
  
  markAsRead: async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      console.error('Mark as read error:', error);
      set({ error: error.message });
    }
  },
  
  markAllAsRead: async () => {
    try {
      await notificationAPI.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      console.error('Mark all as read error:', error);
      set({ error: error.message });
    }
  },
  
  deleteNotification: async (notificationId: string) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== notificationId),
        total: state.total - 1,
      }));
    } catch (error: any) {
      console.error('Delete notification error:', error);
      set({ error: error.message });
    }
  },
  
  clearError: () => set({ error: null }),
}));