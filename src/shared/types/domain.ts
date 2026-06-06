export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'abandoned';
export type HabitStatus = 'active' | 'paused' | 'abandoned';
export type GoalType = 'outcome' | 'target';
export type TrackingType = 'binary' | 'measured';
export type HabitFrequency = 'daily' | 'weekly' | 'custom';
export type FrequencyUnit = 'hour' | 'day' | 'week';
export type Importance = 'critical' | 'important' | 'supporting';
export type ThemeSetting = 'light' | 'dark' | 'system';
export type DefaultView = 'day' | 'week' | 'month' | 'year';

export interface BaseEntity {
  id: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
}

export interface Goal extends BaseEntity {
  title: string;
  description?: string;
  parentGoalId?: string;
  startDate: number;
  dueDate: number;
  status: GoalStatus;
  type: GoalType;
  tags: string[];
}

export interface KPI extends BaseEntity {
  goalId: string;
  name: string;
  unit: string;
  description?: string;
  startValue: number;
  targetValue: number;
  currentValue?: number;
}

export interface KPILog extends BaseEntity {
  kpiId: string;
  logDate: number;
  value: number;
  note?: string;
}

export interface KPIAdjustment extends BaseEntity {
  kpiId: string;
  previousTargetValue: number;
  newTargetValue: number;
  reason?: string;
  adjustedAt: number;
}

export interface Milestone extends BaseEntity {
  kpiId: string;
  targetDate: number;
  expectedValue: number;
  description?: string;
}

export interface Habit extends BaseEntity {
  title: string;
  description?: string;
  frequencyUnit: FrequencyUnit;
  frequencyCount: number;
  reminderTime?: string;
  startDate: number;
  targetEndDate?: number;
  status: HabitStatus;
  tags: string[];
  // Legacy fields kept optional for backward compatibility with old saved data.
  frequency?: HabitFrequency;
  daysOfWeek?: number[];
  customSchedule?: string;
}

export interface HabitKPI extends BaseEntity {
  habitId: string;
  name: string;
  unit: string;
  description?: string;
  trackingType: TrackingType;
  targetValue?: number;
  targetUnit?: string;
}

export interface HabitKPILog extends BaseEntity {
  habitKpiId: string;
  logDate: number;
  value?: number;
  completed?: boolean;
  note?: string;
  streakActive: boolean;
}

export interface HabitStreak extends BaseEntity {
  habitKpiId: string;
  currentStreakStart: number;
  streakLength: number;
  longestStreakLength: number;
  timesRestarted: number;
}

export interface GoalHabitLink extends BaseEntity {
  goalId: string;
  habitId: string;
  importance: Importance;
  estimatedImpact?: string;
}

export interface GoalNote extends BaseEntity {
  goalId: string;
  content: string;
  noteDate: number;
}

export interface UserSettings extends BaseEntity {
  theme: ThemeSetting;
  enablePushNotifications: boolean;
  enableInappAlerts: boolean;
  habitReminderTime: string;
  quietHoursStart: string;
  quietHoursEnd: string;
  defaultView: DefaultView;
  notificationTypes: Record<string, boolean>;
}

export interface BackupPayload {
  version: 1;
  exportedAt: string;
  userId: 'self';
  data: DomainData;
}

export interface DomainData {
  goals: Goal[];
  kpis: KPI[];
  kpiLogs: KPILog[];
  kpiAdjustments: KPIAdjustment[];
  milestones: Milestone[];
  habits: Habit[];
  habitKpis: HabitKPI[];
  habitKpiLogs: HabitKPILog[];
  habitStreaks: HabitStreak[];
  links: GoalHabitLink[];
  notes: GoalNote[];
  settings: UserSettings;
}
