import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class Habit extends Model {
  static table = 'habits';
  @field('user_id') userId!: string;
  @field('title') title!: string;
  @field('description') description!: string;
  @field('frequency') frequency!: string;
  @field('days_of_week') daysOfWeek!: string;
  @field('custom_schedule') customSchedule!: string;
  @field('reminder_time') reminderTime!: string;
  @field('status') status!: string;
  @field('tags') tags!: string;
  @date('start_date') startDate!: Date;
  @date('target_end_date') targetEndDate!: Date;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  getTags(): string[] { try { return JSON.parse(this.tags || '[]') as string[]; } catch { return []; } }
}
