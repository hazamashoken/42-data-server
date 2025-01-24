import "dotenv/config";
import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../schema/index.js";

/**
 * Single client is instantiated and shared across the application.
 * This Postgres client is used by Drizzle ORM.
 */

declare global {
  var drizzle: NodePgDatabase<typeof schema> | undefined;
}

let db: NodePgDatabase<typeof schema>;

if (process.env.NODE_ENV !== "production") {
  if (!global.drizzle)
    global.drizzle = drizzle(`${process.env["POSTGRES_URI"]}`, {
      schema,
    });

  db = global.drizzle;
} else {
  db = drizzle(`${process.env["POSTGRES_URI"]}`, { schema });
}

export { db };
