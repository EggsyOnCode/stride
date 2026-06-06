import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DayScreen from '../../features/calendar/screens/DayScreen';
import WeekScreen from '../../features/calendar/screens/WeekScreen';
import MonthScreen from '../../features/calendar/screens/MonthScreen';
import YearScreen from '../../features/calendar/screens/YearScreen';
import GoalsScreen from '../../features/goals/screens/YearScreen';
import { useTheme } from '../../shared/theme/ThemeProvider';
import type { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabNavigator() {
  const theme = useTheme();
  const icon = (name: IconName) => ({ color, size }: { color: string; size: number }) => <Ionicons name={name} size={size} color={color} />;
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: theme.colors.primary, tabBarInactiveTintColor: theme.colors.textTertiary, tabBarStyle: { backgroundColor: theme.colors.surfaceElevated, borderTopColor: theme.colors.border } }}>
      <Tab.Screen name="Day" component={DayScreen} options={{ tabBarIcon: icon('today-outline') }} />
      <Tab.Screen name="Week" component={WeekScreen} options={{ tabBarIcon: icon('calendar-outline') }} />
      <Tab.Screen name="Month" component={MonthScreen} options={{ tabBarIcon: icon('grid-outline') }} />
      <Tab.Screen name="Year" component={YearScreen} options={{ tabBarIcon: icon('albums-outline') }} />
      <Tab.Screen name="Goals" component={GoalsScreen} options={{ tabBarIcon: icon('flag-outline') }} />
    </Tab.Navigator>
  );
}
