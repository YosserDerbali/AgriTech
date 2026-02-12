import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { FarmerStackParamList } from './types';
import FarmerTabs from './FarmerTabs';
import DiagnosisDetailScreen from '../screens/farmer/DiagnosisDetailScreen';
import ArticleDetailScreen from '../screens/farmer/ArticleDetailScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<FarmerStackParamList>();

export default function FarmerNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerBackTitleVisible: false,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerLeft: () => (
          <Feather
            name="chevron-left"
            size={24}
            color={colors.text}
            onPress={() => navigation?.goBack()}
          />
        ),
      })}
    >
      <Stack.Screen name="FarmerTabs" component={FarmerTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="DiagnosisDetail"
        component={DiagnosisDetailScreen}
        options={{ title: 'Diagnosis Details' }}
      />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} options={{ title: 'Article' }} />
    </Stack.Navigator>
  );
}
