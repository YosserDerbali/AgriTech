import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Text } from 'react-native';
import { colors, shadows } from '../../theme/colors';
import { typography, fontFamilies } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

type TextareaProps = TextInputProps & {
  label?: string;
  error?: string;
  minHeight?: number;
};

export function Textarea({ style, label, error, minHeight = 120, ...props }: TextareaProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.textarea,
          { minHeight },
          error && styles.textareaError,
          style,
        ]}
        placeholderTextColor={colors.textTertiary}
        multiline
        textAlignVertical="top"
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
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: 15,
    fontFamily: fontFamilies.regular,
    color: colors.text,
    backgroundColor: colors.surface,
    ...shadows.xs,
  },
  textareaError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
