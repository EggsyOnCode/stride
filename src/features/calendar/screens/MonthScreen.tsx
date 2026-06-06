import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { complianceForDay, goalsActiveInRange } from '../../../shared/utils/calculations';
import { MonthHeatmap } from '../components/MonthHeatmap';
import { ActiveGoalsList } from '../components/ActiveGoalsList';

export default function MonthScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const store = useAppStore();
  const [tag, setTag] = React.useState('all');
  const marked: Record<string, { selected?: boolean; marked?: boolean; dotColor?: string; selectedColor?: string }> = {};
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(now.getFullYear(), now.getMonth(), daysInMonth, 23, 59, 59).getTime();
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(now.getFullYear(), now.getMonth(), day);
    const iso = date.toISOString().slice(0, 10);
    const compliance = complianceForDay(date.getTime(), store.habits, store.habitKpis, store.habitKpiLogs);
    marked[iso] = { marked: true, dotColor: compliance >= 0.9 ? theme.colors.success : compliance >= 0.5 ? theme.colors.warning : theme.colors.danger };
  }
  for (const goal of store.goals) marked[new Date(goal.dueDate).toISOString().slice(0, 10)] = { ...(marked[new Date(goal.dueDate).toISOString().slice(0, 10)] ?? {}), selected: true, selectedColor: theme.colors.primary };
  const activeGoals = goalsActiveInRange(store.goals, monthStart, monthEnd);
  const tags = Array.from(new Set(activeGoals.flatMap((goal) => goal.tags))).sort();
  const shownGoals = tag === 'all' ? activeGoals : activeGoals.filter((goal) => goal.tags.includes(tag));
  return (
    <Screen>
      <SectionHeader title="Month" />
      <MonthHeatmap markedDates={marked} onDayPress={(date) => { store.setSelectedDate(date); navigation.navigate('Tabs', { screen: 'Day', params: { date } }); }} />
      <Card><Text style={{ color: theme.colors.textSecondary }}>Heatmap dots show habit compliance. Selected days mark goal due dates.</Text></Card>
      <SectionHeader title="Active goals this month" />
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
