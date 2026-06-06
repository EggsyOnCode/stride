import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({ name: 'goals', columns: [
      { name: 'user_id', type: 'string' }, { name: 'title', type: 'string' }, { name: 'description', type: 'string', isOptional: true },
      { name: 'parent_goal_id', type: 'string', isOptional: true }, { name: 'start_date', type: 'number' }, { name: 'due_date', type: 'number' },
      { name: 'status', type: 'string' }, { name: 'type', type: 'string' }, { name: 'tags', type: 'string' }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'kpis', columns: [
      { name: 'user_id', type: 'string' }, { name: 'goal_id', type: 'string' }, { name: 'name', type: 'string' }, { name: 'unit', type: 'string' },
      { name: 'description', type: 'string', isOptional: true }, { name: 'start_value', type: 'number' }, { name: 'target_value', type: 'number' }, { name: 'current_value', type: 'number', isOptional: true },
      { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'kpi_logs', columns: [
      { name: 'user_id', type: 'string' }, { name: 'kpi_id', type: 'string' }, { name: 'log_date', type: 'number' }, { name: 'value', type: 'number' }, { name: 'note', type: 'string', isOptional: true }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'kpi_adjustments', columns: [
      { name: 'user_id', type: 'string' }, { name: 'kpi_id', type: 'string' }, { name: 'previous_target_value', type: 'number' }, { name: 'new_target_value', type: 'number' }, { name: 'reason', type: 'string', isOptional: true }, { name: 'adjusted_at', type: 'number' }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'milestones', columns: [
      { name: 'user_id', type: 'string' }, { name: 'kpi_id', type: 'string' }, { name: 'target_date', type: 'number' }, { name: 'expected_value', type: 'number' }, { name: 'description', type: 'string', isOptional: true }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'habits', columns: [
      { name: 'user_id', type: 'string' }, { name: 'title', type: 'string' }, { name: 'description', type: 'string', isOptional: true }, { name: 'frequency', type: 'string' }, { name: 'days_of_week', type: 'string', isOptional: true }, { name: 'custom_schedule', type: 'string', isOptional: true }, { name: 'reminder_time', type: 'string', isOptional: true }, { name: 'start_date', type: 'number' }, { name: 'target_end_date', type: 'number', isOptional: true }, { name: 'status', type: 'string' }, { name: 'tags', type: 'string' }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'habit_kpis', columns: [
      { name: 'user_id', type: 'string' }, { name: 'habit_id', type: 'string' }, { name: 'name', type: 'string' }, { name: 'unit', type: 'string' }, { name: 'description', type: 'string', isOptional: true }, { name: 'tracking_type', type: 'string' }, { name: 'target_value', type: 'number', isOptional: true }, { name: 'target_unit', type: 'string', isOptional: true }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'habit_kpi_logs', columns: [
      { name: 'user_id', type: 'string' }, { name: 'habit_kpi_id', type: 'string' }, { name: 'log_date', type: 'number' }, { name: 'value', type: 'number', isOptional: true }, { name: 'completed', type: 'boolean', isOptional: true }, { name: 'note', type: 'string', isOptional: true }, { name: 'streak_active', type: 'boolean' }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'habit_streaks', columns: [
      { name: 'user_id', type: 'string' }, { name: 'habit_kpi_id', type: 'string' }, { name: 'current_streak_start', type: 'number' }, { name: 'streak_length', type: 'number' }, { name: 'longest_streak_length', type: 'number' }, { name: 'times_restarted', type: 'number' }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'goal_habit_links', columns: [
      { name: 'user_id', type: 'string' }, { name: 'goal_id', type: 'string' }, { name: 'habit_id', type: 'string' }, { name: 'importance', type: 'string' }, { name: 'estimated_impact', type: 'string', isOptional: true }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'goal_notes', columns: [
      { name: 'user_id', type: 'string' }, { name: 'goal_id', type: 'string' }, { name: 'content', type: 'string' }, { name: 'note_date', type: 'number' }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
    tableSchema({ name: 'user_settings', columns: [
      { name: 'user_id', type: 'string' }, { name: 'theme', type: 'string' }, { name: 'enable_push_notifications', type: 'boolean' }, { name: 'enable_inapp_alerts', type: 'boolean' }, { name: 'habit_reminder_time', type: 'string' }, { name: 'quiet_hours_start', type: 'string' }, { name: 'quiet_hours_end', type: 'string' }, { name: 'default_view', type: 'string' }, { name: 'notification_types', type: 'string' }, { name: 'created_at', type: 'number' }, { name: 'updated_at', type: 'number' },
    ] }),
  ],
});
