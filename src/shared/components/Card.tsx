import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme.colors.surfaceElevated, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius.lg, padding: theme.spacing.md, ...theme.shadows.sm }, style]}>{children}</View>;
}
