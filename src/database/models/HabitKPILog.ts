import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class HabitKPILog extends Model {
  static table = 'habit_kpi_logs';
  @field('user_id') userId!: string;
  @field('habit_kpi_id') habitKpiId!: string;
  @field('note') note!: string;
  @date('log_date') logDate!: Date;
  @field('value') value!: number;
  @field('completed') completed!: boolean;
  @field('streak_active') streakActive!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
