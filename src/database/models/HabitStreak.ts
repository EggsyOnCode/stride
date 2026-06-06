import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class HabitStreak extends Model {
  static table = 'habit_streaks';
  @field('user_id') userId!: string;
  @field('habit_kpi_id') habitKpiId!: string;
  @date('current_streak_start') currentStreakStart!: Date;
  @field('streak_length') streakLength!: number;
  @field('longest_streak_length') longestStreakLength!: number;
  @field('times_restarted') timesRestarted!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
