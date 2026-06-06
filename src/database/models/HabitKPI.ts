import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class HabitKPI extends Model {
  static table = 'habit_kpis';
  @field('user_id') userId!: string;
  @field('habit_id') habitId!: string;
  @field('name') name!: string;
  @field('unit') unit!: string;
  @field('description') description!: string;
  @field('tracking_type') trackingType!: string;
  @field('target_unit') targetUnit!: string;
  @field('target_value') targetValue!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
