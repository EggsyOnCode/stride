import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function SectionHeader({ title, actionLabel, onAction, secondaryActionLabel, onSecondaryAction }: { title: string; actionLabel?: string; onAction?: () => void; secondaryActionLabel?: string; onSecondaryAction?: () => void }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: theme.spacing.md }}>
      <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.xl, fontWeight: '800', flex: 1 }}>{title}</Text>
      <View style={{ flexDirection: 'row', gap: theme.spacing.md }}>
        {secondaryActionLabel && onSecondaryAction ? <Pressable onPress={onSecondaryAction}><Text style={{ color: theme.colors.primary, fontWeight: '800' }}>{secondaryActionLabel}</Text></Pressable> : null}
        {actionLabel && onAction ? <Pressable onPress={onAction}><Text style={{ color: theme.colors.primary, fontWeight: '800' }}>{actionLabel}</Text></Pressable> : null}
      </View>
    </View>
  );
}
