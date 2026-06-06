import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function WeekGrid({ days, onSelect }: { days: Array<{ label: string; value: number; compliance: number }>; onSelect: (value: number) => void }) {
  const theme = useTheme();
  return <View style={{ flexDirection: 'row', gap: theme.spacing.xs }}>{days.map((day) => <Pressable key={day.label} onPress={() => onSelect(day.value)} style={{ flex: 1, backgroundColor: day.compliance >= 0.9 ? theme.colors.successLight : day.compliance >= 0.5 ? theme.colors.warningLight : theme.colors.dangerLight, borderRadius: theme.radius.md, padding: theme.spacing.sm, alignItems: 'center' }}><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{day.label}</Text><Text style={{ color: theme.colors.textSecondary }}>{Math.round(day.compliance * 100)}%</Text></Pressable>)}</View>;
}
