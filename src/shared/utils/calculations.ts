import type { FrequencyUnit, Goal, Habit, HabitKPILog, HabitKPI, KPI, KPILog, Milestone } from '../types/domain';
import { startOfDayMs } from './formatters';

export function goalProgress(goal: Goal, kpis: KPI[]): number {
  const goalKpis = kpis.filter((kpi) => kpi.goalId === goal.id);
  if (goal.status === 'completed') return 100;
  if (!goalKpis.length) {
    const total = Math.max(1, goal.dueDate - goal.startDate);
    return Math.max(0, Math.min(100, ((Date.now() - goal.startDate) / total) * 100));
  }
  const values = goalKpis.map((kpi) => kpiProgress(kpi));
  return Math.round(values.reduce((sum, item) => sum + item, 0) / values.length);
}

export function kpiProgress(kpi: KPI): number {
  const current = kpi.currentValue ?? kpi.startValue;
  const range = kpi.targetValue - kpi.startValue;
  if (range === 0) return current >= kpi.targetValue ? 100 : 0;
  // Signed range supports both increasing goals (0 -> 100) and decreasing goals (76 -> 70).
  // Moving in the wrong direction yields negative progress and is clamped to 0.
  return Math.max(0, Math.min(100, ((current - kpi.startValue) / range) * 100));
}

export function habitInterval(habit: Habit): { unit: FrequencyUnit; count: number } {
  if (habit.frequencyUnit && habit.frequencyCount) return { unit: habit.frequencyUnit, count: Math.max(1, habit.frequencyCount) };
  // Fall back to legacy frequency representation.
  if (habit.frequency === 'weekly') return { unit: 'week', count: 1 };
  return { unit: 'day', count: 1 };
}

export function frequencyLabel(habit: Habit): string {
  const { unit, count } = habitInterval(habit);
  if (count === 1) return unit === 'hour' ? 'Hourly' : unit === 'week' ? 'Weekly' : 'Daily';
  return `Every ${count} ${unit}s`;
}

export function isHabitDueOn(habit: Habit, dateMs: number): boolean {
  if (habit.status !== 'active') return false;
  const start = startOfDayMs(habit.startDate);
  const day = startOfDayMs(dateMs);
  if (day < start) return false;
  if (habit.targetEndDate && day > startOfDayMs(habit.targetEndDate)) return false;
  const { unit, count } = habitInterval(habit);
  // Hourly habits recur multiple times within a day, so they are due every day.
  if (unit === 'hour') return true;
  const dayDiff = Math.round((day - start) / 86400000);
  if (unit === 'week') return dayDiff % (count * 7) === 0;
  return dayDiff % count === 0;
}

export function goalsActiveInRange(goals: Goal[], rangeStart: number, rangeEnd: number): Goal[] {
  return goals.filter((goal) => {
    if (goal.status === 'abandoned') return false;
    return goal.startDate <= rangeEnd && goal.dueDate >= rangeStart;
  });
}

// Target met (for analytics "completed days" and full-target badge).
export function isHabitLogComplete(log: HabitKPILog | undefined, habitKpi: HabitKPI): boolean {
  if (!log) return false;
  if (habitKpi.trackingType === 'binary') return log.completed === true;
  if (habitKpi.targetValue === undefined) return log.value !== undefined;
  return (log.value ?? 0) >= habitKpi.targetValue;
}

/** Whether this log counts as an active streak day (any logged measured progress counts). */
export function isHabitStreakDay(log: HabitKPILog | undefined, habitKpi: HabitKPI): boolean {
  if (!log) return false;
  if (habitKpi.trackingType === 'binary') return log.completed === true;
  return log.value !== undefined && log.value > 0;
}

// Fractional daily progress (0..1) for compliance: binary = done/not-done, measured = value/target capped at 1.
export function habitDayProgress(log: HabitKPILog | undefined, habitKpi: HabitKPI): number {
  if (!log) return 0;
  if (habitKpi.trackingType === 'binary') return log.completed === true ? 1 : 0;
  if (log.value === undefined) return 0;
  if (habitKpi.targetValue === undefined || habitKpi.targetValue === 0) return 1;
  return Math.max(0, Math.min(1, log.value / habitKpi.targetValue));
}

export function complianceForDay(dateMs: number, habits: Habit[], habitKpis: HabitKPI[], logs: HabitKPILog[]): number {
  const day = startOfDayMs(dateMs);
  const dueKpis = habitKpis.filter((habitKpi) => {
    const habit = habits.find((candidate) => candidate.id === habitKpi.habitId);
    return habit ? isHabitDueOn(habit, day) : false;
  });
  if (!dueKpis.length) return 1;
  const total = dueKpis.reduce((sum, habitKpi) => {
    const log = logs.find((candidate) => candidate.habitKpiId === habitKpi.id && startOfDayMs(candidate.logDate) === day);
    return sum + habitDayProgress(log, habitKpi);
  }, 0);
  return total / dueKpis.length;
}

export function complianceTone(value: number): 'success' | 'warning' | 'danger' | 'info' {
  if (value >= 0.9) return 'success';
  if (value >= 0.5) return 'warning';
  if (value > 0) return 'info';
  return 'danger';
}

export function recalculateStreak(habitKpiId: string, logs: HabitKPILog[], habitKpi?: HabitKPI): { start: number; length: number; longest: number } {
  const byDay = logs
    .filter((log) => log.habitKpiId === habitKpiId)
    .sort((a, b) => startOfDayMs(a.logDate) - startOfDayMs(b.logDate));
  let current = 0;
  let longest = 0;
  let lastDay: number | undefined;
  let start = byDay.length ? startOfDayMs(byDay[0].logDate) : startOfDayMs();
  for (const log of byDay) {
    const day = startOfDayMs(log.logDate);
    const complete = habitKpi ? isHabitStreakDay(log, habitKpi) : log.streakActive;
    if (!complete) {
      current = 0;
      lastDay = undefined;
      continue;
    }
    if (lastDay === undefined || day - lastDay === 86400000) {
      current += 1;
    } else {
      current = 1;
      start = day;
    }
    if (current === 1) start = day;
    longest = Math.max(longest, current);
    lastDay = day;
  }
  return { start, length: current, longest };
}

export function trendForLogs(logs: { logDate: number; value: number }[]): 'up' | 'flat' | 'down' {
  if (logs.length < 2) return 'flat';
  const sorted = [...logs].sort((a, b) => a.logDate - b.logDate);
  const delta = sorted[sorted.length - 1].value - sorted[0].value;
  if (Math.abs(delta) < 0.001) return 'flat';
  return delta > 0 ? 'up' : 'down';
}

export function hasReachedMilestone(logs: KPILog[], milestone: Milestone): boolean {
  return logs.some((log) => log.logDate <= milestone.targetDate && log.value >= milestone.expectedValue);
}
