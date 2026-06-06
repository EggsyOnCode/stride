import React from 'react';
import { Text, View } from 'react-native';
import { Card } from '../../../shared/components';
import type { Milestone } from '../../../shared/types/domain';
import { formatShortDate } from '../../../shared/utils/formatters';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function MilestoneList({ milestones }: { milestones: Milestone[] }) {
  const theme = useTheme();
  return <Card style={{ gap: theme.spacing.sm }}>{milestones.length ? milestones.map((m) => <Text key={m.id} style={{ color: theme.colors.textSecondary }}>{formatShortDate(m.targetDate)}: {m.expectedValue} {m.description ?? ''}</Text>) : <Text style={{ color: theme.colors.textSecondary }}>No milestones yet.</Text>}</Card>;
}
