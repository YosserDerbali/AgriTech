import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle, View, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, shadows } from '../../theme/colors';
import { typography, fontFamilies } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' | 'accent';
type ButtonSize = 'small' | 'medium' | 'large';
type IconPosition = 'left' | 'right';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  textColor?: string;
  loading?: boolean;
  haptics?: boolean;
};

export function Button({
  title,
  onPress,
  variant = 'default',
  size = 'medium',
  disabled,
  style,
  icon,
  iconPosition = 'left',
  textColor,
  loading,
  haptics = true,
}: ButtonProps) {
  const stylesByVariant = variantStyles[variant];
  const sizeStyles = sizePresets[size];

  const handlePress = () => {
    if (!disabled && !loading) {
      if (haptics && Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onPress();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        buttonStyles.base,
        sizeStyles.container,
        stylesByVariant.container,
        pressed && !disabled && stylesByVariant.pressed,
        disabled && buttonStyles.disabled,
        style,
      ]}
    >
      <View style={buttonStyles.content}>
        {icon && iconPosition === 'left' && <View style={[buttonStyles.iconLeft, sizeStyles.iconMargin]}>{icon}</View>}
        <Text style={[buttonStyles.text, sizeStyles.text, stylesByVariant.text, textColor && { color: textColor }]}>
          {loading ? '...' : title}
        </Text>
        {icon && iconPosition === 'right' && <View style={[buttonStyles.iconRight, sizeStyles.iconMargin]}>{icon}</View>}
      </View>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius['2xl'],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: fontFamilies.semibold,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizePresets: Record<ButtonSize, { container: ViewStyle; text: TextStyle; iconMargin: ViewStyle }> = {
  small: {
    container: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
    },
    text: typography.buttonSmall,
    iconMargin: { width: 16, height: 16 },
  },
  medium: {
    container: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
    },
    text: typography.buttonMedium,
    iconMargin: { width: 18, height: 18 },
  },
  large: {
    container: {
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    text: typography.buttonLarge,
    iconMargin: { width: 20, height: 20 },
  },
};

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle; pressed: ViewStyle }> = {
  default: {
    container: {
      backgroundColor: colors.primary,
      ...shadows.md,
    },
    text: {
      color: colors.textInverse,
    },
    pressed: {
      backgroundColor: colors.primaryDark,
      transform: [{ scale: 0.98 }],
    },
  },
  secondary: {
    container: {
      backgroundColor: colors.primaryLight,
      ...shadows.sm,
    },
    text: {
      color: colors.textInverse,
    },
    pressed: {
      backgroundColor: colors.primaryDark,
      transform: [{ scale: 0.98 }],
    },
  },
  accent: {
    container: {
      backgroundColor: colors.accent,
      ...shadows.md,
    },
    text: {
      color: colors.text,
    },
    pressed: {
      backgroundColor: colors.accentDark,
      transform: [{ scale: 0.98 }],
    },
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.primary,
      ...shadows.xs,
    },
    text: {
      color: colors.primary,
    },
    pressed: {
      backgroundColor: colors.primarySoft,
      transform: [{ scale: 0.98 }],
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: colors.primary,
    },
    pressed: {
      backgroundColor: colors.primarySoft,
      transform: [{ scale: 0.98 }],
    },
  },
  destructive: {
    container: {
      backgroundColor: colors.error,
      ...shadows.md,
    },
    text: {
      color: colors.textInverse,
    },
    pressed: {
      backgroundColor: colors.error,
      opacity: 0.9,
      transform: [{ scale: 0.98 }],
    },
  },
};
