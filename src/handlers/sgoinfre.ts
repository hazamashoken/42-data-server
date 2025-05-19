import { createHandler } from '../utils/create.js';
import { createSogoinfreSchema} from "../schema/index.js"
import { logger } from '../logger.js';


const { DISCORD_WEBHOOK_STORAGE, AVATAR_URL } = process.env;

function byteToHumanSize(bytes: number) {
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export const handleSgoinfreSize = createHandler(
  createSogoinfreSchema,
  async (req, res) => {
    const body = req.body;
    try {

    const description = `${body
      .filter((val) => val.size > 32212254720)
      .sort((a, b) => a.size - b.size)
      .map((user) => `${user.name} : ${byteToHumanSize(user.size)}`).join("\n")}`

    // console.log("Sgoinfre size report", description);
    
    const dwh_res = await fetch(DISCORD_WEBHOOK_STORAGE!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: "Sgoinfre Size Report" ,
              description: description,
            },
          ],
          avatar_url: AVATAR_URL,
          username: "Sgoinfre Size Reporter",
        }),
      });
      if (!dwh_res.ok) {
        const data = await dwh_res.json();
        logger.error(
          "Failed to send Discord webhook: " + JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      logger.error(error);
    }

    res.status(201).send();
  }
)