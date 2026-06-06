import { useAppStore } from '../../../shared/hooks/useAppStore';

export function useHabitLogs(habitKpiId?: string) {
  const allLogs = useAppStore((s) => s.habitKpiLogs);
  const logHabitKpi = useAppStore((s) => s.logHabitKpi);
  return { logs: habitKpiId ? allLogs.filter((log) => log.habitKpiId === habitKpiId) : allLogs, logHabitKpi };
}
