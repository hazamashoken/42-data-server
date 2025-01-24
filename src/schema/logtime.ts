import { relations, type InferSelectModel } from "drizzle-orm";
import {
  integer,
  text,
  pgTable,
  unique,
  date,
  varchar,
  serial,
} from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("user", {
  id: text().primaryKey().notNull(),
  login: text().notNull(),
});

export const logtimes = pgTable(
  "logtime",
  {
    id: serial("id").primaryKey(),
    userId: varchar().notNull(),
    date: date({ mode: "date" }).notNull(),
    time: integer().notNull(), // in seconds
  },
  (t) => [unique().on(t.userId, t.date)]
);

export const usersRelations = relations(users, ({ many }) => ({
  logtime: many(logtimes),
}));

export const logtimeRelations = relations(logtimes, ({ one }) => ({
  user: one(users, {
    fields: [logtimes.userId],
    references: [users.id],
  }),
}));

export const selectUserSchema = createSelectSchema(users);

export const selectLogtimeSchema = createSelectSchema(logtimes);

export const updateLogtimeSchema = z.object({
  body: z.object({
    id: z.number(),
    begin_at: z.string(),
    end_at: z.string(),
    primary: z.boolean(),
    host: z.string(),
    campus_id: z.number(),
    user: z.object({
      id: z.number(),
      login: z.string(),
      url: z.string(),
    }),
  }),
});

export type User = InferSelectModel<typeof users>;
export type Logtime = InferSelectModel<typeof logtimes>;
