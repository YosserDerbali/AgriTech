import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import FarmerNavigator from './FarmerNavigator';
import AgronomistNavigator from './AgronomistNavigator';
import { useAppStore } from '../stores/appStore';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, currentRole } = useAppStore();

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthStack} />
      ) : currentRole === 'agronomist' ? (
        <RootStack.Screen name="Agronomist" component={AgronomistNavigator} />
      ) : (
        <RootStack.Screen name="Farmer" component={FarmerNavigator} />
      )}
    </RootStack.Navigator>
  );
}
