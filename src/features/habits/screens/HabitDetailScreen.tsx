import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, Screen, SectionHeader, Tag } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { formatDate } from '../../../shared/utils/formatters';
import { frequencyLabel } from '../../../shared/utils/calculations';
import { syncScheduledNotifications } from '../../../shared/hooks/useNotifications';
import { StreakCounter } from '../components/StreakCounter';
import { HabitLogRow } from '../components/HabitLogRow';

export default function HabitDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute() as { params: { habitId: string } };
  const theme = useTheme();
  const store = useAppStore();
  const habit = store.habits.find((item) => item.id === route.params.habitId);
  if (!habit) return <Screen><SectionHeader title="Habit not found" /><Button label="Back" onPress={() => navigation.goBack()} /></Screen>;
  const habitKpis = store.habitKpis.filter((kpi) => kpi.habitId === habit.id);
  const primaryKpi = habitKpis[0];
  const logs = primaryKpi ? store.habitKpiLogs.filter((log) => log.habitKpiId === primaryKpi.id).sort((a, b) => b.logDate - a.logDate) : [];
  const streak = primaryKpi ? store.habitStreaks.find((item) => item.habitKpiId === primaryKpi.id) : undefined;
  const linkedGoals = store.links.filter((link) => link.habitId === habit.id).map((link) => ({ link, goal: store.goals.find((goal) => goal.id === link.goalId) }));
  return <Screen><SectionHeader title={habit.title} actionLabel="Edit" onAction={() => navigation.navigate('CreateEditHabit', { habitId: habit.id })} /><Card style={{ gap: theme.spacing.sm }}><Text style={{ color: theme.colors.textSecondary }}>{frequencyLabel(habit)} · started {formatDate(habit.startDate)}</Text><Text style={{ color: theme.colors.textPrimary }}>{habit.description}</Text><View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>{habit.tags.map((tag) => <Tag key={tag} label={tag} />)}</View></Card>{streak ? <StreakCounter length={streak.streakLength} longest={streak.longestStreakLength} /> : null}{primaryKpi ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}><Button label="Log today" onPress={() => store.logHabitKpi(primaryKpi.id, primaryKpi.trackingType === 'binary' ? { completed: true } : { value: primaryKpi.targetValue ?? 1 })} /><Button label="Analytics" variant="secondary" onPress={() => navigation.navigate('KPIAnalytics', { kpiId: primaryKpi.id, kpiType: 'habit' })} /><Button label="Restart streak" variant="ghost" onPress={() => store.restartStreak(primaryKpi.id)} /></View> : null}<SectionHeader title="Linked Goals" /><Card>{linkedGoals.length ? linkedGoals.map(({ link, goal }) => <Text key={link.id} style={{ color: theme.colors.textSecondary }}>{goal?.title ?? 'Missing goal'} · {link.importance}</Text>) : <Text style={{ color: theme.colors.textSecondary }}>No goals linked yet.</Text>}</Card><SectionHeader title="Logs" />{logs.length ? logs.map((log) => <HabitLogRow key={log.id} log={log} />) : <Card><Text style={{ color: theme.colors.textSecondary }}>No logs yet.</Text></Card>}<View style={{ flexDirection: 'row', gap: theme.spacing.sm }}><Button label="Pause" variant="secondary" onPress={() => { store.updateHabit(habit.id, { status: 'paused' }); void syncScheduledNotifications(); }} /><Button label="Delete" variant="danger" onPress={() => { store.deleteHabit(habit.id); void syncScheduledNotifications(); navigation.goBack(); }} /></View></Screen>;
}
