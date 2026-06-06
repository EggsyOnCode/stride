import notifee, { AndroidImportance, EventType, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';
import type { Goal, Habit, UserSettings } from '../types/domain';
import { useAppStore } from './useAppStore';

const CHANNEL_ID = 'goal-planner';

export async function createNotificationChannel() {
  await notifee.requestPermission();
  await notifee.createChannel({ id: CHANNEL_ID, name: 'Goal Planner', importance: AndroidImportance.HIGH, sound: 'default' });
}

/** Reschedule everything from the latest store state. Safe to call after any create/edit/delete. */
export async function syncScheduledNotifications() {
  const { habits, goals, settings } = useAppStore.getState();
  await rescheduleAllNotifications(habits, goals, settings);
}

/** Fire an immediate notification to confirm permissions + channel are working. */
export async function sendTestNotification() {
  await notifee.requestPermission();
  await notifee.createChannel({ id: CHANNEL_ID, name: 'Goal Planner', importance: AndroidImportance.HIGH, sound: 'default' });
  await notifee.displayNotification({ title: 'Test', body: 'Notifications work', android: { channelId: CHANNEL_ID } });
}

export async function scheduleHabitReminder(habit: Habit, time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  if (date.getTime() < Date.now()) date.setDate(date.getDate() + 1);
  await notifee.createTriggerNotification({ id: `habit-${habit.id}`, title: 'Habit Reminder', body: `Time to: ${habit.title}`, android: { channelId: CHANNEL_ID }, data: { habitId: habit.id, type: 'habit_reminder' } }, { type: TriggerType.TIMESTAMP, timestamp: date.getTime(), repeatFrequency: RepeatFrequency.DAILY } as TimestampTrigger);
}

export async function scheduleGoalDeadline(goal: Goal, daysBefore: number) {
  const date = new Date(goal.dueDate);
  date.setDate(date.getDate() - daysBefore);
  if (date.getTime() < Date.now()) return;
  const label = daysBefore === 0 ? 'Due today' : `Due in ${daysBefore} day${daysBefore === 1 ? '' : 's'}`;
  await notifee.createTriggerNotification({ id: `goal-${goal.id}-${daysBefore}`, title: 'Goal Deadline', body: `${label}: ${goal.title}`, android: { channelId: CHANNEL_ID }, data: { goalId: goal.id, type: 'goal_deadline' } }, { type: TriggerType.TIMESTAMP, timestamp: date.getTime() } as TimestampTrigger);
}

export async function rescheduleAllNotifications(habits: Habit[], goals: Goal[], settings: UserSettings) {
  await notifee.cancelAllNotifications();
  if (!settings.enablePushNotifications) return;
  for (const habit of habits.filter((habit) => habit.status === 'active')) await scheduleHabitReminder(habit, habit.reminderTime ?? settings.habitReminderTime);
  for (const goal of goals.filter((goal) => !['completed', 'abandoned'].includes(goal.status))) for (const days of [7, 3, 1, 0]) await scheduleGoalDeadline(goal, days);
}

export function registerBackgroundNotificationHandler() {
  notifee.onBackgroundEvent(async ({ type }) => {
    if (type === EventType.PRESS) return;
  });
}
