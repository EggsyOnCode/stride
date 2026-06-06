import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, EmptyState, ProgressBar, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { formatDate, formatShortDate } from '../../../shared/utils/formatters';
import { useCalendarData } from '../hooks/useCalendarData';
import { DayHabitList } from '../components/DayHabitList';

export default function DayScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const data = useCalendarData();
  const store = useAppStore();
  const progressPct = Math.round(data.compliance * 100);
  return <Screen><SectionHeader title={formatDate(data.selectedDayMs)} actionLabel="Settings" onAction={() => navigation.navigate('Settings')} secondaryActionLabel="Guide" onSecondaryAction={() => navigation.navigate('GoalGuide')} />{data.todayHabits.length ? <Card style={{ gap: theme.spacing.sm }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.textSecondary }}>Daily progress</Text><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{progressPct}%</Text></View><ProgressBar value={progressPct} /><Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.xs }}>Measured habits count partial progress toward your day.</Text></Card> : null}<SectionHeader title="Today's Habits" />{data.todayHabits.length ? <DayHabitList habits={data.todayHabits} habitKpis={data.habitKpis} logs={data.habitLogs} goals={data.goals} links={data.links} dateMs={data.selectedDayMs} onOpen={(habitId) => navigation.navigate('HabitDetail', { habitId })} onLog={(habitKpiId, completed, value) => store.logHabitKpi(habitKpiId, { completed, value, logDate: data.selectedDayMs })} /> : <EmptyState title="No habits due" message="Create a habit to make daily progress visible." actionLabel="Create habit" onAction={() => navigation.navigate('CreateEditHabit')} />}<SectionHeader title="Upcoming Deadlines" />{data.upcomingDeadlines.length ? data.upcomingDeadlines.map((goal) => <Card key={goal.id}><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{goal.title}</Text><Text style={{ color: theme.colors.textSecondary }}>Due {formatShortDate(goal.dueDate)}</Text></Card>) : <Card><Text style={{ color: theme.colors.textSecondary }}>No deadlines in the next 7 days.</Text></Card>}</Screen>;
}
