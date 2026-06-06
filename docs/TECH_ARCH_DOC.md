# Goal Planning App — Technical Architecture Document
**Version 1.0 | For Coding Agent Use**

---

## 1. Tech Stack

| Layer | Technology | Version | Reason |
|-------|-----------|---------|--------|
| Framework | React Native | 0.74+ | Cross-platform iOS/Android |
| Language | TypeScript | 5.x | Type safety; required |
| Build system | Expo (bare workflow) | SDK 51+ | Easier APK builds; bare = full native access |
| Database | WatermelonDB + SQLite | 0.27+ | Reactive, offline-first, optimized for complex queries |
| State management | Zustand | 4.x | Lightweight, no boilerplate, easy async |
| Navigation | React Navigation v6 | 6.x | Industry standard; supports deep linking |
| Notifications | react-native-notifee | 7.x | Local OS notifications; no server; iOS + Android |
| Calendar UI | react-native-calendars | 1.x | Flexible calendar component |
| Charts | Victory Native | 36.x | Composable, SVG-based, works with RN |
| File I/O | expo-file-system + expo-document-picker | latest | Export/import backup files |
| Icons | @expo/vector-icons (Ionicons) | latest | 1300+ icons, expo-compatible |
| Toast/Alerts | react-native-toast-message | 2.x | In-app notifications |
| Theming | Custom ThemeProvider (React Context) | — | Full token-based theming |

---

## 2. Project Structure

Strictly feature-based modular structure. Each feature is self-contained (screens, components, hooks, types). Shared code lives in `src/shared/`.

```
/
├── app.json
├── babel.config.js
├── tsconfig.json
├── package.json
│
└── src/
    ├── app/
    │   ├── App.tsx                    # Root: providers, navigation, DB init
    │   └── navigation/
    │       ├── RootNavigator.tsx      # Stack wrapping tabs + modals
    │       ├── TabNavigator.tsx       # Bottom tab bar (Day/Week/Month/Goals)
    │       └── routes.ts              # Route name constants
    │
    ├── features/
    │   ├── goals/
    │   │   ├── screens/
    │   │   │   ├── YearScreen.tsx
    │   │   │   ├── GoalDetailScreen.tsx
    │   │   │   └── CreateEditGoalScreen.tsx
    │   │   ├── components/
    │   │   │   ├── GoalCard.tsx
    │   │   │   ├── GoalTree.tsx
    │   │   │   ├── KPISection.tsx
    │   │   │   ├── MilestoneList.tsx
    │   │   │   └── GoalStatusBadge.tsx
    │   │   ├── hooks/
    │   │   │   ├── useGoals.ts
    │   │   │   ├── useGoalTree.ts
    │   │   │   └── useKPIs.ts
    │   │   └── types.ts
    │   │
    │   ├── habits/
    │   │   ├── screens/
    │   │   │   ├── HabitDetailScreen.tsx
    │   │   │   └── CreateEditHabitScreen.tsx
    │   │   ├── components/
    │   │   │   ├── HabitCard.tsx
    │   │   │   ├── HabitLogRow.tsx
    │   │   │   ├── StreakCounter.tsx
    │   │   │   └── FrequencyPicker.tsx
    │   │   ├── hooks/
    │   │   │   ├── useHabits.ts
    │   │   │   ├── useHabitLogs.ts
    │   │   │   └── useStreaks.ts
    │   │   └── types.ts
    │   │
    │   ├── calendar/
    │   │   ├── screens/
    │   │   │   ├── DayScreen.tsx
    │   │   │   ├── WeekScreen.tsx
    │   │   │   └── MonthScreen.tsx
    │   │   ├── components/
    │   │   │   ├── DayHabitList.tsx
    │   │   │   ├── GoalChainView.tsx
    │   │   │   ├── WeekGrid.tsx
    │   │   │   └── MonthHeatmap.tsx
    │   │   ├── hooks/
    │   │   │   └── useCalendarData.ts
    │   │   └── types.ts
    │   │
    │   ├── analytics/
    │   │   ├── screens/
    │   │   │   └── KPIAnalyticsScreen.tsx
    │   │   ├── components/
    │   │   │   ├── KPIChart.tsx
    │   │   │   ├── StatsPanel.tsx
    │   │   │   └── AdjustmentHistory.tsx
    │   │   └── hooks/
    │   │       └── useKPIAnalytics.ts
    │   │
    │   └── settings/
    │       ├── screens/
    │       │   └── SettingsScreen.tsx
    │       ├── components/
    │       │   ├── NotificationSettings.tsx
    │       │   ├── BackupSection.tsx
    │       │   └── ConflictResolutionModal.tsx
    │       └── hooks/
    │           └── useSettings.ts
    │
    ├── shared/
    │   ├── components/
    │   │   ├── Button.tsx             # Primary, secondary, ghost variants
    │   │   ├── Card.tsx               # Surface card container
    │   │   ├── Input.tsx              # Text input
    │   │   ├── DatePicker.tsx         # Date input
    │   │   ├── Tag.tsx                # Colored tag pill
    │   │   ├── ProgressBar.tsx        # KPI progress bar
    │   │   ├── SectionHeader.tsx      # Section title with optional action
    │   │   ├── EmptyState.tsx         # Empty list placeholder
    │   │   ├── BottomSheet.tsx        # Modal bottom sheet
    │   │   ├── FAB.tsx                # Floating action button
    │   │   └── LoadingSpinner.tsx
    │   │
    │   ├── hooks/
    │   │   ├── useTheme.ts            # Access theme tokens
    │   │   ├── useNotifications.ts    # Schedule/cancel notifications
    │   │   ├── useBackup.ts           # Export/import logic
    │   │   └── useAppStore.ts         # Global Zustand store
    │   │
    │   ├── theme/
    │   │   ├── tokens.ts              # All design tokens (colors, spacing, etc.)
    │   │   ├── lightTheme.ts          # Light mode token values
    │   │   ├── darkTheme.ts           # Dark mode token values
    │   │   └── ThemeProvider.tsx      # Context provider
    │   │
    │   └── utils/
    │       ├── formatters.ts          # Date, number, duration formatting
    │       ├── calculations.ts        # Progress %, streak logic, compliance
    │       ├── validators.ts          # Form validation
    │       └── backup.ts              # Serialize/deserialize backup data
    │
    └── database/
        ├── index.ts                   # WatermelonDB instance
        ├── schema.ts                  # WatermelonDB schema definition
        └── models/
            ├── Goal.ts
            ├── KPI.ts
            ├── KPILog.ts
            ├── KPIAdjustment.ts
            ├── Milestone.ts
            ├── Habit.ts
            ├── HabitKPI.ts
            ├── HabitKPILog.ts
            ├── HabitStreak.ts
            ├── GoalHabitLink.ts
            ├── GoalNote.ts
            ├── Notification.ts
            ├── UserSettings.ts
            └── index.ts              # Export all models + allModels array
```

---

## 3. Database Schema (SQLite via WatermelonDB)

### 3.1 Schema Definition (`src/database/schema.ts`)

```typescript
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'goals',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'parent_goal_id', type: 'string', isOptional: true },
        { name: 'start_date', type: 'number' },
        { name: 'due_date', type: 'number' },
        { name: 'status', type: 'string' },
        { name: 'tags', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'kpis',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'goal_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'unit', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'start_value', type: 'number' },
        { name: 'target_value', type: 'number' },
        { name: 'current_value', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'kpi_logs',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'kpi_id', type: 'string' },
        { name: 'log_date', type: 'number' },
        { name: 'value', type: 'number' },
        { name: 'note', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'kpi_adjustments',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'kpi_id', type: 'string' },
        { name: 'previous_target_value', type: 'number' },
        { name: 'new_target_value', type: 'number' },
        { name: 'reason', type: 'string', isOptional: true },
        { name: 'adjusted_at', type: 'number' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'milestones',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'kpi_id', type: 'string' },
        { name: 'target_date', type: 'number' },
        { name: 'expected_value', type: 'number' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'habits',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'frequency', type: 'string' },
        { name: 'days_of_week', type: 'string', isOptional: true },
        { name: 'custom_schedule', type: 'string', isOptional: true },
        { name: 'reminder_time', type: 'string', isOptional: true },
        { name: 'start_date', type: 'number' },
        { name: 'target_end_date', type: 'number', isOptional: true },
        { name: 'status', type: 'string' },
        { name: 'tags', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'habit_kpis',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'habit_id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'unit', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'tracking_type', type: 'string' },
        { name: 'target_value', type: 'number', isOptional: true },
        { name: 'target_unit', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'habit_kpi_logs',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'habit_kpi_id', type: 'string' },
        { name: 'log_date', type: 'number' },
        { name: 'value', type: 'number', isOptional: true },
        { name: 'completed', type: 'boolean', isOptional: true },
        { name: 'note', type: 'string', isOptional: true },
        { name: 'streak_active', type: 'boolean' },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'habit_streaks',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'habit_kpi_id', type: 'string' },
        { name: 'current_streak_start', type: 'number' },
        { name: 'streak_length', type: 'number' },
        { name: 'longest_streak_length', type: 'number' },
        { name: 'times_restarted', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'goal_habit_links',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'goal_id', type: 'string' },
        { name: 'habit_id', type: 'string' },
        { name: 'importance', type: 'string' },
        { name: 'estimated_impact', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'goal_notes',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'goal_id', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'note_date', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'user_settings',
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'theme', type: 'string' },
        { name: 'enable_push_notifications', type: 'boolean' },
        { name: 'enable_inapp_alerts', type: 'boolean' },
        { name: 'habit_reminder_time', type: 'string' },
        { name: 'quiet_hours_start', type: 'string' },
        { name: 'quiet_hours_end', type: 'string' },
        { name: 'default_view', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
  ],
});
```

### 3.2 WatermelonDB Models (`src/database/models/`)

Each model wraps a table and defines:
- Fields via decorators (`@field`, `@date`, `@readonly`)
- Associations (belongs_to, has_many)
- Helper methods (e.g., `getProgress()`, `getTags()`)

**Sample: Goal model**

```typescript
// src/database/models/Goal.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, lazy } from '@nozbe/watermelondb/decorators';

export default class Goal extends Model {
  static table = 'goals';
  static associations = {
    parent_goal: { type: 'belongs_to', key: 'parent_goal_id', table: 'goals' },
    sub_goals:   { type: 'has_many',  foreignKey: 'parent_goal_id', table: 'goals' },
    kpis:        { type: 'has_many',  foreignKey: 'goal_id', table: 'kpis' },
    notes:       { type: 'has_many',  foreignKey: 'goal_id', table: 'goal_notes' },
    links:       { type: 'has_many',  foreignKey: 'goal_id', table: 'goal_habit_links' },
  };

  @field('user_id')      userId!: string;
  @field('title')        title!: string;
  @field('description')  description?: string;
  @field('parent_goal_id') parentGoalId?: string;
  @date('start_date')    startDate!: Date;
  @date('due_date')      dueDate!: Date;
  @field('status')       status!: GoalStatus;
  @field('tags')         tags!: string;

  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;

  @lazy kpis = this.collections.get<KPI>('kpis').query(Q.where('goal_id', this.id));
  @lazy subGoals = this.collections.get<Goal>('goals').query(Q.where('parent_goal_id', this.id));

  getTags = (): string[] => {
    try { return JSON.parse(this.tags || '[]'); }
    catch { return []; }
  };
}

export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'abandoned';
```

All models follow the same pattern. Define a model file per table. Export all from `models/index.ts`.

### 3.3 Database Initialization (`src/database/index.ts`)

```typescript
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import { allModels } from './models';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'goalplanner',
  jsi: true,           // JSI = faster, native synchronous SQLite
  onSetUpError: error => console.error('DB setup error:', error),
});

export const database = new Database({ adapter, modelClasses: allModels });
```

### 3.4 Data Access Pattern (Hooks)

All database access is through feature hooks. Components never query the database directly.

```typescript
// src/features/goals/hooks/useGoals.ts
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import { useCallback } from 'react';
import Goal from '../../../database/models/Goal';

export function useGoals() {
  const db = useDatabase();

  const getActiveGoals = useCallback(() =>
    db.get<Goal>('goals')
      .query(Q.where('status', Q.oneOf(['not_started', 'in_progress'])))
      .observe(),               // Returns Observable (reactive)
  [db]);

  const getGoalTree = useCallback((rootId?: string) =>
    db.get<Goal>('goals')
      .query(Q.where('parent_goal_id', rootId ?? null))
      .observe(),
  [db]);

  const createGoal = useCallback(async (data: CreateGoalInput) => {
    return db.write(async () => {
      return db.get<Goal>('goals').create(goal => {
        goal.userId = 'self';
        goal.title = data.title;
        goal.description = data.description;
        goal.parentGoalId = data.parentGoalId;
        goal.startDate = data.startDate;
        goal.dueDate = data.dueDate;
        goal.status = 'not_started';
        goal.tags = JSON.stringify(data.tags ?? []);
      });
    });
  }, [db]);

  const updateGoal = useCallback(async (id: string, updates: Partial<CreateGoalInput>) =>
    db.write(async () => {
      const goal = await db.get<Goal>('goals').find(id);
      await goal.update(g => Object.assign(g, updates));
    }), [db]);

  const deleteGoal = useCallback(async (id: string) =>
    db.write(async () => {
      const goal = await db.get<Goal>('goals').find(id);
      await goal.markAsDeleted();
    }), [db]);

  return { getActiveGoals, getGoalTree, createGoal, updateGoal, deleteGoal };
}
```

All mutations go through `database.write()`. All reactive queries return Observables consumed with WatermelonDB's `useObservable()` or the `withObservables` HOC.

---

## 4. Theming System

### 4.1 Design Tokens (`src/shared/theme/tokens.ts`)

All design values are defined once here. Nothing is hardcoded in components.

```typescript
// src/shared/theme/tokens.ts

export interface ThemeTokens {
  // Colors
  colors: {
    primary: string;
    primaryLight: string;
    background: string;
    surface: string;
    surfaceElevated: string;
    border: string;
    borderSubtle: string;

    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    textOnPrimary: string;

    success: string;
    successLight: string;
    warning: string;
    warningLight: string;
    danger: string;
    dangerLight: string;
    info: string;
    infoLight: string;

    // Tag/category colors
    tagHealth: string;
    tagFinance: string;
    tagCareer: string;
    tagPersonal: string;
    tagLearning: string;
    tagSocial: string;
  };

  // Spacing (8px base unit)
  spacing: {
    xs: number;   // 4
    sm: number;   // 8
    md: number;   // 16
    lg: number;   // 24
    xl: number;   // 32
    xxl: number;  // 48
  };

  // Border radius
  radius: {
    sm: number;   // 4
    md: number;   // 8
    lg: number;   // 12
    xl: number;   // 16
    full: number; // 9999
  };

  // Typography
  typography: {
    fontFamily: {
      regular: string;
      medium: string;
      bold: string;
    };
    sizes: {
      xs: number;   // 11
      sm: number;   // 13
      md: number;   // 15
      lg: number;   // 17
      xl: number;   // 20
      xxl: number;  // 24
      display: number; // 30
    };
    lineHeights: {
      tight: number;   // 1.2
      normal: number;  // 1.5
      relaxed: number; // 1.75
    };
  };

  // Shadows (elevation)
  shadows: {
    sm: object;
    md: object;
    lg: object;
  };
}
```

### 4.2 Light Theme (`src/shared/theme/lightTheme.ts`)

```typescript
import { ThemeTokens } from './tokens';

export const lightTheme: ThemeTokens = {
  colors: {
    primary:         '#5B6AF0',
    primaryLight:    '#EEF0FD',
    background:      '#FFFFFF',
    surface:         '#F7F8FC',
    surfaceElevated: '#FFFFFF',
    border:          '#E2E5F0',
    borderSubtle:    '#F0F2F8',

    textPrimary:     '#111827',
    textSecondary:   '#6B7280',
    textTertiary:    '#9CA3AF',
    textOnPrimary:   '#FFFFFF',

    success:         '#22C55E',
    successLight:    '#F0FDF4',
    warning:         '#F59E0B',
    warningLight:    '#FFFBEB',
    danger:          '#EF4444',
    dangerLight:     '#FEF2F2',
    info:            '#3B82F6',
    infoLight:       '#EFF6FF',

    tagHealth:       '#10B981',
    tagFinance:      '#6366F1',
    tagCareer:       '#F59E0B',
    tagPersonal:     '#EC4899',
    tagLearning:     '#8B5CF6',
    tagSocial:       '#14B8A6',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius:  { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  typography: {
    fontFamily: {
      regular: 'System',
      medium:  'System',
      bold:    'System',
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, display: 30 },
    lineHeights: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  },
  shadows: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  },
};
```

### 4.3 Dark Theme (`src/shared/theme/darkTheme.ts`)

```typescript
import { ThemeTokens } from './tokens';

export const darkTheme: ThemeTokens = {
  colors: {
    primary:         '#818CF8',
    primaryLight:    '#1E2054',
    background:      '#0F1117',
    surface:         '#1A1D27',
    surfaceElevated: '#22263A',
    border:          '#2A2D3E',
    borderSubtle:    '#1E2133',

    textPrimary:     '#F1F3F9',
    textSecondary:   '#9CA3AF',
    textTertiary:    '#6B7280',
    textOnPrimary:   '#FFFFFF',

    success:         '#4ADE80',
    successLight:    '#052E16',
    warning:         '#FCD34D',
    warningLight:    '#1C1400',
    danger:          '#F87171',
    dangerLight:     '#2D0000',
    info:            '#60A5FA',
    infoLight:       '#0C1A35',

    tagHealth:       '#34D399',
    tagFinance:      '#818CF8',
    tagCareer:       '#FCD34D',
    tagPersonal:     '#F472B6',
    tagLearning:     '#A78BFA',
    tagSocial:       '#2DD4BF',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius:  { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
  typography: {
    fontFamily: {
      regular: 'System',
      medium:  'System',
      bold:    'System',
    },
    sizes: { xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 24, display: 30 },
    lineHeights: { tight: 1.2, normal: 1.5, relaxed: 1.75 },
  },
  shadows: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 6 },
  },
};
```

### 4.4 ThemeProvider (`src/shared/theme/ThemeProvider.tsx`)

```typescript
import React, { createContext, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeTokens } from './tokens';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';
import { useAppStore } from '../hooks/useAppStore';

const ThemeContext = createContext<ThemeTokens>(lightTheme);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const { themeSetting } = useAppStore();

  const resolvedTheme = (() => {
    if (themeSetting === 'light') return lightTheme;
    if (themeSetting === 'dark') return darkTheme;
    return systemScheme === 'dark' ? darkTheme : lightTheme;
  })();

  return (
    <ThemeContext.Provider value={resolvedTheme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeTokens => useContext(ThemeContext);
```

### 4.5 Using the Theme in Components

```typescript
// Example: Button component
import { useTheme } from '../../shared/theme/ThemeProvider';

export function Button({ label, onPress, variant = 'primary' }) {
  const theme = useTheme();

  const styles = {
    container: {
      backgroundColor: variant === 'primary'
        ? theme.colors.primary
        : theme.colors.surface,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    label: {
      color: variant === 'primary'
        ? theme.colors.textOnPrimary
        : theme.colors.textPrimary,
      fontSize: theme.typography.sizes.md,
    },
  };

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
```

**Rule**: No component ever uses hardcoded color strings, spacing numbers, or font sizes. Everything comes from `useTheme()`.

**To change the color palette**: update `lightTheme.ts` or `darkTheme.ts` only. All components update automatically.

---

## 5. State Management

### 5.1 Architecture: Two-Layer State

- **Persistent state** (database): Goals, habits, KPIs, logs — all in WatermelonDB/SQLite. Queried reactively via hooks.
- **UI state** (Zustand): Current date selection, selected view, theme setting, modals open/closed, loading states, notification preferences in memory.

They do not overlap. Never store DB data in Zustand.

### 5.2 Zustand Store (`src/shared/hooks/useAppStore.ts`)

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppStore {
  // Navigation & view state
  currentView: 'day' | 'week' | 'month' | 'year';
  selectedDate: string;  // ISO date string 'YYYY-MM-DD'
  setCurrentView: (view: AppStore['currentView']) => void;
  setSelectedDate: (date: string) => void;

  // Theme
  themeSetting: 'light' | 'dark' | 'system';
  setThemeSetting: (t: AppStore['themeSetting']) => void;

  // Notification preferences (mirrors UserSettings in DB, cached here)
  enablePush: boolean;
  enableInApp: boolean;
  habitReminderTime: string;
  setNotificationPrefs: (prefs: Partial<Pick<AppStore, 'enablePush' | 'enableInApp' | 'habitReminderTime'>>) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      currentView: 'day',
      selectedDate: new Date().toISOString().split('T')[0],
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedDate: (date) => set({ selectedDate: date }),

      themeSetting: 'system',
      setThemeSetting: (t) => set({ themeSetting: t }),

      enablePush: true,
      enableInApp: true,
      habitReminderTime: '09:00',
      setNotificationPrefs: (prefs) => set(prefs),
    }),
    {
      name: 'app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        themeSetting: state.themeSetting,
        enablePush: state.enablePush,
        enableInApp: state.enableInApp,
        habitReminderTime: state.habitReminderTime,
        currentView: state.currentView,
      }),
    }
  )
);
```

---

## 6. Navigation (`src/app/navigation/`)

### 6.1 Root Navigator

```typescript
// RootNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import GoalDetailScreen from '../../features/goals/screens/GoalDetailScreen';
import CreateEditGoalScreen from '../../features/goals/screens/CreateEditGoalScreen';
import HabitDetailScreen from '../../features/habits/screens/HabitDetailScreen';
import CreateEditHabitScreen from '../../features/habits/screens/CreateEditHabitScreen';
import KPIAnalyticsScreen from '../../features/analytics/screens/KPIAnalyticsScreen';
import SettingsScreen from '../../features/settings/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="GoalDetail" component={GoalDetailScreen}
          options={{ presentation: 'card' }} />
        <Stack.Screen name="CreateEditGoal" component={CreateEditGoalScreen}
          options={{ presentation: 'modal' }} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen}
          options={{ presentation: 'card' }} />
        <Stack.Screen name="CreateEditHabit" component={CreateEditHabitScreen}
          options={{ presentation: 'modal' }} />
        <Stack.Screen name="KPIAnalytics" component={KPIAnalyticsScreen}
          options={{ presentation: 'card' }} />
        <Stack.Screen name="Settings" component={SettingsScreen}
          options={{ presentation: 'modal' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 6.2 Route Constants (`routes.ts`)

```typescript
export const ROUTES = {
  TABS: 'Tabs',
  DAY: 'Day',
  WEEK: 'Week',
  MONTH: 'Month',
  YEAR: 'Year',
  GOAL_DETAIL: 'GoalDetail',
  CREATE_EDIT_GOAL: 'CreateEditGoal',
  HABIT_DETAIL: 'HabitDetail',
  CREATE_EDIT_HABIT: 'CreateEditHabit',
  KPI_ANALYTICS: 'KPIAnalytics',
  SETTINGS: 'Settings',
} as const;

export type RouteNames = typeof ROUTES[keyof typeof ROUTES];
```

### 6.3 Navigation Types

```typescript
// src/app/navigation/types.ts
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: undefined;
  GoalDetail: { goalId: string };
  CreateEditGoal: { goalId?: string; parentGoalId?: string };
  HabitDetail: { habitId: string };
  CreateEditHabit: { habitId?: string };
  KPIAnalytics: { kpiId: string; kpiType: 'goal' | 'habit' };
  Settings: undefined;
};

export type GoalDetailProps = NativeStackScreenProps<RootStackParamList, 'GoalDetail'>;
export type CreateEditGoalProps = NativeStackScreenProps<RootStackParamList, 'CreateEditGoal'>;
// ... etc.
```

---

## 7. Notifications (`src/shared/hooks/useNotifications.ts`)

### 7.1 Architecture

All notifications are **local OS notifications** via `react-native-notifee`. No backend required. The OS fires them at scheduled times even when the app is closed.

### 7.2 Implementation

```typescript
import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
  RepeatFrequency,
  EventType,
} from '@notifee/react-native';

export async function createNotificationChannel() {
  await notifee.createChannel({
    id: 'goal-planner',
    name: 'Goal Planner',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function scheduleHabitReminder(habitId: string, title: string, time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  const trigger = new Date();
  trigger.setHours(hours, minutes, 0, 0);
  if (trigger < new Date()) trigger.setDate(trigger.getDate() + 1); // next occurrence

  await notifee.createTriggerNotification(
    {
      id: `habit-${habitId}`,
      title: 'Habit Reminder',
      body: `Time to: ${title}`,
      android: { channelId: 'goal-planner', smallIcon: 'ic_notification' },
      data: { habitId, type: 'habit_reminder' },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: trigger.getTime(),
      repeatFrequency: RepeatFrequency.DAILY,
    } as TimestampTrigger,
  );
}

export async function scheduleGoalDeadline(goalId: string, title: string, dueDate: Date, daysBefore: number) {
  const fireDate = new Date(dueDate);
  fireDate.setDate(fireDate.getDate() - daysBefore);
  if (fireDate < new Date()) return; // Already past

  const label = daysBefore === 0 ? 'Due today' : `Due in ${daysBefore} day${daysBefore > 1 ? 's' : ''}`;

  await notifee.createTriggerNotification(
    {
      id: `goal-${goalId}-d${daysBefore}`,
      title: 'Goal Deadline',
      body: `${label}: ${title}`,
      android: { channelId: 'goal-planner' },
      data: { goalId, type: 'goal_deadline' },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: fireDate.getTime(),
    } as TimestampTrigger,
  );
}

// Cancel and reschedule all notifications
// Called: on boot, on habit/goal create/edit/delete, nightly at 11 PM
export async function rescheduleAllNotifications(habits: Habit[], goals: Goal[], settings: UserSettings) {
  await notifee.cancelAllNotifications();

  if (!settings.enablePushNotifications) return;

  for (const habit of habits.filter(h => h.status === 'active' && h.reminderTime)) {
    await scheduleHabitReminder(habit.id, habit.title, habit.reminderTime!);
  }

  const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
  for (const goal of goals.filter(g => g.dueDate.getTime() > Date.now() && g.dueDate.getTime() < sevenDaysFromNow * 6)) {
    for (const daysBefore of [7, 3, 1, 0]) {
      await scheduleGoalDeadline(goal.id, goal.title, goal.dueDate, daysBefore);
    }
  }
}

// Handle notification tap (both foreground and background)
export function registerNotificationHandlers(navigation: any) {
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      const { habitId, goalId } = detail.notification?.data ?? {};
      if (habitId) navigation.navigate('HabitDetail', { habitId });
      if (goalId)  navigation.navigate('GoalDetail',  { goalId });
    }
  });
}

notifee.onBackgroundEvent(async ({ type, detail }) => {
  // Background: store the intent; foreground handler picks it up on app open
  if (type === EventType.PRESS && detail.notification?.data) {
    // Optionally store in AsyncStorage for deferred navigation
  }
});
```

---

## 8. Backup & Restore (`src/shared/utils/backup.ts`)

### 8.1 Export

```typescript
import * as FileSystem from 'expo-file-system';

export async function exportBackup(db: Database): Promise<string> {
  const tables = ['goals', 'kpis', 'kpi_logs', 'kpi_adjustments', 'milestones',
                  'habits', 'habit_kpis', 'habit_kpi_logs', 'habit_streaks',
                  'goal_habit_links', 'goal_notes'];

  const data: Record<string, any[]> = {};
  for (const table of tables) {
    const records = await db.get(table).query().fetch();
    data[table] = records.map(r => r.serialize());
  }

  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    userId: 'self',
    data,
  };

  const fileName = `GoalPlanner_${Date.now()}.json`;
  const uri = `${FileSystem.documentDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, JSON.stringify(backup, null, 2));
  return uri;
}
```

### 8.2 Import with Conflict Resolution

```typescript
import * as DocumentPicker from 'expo-document-picker';

export async function pickAndValidateBackup(): Promise<{ json: string; preview: ImportPreview } | null> {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/json', copyToCacheDirectory: true });
  if (result.canceled) return null;

  const json = await FileSystem.readAsStringAsync(result.assets[0].uri);
  const backup = JSON.parse(json);

  if (!backup.version || !backup.data) throw new Error('Invalid backup file.');

  const preview: ImportPreview = {
    goalCount: backup.data.goals?.length ?? 0,
    habitCount: backup.data.habits?.length ?? 0,
    logCount: (backup.data.kpi_logs?.length ?? 0) + (backup.data.habit_kpi_logs?.length ?? 0),
    conflicts: [],
  };

  // Check for conflicts (goals and habits)
  for (const goal of backup.data.goals ?? []) {
    try {
      const local = await db.get('goals').find(goal.id);
      if (new Date(local.updatedAt).getTime() !== new Date(goal.updated_at).getTime()) {
        preview.conflicts.push({ type: 'goal', id: goal.id, localTitle: local.title, importedUpdatedAt: goal.updated_at });
      }
    } catch { /* doesn't exist locally, no conflict */ }
  }

  return { json, preview };
}

export type ConflictResolution = 'keep_local' | 'use_imported' | 'create_copy';

export async function performImport(
  db: Database,
  backupJson: string,
  resolutions: Record<string, ConflictResolution>
): Promise<void> {
  const backup = JSON.parse(backupJson);

  await db.write(async () => {
    // Logs, milestones, notes: insert if not exists (they have unique IDs)
    const insertIfNew = async (table: string, records: any[]) => {
      for (const r of records) {
        try {
          await db.get(table).find(r.id);
          // Already exists, skip
        } catch {
          await db.get(table).create(m => Object.assign(m, r));
        }
      }
    };

    // Goals and habits: respect conflict resolutions
    const upsertWithResolution = async (table: string, records: any[]) => {
      for (const r of records) {
        const resolution = resolutions[r.id] ?? 'use_imported';
        try {
          const existing = await db.get(table).find(r.id);
          if (resolution === 'use_imported') await existing.update(m => Object.assign(m, r));
          else if (resolution === 'create_copy') {
            await db.get(table).create(m => { Object.assign(m, r); m._raw.id = `${r.id}_copy`; (m as any).title += ' (imported)'; });
          }
          // 'keep_local': do nothing
        } catch {
          await db.get(table).create(m => Object.assign(m, r));
        }
      }
    };

    await upsertWithResolution('goals', backup.data.goals ?? []);
    await upsertWithResolution('habits', backup.data.habits ?? []);
    await insertIfNew('kpis', backup.data.kpis ?? []);
    await insertIfNew('kpi_logs', backup.data.kpi_logs ?? []);
    await insertIfNew('milestones', backup.data.milestones ?? []);
    await insertIfNew('habit_kpis', backup.data.habit_kpis ?? []);
    await insertIfNew('habit_kpi_logs', backup.data.habit_kpi_logs ?? []);
    await insertIfNew('goal_habit_links', backup.data.goal_habit_links ?? []);
    await insertIfNew('goal_notes', backup.data.goal_notes ?? []);
  });
}
```

---

## 9. Open Architecture & Extensibility

### 9.1 Principles

The app is built to accommodate new features without surgery on existing code:

1. **Feature isolation**: Every feature is in its own directory under `src/features/`. New features drop in without touching existing ones.
2. **Token-based theming**: Swap the entire visual language by editing two files (`lightTheme.ts`, `darkTheme.ts`). Zero component changes.
3. **Hook-based data access**: Components depend on hooks, not on WatermelonDB directly. Swap the database or add sync without changing components.
4. **Single userId abstraction**: All queries filter by `userId = 'self'`. Multi-user support = change this string to a real user ID.
5. **Backup versioning**: Backup files include `version` field. Add a migration function when schema changes.
6. **Navigation via constants**: All route names in `routes.ts`. Renaming a screen = one-file change.

### 9.2 Future Extension Points

| Feature | Extension Point |
|---------|----------------|
| Cloud sync | Replace SQLite adapter in `database/index.ts` with a sync-capable adapter (WatermelonDB supports this natively via sync API) |
| Multi-user / collaboration | Change `userId = 'self'` to actual user ID; add auth feature module |
| AI-powered milestone suggestions | Add `features/ai/` module; call from GoalDetailScreen; does not touch DB layer |
| Widget (Android/iOS) | Read from SQLite directly via native module; DB layer unchanged |
| CSV import | Add import handler in `backup.ts`; new format, same import flow |
| Recurring notifications with complex cron | Extend `rescheduleAllNotifications()` in `notifications.ts`; rest of app unchanged |
| Gamification / streaks leaderboard | New feature module; reads from `habit_streaks` table |
| Goal templates | New table `goal_templates`; new screen; no changes to existing goal logic |
| Custom fields | Add `custom_fields JSON` column to goals/habits; render dynamically |

### 9.3 Shared Component Design Contract

Every shared component must:
1. Accept a `style?: ViewStyle` prop to allow overrides
2. Get all colors/spacing from `useTheme()` — no hardcoded values
3. Be self-contained (no side effects, no direct DB calls)
4. Export its prop types explicitly

```typescript
// Example contract
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: ViewStyle;
}
```

---

## 10. Development Setup & Build

### 10.1 Initial Setup

```bash
# Create project
npx create-expo-app GoalPlanner --template expo-template-bare-minimum
cd GoalPlanner

# Core dependencies
npm install @nozbe/watermelondb @nozbe/with-observables
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install zustand @react-native-async-storage/async-storage
npm install @notifee/react-native
npm install victory-native react-native-svg
npm install react-native-calendars
npm install react-native-toast-message
npm install expo-document-picker expo-file-system
npm install @expo/vector-icons

# Dev dependencies
npm install --save-dev typescript @types/react @types/react-native

# Enable JSI for WatermelonDB (faster SQLite)
# Follow: https://watermelondb.dev/docs/Installation
```

### 10.2 Required Native Config

**Android** (`android/app/build.gradle`):
```gradle
android {
  defaultConfig {
    minSdkVersion 23          // Notifee requires 23+
  }
}
```

**Android** (`AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
```

### 10.3 Build APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build APK (Android only, local)
eas build --platform android --profile preview --local

# Or via Expo servers
eas build --platform android --profile preview
```

**`eas.json`**:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

---

## 11. App Entry Point (`src/app/App.tsx`)

```typescript
import React, { useEffect } from 'react';
import { DatabaseProvider } from '@nozbe/watermelondb/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { database } from '../database';
import { ThemeProvider } from '../shared/theme/ThemeProvider';
import RootNavigator from './navigation/RootNavigator';
import { createNotificationChannel } from '../shared/hooks/useNotifications';

export default function App() {
  useEffect(() => {
    createNotificationChannel();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DatabaseProvider database={database}>
        <ThemeProvider>
          <RootNavigator />
          <Toast />
        </ThemeProvider>
      </DatabaseProvider>
    </GestureHandlerRootView>
  );
}
```

---

## 12. Coding Standards

1. **TypeScript strict mode on** — `"strict": true` in `tsconfig.json`
2. **No `any` types** — use `unknown` and narrow, or define proper types
3. **No direct SQLite queries** — always use WatermelonDB model methods
4. **No hardcoded colors/spacing** — always use `useTheme()` tokens
5. **All navigation via ROUTES constants** — never string literals
6. **Mutations inside `database.write()`** — never outside
7. **Reactive queries via `.observe()`** — not `.fetch()` in components
8. **`useCallback` on all hook methods** — prevent unnecessary re-renders
9. **Extract shared logic into `src/shared/utils/`** — not inside components
10. **One screen per file** — co-locate screen-specific components in same feature folder
