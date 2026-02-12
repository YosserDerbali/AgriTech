import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../../theme/colors';

type TextareaProps = TextInputProps;

export function Textarea({ style, ...props }: TextareaProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.textarea, style]}
        placeholderTextColor={colors.muted}
        multiline
        textAlignVertical="top"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    minHeight: 120,
    backgroundColor: colors.card,
  },
});
