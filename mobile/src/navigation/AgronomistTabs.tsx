import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { AgronomistTabsParamList } from './types';
import AgronomistDashboardScreen from '../screens/agronomist/AgronomistDashboardScreen';
import PendingQueueScreen from '../screens/agronomist/PendingQueueScreen';
import AgronomistArticlesScreen from '../screens/agronomist/AgronomistArticlesScreen';
import AgronomistProfileScreen from '../screens/agronomist/AgronomistProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<AgronomistTabsParamList>();

export default function AgronomistTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="AgronomistDashboard"
        component={AgronomistDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Feather name="grid" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="PendingQueue"
        component={PendingQueueScreen}
        options={{
          title: 'Queue',
          tabBarIcon: ({ color, size }) => <Feather name="clipboard" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AgronomistArticles"
        component={AgronomistArticlesScreen}
        options={{
          title: 'Articles',
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AgronomistProfile"
        component={AgronomistProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
