import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class GoalNote extends Model {
  static table = 'goal_notes';
  @field('user_id') userId!: string;
  @field('goal_id') goalId!: string;
  @field('content') content!: string;
  @date('note_date') noteDate!: Date;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
