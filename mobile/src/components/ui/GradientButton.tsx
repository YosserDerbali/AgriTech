/**
 * Gradient Button Component
 * Premium button with gradient background
 */
import React from 'react';
import { Pressable, StyleSheet, Text, Platform, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { typography, fontFamilies } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type GradientButtonProps = {
  title: string;
  onPress: () => void;
  gradientColors?: [string, string];
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
  full?: boolean;
  haptics?: boolean;
};

export function GradientButton({
  title,
  onPress,
  gradientColors = [colors.primary, colors.primaryLight],
  disabled = false,
  size = 'medium',
  icon,
  full = false,
  haptics = true,
}: GradientButtonProps) {
  const handlePress = () => {
    if (!disabled) {
      if (haptics && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const sizeStyles = getSizeStyles(size);

  return (
    <LinearGradient
      colors={disabled ? [colors.textMuted, colors.textMuted] : gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.gradientContainer,
        sizeStyles.container,
        full && styles.full,
        disabled && styles.disabled,
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          pressed && !disabled && styles.pressablePressed,
        ]}
        onPress={handlePress}
        disabled={disabled}
      >
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, sizeStyles.text]}>{title}</Text>
        </View>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  full: {
    width: '100%',
  },
  pressable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressablePressed: {
    opacity: 0.9,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  text: {
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return {
        container: {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        },
        text: typography.buttonSmall,
      };
    case 'large':
      return {
        container: {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
        },
        text: typography.buttonLarge,
      };
    case 'medium':
    default:
      return {
        container: {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        text: typography.buttonMedium,
      };
  }
};
