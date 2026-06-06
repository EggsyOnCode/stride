import { useMemo } from 'react';
import { useAppStore } from '../../../shared/hooks/useAppStore';
import type { Goal } from '../../../shared/types/domain';

export interface GoalTreeNode extends Goal { children: GoalTreeNode[] }

function build(goals: Goal[], parentGoalId?: string): GoalTreeNode[] {
  return goals.filter((goal) => goal.parentGoalId === parentGoalId).map((goal) => ({ ...goal, children: build(goals, goal.id) }));
}

export function useGoalTree(rootId?: string) {
  const goals = useAppStore((s) => s.goals);
  return useMemo(() => build(goals, rootId), [goals, rootId]);
}
