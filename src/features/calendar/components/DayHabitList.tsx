import React from 'react';
import { Text, View } from 'react-native';
import { Button, Card, Input } from '../../../shared/components';
import type { Goal, GoalHabitLink, Habit, HabitKPI, HabitKPILog } from '../../../shared/types/domain';
import { startOfDayMs } from '../../../shared/utils/formatters';
import { isHabitLogComplete } from '../../../shared/utils/calculations';
import { useTheme } from '../../../shared/theme/ThemeProvider';

interface DayHabitListProps {
  habits: Habit[];
  habitKpis: HabitKPI[];
  logs: HabitKPILog[];
  goals: Goal[];
  links: GoalHabitLink[];
  dateMs: number;
  onLog: (habitKpiId: string, completed?: boolean, value?: number) => void;
  onOpen: (habitId: string) => void;
}

export function DayHabitList({ habits, habitKpis, logs, goals, links, dateMs, onLog, onOpen }: DayHabitListProps) {
  const theme = useTheme();
  const [values, setValues] = React.useState<Record<string, string>>({});
  const logMeasured = (habitKpiId: string) => {
    const raw = values[habitKpiId];
    const value = Number(raw);
    if (raw === undefined || raw.trim() === '' || Number.isNaN(value)) return;
    onLog(habitKpiId, undefined, value);
  };
  return <View style={{ gap: theme.spacing.sm }}>{habits.map((habit) => {
    const kpi = habitKpis.find((item) => item.habitId === habit.id);
    const log = kpi ? logs.find((item) => item.habitKpiId === kpi.id && startOfDayMs(item.logDate) === startOfDayMs(dateMs)) : undefined;
    const complete = kpi ? isHabitLogComplete(log, kpi) : false;
    const hasMeasuredLog = kpi?.trackingType === 'measured' && log?.value !== undefined;
    const linkedGoalTitles = links.filter((link) => link.habitId === habit.id).map((link) => goals.find((goal) => goal.id === link.goalId)?.title).filter(Boolean) as string[];
    return <Card key={habit.id} style={{ gap: theme.spacing.sm }}><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{habit.title}</Text>{linkedGoalTitles.length ? <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm }}>↳ {linkedGoalTitles.join(', ')}</Text> : <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm }}>Not linked to a goal</Text>}{hasMeasuredLog ? <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>Logged: {log.value} {kpi?.unit}</Text> : null}{kpi?.trackingType === 'measured' ? <Input value={values[kpi.id] ?? ''} onChangeText={(value) => setValues((state) => ({ ...state, [kpi.id]: value }))} keyboardType="numeric" placeholder={`Value (${kpi.unit})`} /> : null}<View style={{ flexDirection: 'row', gap: theme.spacing.sm }}><Button label={kpi?.trackingType === 'measured' ? (hasMeasuredLog ? 'Update' : 'Log') : complete ? 'Logged' : 'Log'} onPress={() => { if (!kpi) return; if (kpi.trackingType === 'measured') logMeasured(kpi.id); else onLog(kpi.id, true); }} /><Button label="Details" variant="secondary" onPress={() => onOpen(habit.id)} /></View></Card>;
  })}</View>;
}
