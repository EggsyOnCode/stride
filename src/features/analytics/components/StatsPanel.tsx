import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import { formatNumber } from '../../../shared/utils/formatters';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function StatsPanel({ stats }: { stats: { current: number; target: number; avg: number; avgImprovement: number; trend: string } }) {
  const theme = useTheme();
  const improvement = `${stats.avgImprovement > 0 ? '+' : ''}${formatNumber(stats.avgImprovement)}`;
  const items = [['Current', formatNumber(stats.current)], ['Target', formatNumber(stats.target)], ['Average value', formatNumber(stats.avg)], ['Avg improvement / entry', improvement]] as const;
  return (
    <Card style={{ gap: theme.spacing.sm }}>
      {items.map(([label, value]) => (
        <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.colors.textSecondary }}>{label}</Text>
          <Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{value}</Text>
        </View>
      ))}
      <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>Trend: {stats.trend}</Text>
    </Card>
  );
}
