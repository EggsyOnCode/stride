import type { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  Day: { date?: string } | undefined;
  Week: undefined;
  Month: undefined;
  Year: undefined;
  Goals: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  GoalDetail: { goalId: string };
  CreateEditGoal: { goalId?: string; parentGoalId?: string } | undefined;
  HabitDetail: { habitId: string };
  CreateEditHabit: { habitId?: string } | undefined;
  KPIAnalytics: { kpiId: string; kpiType: 'goal' | 'habit' };
  Settings: undefined;
  GoalGuide: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
