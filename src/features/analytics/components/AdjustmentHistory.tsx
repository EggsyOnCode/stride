import React from 'react';
import { Text } from 'react-native';
import { Card } from '../../../shared/components';
import type { KPIAdjustment } from '../../../shared/types/domain';
import { formatDate } from '../../../shared/utils/formatters';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function AdjustmentHistory({ adjustments }: { adjustments: KPIAdjustment[] }) {
  const theme = useTheme();
  return <Card style={{ gap: theme.spacing.sm }}>{adjustments.length ? adjustments.map((item) => <Text key={item.id} style={{ color: theme.colors.textSecondary }}>{`${formatDate(item.adjustedAt)}: ${item.previousTargetValue} -> ${item.newTargetValue} ${item.reason ? `(${item.reason})` : ''}`}</Text>) : <Text style={{ color: theme.colors.textSecondary }}>No target changes yet.</Text>}</Card>;
}
