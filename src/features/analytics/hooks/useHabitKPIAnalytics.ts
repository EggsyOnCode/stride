import { useMemo } from 'react';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { isHabitLogComplete, trendForLogs } from '../../../shared/utils/calculations';

export function useHabitKPIAnalytics(habitKpiId: string) {
  const habitKpis = useAppStore((s) => s.habitKpis);
  const habitKpiLogs = useAppStore((s) => s.habitKpiLogs);
  return useMemo(() => {
    const kpi = habitKpis.find((item) => item.id === habitKpiId);
    const logs = habitKpiLogs.filter((log) => log.habitKpiId === habitKpiId).sort((a, b) => a.logDate - b.logDate);
    const measured = kpi?.trackingType === 'measured';
    // For the chart: measured plots the logged value, binary plots completion as 0/1 over time.
    const points = logs.map((log) => ({ id: log.id, logDate: log.logDate, value: measured ? (log.value ?? 0) : (log.completed ? 1 : 0) }));
    const values = points.map((point) => point.value);
    const avg = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const avgImprovement = values.length > 1 ? (values[values.length - 1] - values[0]) / (values.length - 1) : 0;
    const loggedDays = logs.length;
    const completedDays = kpi ? logs.filter((log) => isHabitLogComplete(log, kpi)).length : 0;
    const completionRate = loggedDays ? completedDays / loggedDays : 0;
    const stats = {
      current: values.length ? values[values.length - 1] : 0,
      target: kpi?.targetValue ?? 0,
      avg,
      avgImprovement,
      trend: trendForLogs(points),
    };
    return { kpi, measured, points, stats, loggedDays, completedDays, completionRate };
  }, [habitKpiId, habitKpis, habitKpiLogs]);
}
