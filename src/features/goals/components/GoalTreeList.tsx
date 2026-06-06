import React from 'react';
import { Text, View } from 'react-native';
import type { KPI } from '../../../shared/types/domain';
import type { GoalTreeNode } from '../hooks/useGoalTree';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { GoalCard } from './GoalCard';

const MAX_DEPTH = 3;

function countDescendants(node: GoalTreeNode): number {
  return node.children.reduce((sum, child) => sum + 1 + countDescendants(child), 0);
}

export function GoalTreeList({ nodes, kpis, onOpen }: { nodes: GoalTreeNode[]; kpis: KPI[]; onOpen: (goalId: string) => void }) {
  const theme = useTheme();

  const renderNode = (node: GoalTreeNode, depth: number): React.ReactNode => (
    <View key={node.id} style={{ marginLeft: depth > 1 ? theme.spacing.lg : 0, gap: theme.spacing.sm }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.xs }}>
        {depth > 1 ? <Text style={{ color: theme.colors.textTertiary, fontWeight: '800', marginTop: theme.spacing.sm }}>{'→'.repeat(depth - 1)}</Text> : null}
        <View style={{ flex: 1 }}>
          <GoalCard goal={node} kpis={kpis} onPress={() => onOpen(node.id)} />
        </View>
      </View>
      {node.children.length
        ? depth < MAX_DEPTH
          ? node.children.map((child) => renderNode(child, depth + 1))
          : (
            <Text style={{ color: theme.colors.textTertiary, fontSize: theme.typography.sizes.sm, marginLeft: theme.spacing.lg }}>
              ↳ {countDescendants(node)} more sub-goal{countDescendants(node) === 1 ? '' : 's'} — open to view
            </Text>
          )
        : null}
    </View>
  );

  return <View style={{ gap: theme.spacing.md }}>{nodes.map((node) => renderNode(node, 1))}</View>;
}
