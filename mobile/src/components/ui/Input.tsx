import React from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { colors } from '../../theme/colors';

type InputProps = TextInputProps & {
  hasIconPadding?: boolean;
};

export function Input({ style, hasIconPadding, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, hasIconPadding && styles.inputWithIcon, style]}
        placeholderTextColor={colors.muted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.text,
    backgroundColor: colors.card,
  },
  inputWithIcon: {
    paddingLeft: 40,
  },
});
