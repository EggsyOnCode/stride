import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class KPI extends Model {
  static table = 'kpis';
  @field('user_id') userId!: string;
  @field('goal_id') goalId!: string;
  @field('name') name!: string;
  @field('unit') unit!: string;
  @field('description') description!: string;
  @field('start_value') startValue!: number;
  @field('target_value') targetValue!: number;
  @field('current_value') currentValue!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
