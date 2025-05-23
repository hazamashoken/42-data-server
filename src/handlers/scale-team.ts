import { createScaleTeamSchema } from "../schema/index.js";
import { createHandler } from "../utils/create.js";
import { api } from "../api/intra.js";
import { fetchTeam } from "../api/fetches.js";
import { logger as defaultLogger } from "../logger.js";
import { isPiscineProjects } from "../lib/piscine-project.js";

const { DISCORD_WEBHOOK_EVAL, AVATAR_URL } = process.env;

const logger = defaultLogger.child({ service: "scale-team" });

export const handleScaleTeam = createHandler(
  createScaleTeamSchema,
  async (req, res) => {
    const body = req.body;

    try {
      const teams = await fetchTeam(api, body.team.id.toString());
      const team = teams![0]!;

      if (isPiscineProjects(body.project.id)) {
        res.status(201).send();
        return;
      }

      const dwh_res = await fetch(DISCORD_WEBHOOK_EVAL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          embeds: [
            {
              title: `${body.project.name}`,
              description: `Begin At: ${new Date(
                body.begin_at ?? body.created_at
              ).toLocaleString()}\n\nEvaluate by: ${
                body.user ? body.user.login : "System Auto Evaluation"
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
