import React from 'react';
import { Text, View } from 'react-native';
import type { GoalStatus } from '../../../shared/types/domain';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function GoalStatusBadge({ status }: { status: GoalStatus }) {
  const theme = useTheme();
  const tone = status === 'completed' ? 'success' : status === 'paused' ? 'warning' : status === 'abandoned' ? 'danger' : 'info';
  const color = theme.colors[tone];
  const bg = theme.colors[`${tone}Light` as const];
  return (
    <View style={{ backgroundColor: bg, borderRadius: theme.radius.sm, paddingHorizontal: theme.spacing.sm, paddingVertical: 2, alignSelf: 'flex-start' }}>
      <Text style={{ color, fontSize: theme.typography.sizes.xs, fontWeight: '700' }}>{status.replace('_', ' ')}</Text>
    </View>
  );
}
