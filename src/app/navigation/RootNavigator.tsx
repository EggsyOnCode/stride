import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import GoalDetailScreen from '../../features/goals/screens/GoalDetailScreen';
import CreateEditGoalScreen from '../../features/goals/screens/CreateEditGoalScreen';
import HabitDetailScreen from '../../features/habits/screens/HabitDetailScreen';
import CreateEditHabitScreen from '../../features/habits/screens/CreateEditHabitScreen';
import KPIAnalyticsScreen from '../../features/analytics/screens/KPIAnalyticsScreen';
import SettingsScreen from '../../features/settings/screens/SettingsScreen';
import GoalGuideScreen from '../../features/guide/screens/GoalGuideScreen';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const theme = useTheme();
  const navTheme = theme.colors.background === '#0F1117' ? DarkTheme : DefaultTheme;
  return (
    <NavigationContainer theme={{ ...navTheme, colors: { ...navTheme.colors, background: theme.colors.background, card: theme.colors.surfaceElevated, text: theme.colors.textPrimary, border: theme.colors.border, primary: theme.colors.primary } }}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen} />
        <Stack.Screen name="CreateEditGoal" component={CreateEditGoalScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} />
        <Stack.Screen name="CreateEditHabit" component={CreateEditHabitScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="KPIAnalytics" component={KPIAnalyticsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="GoalGuide" component={GoalGuideScreen} options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
