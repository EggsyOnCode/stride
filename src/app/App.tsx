import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';
import { ThemeProvider, useTheme } from '../shared/theme/ThemeProvider';
import RootNavigator from './navigation/RootNavigator';
import { createNotificationChannel, registerBackgroundNotificationHandler, syncScheduledNotifications } from '../shared/hooks/useNotifications';

function AppShell() {
  const theme = useTheme();
  useEffect(() => {
    registerBackgroundNotificationHandler();
    void (async () => {
      await createNotificationChannel();
      await syncScheduledNotifications();
    })();
  }, []);
  return <><RootNavigator /><StatusBar style={theme.colors.background === '#0F1117' ? 'light' : 'dark'} /><Toast /></>;
}

export default function App() {
  return <GestureHandlerRootView style={{ flex: 1 }}><ThemeProvider><AppShell /></ThemeProvider></GestureHandlerRootView>;
}
