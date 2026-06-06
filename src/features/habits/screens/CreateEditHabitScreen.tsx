import React from 'react';
import { Alert, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, Card, DatePicker, EndDatePicker, Input, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { fromIsoDate, isoDate } from '../../../shared/utils/formatters';
import type { FrequencyUnit, Importance, TrackingType } from '../../../shared/types/domain';
import { syncScheduledNotifications } from '../../../shared/hooks/useNotifications';
import { FrequencyPicker } from '../components/FrequencyPicker';

type Params = { params?: { habitId?: string } };
type LinkChoice = Importance | 'none';

const IMPORTANCE_OPTIONS: Importance[] = ['critical', 'important', 'supporting'];

export default function CreateEditHabitScreen() {
  const navigation = useNavigation();
  const route = useRoute() as Params;
  const theme = useTheme();
  const store = useAppStore();
  const existing = store.habits.find((habit) => habit.id === route.params?.habitId);
  const existingKpi = store.habitKpis.find((kpi) => kpi.habitId === existing?.id);
  const [title, setTitle] = React.useState(existing?.title ?? '');
  const [description, setDescription] = React.useState(existing?.description ?? '');
  const [frequencyCount, setFrequencyCount] = React.useState(String(existing?.frequencyCount ?? 1));
  const [frequencyUnit, setFrequencyUnit] = React.useState<FrequencyUnit>(existing?.frequencyUnit ?? 'day');
  const [reminderTime, setReminderTime] = React.useState(existing?.reminderTime ?? store.settings.habitReminderTime);
  const [startDate, setStartDate] = React.useState(isoDate(existing?.startDate ?? Date.now()));
  const [endDate, setEndDate] = React.useState<number | undefined>(existing?.targetEndDate);
  const [tags, setTags] = React.useState(existing?.tags.join(', ') ?? '');
  const [trackingType, setTrackingType] = React.useState<TrackingType>(existingKpi?.trackingType ?? 'binary');
  const [kpiName, setKpiName] = React.useState(existingKpi?.name ?? 'Completion');
  const [unit, setUnit] = React.useState(existingKpi?.unit ?? (existingKpi?.trackingType === 'measured' ? 'units' : 'done'));
  const [targetValue, setTargetValue] = React.useState(String(existingKpi?.targetValue ?? 1));

  const initialLinks = React.useMemo<Record<string, LinkChoice>>(() => {
    const map: Record<string, LinkChoice> = {};
    if (existing) for (const link of store.links.filter((item) => item.habitId === existing.id)) map[link.goalId] = link.importance;
    return map;
  }, [existing, store.links]);
  const [goalLinks, setGoalLinks] = React.useState<Record<string, LinkChoice>>(initialLinks);

  const cycleImportance = (goalId: string) => {
    setGoalLinks((state) => {
      const current = state[goalId] ?? 'none';
      const order: LinkChoice[] = ['none', 'critical', 'important', 'supporting'];
      const next = order[(order.indexOf(current) + 1) % order.length];
      return { ...state, [goalId]: next };
    });
  };

  const syncLinks = (habitId: string) => {
    for (const goal of store.goals) {
      const choice = goalLinks[goal.id] ?? 'none';
      const already = store.links.find((link) => link.habitId === habitId && link.goalId === goal.id);
      if (choice === 'none') {
        if (already) store.unlinkHabitFromGoal(goal.id, habitId);
      } else if (already) {
        if (already.importance !== choice) { store.unlinkHabitFromGoal(goal.id, habitId); store.linkHabitToGoal(goal.id, habitId, choice); }
      } else {
        store.linkHabitToGoal(goal.id, habitId, choice);
      }
    }
  };

  const save = () => {
    if (!title.trim()) { Alert.alert('Title required'); return; }
    const habitPayload = {
      title,
      description,
      frequencyUnit,
      frequencyCount: Math.max(1, Number(frequencyCount || 1)),
      reminderTime,
      startDate: fromIsoDate(startDate),
      targetEndDate: endDate,
      status: existing?.status ?? ('active' as const),
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
    };
    let habitId = existing?.id;
    if (existing) {
      store.updateHabit(existing.id, habitPayload);
    } else {
      const created = store.createHabit(habitPayload, { name: kpiName, unit, trackingType, targetValue: trackingType === 'measured' ? Number(targetValue || 1) : 1, targetUnit: unit });
      habitId = created.id;
    }
    if (habitId) syncLinks(habitId);
    void syncScheduledNotifications();
    navigation.goBack();
  };

  return (
    <Screen>
      <SectionHeader title={existing ? 'Edit Habit' : 'Create Habit'} />
      <Input label="Title" value={title} onChangeText={setTitle} />
      <Input label="Description" value={description} onChangeText={setDescription} multiline />
      <FrequencyPicker count={frequencyCount} unit={frequencyUnit} onChangeCount={setFrequencyCount} onChangeUnit={setFrequencyUnit} />
      <Input label="Reminder time" value={reminderTime} onChangeText={setReminderTime} placeholder="09:00" />
      <DatePicker label="Start date" value={startDate} onChange={setStartDate} />
      <EndDatePicker label="End date" startMs={fromIsoDate(startDate)} value={endDate} onChange={setEndDate} allowNone />
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <Button label="Binary" variant={trackingType === 'binary' ? 'primary' : 'secondary'} onPress={() => setTrackingType('binary')} style={{ flex: 1 }} />
        <Button label="Measured" variant={trackingType === 'measured' ? 'primary' : 'secondary'} onPress={() => setTrackingType('measured')} style={{ flex: 1 }} />
      </View>
      <Input label="KPI name" value={kpiName} onChangeText={setKpiName} />
      <Input label="Unit" value={unit} onChangeText={setUnit} />
      {trackingType === 'measured' ? <Input label="Target" value={targetValue} onChangeText={setTargetValue} keyboardType="numeric" /> : null}
      <Input label="Tags" value={tags} onChangeText={setTags} />
      <SectionHeader title="Link to Goals" />
      <Card style={{ gap: theme.spacing.sm }}>
        {store.goals.length ? store.goals.map((goal) => {
          const choice = goalLinks[goal.id] ?? 'none';
          return (
            <View key={goal.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
              <Text style={{ color: theme.colors.textPrimary, flex: 1 }}>{goal.title}</Text>
              <Button
                label={choice === 'none' ? 'Not linked' : choice}
                variant={choice === 'none' ? 'secondary' : 'primary'}
                onPress={() => cycleImportance(goal.id)}
              />
            </View>
          );
        }) : <Text style={{ color: theme.colors.textSecondary }}>Create a goal first to link this habit.</Text>}
        <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm }}>Tap to cycle: not linked → {IMPORTANCE_OPTIONS.join(' → ')}.</Text>
      </Card>
      <Button label="Save" onPress={save} />
      <Button label="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
