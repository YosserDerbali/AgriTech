import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useAppStore } from '../../stores/appStore';
import { authAPI } from '../../services/authAPI';
import { colors } from '../../theme/colors';

export default function AgronomistAuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { setRole, setUser, setIsAuthenticated, setToken } = useAppStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialties: '',
    experience: '',
  });

  const handleSubmit = async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Register
        if (!formData.name || !formData.email || !formData.password) {
          Alert.alert('Error', 'Please fill in all required fields');
          setIsLoading(false);
          return;
        }

        const response = await authAPI.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'AGRONOMIST',
        });

        await setToken(response.token);
        setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: 'agronomist',
        });
        setRole('agronomist');
        setIsAuthenticated(true);
        Alert.alert('Success', 'Account created successfully!');
      } else {
        // Login
        if (!formData.email || !formData.password) {
          Alert.alert('Error', 'Please enter email and password');
          setIsLoading(false);
          return;
        }

        const response = await authAPI.login({
          email: formData.email,
          password: formData.password,
          role: 'AGRONOMIST',
        });

        await setToken(response.token);
        setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: 'agronomist',
        });
        setRole('agronomist');
        setIsAuthenticated(true);
        Alert.alert('Welcome back', `Signed in as ${response.user.name}`);
      }
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>
          {isSignUp ? 'Join as Agronomist' : 'Agronomist Portal'}
        </Text>
        <Text style={styles.subtitle}>
          {isSignUp
            ? 'Help farmers protect their crops with your expertise'
            : 'Sign in to review diagnoses and help farmers'}
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
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          placeholder="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          style={styles.input}
          secureTextEntry
        />

        {isSignUp ? (
          <>
            <Textarea
              placeholder="Specialties (e.g., Tomato diseases, Organic farming)"
              value={formData.specialties}
              onChangeText={(text) => setFormData({ ...formData, specialties: text })}
              style={styles.textarea}
            />
            <Input
              placeholder="Years of Experience"
              value={formData.experience}
              onChangeText={(text) => setFormData({ ...formData, experience: text })}
              style={styles.input}
              keyboardType="numeric"
            />
          </>
        ) : null}

        <Button
          title={isSignUp ? 'Create Account' : 'Sign In'}
          onPress={handleSubmit}
          disabled={isLoading}
        />

        <Text style={styles.toggle} onPress={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>

        <View style={styles.switchRole}>
          <Text style={styles.switchText}>Are you a farmer?</Text>
          <Button
            title="Sign in as Farmer"
            variant="outline"
            onPress={() => navigation.navigate('FarmerAuth')}
          />
        </View>
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
  textarea: {
    marginBottom: 12,
    minHeight: 90,
  },
  toggle: {
    marginTop: 12,
    color: colors.accent,
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
});
