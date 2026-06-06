import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class GoalHabitLink extends Model {
  static table = 'goal_habit_links';
  @field('user_id') userId!: string;
  @field('goal_id') goalId!: string;
  @field('habit_id') habitId!: string;
  @field('importance') importance!: string;
  @field('estimated_impact') estimatedImpact!: string;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
