import React from 'react';
import { Alert, Text, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BottomSheet, Button, Card, Input, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { useKPIAnalytics } from '../hooks/useKPIAnalytics';
import { useHabitKPIAnalytics } from '../hooks/useHabitKPIAnalytics';
import { KPIChart } from '../components/KPIChart';
import { StatsPanel } from '../components/StatsPanel';
import { AdjustmentHistory } from '../components/AdjustmentHistory';
import { exportKpiCsv } from '../../../shared/utils/backup';

export default function KPIAnalyticsScreen() {
  const route = useRoute() as { params: { kpiId: string; kpiType?: 'goal' | 'habit' } };
  if (route.params.kpiType === 'habit') return <HabitKPIAnalytics kpiId={route.params.kpiId} />;
  return <GoalKPIAnalytics kpiId={route.params.kpiId} />;
}

function GoalKPIAnalytics({ kpiId }: { kpiId: string }) {
  const navigation = useNavigation();
  const data = useKPIAnalytics(kpiId);
  const adjustKpiTarget = useAppStore((s) => s.adjustKpiTarget);
  const [targetOpen, setTargetOpen] = React.useState(false);
  const [newTarget, setNewTarget] = React.useState('');
  const [reason, setReason] = React.useState('');

  if (!data.kpi) return <Screen><SectionHeader title="KPI not found" /><Button label="Back" onPress={() => navigation.goBack()} /></Screen>;

  const openTarget = () => { setNewTarget(String(data.kpi!.targetValue)); setReason(''); setTargetOpen(true); };
  const saveTarget = () => {
    const value = Number(newTarget);
    if (!Number.isFinite(value)) { Alert.alert('Enter a valid number'); return; }
    adjustKpiTarget(data.kpi!.id, value, reason.trim() || undefined);
    setTargetOpen(false);
  };

  return (
    <Screen>
      <SectionHeader title={data.kpi.name} actionLabel="Back" onAction={() => navigation.goBack()} />
      <KPIChart logs={data.logs} milestones={data.milestones} />
      <StatsPanel stats={data.stats} />
      <Button label="Change target" onPress={openTarget} />
      <SectionHeader title="Target History" />
      <AdjustmentHistory adjustments={data.adjustments} />
      <Button label="Export CSV" variant="secondary" onPress={async () => { const uri = await exportKpiCsv(data.kpi!, data.logs); Alert.alert('CSV exported', uri); }} />

      <BottomSheet visible={targetOpen} onClose={() => setTargetOpen(false)}>
        <SectionHeader title="Change target" />
        <Input label={`New target (${data.kpi.unit})`} value={newTarget} onChangeText={setNewTarget} keyboardType="numeric" />
        <Input label="Reason (optional)" value={reason} onChangeText={setReason} placeholder="Why is the target changing?" />
        <Button label="Save target" onPress={saveTarget} />
        <Button label="Cancel" variant="ghost" onPress={() => setTargetOpen(false)} />
      </BottomSheet>
    </Screen>
  );
}

function HabitKPIAnalytics({ kpiId }: { kpiId: string }) {
  const navigation = useNavigation();
  const theme = useTheme();
  const data = useHabitKPIAnalytics(kpiId);

  if (!data.kpi) return <Screen><SectionHeader title="KPI not found" /><Button label="Back" onPress={() => navigation.goBack()} /></Screen>;

  const completionRow = (
    <Card style={{ gap: theme.spacing.sm }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.textSecondary }}>Logged days</Text><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{data.loggedDays}</Text></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.textSecondary }}>Completed days</Text><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{data.completedDays}</Text></View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.textSecondary }}>Completion rate</Text><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{Math.round(data.completionRate * 100)}%</Text></View>
    </Card>
  );

  return (
    <Screen>
      <SectionHeader title={data.kpi.name} actionLabel="Back" onAction={() => navigation.goBack()} />
      <Text style={{ color: theme.colors.textSecondary }}>{data.measured ? `Measured habit · target ${data.kpi.targetValue ?? '-'} ${data.kpi.unit}` : 'Binary habit · done / not done'}</Text>
      <KPIChart logs={data.points} milestones={[]} />
      {data.measured ? <StatsPanel stats={data.stats} /> : null}
      {completionRow}
    </Screen>
  );
}
