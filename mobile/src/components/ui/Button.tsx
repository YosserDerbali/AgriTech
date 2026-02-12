import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ title, onPress, variant = 'default', disabled, style }: ButtonProps) {
  const stylesByVariant = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        buttonStyles.base,
        stylesByVariant.container,
        pressed && stylesByVariant.pressed,
        disabled && buttonStyles.disabled,
        style,
      ]}
    >
      <Text style={[buttonStyles.text, stylesByVariant.text]}>{title}</Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.6,
  },
});

const variantStyles: Record<ButtonVariant, { container: ViewStyle; text: TextStyle; pressed: ViewStyle }> = {
  default: {
    container: {
      backgroundColor: colors.primary,
    },
    text: {
      color: '#FFFFFF',
    },
    pressed: {
      opacity: 0.9,
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: {
      color: colors.text,
    },
    pressed: {
      backgroundColor: '#F1F5F9',
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
    },
    text: {
      color: colors.text,
    },
    pressed: {
      backgroundColor: '#F1F5F9',
    },
  },
  destructive: {
    container: {
      backgroundColor: colors.destructive,
    },
    text: {
      color: '#FFFFFF',
    },
    pressed: {
      opacity: 0.9,
    },
  },
};
