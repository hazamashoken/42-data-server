import { createHandler } from "../utils/create.js";
import { logger as defaultLogger } from "../logger.js";
import { freezeFreezeSchema } from '../schema/freeze-freeze.js';

const { DISCORD_WEBHOOK_FREEZE, AVATAR_URL } = process.env;

const logger = defaultLogger.child({ service: "freeze-freeze" });

export const handleWHFreezeFreeze = createHandler(
  freezeFreezeSchema,
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
              title: `Freeze ${body.login}`,
              description: `Freeze Begin: ${new Date(body.begin_date!).toLocaleDateString()}
              \nFreeze Expected End: ${new Date(body.expected_end_date!).toLocaleDateString()}
              \nCategory: ${
                body.category
              }\nReason:\n${body.reason}`,
              url: `https://staff.intra.42.fr/freeze`,
            },
          ],
          avatar_url: AVATAR_URL,
          username: "Freeze Tracker",
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
