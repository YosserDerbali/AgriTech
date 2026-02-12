import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from './types';
import AgronomistTabs from './AgronomistTabs';
import DiagnosisReviewScreen from '../screens/agronomist/DiagnosisReviewScreen';
import ArticleEditorScreen from '../screens/agronomist/ArticleEditorScreen';

const Stack = createNativeStackNavigator<AgronomistStackParamList>();

export default function AgronomistNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgronomistTabs" component={AgronomistTabs} />
      <Stack.Screen name="DiagnosisReview" component={DiagnosisReviewScreen} />
      <Stack.Screen name="ArticleEditor" component={ArticleEditorScreen} />
    </Stack.Navigator>
  );
}
