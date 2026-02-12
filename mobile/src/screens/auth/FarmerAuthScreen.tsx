import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAppStore } from '../../stores/appStore';
import { colors } from '../../theme/colors';

const MOCK_FARMER = {
  email: 'farmer@test.com',
  password: 'password123',
  name: 'John Farmer',
};

export default function FarmerAuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { setRole, setUser, setIsAuthenticated } = useAppStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (isSignUp) {
      if (formData.email && formData.password && formData.name) {
        setUser({ name: formData.name, email: formData.email, role: 'farmer' });
        setRole('farmer');
        setIsAuthenticated(true);
        Alert.alert('Account created', 'Welcome to AgriScan');
      } else {
        Alert.alert('Error', 'Please fill in all fields');
      }
    } else {
      if (formData.email === MOCK_FARMER.email && formData.password === MOCK_FARMER.password) {
        setUser({ name: MOCK_FARMER.name, email: MOCK_FARMER.email, role: 'farmer' });
        setRole('farmer');
        setIsAuthenticated(true);
        Alert.alert('Welcome back', `Signed in as ${MOCK_FARMER.name}`);
      } else {
        Alert.alert('Invalid credentials', 'Use farmer@test.com / password123');
      }
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Farmer portal'}</Text>
      <Text style={styles.subtitle}>
        {isSignUp
          ? 'Join thousands of farmers using AI to protect their crops'
          : 'Sign in to continue to AgriScan'}
      </Text>

      {isSignUp ? (
        <Input
          placeholder="Full Name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          style={styles.input}
        />
      ) : null}
      <Input
        placeholder="farmer@test.com"
        value={formData.email}
        onChangeText={(text) => setFormData({ ...formData, email: text })}
        style={styles.input}
        autoCapitalize="none"
      />
      <Input
        placeholder="password123"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        style={styles.input}
        secureTextEntry
      />

      <Button title={isSignUp ? 'Create Account' : 'Sign In'} onPress={handleSubmit} disabled={isLoading} />

      <Text style={styles.toggle} onPress={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </Text>

      <View style={styles.switchRole}>
        <Text style={styles.switchText}>Are you an agronomist?</Text>
        <Button title="Sign in as Agronomist" variant="outline" onPress={() => navigation.navigate('AgronomistAuth')} />
      </View>

      <Text style={styles.demo}>Demo: farmer@test.com / password123</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  toggle: {
    marginTop: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  switchRole: {
    marginTop: 20,
  },
  switchText: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 10,
  },
  demo: {
    marginTop: 20,
    fontSize: 11,
    color: colors.muted,
  },
});
