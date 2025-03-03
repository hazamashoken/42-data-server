import {
  integer,
  pgTable,
  varchar,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

import { users } from "./schema.js";

export const locationStats = pgTable(
    "location_stat",
    {
        id: varchar().primaryKey(),
        user: integer().references(() => users.id),
        date: timestamp({ withTimezone: true }),
        duration: numeric(),
        created: timestamp({withTimezone: true}).defaultNow(),
        updated: timestamp({withTimezone: true}).defaultNow(),
    },
)