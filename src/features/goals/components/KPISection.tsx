import React from 'react';
import { Text, View } from 'react-native';
import { Button, Card, ProgressBar } from '../../../shared/components';
import type { KPI } from '../../../shared/types/domain';
import { kpiProgress } from '../../../shared/utils/calculations';
import { formatNumber } from '../../../shared/utils/formatters';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function KPISection({ kpis, onAnalytics, onLog }: { kpis: KPI[]; onAnalytics: (kpiId: string) => void; onLog: (kpiId: string) => void }) {
  const theme = useTheme();
  return <View style={{ gap: theme.spacing.sm }}>{kpis.map((kpi) => <Card key={kpi.id} style={{ gap: theme.spacing.sm }}><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{kpi.name}</Text><Text style={{ color: theme.colors.textSecondary }}>{formatNumber(kpi.currentValue ?? kpi.startValue)} / {formatNumber(kpi.targetValue)} {kpi.unit}</Text><ProgressBar value={kpiProgress(kpi)} /><View style={{ flexDirection: 'row', gap: theme.spacing.sm }}><Button label="Log" onPress={() => onLog(kpi.id)} /><Button label="Analytics" variant="secondary" onPress={() => onAnalytics(kpi.id)} /></View></Card>)}</View>;
}
