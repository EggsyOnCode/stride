import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  BackupPayload,
  DefaultView,
  DomainData,
  Goal,
  GoalHabitLink,
  GoalNote,
  Habit,
  HabitKPI,
  HabitKPILog,
  HabitStreak,
  KPI,
  KPIAdjustment,
  KPILog,
  Milestone,
  UserSettings,
} from '../types/domain';
import { makeId, now } from '../utils/ids';
import { recalculateStreak, isHabitStreakDay } from '../utils/calculations';

const defaultSettings: UserSettings = {
  id: 'settings_self',
  userId: 'self',
  theme: 'system',
  enablePushNotifications: true,
  enableInappAlerts: true,
  habitReminderTime: '09:00',
  quietHoursStart: '23:00',
  quietHoursEnd: '08:00',
  defaultView: 'day',
  notificationTypes: {
    habitReminder: true,
    goalDeadline: true,
    weeklyCheckIn: true,
    streakBreak: true,
    milestoneReached: true,
    goalCompleted: true,
  },
  createdAt: now(),
  updatedAt: now(),
};

export interface AppStore {
  currentView: DefaultView;
  selectedDate: string;
  settings: UserSettings;
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
  setCurrentView: (view: DefaultView) => void;
  setSelectedDate: (date: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  createGoal: (data: Omit<Goal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, kpis?: Array<Omit<KPI, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'goalId'>>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addGoalNote: (goalId: string, content: string) => void;
  createKpi: (data: Omit<KPI, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => KPI;
  logKpi: (kpiId: string, value: number, note?: string, logDate?: number) => void;
  adjustKpiTarget: (kpiId: string, newTargetValue: number, reason?: string) => void;
  createMilestone: (data: Omit<Milestone, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Milestone;
  createHabit: (habit: Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt'>, habitKpi: Omit<HabitKPI, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'habitId'>) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  logHabitKpi: (habitKpiId: string, input: { value?: number; completed?: boolean; note?: string; logDate?: number }) => void;
  restartStreak: (habitKpiId: string) => void;
  linkHabitToGoal: (goalId: string, habitId: string, importance: GoalHabitLink['importance']) => void;
  unlinkHabitFromGoal: (goalId: string, habitId: string) => void;
  replaceAllData: (data: Partial<DomainData>) => void;
  exportData: () => BackupPayload;
}

function stamp<T extends object>(item: T): T & { id: string; userId: string; createdAt: number; updatedAt: number } {
  const time = now();
  return { ...item, id: makeId('id'), userId: 'self', createdAt: time, updatedAt: time };
}

/** Collect root goal id and every descendant sub-goal at any depth. */
function collectDescendantGoalIds(goals: Goal[], rootId: string): Set<string> {
  const ids = new Set<string>([rootId]);
  const queue = [rootId];
  while (queue.length > 0) {
    const parentId = queue.shift()!;
    for (const goal of goals) {
      if (goal.parentGoalId === parentId && !ids.has(goal.id)) {
        ids.add(goal.id);
        queue.push(goal.id);
      }
    }
  }
  return ids;
}

function removeHabitData(state: Pick<AppStore, 'habits' | 'habitKpis' | 'habitKpiLogs' | 'habitStreaks'>, habitIds: Set<string>) {
  const habitKpiIds = new Set(state.habitKpis.filter((hk) => habitIds.has(hk.habitId)).map((hk) => hk.id));
  return {
    habits: state.habits.filter((habit) => !habitIds.has(habit.id)),
    habitKpis: state.habitKpis.filter((hk) => !habitIds.has(hk.habitId)),
    habitKpiLogs: state.habitKpiLogs.filter((log) => !habitKpiIds.has(log.habitKpiId)),
    habitStreaks: state.habitStreaks.filter((streak) => !habitKpiIds.has(streak.habitKpiId)),
  };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentView: 'day',
      selectedDate: new Date().toISOString().slice(0, 10),
      settings: defaultSettings,
      goals: [],
      kpis: [],
      kpiLogs: [],
      kpiAdjustments: [],
      milestones: [],
      habits: [],
      habitKpis: [],
      habitKpiLogs: [],
      habitStreaks: [],
      links: [],
      notes: [],
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      updateSettings: (updates) => set((state) => ({ settings: { ...state.settings, ...updates, updatedAt: now() } })),
      createGoal: (data, kpiInputs = []) => {
        const goal = stamp({ ...data, id: makeId('goal') }) as Goal;
        const createdKpis = kpiInputs.map((kpi) => stamp({ ...kpi, id: makeId('kpi'), goalId: goal.id }) as KPI);
        set((state) => ({ goals: [goal, ...state.goals], kpis: [...createdKpis, ...state.kpis] }));
        return goal;
      },
      updateGoal: (id, updates) => set((state) => ({ goals: state.goals.map((goal) => (goal.id === id ? { ...goal, ...updates, updatedAt: now() } : goal)) })),
      deleteGoal: (id) => set((state) => {
        const goalIds = collectDescendantGoalIds(state.goals, id);
        const kpiIds = new Set(state.kpis.filter((kpi) => goalIds.has(kpi.goalId)).map((kpi) => kpi.id));
        const habitIdsToDelete = new Set(
          state.links
            .filter((link) => goalIds.has(link.goalId))
            .map((link) => link.habitId),
        );
        return {
          goals: state.goals.filter((goal) => !goalIds.has(goal.id)),
          kpis: state.kpis.filter((kpi) => !kpiIds.has(kpi.id)),
          kpiLogs: state.kpiLogs.filter((log) => !kpiIds.has(log.kpiId)),
          kpiAdjustments: state.kpiAdjustments.filter((adj) => !kpiIds.has(adj.kpiId)),
          milestones: state.milestones.filter((m) => !kpiIds.has(m.kpiId)),
          notes: state.notes.filter((note) => !goalIds.has(note.goalId)),
          links: state.links.filter((link) => !goalIds.has(link.goalId) && !habitIdsToDelete.has(link.habitId)),
          ...removeHabitData(state, habitIdsToDelete),
        };
      }),
      addGoalNote: (goalId, content) => set((state) => ({ notes: [stamp({ id: makeId('note'), goalId, content, noteDate: now() }) as GoalNote, ...state.notes] })),
      createKpi: (data) => {
        const kpi = stamp({ ...data, id: makeId('kpi') }) as KPI;
        set((state) => ({ kpis: [kpi, ...state.kpis] }));
        return kpi;
      },
      logKpi: (kpiId, value, note, logDate = now()) => set((state) => ({
        kpiLogs: [stamp({ id: makeId('kpi_log'), kpiId, value, note, logDate }) as KPILog, ...state.kpiLogs],
        kpis: state.kpis.map((kpi) => (kpi.id === kpiId ? { ...kpi, currentValue: value, updatedAt: now() } : kpi)),
      })),
      adjustKpiTarget: (kpiId, newTargetValue, reason) => set((state) => {
        const kpi = state.kpis.find((item) => item.id === kpiId);
        if (!kpi) return state;
        const adjustment = stamp({ id: makeId('kpi_adjustment'), kpiId, previousTargetValue: kpi.targetValue, newTargetValue, reason, adjustedAt: now() }) as KPIAdjustment;
        return {
          kpiAdjustments: [adjustment, ...state.kpiAdjustments],
          kpis: state.kpis.map((item) => (item.id === kpiId ? { ...item, targetValue: newTargetValue, updatedAt: now() } : item)),
        };
      }),
      createMilestone: (data) => {
        const milestone = stamp({ ...data, id: makeId('milestone') }) as Milestone;
        set((state) => ({ milestones: [milestone, ...state.milestones] }));
        return milestone;
      },
      createHabit: (habitInput, habitKpiInput) => {
        const habit = stamp({ ...habitInput, id: makeId('habit') }) as Habit;
        const habitKpi = stamp({ ...habitKpiInput, id: makeId('habit_kpi'), habitId: habit.id }) as HabitKPI;
        const streak = stamp({ id: makeId('streak'), habitKpiId: habitKpi.id, currentStreakStart: now(), streakLength: 0, longestStreakLength: 0, timesRestarted: 0 }) as HabitStreak;
        set((state) => ({ habits: [habit, ...state.habits], habitKpis: [habitKpi, ...state.habitKpis], habitStreaks: [streak, ...state.habitStreaks] }));
        return habit;
      },
      updateHabit: (id, updates) => set((state) => ({ habits: state.habits.map((habit) => (habit.id === id ? { ...habit, ...updates, updatedAt: now() } : habit)) })),
      deleteHabit: (id) => set((state) => ({
        links: state.links.filter((link) => link.habitId !== id),
        ...removeHabitData(state, new Set([id])),
      })),
      logHabitKpi: (habitKpiId, input) => set((state) => {
        const logDate = input.logDate ?? now();
        const existing = state.habitKpiLogs.find((log) => log.habitKpiId === habitKpiId && new Date(log.logDate).toDateString() === new Date(logDate).toDateString());
        const habitKpi = state.habitKpis.find((item) => item.id === habitKpiId);
        const mergedValue = input.value ?? existing?.value;
        const mergedCompleted = input.completed ?? existing?.completed;
        const streakActive = habitKpi
          ? isHabitStreakDay(
            existing
              ? { ...existing, value: mergedValue, completed: mergedCompleted }
              : { habitKpiId, logDate, value: mergedValue, completed: mergedCompleted, streakActive: false, id: '', userId: 'self', createdAt: 0, updatedAt: 0 },
            habitKpi,
          )
          : mergedCompleted === true;
        const nextLog = existing
          ? { ...existing, ...input, logDate, streakActive, updatedAt: now() }
          : stamp({ id: makeId('habit_log'), habitKpiId, logDate, value: input.value, completed: input.completed, note: input.note, streakActive }) as HabitKPILog;
        const logs = existing ? state.habitKpiLogs.map((log) => (log.id === existing.id ? nextLog : log)) : [nextLog, ...state.habitKpiLogs];
        const streakCalc = recalculateStreak(habitKpiId, logs, habitKpi);
        const streaks = state.habitStreaks.map((streak) => streak.habitKpiId === habitKpiId
          ? { ...streak, currentStreakStart: streakCalc.start, streakLength: streakCalc.length, longestStreakLength: Math.max(streak.longestStreakLength, streakCalc.longest), updatedAt: now() }
          : streak);
        return { habitKpiLogs: logs, habitStreaks: streaks };
      }),
      restartStreak: (habitKpiId) => set((state) => ({ habitStreaks: state.habitStreaks.map((streak) => streak.habitKpiId === habitKpiId ? { ...streak, currentStreakStart: now(), streakLength: 0, timesRestarted: streak.timesRestarted + 1, updatedAt: now() } : streak) })),
      linkHabitToGoal: (goalId, habitId, importance) => set((state) => {
        if (state.links.some((link) => link.goalId === goalId && link.habitId === habitId)) return state;
        return { links: [stamp({ id: makeId('link'), goalId, habitId, importance }) as GoalHabitLink, ...state.links] };
      }),
      unlinkHabitFromGoal: (goalId, habitId) => set((state) => ({ links: state.links.filter((link) => !(link.goalId === goalId && link.habitId === habitId)) })),
      replaceAllData: (data) => set((state) => ({ ...state, ...data, settings: data.settings ?? state.settings })),
      exportData: () => {
        const state = get();
        return {
          version: 1,
          exportedAt: new Date().toISOString(),
          userId: 'self',
          data: {
            goals: state.goals,
            kpis: state.kpis,
            kpiLogs: state.kpiLogs,
            kpiAdjustments: state.kpiAdjustments,
            milestones: state.milestones,
            habits: state.habits,
            habitKpis: state.habitKpis,
            habitKpiLogs: state.habitKpiLogs,
            habitStreaks: state.habitStreaks,
            links: state.links,
            notes: state.notes,
            settings: state.settings,
          },
        };
      },
    }),
    {
      name: 'goal-tracker-store',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
