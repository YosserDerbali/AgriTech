import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FarmerStackParamList } from './types';
import FarmerTabs from './FarmerTabs';
import DiagnosisDetailScreen from '../screens/farmer/DiagnosisDetailScreen';
import ArticleDetailScreen from '../screens/farmer/ArticleDetailScreen';

const Stack = createNativeStackNavigator<FarmerStackParamList>();

export default function FarmerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FarmerTabs" component={FarmerTabs} />
      <Stack.Screen name="DiagnosisDetail" component={DiagnosisDetailScreen} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
    </Stack.Navigator>
  );
}
