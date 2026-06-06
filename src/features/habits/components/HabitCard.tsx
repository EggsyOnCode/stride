import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, Tag } from '../../../shared/components';
import type { Habit } from '../../../shared/types/domain';
import { frequencyLabel } from '../../../shared/utils/calculations';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function HabitCard({ habit, onPress }: { habit: Habit; onPress: () => void }) {
  const theme = useTheme();
  return <Pressable onPress={onPress}><Card style={{ gap: theme.spacing.sm }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.textPrimary, fontWeight: '800', fontSize: theme.typography.sizes.lg }}>{habit.title}</Text><Tag label={frequencyLabel(habit)} /></View><Text style={{ color: theme.colors.textSecondary }}>{habit.description || 'No description'}</Text></Card></Pressable>;
}
