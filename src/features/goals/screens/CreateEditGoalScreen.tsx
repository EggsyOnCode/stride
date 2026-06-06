import React from 'react';
import { Alert, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, DatePicker, EndDatePicker, Input, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { addDuration, fromIsoDate, isoDate } from '../../../shared/utils/formatters';
import type { GoalType } from '../../../shared/types/domain';
import { syncScheduledNotifications } from '../../../shared/hooks/useNotifications';

type Params = { params?: { goalId?: string; parentGoalId?: string } };

export default function CreateEditGoalScreen() {
  const navigation = useNavigation();
  const route = useRoute() as Params;
  const theme = useTheme();
  const goals = useAppStore((s) => s.goals);
  const createGoal = useAppStore((s) => s.createGoal);
  const updateGoal = useAppStore((s) => s.updateGoal);
  const existing = goals.find((goal) => goal.id === route.params?.goalId);
  const parentId = route.params?.parentGoalId ?? existing?.parentGoalId;
  const parentGoal = goals.find((goal) => goal.id === parentId);
  const [title, setTitle] = React.useState(existing?.title ?? '');
  const [description, setDescription] = React.useState(existing?.description ?? '');
  const [startDate, setStartDate] = React.useState(isoDate(existing?.startDate ?? Date.now()));
  const [dueDate, setDueDate] = React.useState<number>(existing?.dueDate ?? addDuration(Date.now(), 30, 'day'));
  const [type, setType] = React.useState<GoalType>(existing?.type ?? 'target');
  const [kpiName, setKpiName] = React.useState('Progress');
  const [unit, setUnit] = React.useState('%');
  const [startValue, setStartValue] = React.useState('0');
  const [target, setTarget] = React.useState('100');
  const [tags, setTags] = React.useState(existing?.tags.join(', ') ?? '');
  const save = () => {
    if (!title.trim()) { Alert.alert('Title required'); return; }
    const payload = { title, description, parentGoalId: parentId, startDate: fromIsoDate(startDate), dueDate, status: existing?.status ?? 'not_started' as const, type, tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean) };
    const start = Number(startValue || 0);
    if (existing) updateGoal(existing.id, payload); else createGoal(payload, type === 'target' ? [{ name: kpiName || 'Progress', unit: unit || '%', startValue: start, targetValue: Number(target || 100), currentValue: start }] : []);
    void syncScheduledNotifications();
    navigation.goBack();
  };
  return (
    <Screen>
      <SectionHeader title={existing ? 'Edit Goal' : 'Create Goal'} />
      {parentGoal ? <Text style={{ color: theme.colors.textTertiary }}>Sub-goal of {parentGoal.title}</Text> : null}
      <Input label="Title" value={title} onChangeText={setTitle} />
      <Input label="Description" value={description} onChangeText={setDescription} multiline />
      <DatePicker label="Start date" value={startDate} onChange={setStartDate} />
      <EndDatePicker label="Due date" startMs={fromIsoDate(startDate)} value={dueDate} onChange={(value) => setDueDate(value ?? addDuration(fromIsoDate(startDate), 30, 'day'))} />
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <Button label="Target" variant={type === 'target' ? 'primary' : 'secondary'} onPress={() => setType('target')} style={{ flex: 1 }} />
        <Button label="Outcome" variant={type === 'outcome' ? 'primary' : 'secondary'} onPress={() => setType('outcome')} style={{ flex: 1 }} />
      </View>
      {type === 'target' && !existing ? (
        <>
          <Input label="KPI name" value={kpiName} onChangeText={setKpiName} />
          <Input label="Unit" value={unit} onChangeText={setUnit} />
          <Input label="Start value" value={startValue} onChangeText={setStartValue} keyboardType="numeric" />
          <Input label="Target value" value={target} onChangeText={setTarget} keyboardType="numeric" />
        </>
      ) : null}
      <Input label="Tags" value={tags} onChangeText={setTags} placeholder="health, learning" />
      <Button label="Save" onPress={save} />
      <Button label="Cancel" variant="ghost" onPress={() => navigation.goBack()} />
    </Screen>
  );
}
