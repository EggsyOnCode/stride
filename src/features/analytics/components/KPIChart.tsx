import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import type { Milestone } from '../../../shared/types/domain';
import { formatNumber, formatShortDate } from '../../../shared/utils/formatters';
import { useTheme } from '../../../shared/theme/ThemeProvider';

const W = 320;
const H = 180;
const PAD_X = 8;
const PAD_Y = 12;

type ChartPoint = { id: string; logDate: number; value: number };

export function KPIChart({ logs, milestones }: { logs: ChartPoint[]; milestones: Milestone[] }) {
  const theme = useTheme();
  if (logs.length < 2) return <View style={{ height: 180, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: theme.colors.textSecondary }}>Log at least two values to chart progress.</Text></View>;

  const values = logs.map((log) => log.value);
  const milestoneValues = milestones.map((m) => m.expectedValue);
  const minV = Math.min(...values, ...milestoneValues);
  const maxV = Math.max(...values, ...milestoneValues);
  const rangeV = Math.max(1, maxV - minV);
  const minT = logs[0].logDate;
  const maxT = logs[logs.length - 1].logDate;
  const rangeT = Math.max(1, maxT - minT);

  const x = (t: number) => PAD_X + ((t - minT) / rangeT) * (W - PAD_X * 2);
  const y = (v: number) => PAD_Y + (1 - (v - minV) / rangeV) * (H - PAD_Y * 2);

  const points = logs.map((log) => `${x(log.logDate)},${y(log.value)}`).join(' ');

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <View style={{ flexDirection: 'row' }}>
        <View style={{ justifyContent: 'space-between', paddingVertical: PAD_Y, width: 44 }}>
          <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.xs }}>{formatNumber(maxV)}</Text>
          <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.xs }}>{formatNumber(minV)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
            {milestones.map((m, index) => (
              <Line key={index} x1={PAD_X} y1={y(m.expectedValue)} x2={W - PAD_X} y2={y(m.expectedValue)} stroke={theme.colors.warning} strokeWidth={1} strokeDasharray="4 4" />
            ))}
            <Polyline points={points} fill="none" stroke={theme.colors.primary} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
            {logs.map((log) => <Circle key={log.id} cx={x(log.logDate)} cy={y(log.value)} r={3.5} fill={theme.colors.primary} />)}
          </Svg>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 44 }}>
        <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.xs }}>{formatShortDate(minT)}</Text>
        <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.xs }}>{formatShortDate(maxT)}</Text>
      </View>
      <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.xs, textAlign: 'center' }}>Value over time{milestones.length ? ' · dashed = milestones' : ''}</Text>
    </View>
  );
}
