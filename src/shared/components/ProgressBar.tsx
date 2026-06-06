import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function ProgressBar({ value }: { value: number }) {
  const theme = useTheme();
  return <View style={{ height: 8, borderRadius: theme.radius.full, backgroundColor: theme.colors.borderSubtle, overflow: 'hidden' }}><View style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: '100%', backgroundColor: theme.colors.primary }} /></View>;
}
