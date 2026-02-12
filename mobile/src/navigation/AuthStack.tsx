import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import FarmerAuthScreen from '../screens/auth/FarmerAuthScreen';
import AgronomistAuthScreen from '../screens/auth/AgronomistAuthScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FarmerAuth" component={FarmerAuthScreen} />
      <Stack.Screen name="AgronomistAuth" component={AgronomistAuthScreen} />
    </Stack.Navigator>
  );
}
