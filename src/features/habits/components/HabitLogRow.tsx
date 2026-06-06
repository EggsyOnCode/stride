import React from 'react';
import { Text, View } from 'react-native';
import type { HabitKPILog } from '../../../shared/types/domain';
import { formatShortDate, formatNumber } from '../../../shared/utils/formatters';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function HabitLogRow({ log }: { log: HabitKPILog }) {
  const theme = useTheme();
  return <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: theme.colors.borderSubtle, paddingVertical: theme.spacing.sm }}><Text style={{ color: theme.colors.textPrimary }}>{formatShortDate(log.logDate)}</Text><Text style={{ color: log.streakActive ? theme.colors.success : theme.colors.textSecondary }}>{log.completed !== undefined ? (log.completed ? 'Done' : 'Missed') : formatNumber(log.value)}</Text></View>;
}
