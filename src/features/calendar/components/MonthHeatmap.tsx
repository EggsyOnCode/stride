import React from 'react';
import { Calendar, DateData } from 'react-native-calendars';
import { useTheme } from '../../../shared/theme/ThemeProvider';

export function MonthHeatmap({ markedDates, onDayPress }: { markedDates: Record<string, { selected?: boolean; marked?: boolean; dotColor?: string; selectedColor?: string }>; onDayPress: (date: string) => void }) {
  const theme = useTheme();
  return <Calendar markedDates={markedDates} onDayPress={(day: DateData) => onDayPress(day.dateString)} theme={{ calendarBackground: theme.colors.background, dayTextColor: theme.colors.textPrimary, monthTextColor: theme.colors.textPrimary, textDisabledColor: theme.colors.textTertiary, arrowColor: theme.colors.primary, todayTextColor: theme.colors.primary }} />;
}
