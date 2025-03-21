import { createHandler } from "../utils/create.js";
import { logger as defaultLogger } from "../logger.js";
import { freezeUserSchema } from '../schema/freeze-user.js';

const { DISCORD_WEBHOOK_FREEZE, AVATAR_URL } = process.env;

const logger = defaultLogger.child({ service: "scale-team" });

export const handleWHFreezeUser = createHandler(
  freezeUserSchema,
  async (req, res) => {
    const body = req.body;

    try {

      const dwh_res = await fetch(DISCORD_WEBHOOK_FREEZE!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: `Freeze User: ${body.login}`,
              description: `:Available Bonus Day: ${body.available_bonus_days}
              \n\nUsed Freeze Days: ${
                body.used_freeze_days
              }\n\nTotal freeze occurences used:\n${body.total_freeze_occurences}`,
              url: `https://profile.intra.42.fr/users/${body.login}`,
            },
          ],
          avatar_url: AVATAR_URL,
          username: "Freeze User",
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
