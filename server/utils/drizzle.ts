import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

import * as schema from '../database/schema';

export { sql, eq, and, or } from 'drizzle-orm';

export const tables = schema;

export function useDrizzle() {
    const runtimeConfig = useRuntimeConfig();

    const queryClient = Database(runtimeConfig.db.path);
    return drizzle(queryClient, { schema });
}

export type Mood = typeof schema.moods.$inferSelect;
export type Quotes = typeof schema.quotes.$inferSelect;
export type User = typeof schema.users.$inferSelect;
