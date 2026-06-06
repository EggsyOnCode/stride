import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, ProgressBar, Tag } from '../../../shared/components';
import type { Goal, KPI } from '../../../shared/types/domain';
import { formatShortDate } from '../../../shared/utils/formatters';
import { goalProgress } from '../../../shared/utils/calculations';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { GoalStatusBadge } from './GoalStatusBadge';

export function GoalCard({ goal, kpis, onPress, parentTitle }: { goal: Goal; kpis: KPI[]; onPress: () => void; parentTitle?: string }) {
  const theme = useTheme();
  const isTarget = goal.type === 'target';
  const progress = goalProgress(goal, kpis);
  return (
    <Pressable onPress={onPress}>
      <Card style={{ gap: theme.spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.sm }}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.lg, fontWeight: '800', flex: 1 }}>{goal.title}</Text>
          <GoalStatusBadge status={goal.status} />
        </View>
        {parentTitle ? <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm }}>↳ under {parentTitle}</Text> : null}
        {isTarget ? (
          <>
            <Text style={{ color: theme.colors.textSecondary }}>Due {formatShortDate(goal.dueDate)} · {Math.round(progress)}%</Text>
            <ProgressBar value={progress} />
          </>
        ) : (
          <Text style={{ color: theme.colors.textSecondary }}>Outcome · due {formatShortDate(goal.dueDate)}</Text>
        )}
        {goal.tags.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.xs }}>{goal.tags.map((tag) => <Tag key={tag} label={tag} />)}</View> : null}
      </Card>
    </Pressable>
  );
}
