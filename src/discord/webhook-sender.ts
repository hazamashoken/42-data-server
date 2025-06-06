import { deviceCache } from "../lib/cache.js";
import { logger } from "../logger.js";

const { AVATAR_URL, DISCORD_WEBHOOK_DOWN } = process.env;

export async function deviceTrackerWH() {
  try {
    const ips = Object.entries(deviceCache.data).map(([ip, _]) => ip);
    if (ips.length === 0) return;
    const res = await fetch(DISCORD_WEBHOOK_DOWN!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: `Dells down`,
            description: `${ips.join("\n")}`,
          },
        ],
        avatar_url: AVATAR_URL,
        username: "42 Device Status",
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      logger.error(
        "Failed to send Discord webhook: " + JSON.stringify(data, null, 2)
      );
    }
  } catch (error) {}
}

export async function rmqTrackerWH(comeAlive: string[], goneDead: string[], deadlist: string[] = []) {
  try {
    if (comeAlive.length === 0 && goneDead.length === 0) return;

    const message = `${
      comeAlive.length > 0
        ? `\n:green_circle: [${comeAlive.length}/${deadlist.length}]\n` + comeAlive.join("\n") + "\n"
        : ""
    } ${goneDead.length > 0 ? `\n:red_circle: [${goneDead.length}]\n` + goneDead.join("\n") : ""}
    `;
    console.info({ goneDead: goneDead, comeAlive: comeAlive }, {service: "rmqTrackerWH"});
    const res = await fetch(DISCORD_WEBHOOK_DOWN!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        embeds: [
          {
            title: `Dells Status`,
            description: message,
          },
        ],
        avatar_url: AVATAR_URL,
        username: "42 Device Status",
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      logger.error(
        "Failed to send Discord webhook: " + JSON.stringify(data, null, 2)
      );
    }
  } catch (error) {}
}
