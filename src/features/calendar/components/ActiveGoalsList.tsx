import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, ProgressBar, Tag } from '../../../shared/components';
import type { Goal, KPI } from '../../../shared/types/domain';
import { goalProgress } from '../../../shared/utils/calculations';
import { formatShortDate } from '../../../shared/utils/formatters';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function ActiveGoalsList({ goals, allGoals, kpis, onOpen }: { goals: Goal[]; allGoals: Goal[]; kpis: KPI[]; onOpen: (goalId: string) => void }) {
  const theme = useTheme();
  const parentTitle = (parentGoalId?: string) => allGoals.find((goal) => goal.id === parentGoalId)?.title;
  if (!goals.length) return <Card><Text style={{ color: theme.colors.textSecondary }}>No active goals in this period.</Text></Card>;
  return (
    <View style={{ gap: theme.spacing.sm }}>
      {goals.map((goal) => {
        const parent = parentTitle(goal.parentGoalId);
        return (
          <Pressable key={goal.id} onPress={() => onOpen(goal.id)}>
            <Card style={{ gap: theme.spacing.xs }}>
              <Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{goal.title}</Text>
              {parent ? <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm }}>↳ under {parent}</Text> : null}
              <Text style={{ color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>{formatShortDate(goal.startDate)} → {formatShortDate(goal.dueDate)}</Text>
              {goal.type === 'target' ? <ProgressBar value={goalProgress(goal, kpis)} /> : <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm }}>Outcome · {goal.status.replace('_', ' ')}</Text>}
              {goal.tags.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>{goal.tags.map((tag) => <Tag key={tag} label={tag} />)}</View> : null}
            </Card>
          </Pressable>
        );
      })}
    </View>
  );
}
