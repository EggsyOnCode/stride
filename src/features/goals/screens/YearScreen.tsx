import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomSheet, Button, EmptyState, FAB, Input, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { useGoals } from '../hooks/useGoals';
import { useGoalTree } from '../hooks/useGoalTree';
import { GoalCard } from '../components/GoalCard';
import { GoalTreeList } from '../components/GoalTreeList';
import { HabitCard } from '../../habits/components/HabitCard';

export default function YearScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { goals, kpis } = useGoals();
  const habits = useAppStore((s) => s.habits);
  const tree = useGoalTree(undefined);
  const [search, setSearch] = React.useState('');
  const [tag, setTag] = React.useState<string>('all');
  const [createOpen, setCreateOpen] = React.useState(false);

  const query = search.trim().toLowerCase();
  const allTags = React.useMemo(() => Array.from(new Set(goals.flatMap((goal) => goal.tags))).sort(), [goals]);
  const filtering = query.length > 0 || tag !== 'all';

  const parentTitle = (parentGoalId?: string) => goals.find((goal) => goal.id === parentGoalId)?.title;
  const matchesGoal = (title: string, tags: string[]) =>
    (!query || title.toLowerCase().includes(query)) && (tag === 'all' || tags.includes(tag));
  const filteredGoals = goals.filter((goal) => matchesGoal(goal.title, goal.tags));
  const filteredHabits = habits.filter((habit) => !query || habit.title.toLowerCase().includes(query));

  return (
    <Screen>
      <SectionHeader title="Goals" actionLabel="Settings" onAction={() => navigation.navigate('Settings')} secondaryActionLabel="Guide" onSecondaryAction={() => navigation.navigate('GoalGuide')} />
      <Input value={search} onChangeText={setSearch} placeholder="Search goals and habits" autoCapitalize="none" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>
        <Button label="all" variant={tag === 'all' ? 'primary' : 'secondary'} onPress={() => setTag('all')} />
        {allTags.map((item) => <Button key={item} label={item} variant={tag === item ? 'primary' : 'secondary'} onPress={() => setTag(item)} />)}
      </View>

      {goals.length === 0 ? (
        <EmptyState title="No goals yet" message="Create your first long-term outcome and connect habits to it." actionLabel="Create goal" onAction={() => navigation.navigate('CreateEditGoal')} />
      ) : filtering ? (
        filteredGoals.length ? filteredGoals.map((goal) => <GoalCard key={goal.id} goal={goal} kpis={kpis} parentTitle={parentTitle(goal.parentGoalId)} onPress={() => navigation.navigate('GoalDetail', { goalId: goal.id })} />)
          : <EmptyState title="No matching goals" message="Try a different search or tag." />
      ) : (
        <GoalTreeList nodes={tree} kpis={kpis} onOpen={(goalId) => navigation.navigate('GoalDetail', { goalId })} />
      )}

      <SectionHeader title="Habits" />
      {filteredHabits.length ? filteredHabits.map((habit) => <HabitCard key={habit.id} habit={habit} onPress={() => navigation.navigate('HabitDetail', { habitId: habit.id })} />)
        : <EmptyState title="No habits" message={habits.length ? 'No habits match your search.' : 'Create a habit from the Day tab.'} />}

      <FAB onPress={() => setCreateOpen(true)} />
      <BottomSheet visible={createOpen} onClose={() => setCreateOpen(false)}>
        <SectionHeader title="Create" />
        <Button label="New goal" onPress={() => { setCreateOpen(false); navigation.navigate('CreateEditGoal'); }} />
        <View style={{ height: theme.spacing.sm }} />
        <Button label="New habit" variant="secondary" onPress={() => { setCreateOpen(false); navigation.navigate('CreateEditHabit'); }} />
        <View style={{ height: theme.spacing.sm }} />
        <Button label="Cancel" variant="ghost" onPress={() => setCreateOpen(false)} />
      </BottomSheet>
    </Screen>
  );
}
