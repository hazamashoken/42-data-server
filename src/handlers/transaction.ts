import { createHandler } from '../utils/create.js';
import { createTransactionSchema } from '../schema/transaction.js';
import { logger} from "../logger.js"

const { DISCORD_WEBHOOK_SHOP, DISCORD_WEBHOOK_ALTARIAN, AVATAR_URL } = process.env; 

async function sendDiscordWebhook(
  url: string,
  body: Record<string, unknown>,
  botname: string,
) {
  return await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...body, 
      avatar_url: AVATAR_URL,
      username: botname,
    }),
  });
}

export const handleTransaction = createHandler(
  createTransactionSchema,
  async (req, res) => {
    const body = req.body;
    try {
      logger.info(body);
      switch (body.transactable_type) {
        case "Product":
          const msg = {
            embeds: [
              {
                title: "Intra Shop",
                description: `**${body.user.login}** have buy **${body.reason}** for **${body.value}**`,
                image: {
                  url: typeof body.transactable !== "string" ? body.transactable?.image.link : "",
                }   
              },
            ],
          };
          const shop_dwh_res = await sendDiscordWebhook(
            DISCORD_WEBHOOK_SHOP!,
            msg,
            "Intra Shop Alert",
          );
          if (!shop_dwh_res.ok) {
            const data = await shop_dwh_res.json();
            logger.error(
              "Failed to send Discord webhook: " + JSON.stringify(data, null, 2)
            );
          }
          break;
        case "event":
        case "bocal":
        case "Tuteurs":
          const alt_msg = {
            embeds: [
              {
                title: "Intra Altarian Tracker",
                description: `**${body.user.login}** earn **${body.value}** from **${body.reason}**`,
              },
            ],
          }
          const dwh_res = await sendDiscordWebhook(
            DISCORD_WEBHOOK_ALTARIAN!,
            alt_msg,
            "Intra Altarian Tracker",
          );
          if (!dwh_res.ok) {
            const data = await dwh_res.json();
            logger.error(
              "Failed to send Discord webhook: " + JSON.stringify(data, null, 2)
            );
          }
          break;
        default:
          logger.error("Unknown trasactable_type", body.transactable_type);
          break;
      }
    } catch (error) {

    }

    res.status(201).send();
  }
)