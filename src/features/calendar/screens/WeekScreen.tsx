import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { complianceForDay, goalsActiveInRange } from '../../../shared/utils/calculations';
import { formatShortDate, isoDate, startOfDayMs } from '../../../shared/utils/formatters';
import { WeekGrid } from '../components/WeekGrid';
import { ActiveGoalsList } from '../components/ActiveGoalsList';

export default function WeekScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const store = useAppStore();
  const today = startOfDayMs();
  const day = new Date(today).getDay();
  const start = today - day * 86400000;
  const end = start + 6 * 86400000;
  const days = Array.from({ length: 7 }, (_, index) => {
    const value = start + index * 86400000;
    return { label: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][index], value, compliance: complianceForDay(value, store.habits, store.habitKpis, store.habitKpiLogs) };
  });
  const avg = days.reduce((sum, item) => sum + item.compliance, 0) / days.length;
  const activeGoals = goalsActiveInRange(store.goals, start, end + 86400000 - 1);
  const [tag, setTag] = React.useState('all');
  const tags = Array.from(new Set(activeGoals.flatMap((goal) => goal.tags))).sort();
  const shownGoals = tag === 'all' ? activeGoals : activeGoals.filter((goal) => goal.tags.includes(tag));
  return (
    <Screen>
      <SectionHeader title="Week" />
      <WeekGrid days={days} onSelect={(value) => { const date = isoDate(value); store.setSelectedDate(date); navigation.navigate('Tabs', { screen: 'Day', params: { date } }); }} />
      <Card><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>Weekly habit compliance</Text><Text style={{ color: theme.colors.textSecondary }}>{Math.round(avg * 100)}%</Text></Card>
      <SectionHeader title={`Active goals (${formatShortDate(start)} – ${formatShortDate(end)})`} />
      {tags.length ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
          <Button label="all" variant={tag === 'all' ? 'primary' : 'secondary'} onPress={() => setTag('all')} />
          {tags.map((item) => <Button key={item} label={item} variant={tag === item ? 'primary' : 'secondary'} onPress={() => setTag(item)} />)}
        </View>
      ) : null}
      <ActiveGoalsList goals={shownGoals} allGoals={store.goals} kpis={store.kpis} onOpen={(goalId) => navigation.navigate('GoalDetail', { goalId })} />
    </Screen>
  );
}
