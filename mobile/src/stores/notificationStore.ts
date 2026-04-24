import { create } from 'zustand';
import { Notification } from '../types/notification';


interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
 
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (notificationId: string) => void;
  markAsRead: (notificationId: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearNotifications: () => void;
}


export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  isLoading: false,
  error: null,


  setNotifications: (notifications) => set({ notifications }),
 
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),


  removeNotification: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== notificationId),
    })),


  markAsRead: (notificationId) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    })),


  setIsLoading: (isLoading) => set({ isLoading }),
 
  setError: (error) => set({ error }),
 
  clearNotifications: () => set({ notifications: [], error: null }),
}));
