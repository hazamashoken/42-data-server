import consola from "consola";
import { createScaleTeamSchema } from "../schema/index.js";
import { createHandler } from "../utils/create.js";
import { api } from "../api/intra.js";
import { fetchTeam } from "../api/fetches.js";

const { DISCORD_WEBHOOK_EVAL, AVATAR_URL } = process.env;

export const handleScaleTeam = createHandler(
  createScaleTeamSchema,
  async (req, res) => {
    const body = req.body;

    try {
      const teams = await fetchTeam(api, body.team.id.toString());
      const team = teams![0]!;

      const res = await fetch(DISCORD_WEBHOOK_EVAL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: `${body.project.name}`,
              description: `Begin At: ${new Date(
                body.begin_at
              ).toLocaleString()}\n\nEvaluate by: ${
                body.user.login
              }\n\nTeam members:\n${team.users
                .map((user) => user.login)
                .join("\n")}`,
              url: `https://projects.intra.42.fr/projects/${body.project.slug}/projects_users/${team.users[0]?.projects_user_id}`,
            },
          ],
          avatar_url: AVATAR_URL,
          username: "42 Evaluation Tracker",
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        consola.error(
          "Failed to send Discord webhook: " + JSON.stringify(data, null, 2)
        );
      }
    } catch (error) {
      consola.error(error);
    }

    res.status(201).send();
  }
);
