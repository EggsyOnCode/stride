import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import { allModels } from './models';

const adapter = new SQLiteAdapter({
  schema,
  dbName: 'goalplanner',
  jsi: true,
  onSetUpError: (error) => console.error('DB setup error', error),
});

export const database = new Database({ adapter, modelClasses: allModels });
