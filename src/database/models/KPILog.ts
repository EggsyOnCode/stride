import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class KPILog extends Model {
  static table = 'kpi_logs';
  @field('user_id') userId!: string;
  @field('kpi_id') kpiId!: string;
  @field('note') note!: string;
  @date('log_date') logDate!: Date;
  @field('value') value!: number;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
}
