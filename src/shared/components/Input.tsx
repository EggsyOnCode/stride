import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface InputProps extends TextInputProps { label?: string; error?: string }

export function Input({ label, error, style, ...props }: InputProps) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing.xs }}>
      {label ? <Text style={{ color: theme.colors.textSecondary, fontWeight: '700' }}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={theme.colors.textTertiary}
        style={[{ borderWidth: 1, borderColor: error ? theme.colors.danger : theme.colors.border, borderRadius: theme.radius.md, color: theme.colors.textPrimary, backgroundColor: theme.colors.surfaceElevated, padding: theme.spacing.md, minHeight: 44 }, style]}
        {...props}
      />
      {error ? <Text style={{ color: theme.colors.danger, fontSize: theme.typography.sizes.sm }}>{error}</Text> : null}
    </View>
  );
}
