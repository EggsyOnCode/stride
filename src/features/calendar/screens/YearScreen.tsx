import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { goalsActiveInRange } from '../../../shared/utils/calculations';
import { ActiveGoalsList } from '../components/ActiveGoalsList';

export default function YearScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const store = useAppStore();
  const [year, setYear] = React.useState(new Date().getFullYear());
  const [tag, setTag] = React.useState('all');
  const yearStart = new Date(year, 0, 1).getTime();
  const yearEnd = new Date(year, 11, 31, 23, 59, 59).getTime();
  const activeGoals = goalsActiveInRange(store.goals, yearStart, yearEnd).sort((a, b) => a.startDate - b.startDate);
  const tags = Array.from(new Set(activeGoals.flatMap((goal) => goal.tags))).sort();
  const shownGoals = tag === 'all' ? activeGoals : activeGoals.filter((goal) => goal.tags.includes(tag));
  return (
    <Screen>
      <SectionHeader title="Year" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
        <Button label="‹ Prev" variant="secondary" onPress={() => setYear((value) => value - 1)} />
        <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.xl, fontWeight: '800' }}>{year}</Text>
        <Button label="Next ›" variant="secondary" onPress={() => setYear((value) => value + 1)} />
      </View>
      <Card><Text style={{ color: theme.colors.textSecondary }}>{activeGoals.length} goal{activeGoals.length === 1 ? '' : 's'} active during {year}.</Text></Card>
      <SectionHeader title="Active goals" />
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
