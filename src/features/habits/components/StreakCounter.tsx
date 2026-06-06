import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function StreakCounter({ length, longest }: { length: number; longest: number }) {
  const theme = useTheme();
  return <View style={{ backgroundColor: theme.colors.successLight, borderRadius: theme.radius.lg, padding: theme.spacing.md }}><Text style={{ color: theme.colors.success, fontSize: theme.typography.sizes.xxl, fontWeight: '900' }}>{length} day streak</Text><Text style={{ color: theme.colors.textSecondary }}>Best: {longest} days</Text></View>;
}
