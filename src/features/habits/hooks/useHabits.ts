import { useAppStore } from '../../../shared/hooks/useAppStore';

export function useHabits() {
  const habits = useAppStore((s) => s.habits);
  const habitKpis = useAppStore((s) => s.habitKpis);
  const links = useAppStore((s) => s.links);
  const createHabit = useAppStore((s) => s.createHabit);
  const updateHabit = useAppStore((s) => s.updateHabit);
  const deleteHabit = useAppStore((s) => s.deleteHabit);
  const linkHabitToGoal = useAppStore((s) => s.linkHabitToGoal);
  const unlinkHabitFromGoal = useAppStore((s) => s.unlinkHabitFromGoal);
  return { habits, activeHabits: habits.filter((h) => h.status === 'active'), habitKpis, links, createHabit, updateHabit, deleteHabit, linkHabitToGoal, unlinkHabitFromGoal };
}
