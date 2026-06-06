import { useMemo } from 'react';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { trendForLogs } from '../../../shared/utils/calculations';

export function useKPIAnalytics(kpiId: string) {
  const kpis = useAppStore((s) => s.kpis);
  const logs = useAppStore((s) => s.kpiLogs);
  const milestones = useAppStore((s) => s.milestones);
  const adjustments = useAppStore((s) => s.kpiAdjustments);
  return useMemo(() => {
    const kpi = kpis.find((item) => item.id === kpiId);
    const kpiLogs = logs.filter((log) => log.kpiId === kpiId).sort((a, b) => a.logDate - b.logDate);
    const values = kpiLogs.map((log) => log.value);
    const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    // Average improvement per log entry = total change spread over the number of steps.
    const avgImprovement = values.length > 1 ? (values[values.length - 1] - values[0]) / (values.length - 1) : 0;
    return { kpi, logs: kpiLogs, milestones: milestones.filter((m) => m.kpiId === kpiId), adjustments: adjustments.filter((a) => a.kpiId === kpiId), stats: { current: kpi?.currentValue ?? kpi?.startValue ?? 0, target: kpi?.targetValue ?? 0, avg, avgImprovement, trend: trendForLogs(kpiLogs) } };
  }, [adjustments, kpiId, kpis, logs, milestones]);
}
