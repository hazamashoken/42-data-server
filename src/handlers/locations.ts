import { db } from "../db/db.js";
import { users, logtimes } from "../schema/index.js";
import consola from "consola";
import { updateLogtimeSchema } from "../schema/index.js";
import { createHandler } from "../utils/create.js";
import { and, eq } from "drizzle-orm";

export const handleLocation = createHandler(
  updateLogtimeSchema,
  async (req, res) => {
    const body = req.body;
    const userLogin = body.user.login;
    const userId = body.user.id.toString();
    const beginAt = new Date(body.begin_at);
    const endAt = new Date(body.end_at);
    const date = beginAt.toDateString();
    const time = (endAt.getTime() - beginAt.getTime()) / 1000;

    try {
      let user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });

      if (!user) {
        await db
          .insert(users)
          .values({
            id: userId,
            login: userLogin,
          })
          .returning();
      }

      let logtime = await db.query.logtimes.findFirst({
        where: (logtimes, { eq, and }) =>
          and(eq(logtimes.userId, userId), eq(logtimes.date, new Date(date))),
      });

      if (logtime) {
        await db
          .update(logtimes)
          .set({
            time: time + logtime.time,
          })
          .where(
            and(eq(logtimes.userId, userId), eq(logtimes.date, new Date(date)))
          );
      } else {
        await db
          .insert(logtimes)
          .values({
            userId,
            date: new Date(date),
            time,
          })
          .onConflictDoUpdate({
            target: [logtimes.userId, logtimes.date],
            set: {
              time: time,
            },
          });
      }
    } catch (error) {
      consola.error(error);
    }

    res.status(201).send();
  }
);
