import React from 'react';
import { Text, View } from 'react-native';
import { Button, Card } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import type { GoalTreeNode } from '../hooks/useGoalTree';

export function GoalTree({ nodes, onOpen }: { nodes: GoalTreeNode[]; onOpen: (goalId: string) => void }) {
  const theme = useTheme();
  const renderNode = (node: GoalTreeNode, depth: number) => <View key={node.id} style={{ marginLeft: depth * theme.spacing.md, gap: theme.spacing.xs }}><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>{node.title}</Text><Button label="Open" variant="ghost" onPress={() => onOpen(node.id)} />{node.children.map((child) => renderNode(child, depth + 1))}</View>;
  return <Card style={{ gap: theme.spacing.sm }}>{nodes.length ? nodes.map((node) => renderNode(node, 0)) : <Text style={{ color: theme.colors.textSecondary }}>No sub-goals yet.</Text>}</Card>;
}
