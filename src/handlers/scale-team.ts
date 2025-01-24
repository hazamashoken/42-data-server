import consola from "consola";
import { createScaleTeamSchema } from "../schema/index.js";
import { createHandler } from "../utils/create.js";

const { DISCORD_WEBHOOK, AVATAR_URL } = process.env;

export const handleScaleTeam = createHandler(
  createScaleTeamSchema,
  async (req, res) => {
    const body = req.body;

    try {
      const res = await fetch(DISCORD_WEBHOOK!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: `New Evaluation : ${body.project.name}`,
              description: `Repo: ${body.team.repo_url}`,
              author: { name: `${body.team.name} : ${body.team.id}` },
            },
          ],
          avatar_url: AVATAR_URL,
          username: "42 Evaluation Tracker",
        }),
      });
      const data = await res.json();
      consola.info(data);
    } catch (error) {
      consola.error(error);
    }

    res.status(201).send();
  }
);
