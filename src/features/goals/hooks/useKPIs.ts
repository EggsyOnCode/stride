import { useAppStore } from '../../../shared/hooks/useAppStore';

export function useKPIs(goalId?: string) {
  const allKpis = useAppStore((s) => s.kpis);
  const logs = useAppStore((s) => s.kpiLogs);
  const adjustments = useAppStore((s) => s.kpiAdjustments);
  const milestones = useAppStore((s) => s.milestones);
  const createKpi = useAppStore((s) => s.createKpi);
  const logKpi = useAppStore((s) => s.logKpi);
  const adjustKpiTarget = useAppStore((s) => s.adjustKpiTarget);
  const createMilestone = useAppStore((s) => s.createMilestone);
  const kpis = goalId ? allKpis.filter((kpi) => kpi.goalId === goalId) : allKpis;
  return { kpis, logs, adjustments, milestones, createKpi, logKpi, adjustKpiTarget, createMilestone };
}
