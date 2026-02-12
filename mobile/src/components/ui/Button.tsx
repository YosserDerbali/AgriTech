import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle, View } from 'react-native';
import { colors } from '../../theme/colors';

type ButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type IconPosition = 'left' | 'right';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
  iconPosition?: IconPosition;
  textColor?: string;
};

export function Button({ title, onPress, variant = 'default', disabled, style, icon, iconPosition = 'left', textColor }: ButtonProps) {
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
      <View style={buttonStyles.content}>
        {icon && iconPosition === 'left' && <View style={buttonStyles.iconLeft}>{icon}</View>}
        <Text style={[buttonStyles.text, stylesByVariant.text, textColor && { color: textColor }]}>{title}</Text>
        {icon && iconPosition === 'right' && <View style={buttonStyles.iconRight}>{icon}</View>}
      </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
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
