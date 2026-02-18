import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Text } from 'react-native';
import { colors, shadows } from '../../theme/colors';
import { typography, fontFamilies } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type InputVariant = 'default' | 'outline' | 'filled';
type InputSize = 'small' | 'medium' | 'large';

type InputProps = TextInputProps & {
  hasIconPadding?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  error?: string;
  label?: string;
};

export function Input({
  style,
  hasIconPadding,
  variant = 'default',
  size = 'medium',
  error,
  label,
  ...props
}: InputProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizePresets[size];

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          variantStyle,
          sizeStyle,
          hasIconPadding && styles.inputWithIcon,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={colors.textTertiary}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    borderRadius: radius.lg,
    color: colors.text,
    fontFamily: fontFamilies.regular,
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

const variantStyles = {
  default: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    ...shadows.xs,
  },
  outline: {
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
  },
  filled: {
    borderWidth: 0,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    backgroundColor: colors.primaryExtraLight,
  },
};

const sizePresets = {
  small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 13,
  },
  medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
  large: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: 16,
  },
};
