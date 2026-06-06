import React from 'react';
import { Pressable, Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function FAB({ label = '+', onPress }: { label?: string; onPress: () => void }) {
  const theme = useTheme();
  return <Pressable onPress={onPress} style={{ position: 'absolute', right: theme.spacing.lg, bottom: theme.spacing.lg, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', ...theme.shadows.md }}><Text style={{ color: theme.colors.textOnPrimary, fontSize: 28, fontWeight: '800' }}>{label}</Text></Pressable>;
}
