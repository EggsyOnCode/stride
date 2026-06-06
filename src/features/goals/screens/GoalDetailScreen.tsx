import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomSheet, Button, Card, DatePicker, Input, Screen, SectionHeader, Select, Tag } from '../../../shared/components';
import type { SelectOption } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { formatDate, fromIsoDate, isoDate } from '../../../shared/utils/formatters';
import type { GoalStatus } from '../../../shared/types/domain';
import { frequencyLabel } from '../../../shared/utils/calculations';
import { syncScheduledNotifications } from '../../../shared/hooks/useNotifications';
import { KPISection } from '../components/KPISection';
import { GoalTree } from '../components/GoalTree';
import { useGoalTree } from '../hooks/useGoalTree';
import { MilestoneList } from '../components/MilestoneList';

const STATUS_OPTIONS: SelectOption<GoalStatus>[] = [
  { label: 'Not started', value: 'not_started' },
  { label: 'In progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Paused', value: 'paused' },
  { label: 'Abandoned', value: 'abandoned' },
];

export default function GoalDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute() as { params: { goalId: string } };
  const theme = useTheme();
  const store = useAppStore();
  const goal = store.goals.find((item) => item.id === route.params.goalId);
  const parentGoal = store.goals.find((item) => item.id === goal?.parentGoalId);
  const [note, setNote] = React.useState('');
  const [addKpiVisible, setAddKpiVisible] = React.useState(false);
  const [kpiName, setKpiName] = React.useState('');
  const [kpiUnit, setKpiUnit] = React.useState('');
  const [kpiStart, setKpiStart] = React.useState('0');
  const [kpiTarget, setKpiTarget] = React.useState('100');
  const [logKpiId, setLogKpiId] = React.useState<string | null>(null);
  const [logValue, setLogValue] = React.useState('');
  const [milestoneVisible, setMilestoneVisible] = React.useState(false);
  const [milestoneKpiId, setMilestoneKpiId] = React.useState<string>('');
  const [milestoneDate, setMilestoneDate] = React.useState(isoDate(Date.now() + 30 * 86400000));
  const [milestoneValue, setMilestoneValue] = React.useState('');
  const [milestoneDesc, setMilestoneDesc] = React.useState('');
  const tree = useGoalTree(goal?.id);
  if (!goal) return <Screen><SectionHeader title="Goal not found" /><Button label="Back" onPress={() => navigation.goBack()} /></Screen>;
  const isTarget = goal.type === 'target';
  const kpis = store.kpis.filter((kpi) => kpi.goalId === goal.id);
  const linkedHabits = store.links.filter((link) => link.goalId === goal.id).map((link) => ({ link, habit: store.habits.find((habit) => habit.id === link.habitId) }));

  const saveKpi = () => {
    if (!kpiName.trim()) return;
    store.createKpi({ goalId: goal.id, name: kpiName.trim(), unit: kpiUnit.trim() || '%', startValue: Number(kpiStart || 0), targetValue: Number(kpiTarget || 100), currentValue: Number(kpiStart || 0) });
    setKpiName(''); setKpiUnit(''); setKpiStart('0'); setKpiTarget('100'); setAddKpiVisible(false);
  };

  const submitLog = () => {
    if (logKpiId) store.logKpi(logKpiId, Number(logValue || 0));
    setLogKpiId(null); setLogValue('');
  };

  const openMilestone = () => {
    if (!kpis.length) return;
    setMilestoneKpiId(kpis[0].id);
    setMilestoneValue(String(kpis[0].targetValue));
    setMilestoneDate(isoDate(Date.now() + 30 * 86400000));
    setMilestoneDesc('');
    setMilestoneVisible(true);
  };

  const saveMilestone = () => {
    if (!milestoneKpiId) return;
    store.createMilestone({ kpiId: milestoneKpiId, targetDate: fromIsoDate(milestoneDate), expectedValue: Number(milestoneValue || 0), description: milestoneDesc.trim() || undefined });
    setMilestoneVisible(false);
  };

  return (
    <Screen>
      <SectionHeader title={goal.title} actionLabel="Edit" onAction={() => navigation.navigate('CreateEditGoal', { goalId: goal.id })} />
      {parentGoal ? <Text style={{ color: theme.colors.textTertiary }}>Sub-goal of {parentGoal.title}</Text> : null}
      <Card>
        <Text style={{ color: theme.colors.textSecondary }}>{formatDate(goal.startDate)} - {formatDate(goal.dueDate)}</Text>
        <Text style={{ color: theme.colors.textPrimary, marginTop: theme.spacing.sm }}>{goal.description}</Text>
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm, marginTop: theme.spacing.sm }}>{goal.tags.map((tag) => <Tag key={tag} label={tag} />)}</View>
      </Card>

      {isTarget ? (
        <>
          <SectionHeader title="KPIs" actionLabel="Add KPI" onAction={() => setAddKpiVisible(true)} />
          {kpis.length ? (
            <KPISection
              kpis={kpis}
              onAnalytics={(kpiId) => navigation.navigate('KPIAnalytics', { kpiId, kpiType: 'goal' })}
              onLog={(kpiId) => { setLogKpiId(kpiId); setLogValue(String(kpis.find((k) => k.id === kpiId)?.currentValue ?? '')); }}
            />
          ) : <Card><Text style={{ color: theme.colors.textSecondary }}>No KPIs yet. Add one to make this goal measurable.</Text></Card>}
          <SectionHeader title="Milestones" actionLabel={kpis.length ? 'Add' : undefined} onAction={kpis.length ? openMilestone : undefined} />
          <MilestoneList milestones={store.milestones.filter((m) => kpis.some((k) => k.id === m.kpiId))} />
        </>
      ) : (
        <Card><Text style={{ color: theme.colors.textSecondary }}>This is an outcome goal — progress is tracked by its status (set below), not by a metric.</Text></Card>
      )}

      <SectionHeader title="Sub-goals" actionLabel="Add" onAction={() => navigation.navigate('CreateEditGoal', { parentGoalId: goal.id })} />
      <GoalTree nodes={tree} onOpen={(goalId) => navigation.navigate('GoalDetail', { goalId })} />
      <SectionHeader title="Supporting Habits" />
      {linkedHabits.length ? linkedHabits.map(({ link, habit }) => (
        <Pressable key={link.id} onPress={() => habit && navigation.navigate('HabitDetail', { habitId: habit.id })}>
          <Card style={{ gap: theme.spacing.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.sm }}>
              <Text style={{ color: theme.colors.textPrimary, fontWeight: '800', flex: 1 }}>{habit?.title ?? 'Missing habit'}</Text>
              <Tag label={link.importance} tone={link.importance === 'critical' ? 'danger' : link.importance === 'important' ? 'warning' : 'info'} />
            </View>
            {habit ? <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>{frequencyLabel(habit)}</Text> : null}
          </Card>
        </Pressable>
      )) : <Card><Text style={{ color: theme.colors.textSecondary }}>No linked habits yet. Link habits from the habit editor.</Text></Card>}
      <SectionHeader title="Notes" />
      <Input label="Add note" value={note} onChangeText={setNote} multiline />
      <Button label="Save note" onPress={() => { if (note.trim()) { store.addGoalNote(goal.id, note); setNote(''); } }} />
      {store.notes.filter((item) => item.goalId === goal.id).map((item) => <Card key={item.id}><Text style={{ color: theme.colors.textPrimary }}>{item.content}</Text><Text style={{ color: theme.colors.textTertiary }}>{formatDate(item.noteDate)}</Text></Card>)}
      <SectionHeader title="Status" />
      <Select label="Goal status" value={goal.status} options={STATUS_OPTIONS} onChange={(status) => { store.updateGoal(goal.id, { status }); void syncScheduledNotifications(); }} />
      <Button label="Delete goal" variant="danger" onPress={() => { store.deleteGoal(goal.id); void syncScheduledNotifications(); navigation.goBack(); }} />

      <BottomSheet visible={addKpiVisible} onClose={() => setAddKpiVisible(false)}>
        <SectionHeader title="Add KPI" />
        <Input label="Name" value={kpiName} onChangeText={setKpiName} placeholder="Revenue, Weight, Books read" />
        <Input label="Unit" value={kpiUnit} onChangeText={setKpiUnit} placeholder="%, kg, count" />
        <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
          <View style={{ flex: 1 }}><Input label="Start" value={kpiStart} onChangeText={setKpiStart} keyboardType="numeric" /></View>
          <View style={{ flex: 1 }}><Input label="Target" value={kpiTarget} onChangeText={setKpiTarget} keyboardType="numeric" /></View>
        </View>
        <Button label="Save KPI" onPress={saveKpi} />
        <Button label="Cancel" variant="ghost" onPress={() => setAddKpiVisible(false)} />
      </BottomSheet>

      <BottomSheet visible={logKpiId !== null} onClose={() => setLogKpiId(null)}>
        <SectionHeader title="Log value" />
        <Input label="Value" value={logValue} onChangeText={setLogValue} keyboardType="numeric" />
        <Button label="Save" onPress={submitLog} />
        <Button label="Cancel" variant="ghost" onPress={() => setLogKpiId(null)} />
      </BottomSheet>

      <BottomSheet visible={milestoneVisible} onClose={() => setMilestoneVisible(false)}>
        <SectionHeader title="Add milestone" />
        {kpis.length > 1 ? <Select label="KPI" value={milestoneKpiId} options={kpis.map((k) => ({ label: k.name, value: k.id }))} onChange={setMilestoneKpiId} /> : null}
        <DatePicker label="Target date" value={milestoneDate} onChange={setMilestoneDate} />
        <Input label="Expected value" value={milestoneValue} onChangeText={setMilestoneValue} keyboardType="numeric" />
        <Input label="Description (optional)" value={milestoneDesc} onChangeText={setMilestoneDesc} />
        <Button label="Save milestone" onPress={saveMilestone} />
        <Button label="Cancel" variant="ghost" onPress={() => setMilestoneVisible(false)} />
      </BottomSheet>
    </Screen>
  );
}
