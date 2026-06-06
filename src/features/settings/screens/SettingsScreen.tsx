import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';
import { useSettings } from '../hooks/useSettings';
import { NotificationSettings } from '../components/NotificationSettings';
import { BackupSection } from '../components/BackupSection';
import { rescheduleAllNotifications, sendTestNotification } from '../../../shared/hooks/useNotifications';
import { useAppStore } from '../../../shared/hooks/useAppStore';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  const store = useAppStore();
  return <Screen><SectionHeader title="Settings" actionLabel="Done" onAction={() => navigation.goBack()} /><Card style={{ gap: theme.spacing.sm }}>{(['system', 'light', 'dark'] as const).map((item) => <Button key={item} label={item} variant={settings.theme === item ? 'primary' : 'secondary'} onPress={() => updateSettings({ theme: item })} />)}</Card><Card style={{ gap: theme.spacing.sm }}>{(['day', 'week', 'month', 'year'] as const).map((item) => <Button key={item} label={`Default: ${item}`} variant={settings.defaultView === item ? 'primary' : 'secondary'} onPress={() => updateSettings({ defaultView: item })} />)}</Card><NotificationSettings /><Button label="Reschedule notifications" onPress={() => void rescheduleAllNotifications(store.habits, store.goals, store.settings)} /><Button label="Send test notification" variant="secondary" onPress={() => void sendTestNotification()} /><BackupSection /></Screen>;
}
