import axiosInstance from './axiosInstance';

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

export interface NotificationsResponse {
  success: boolean;
  data: {
    total: number;
    unreadCount: number;
    notifications: Notification[];
  };
}

export const getNotifications = async (limit = 50, offset = 0) => {
  const response = await axiosInstance.get(`/api/notifications?limit=${limit}&offset=${offset}`);
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get('/api/notifications/unread/count');
  return response.data;
};

export const markAsRead = async (notificationId: string) => {
  const response = await axiosInstance.patch(`/api/notifications/${notificationId}/read`);
  return response.data;
};

export const markAllAsRead = async () => {
  const response = await axiosInstance.post('/api/notifications/mark-all-read');
  return response.data;
};

export const deleteNotification = async (notificationId: string) => {
  const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
  return response.data;
};