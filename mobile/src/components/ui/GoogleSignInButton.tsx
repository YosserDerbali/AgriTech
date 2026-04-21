import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';

interface GoogleSignInButtonProps {
  onPress: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Modern Google Sign-In Button
 * - Follows Google Brand Guidelines
 * - Accessible and responsive
 * - Supports loading state
 */
export default function GoogleSignInButton({
  onPress,
  disabled = false,
  loading = false,
  style,
  size = 'medium',
}: GoogleSignInButtonProps) {
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await onPress();
    } catch (error) {
      console.error('Google Sign-In button press error:', error);
    }
  };

  const sizeConfig = {
    small: { padding: 10, fontSize: 14, iconSize: 18 },
    medium: { padding: 14, fontSize: 15, iconSize: 20 },
    large: { padding: 16, fontSize: 16, iconSize: 24 },
  };

  const config = sizeConfig[size];

  const styles = StyleSheet.create({
    container: {
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: isPressed ? '#F0F0F0' : '#FFFFFF',
      borderWidth: 1,
      borderColor: '#DADCE0',
      opacity: disabled ? 0.6 : 1,
    },
    pressable: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: config.padding,
      gap: 8,
    },
    pressedStyle: {
      backgroundColor: '#F8F8F8',
    },
    iconContainer: {
      width: config.iconSize,
      height: config.iconSize,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: config.fontSize,
      fontWeight: '600',
      color: '#3C4043',
      letterSpacing: 0.3,
    },
    loadingContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressedStyle,
        ]}
        onPress={handlePress}
        disabled={disabled || loading}
        accessibilityLabel="Sign in with Google"
        accessibilityRole="button"
        accessibilityHint="Redirects to Google Sign-In"
      >
        {loading ? (
          <>
            <View style={styles.iconContainer}>
              <ActivityIndicator size="small" color="#4285F4" />
            </View>
            <Text style={styles.text}>Signing in...</Text>
          </>
        ) : (
          <>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="google"
                size={config.iconSize}
                color="#4285F4"
              />
            </View>
            <Text style={styles.text}>Continue with Google</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
