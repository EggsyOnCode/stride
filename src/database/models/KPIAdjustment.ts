import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class KPIAdjustment extends Model {
  static table = 'kpi_adjustments';
  @field('user_id') userId!: string;
  @field('kpi_id') kpiId!: string;
  @field('reason') reason!: string;
  @field('previous_target_value') previousTargetValue!: number;
  @field('new_target_value') newTargetValue!: number;
  @date('adjusted_at') adjustedAt!: Date;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
