import { createHandler } from "../utils/create.js";
import { logger as defaultLogger } from "../logger.js";
import { paceUserSchema } from '../schema/pace-user.js';

const { DISCORD_WEBHOOK_PACE, AVATAR_URL } = process.env;

const logger = defaultLogger.child({ service: "pace-user" });

export const handleWHPaceUser = createHandler(
  paceUserSchema,
  async (req, res) => {
    const body = req.body;

    try {

      const dwh_res = await fetch(DISCORD_WEBHOOK_PACE!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: `Pace Update: ${body.user_id}`,
              description: `MileStone: ${body.milestone}
              \nPace: ${body.pace}
              \nCursus Begin At: ${new Date(body.cursus_begin_date!).toLocaleDateString()}
              \nDeadline: ${new Date(body.deadline!).toLocaleDateString()}
              \nMatrix Version: ${body.matrix_version}`,
              url: `https://profile.intra.42.fr/users/${body.user_id}`,
            },
          ],
          avatar_url: AVATAR_URL,
          username: "42 Evaluation Tracker",
        }),
      });
      if (!dwh_res.ok) {
        const data = await res.json();
        logger.error(
          "Failed to send Discord webhook: " + JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      logger.error(error);
    }

    res.status(201).send();
  }
);
