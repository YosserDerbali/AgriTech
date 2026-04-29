import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView, Keyboard, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import GoogleSignInButton from '../../components/ui/GoogleSignInButton';
import { useAppStore } from '../../stores/appStore';
import { authAPI } from '../../services/authAPI';
import { useTheme } from '../../hooks/useTheme';
import { useGoogleAuth } from '../../services/auth/googleAuth';
import { isClerkConfigured } from '../../services/auth/clerkConfig';
import { spacing, radius } from '../../theme/spacing';

export default function AgronomistAuthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { setRole, setUser, setIsAuthenticated, setToken } = useAppStore();
  const { colors, shadows } = useTheme();


  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialties: '',
    experience: '',
  });

  // Set agronomist role for this auth screen
  useEffect(() => {
    setRole('agronomist');
  }, [setRole]);

  function ClerkGoogleSignInButton() {
    const { signInWithGoogle } = useGoogleAuth();

    const handlePress = async () => {
      try {
        setIsGoogleLoading(true);
        await signInWithGoogle();
        Alert.alert('Welcome', 'Google sign-in completed successfully.');
      } catch (error) {
        Alert.alert('Error', error instanceof Error ? error.message : 'Google sign-in failed');
      } finally {
        setIsGoogleLoading(false);
      }
    };

    return (
      <GoogleSignInButton
        onPress={handlePress}
        loading={isGoogleLoading}
        disabled={isLoading || isGoogleLoading}
        size="medium"
      />
    );
  }

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
      padding: spacing.lg,
      paddingBottom: spacing['3xl'],
    },
    header: {
      marginBottom: spacing['3xl'],
      paddingBottom: spacing.xl,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    icon: {
      marginRight: spacing.lg,
      marginTop: spacing.sm,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: colors.text,
      flex: 1,
      lineHeight: 40,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 22,
      color: colors.textSecondary,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    googleButtonContainer: {
      marginBottom: spacing['2xl'],
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing['2xl'],
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.8,
      color: colors.textTertiary,
      marginHorizontal: spacing.md,
      textTransform: 'uppercase',
    },
    formContainer: {
      marginBottom: spacing['2xl'],
    },
    inputWrapper: {
      marginBottom: spacing.lg,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: radius.lg,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      height: 48,
      ...shadows.xs,
    },
    inputContainerFocused: {
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },
    inputIcon: {
      marginRight: spacing.md,
    },
    inputField: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    passwordToggle: {
      padding: spacing.sm,
      marginLeft: spacing.sm,
    },
    input: {
      marginBottom: spacing.lg,
    },
    textarea: {
      marginBottom: spacing.lg,
      minHeight: 90,
    },
    submitButton: {
      marginBottom: spacing['2xl'],
    },
    toggleLink: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
      marginBottom: spacing.xl,
      letterSpacing: 0.2,
    },
    switchRoleCard: {
      paddingVertical: spacing.xl,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.primarySoft,
      borderRadius: radius['2xl'],
      borderWidth: 1.5,
      borderColor: colors.primary,
      alignItems: 'center',
      marginTop: spacing['2xl'],
      ...shadows.md,
    },
    switchRoleLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: colors.primary,
      textTransform: 'uppercase',
      marginBottom: spacing.lg,
    },
    switchRoleButton: {
      width: '100%',
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Feather name="award" size={32} color={colors.primary} style={styles.icon} />
            <Text style={styles.title}>
              {isSignUp ? 'Join as Agronomist' : 'Agronomist Portal'}
            </Text>
          </View>
          <Text style={styles.subtitle}>
            {isSignUp
              ? 'Help farmers protect their crops with your expertise'
              : 'Sign in to review diagnoses and help farmers'}
          </Text>
        </View>

        {/* Google Sign-In Button */}
        <View style={styles.googleButtonContainer}>
          {isClerkConfigured ? (
            <ClerkGoogleSignInButton />
          ) : (
            <GoogleSignInButton
              onPress={() => Alert.alert('Google Sign-In', 'Configure Clerk to enable Google sign-in.')}
              loading={false}
              disabled={true}
              size="medium"
            />
          )}
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.formContainer}>
          {isSignUp ? (
            <View style={styles.inputWrapper}>
              <View style={[styles.inputContainer, focusedField === 'name' && styles.inputContainerFocused]}>
                <Feather name="user" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  style={[styles.inputField, { borderWidth: 0 }]}
                />
              </View>
            </View>
          ) : null}

          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, focusedField === 'email' && styles.inputContainerFocused]}>
              <Feather name="mail" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <Input
                placeholder="Email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                keyboardType="email-address"
                style={[styles.inputField, { borderWidth: 0 }]}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, focusedField === 'password' && styles.inputContainerFocused]}>
              <Feather name="lock" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <Input
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                style={[styles.inputField, { borderWidth: 0 }]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
                activeOpacity={0.7}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={16}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {isSignUp ? (
            <>
              <View style={styles.inputWrapper}>
                <Textarea
                  placeholder="Specialties (e.g., Tomato diseases, Organic farming)"
                  value={formData.specialties}
                  onChangeText={(text) => setFormData({ ...formData, specialties: text })}
                  style={styles.textarea}
                />
              </View>
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, focusedField === 'experience' && styles.inputContainerFocused]}>
                  <Feather name="briefcase" size={18} color={colors.textSecondary} style={styles.inputIcon} />
                  <Input
                    placeholder="Years of Experience"
                    value={formData.experience}
                    onChangeText={(text) => setFormData({ ...formData, experience: text })}
                    onFocus={() => setFocusedField('experience')}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="numeric"
                    style={[styles.inputField, { borderWidth: 0 }]}
                  />
                </View>
              </View>
            </>
          ) : null}
        </View>

        <Button
          title={isSignUp ? 'Create Account' : 'Sign In'}
          onPress={handleSubmit}
          disabled={isLoading || isGoogleLoading}
          style={styles.submitButton}
        />


        <Text style={styles.toggleLink} onPress={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Text>

        <View style={styles.switchRoleCard}>
          <Text style={styles.switchRoleLabel}>Are you a farmer?</Text>
          <View style={styles.switchRoleButton}>
            <Button
              title="Sign in as Farmer"
              variant="outline"
              onPress={() => navigation.navigate('FarmerAuth')}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}