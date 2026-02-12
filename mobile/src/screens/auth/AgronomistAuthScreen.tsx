import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { useAppStore } from '../../stores/appStore';
import { colors } from '../../theme/colors';

const MOCK_AGRONOMIST = {
  email: 'agronomist@test.com',
  password: 'password123',
  name: 'Dr. Sarah Green',
};

export default function AgronomistAuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { setRole, setUser, setIsAuthenticated } = useAppStore();

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
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (isSignUp) {
      if (formData.email && formData.password && formData.name) {
        setUser({ name: formData.name, email: formData.email, role: 'agronomist' });
        setRole('agronomist');
        setIsAuthenticated(true);
        Alert.alert('Account created', 'Welcome to the Agronomist Portal');
      } else {
        Alert.alert('Error', 'Please fill in all required fields');
      }
    } else {
      if (formData.email === MOCK_AGRONOMIST.email && formData.password === MOCK_AGRONOMIST.password) {
        setUser({ name: MOCK_AGRONOMIST.name, email: MOCK_AGRONOMIST.email, role: 'agronomist' });
        setRole('agronomist');
        setIsAuthenticated(true);
        Alert.alert('Welcome back', `Signed in as ${MOCK_AGRONOMIST.name}`);
      } else {
        Alert.alert('Invalid credentials', 'Use agronomist@test.com / password123');
      }
    }

    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isSignUp ? 'Join as Agronomist' : 'Agronomist Portal'}</Text>
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
        placeholder="agronomist@test.com"
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

      <Button title={isSignUp ? 'Create Account' : 'Sign In'} onPress={handleSubmit} disabled={isLoading} />

      <Text style={styles.toggle} onPress={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </Text>

      <View style={styles.switchRole}>
        <Text style={styles.switchText}>Are you a farmer?</Text>
        <Button title="Sign in as Farmer" variant="outline" onPress={() => navigation.navigate('FarmerAuth')} />
      </View>

      <Text style={styles.demo}>Demo: agronomist@test.com / password123</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  demo: {
    marginTop: 20,
    fontSize: 11,
    color: colors.muted,
  },
});
