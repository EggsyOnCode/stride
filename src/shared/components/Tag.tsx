import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function Tag({ label, tone = 'info' }: { label: string; tone?: 'success' | 'warning' | 'danger' | 'info' }) {
  const theme = useTheme();
  const color = theme.colors[tone];
  const bg = theme.colors[`${tone}Light` as const];
  return <View style={{ backgroundColor: bg, borderRadius: theme.radius.full, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs }}><Text style={{ color, fontSize: theme.typography.sizes.xs, fontWeight: '700' }}>{label}</Text></View>;
}
