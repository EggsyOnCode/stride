import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class Milestone extends Model {
  static table = 'milestones';
  @field('user_id') userId!: string;
  @field('kpi_id') kpiId!: string;
  @field('description') description!: string;
  @date('target_date') targetDate!: Date;
  @field('expected_value') expectedValue!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
