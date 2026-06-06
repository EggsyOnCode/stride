import React from 'react';
import { Alert, Text } from 'react-native';
import { Button, Card } from '../../../shared/components';
import { useBackup } from '../../../shared/hooks/useBackup';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function BackupSection() {
  const theme = useTheme();
  const { exportBackup, importBackup } = useBackup();
  return <Card style={{ gap: theme.spacing.sm }}><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>Backup & Restore</Text><Button label="Export Backup" onPress={async () => Alert.alert('Backup exported', await exportBackup())} /><Button label="Import Backup" variant="secondary" onPress={async () => { const preview = await importBackup(); if (preview) Alert.alert('Imported', `${preview.goalCount} goals, ${preview.habitCount} habits, ${preview.logCount} logs`); }} /></Card>;
}
