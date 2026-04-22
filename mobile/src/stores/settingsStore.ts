import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  pushNotifications: boolean;
  emailUpdates: boolean;
  darkMode: boolean;
  offlineMode: boolean;
  isLoading: boolean;
  
  loadSettings: () => Promise<void>;
  setPushNotifications: (value: boolean) => Promise<void>;
  setEmailUpdates: (value: boolean) => Promise<void>;
  setDarkMode: (value: boolean) => Promise<void>;
  setOfflineMode: (value: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  pushNotifications: false,
  emailUpdates: true,
  darkMode: false,
  offlineMode: true,
  isLoading: true,

  loadSettings: async () => {
    try {
      const pushNotifications = await AsyncStorage.getItem('pushNotifications');
      const emailUpdates = await AsyncStorage.getItem('emailUpdates');
      const darkMode = await AsyncStorage.getItem('darkMode');
      const offlineMode = await AsyncStorage.getItem('offlineMode');
      
      set({
        pushNotifications: pushNotifications === 'true',
        emailUpdates: emailUpdates !== 'false',
        darkMode: darkMode === 'true',
        offlineMode: offlineMode !== 'false',
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ isLoading: false });
    }
  },

  setPushNotifications: async (value: boolean) => {
    try {
      await AsyncStorage.setItem('pushNotifications', String(value));
      set({ pushNotifications: value });
      
      // Here you would also update the backend or register for push notifications
      if (value) {
        console.log('Register for push notifications');
        // TODO: Register for push notifications with Firebase
      } else {
        console.log('Unregister from push notifications');
      }
    } catch (error) {
      console.error('Error saving push notifications setting:', error);
    }
  },

  setEmailUpdates: async (value: boolean) => {
    try {
      await AsyncStorage.setItem('emailUpdates', String(value));
      set({ emailUpdates: value });
      
      // Here you would update the backend preference
      console.log('Email updates:', value);
    } catch (error) {
      console.error('Error saving email updates setting:', error);
    }
  },

  setDarkMode: async (value: boolean) => {
    try {
      await AsyncStorage.setItem('darkMode', String(value));
      set({ darkMode: value });
      
      // Apply dark mode to the app
      // This would require a theme provider to update all colors
      console.log('Dark mode:', value);
    } catch (error) {
      console.error('Error saving dark mode setting:', error);
    }
  },

  setOfflineMode: async (value: boolean) => {
    try {
      await AsyncStorage.setItem('offlineMode', String(value));
      set({ offlineMode: value });
      
      // Here you would configure offline storage
      console.log('Offline mode:', value);
    } catch (error) {
      console.error('Error saving offline mode setting:', error);
    }
  },
}));