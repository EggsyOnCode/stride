import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function LoadingSpinner() {
  const theme = useTheme();
  return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}><ActivityIndicator color={theme.colors.primary} size="large" /></View>;
}
