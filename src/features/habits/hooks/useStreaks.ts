import { useAppStore } from '../../../shared/hooks/useAppStore';

export function useStreaks(habitKpiId?: string) {
  const streaks = useAppStore((s) => s.habitStreaks);
  const restartStreak = useAppStore((s) => s.restartStreak);
  return { streaks: habitKpiId ? streaks.filter((streak) => streak.habitKpiId === habitKpiId) : streaks, restartStreak };
}
