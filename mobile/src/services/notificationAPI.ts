import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { getApiBaseUrl } from "./apiConfig";

const API = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  console.log('Attaching token to request:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Clearing token');
      await AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

/* =========================
   NOTIFICATIONS
========================= */


// Get user notifications
export const getNotifications = async () => {
  const response = await API.get("/farmer/notifications");
  return response.data;
};

export const getAgronomistNotifications = async () => {
  const response = await API.get("/agronomist/notifications");
  return response.data;
};
// Delete a notification
export const deleteNotification = async (notificationId: string) => {
  const response = await API.delete(`/farmer/notifications/${notificationId}`);
  return response.data;
};


// Mark notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  const response = await API.put(`/farmer/notifications/${notificationId}/read`);
  return response.data;
};