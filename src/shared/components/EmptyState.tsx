import React from 'react';
import { Text, View } from 'react-native';
import { Button } from './Button';
import { useTheme } from '../theme/ThemeProvider';

export function EmptyState({ title, message, actionLabel, onAction }: { title: string; message: string; actionLabel?: string; onAction?: () => void }) {
  const theme = useTheme();
  return <View style={{ padding: theme.spacing.xl, gap: theme.spacing.md, alignItems: 'center' }}><Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.xl, fontWeight: '800', textAlign: 'center' }}>{title}</Text><Text style={{ color: theme.colors.textSecondary, textAlign: 'center' }}>{message}</Text>{actionLabel && onAction ? <Button label={actionLabel} onPress={onAction} /> : null}</View>;
}
