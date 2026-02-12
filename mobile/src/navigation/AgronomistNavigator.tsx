import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AgronomistStackParamList } from './types';
import AgronomistTabs from './AgronomistTabs';
import DiagnosisReviewScreen from '../screens/agronomist/DiagnosisReviewScreen';
import ArticleEditorScreen from '../screens/agronomist/ArticleEditorScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<AgronomistStackParamList>();

export default function AgronomistNavigator() {
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
      <Stack.Screen name="AgronomistTabs" component={AgronomistTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="DiagnosisReview"
        component={DiagnosisReviewScreen}
        options={{ title: 'Review Diagnosis' }}
      />
      <Stack.Screen name="ArticleEditor" component={ArticleEditorScreen} options={{ title: 'Write Article' }} />
    </Stack.Navigator>
  );
}
