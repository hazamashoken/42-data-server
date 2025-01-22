import 'dotenv/config';
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import * as schema from '@/schema';

export const db: NodePgDatabase<typeof schema> = drizzle(
    process.env.DATABASE_URL!, {
    schema
});

