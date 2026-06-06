import React from 'react';
import { Text, View } from 'react-native';
import { Button, Card, Input } from '../../../shared/components';
import { useSettings } from '../hooks/useSettings';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function NotificationSettings() {
  const theme = useTheme();
  const { settings, updateSettings } = useSettings();
  return <Card style={{ gap: theme.spacing.sm }}><Text style={{ color: theme.colors.textPrimary, fontWeight: '800' }}>Notifications</Text><Button label={settings.enablePushNotifications ? 'Push enabled' : 'Push disabled'} variant={settings.enablePushNotifications ? 'primary' : 'secondary'} onPress={() => updateSettings({ enablePushNotifications: !settings.enablePushNotifications })} /><Input label="Habit reminder time" value={settings.habitReminderTime} onChangeText={(habitReminderTime) => updateSettings({ habitReminderTime })} /><Input label="Quiet hours start" value={settings.quietHoursStart} onChangeText={(quietHoursStart) => updateSettings({ quietHoursStart })} /><Input label="Quiet hours end" value={settings.quietHoursEnd} onChangeText={(quietHoursEnd) => updateSettings({ quietHoursEnd })} /></Card>;
}
