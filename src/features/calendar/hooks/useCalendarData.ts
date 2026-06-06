import { useMemo } from 'react';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import { complianceForDay, isHabitDueOn } from '../../../shared/utils/calculations';
import { fromIsoDate, startOfDayMs } from '../../../shared/utils/formatters';

export function useCalendarData(dateIso?: string) {
  const selectedDate = useAppStore((s) => dateIso ?? s.selectedDate);
  const goals = useAppStore((s) => s.goals);
  const habits = useAppStore((s) => s.habits);
  const habitKpis = useAppStore((s) => s.habitKpis);
  const habitLogs = useAppStore((s) => s.habitKpiLogs);
  const links = useAppStore((s) => s.links);
  const selectedDayMs = fromIsoDate(selectedDate);
  return useMemo(() => {
    const todayHabits = habits.filter((habit) => isHabitDueOn(habit, selectedDayMs));
    const upcomingDeadlines = goals.filter((goal) => goal.dueDate >= startOfDayMs() && goal.dueDate <= startOfDayMs() + 7 * 86400000 && !['completed', 'abandoned'].includes(goal.status));
    const compliance = complianceForDay(selectedDayMs, habits, habitKpis, habitLogs);
    return { selectedDate, selectedDayMs, todayHabits, upcomingDeadlines, compliance, goals, habits, habitKpis, habitLogs, links };
  }, [goals, habitKpis, habitLogs, habits, links, selectedDate, selectedDayMs]);
}
