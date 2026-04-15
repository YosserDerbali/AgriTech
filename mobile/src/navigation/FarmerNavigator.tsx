import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FarmerStackParamList } from './types';
import FarmerTabs from './FarmerTabs';
import DiagnosisDetailScreen from '../screens/farmer/DiagnosisDetailScreen';
import ArticleDetailScreen from '../screens/farmer/ArticleDetailScreen';
import SettingsScreen from '../screens/farmer/SettingsScreen';
import PrivacyScreen from '../screens/farmer/PrivacyScreen';
import HelpAndSupportScreen from '../screens/farmer/HelpAndSupportScreen';

const Stack = createNativeStackNavigator<FarmerStackParamList>();

export default function FarmerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Back',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="FarmerTabs"
        component={FarmerTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DiagnosisDetail"
        component={DiagnosisDetailScreen}
        options={{ title: 'Diagnosis Details' }}
      />
      <Stack.Screen
        name="ArticleDetail"
        component={ArticleDetailScreen}
        options={{ title: 'Article' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: 'Privacy & Security' }}
      />
      <Stack.Screen
        name="Help"
        component={HelpAndSupportScreen}
        options={{ title: 'Help & Support' }}
      />
    </Stack.Navigator>
  );
}