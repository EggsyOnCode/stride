import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class Goal extends Model {
  static table = 'goals';
  @field('user_id') userId!: string;
  @field('title') title!: string;
  @field('description') description!: string;
  @field('parent_goal_id') parentGoalId!: string;
  @field('status') status!: string;
  @field('type') type!: string;
  @field('tags') tags!: string;
  @date('start_date') startDate!: Date;
  @date('due_date') dueDate!: Date;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  getTags(): string[] { try { return JSON.parse(this.tags || '[]') as string[]; } catch { return []; } }
}
