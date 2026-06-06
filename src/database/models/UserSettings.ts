import { Model } from '@nozbe/watermelondb';
import { date, field, readonly } from '@nozbe/watermelondb/decorators';

export default class UserSettings extends Model {
  static table = 'user_settings';
  @field('user_id') userId!: string;
  @field('theme') theme!: string;
  @field('habit_reminder_time') habitReminderTime!: string;
  @field('quiet_hours_start') quietHoursStart!: string;
  @field('quiet_hours_end') quietHoursEnd!: string;
  @field('default_view') defaultView!: string;
  @field('notification_types') notificationTypes!: string;
  @field('enable_push_notifications') enablePushNotifications!: boolean;
  @field('enable_inapp_alerts') enableInappAlerts!: boolean;
  @readonly @date('created_at') createdAt!: Date;
  @readonly @date('updated_at') updatedAt!: Date;
  getNotificationTypes(): Record<string, boolean> { try { return JSON.parse(this.notificationTypes || '{}') as Record<string, boolean>; } catch { return {}; } }
}
