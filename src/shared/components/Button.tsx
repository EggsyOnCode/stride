import React from 'react';
import { ActivityIndicator, Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', disabled, loading, style }: ButtonProps) {
  const theme = useTheme();
  const backgroundColor = variant === 'primary' ? theme.colors.primary : variant === 'danger' ? theme.colors.danger : variant === 'secondary' ? theme.colors.surface : 'transparent';
  const color = variant === 'primary' || variant === 'danger' ? theme.colors.textOnPrimary : theme.colors.textPrimary;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [{
        backgroundColor,
        borderColor: theme.colors.border,
        borderWidth: variant === 'ghost' ? 0 : 1,
        borderRadius: theme.radius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        opacity: disabled ? 0.5 : pressed ? 0.75 : 1,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
      }, style]}
    >
      {loading ? <ActivityIndicator color={color} /> : <Text style={{ color, fontSize: theme.typography.sizes.md, fontWeight: '700' }}>{label}</Text>}
    </Pressable>
  );
}
