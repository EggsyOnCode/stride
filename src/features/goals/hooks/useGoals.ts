import { useMemo } from 'react';
import { useAppStore } from '../../../shared/hooks/useAppStore';

export function useGoals() {
  const goals = useAppStore((s) => s.goals);
  const kpis = useAppStore((s) => s.kpis);
  const links = useAppStore((s) => s.links);
  const createGoal = useAppStore((s) => s.createGoal);
  const updateGoal = useAppStore((s) => s.updateGoal);
  const deleteGoal = useAppStore((s) => s.deleteGoal);
  const activeGoals = useMemo(() => goals.filter((goal) => ['not_started', 'in_progress'].includes(goal.status)), [goals]);
  return { goals, activeGoals, kpis, links, createGoal, updateGoal, deleteGoal };
}
