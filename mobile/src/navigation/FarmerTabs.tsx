import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { FarmerTabsParamList } from './types';
import HomeScreen from '../screens/farmer/HomeScreen';
import DiagnoseScreen from '../screens/farmer/DiagnoseScreen';
import HistoryScreen from '../screens/farmer/HistoryScreen';
import FarmerArticlesScreen from '../screens/farmer/FarmerArticlesScreen';
import FarmerProfileScreen from '../screens/farmer/FarmerProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<FarmerTabsParamList>();

export default function FarmerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      }}
    >
      <Tab.Screen
        name="FarmerHome"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Diagnose"
        component={DiagnoseScreen}
        options={{
          title: 'Diagnose',
          tabBarIcon: ({ color, size }) => <Feather name="camera" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Feather name="clock" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="FarmerArticles"
        component={FarmerArticlesScreen}
        options={{
          title: 'Articles',
          tabBarIcon: ({ color, size }) => <Feather name="file-text" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="FarmerProfile"
        component={FarmerProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
