import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema/finance-schema';

export const sqlite = openDatabaseSync('finasp.db', {
  enableChangeListener: true,
});

export const db = drizzle(sqlite, { schema });
