import { Team } from "./interfaces.js";
import { logger } from "../logger.js";

const fetchAll42 = async function (
  //@ts-ignore
  api: Fast42,
  path: string,
  params: { [key: string]: string } = {}
): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const pages = await api.getAllPages(path, params);
      logger.debug(
        `Retrieving API items: ${pages.length} pages for path ${path}`
      );

      // Fetch all pages
      let i = 0;
      const pageItems = await Promise.all(
        //@ts-ignore
        pages.map(async (page) => {
          logger.debug(`Fetching page ${++i}/${pages.length}`);
          const p = await page;
          if (p.status == 429) {
            throw new Error("Intra API rate limit exceeded");
          }
          if (p.ok) {
            const data = await p.json();
            return data;
          } else {
            throw new Error(`Intra API error: ${p.status} ${p.statusText}`);
          }
        })
      );
      return resolve(pageItems.flat());
    } catch (err) {
      logger.error(err);
      return reject(err);
    }
  });
};

//@ts-ignore
export async function fetchTeam(api: Fast42, teamId: string): Team[] | null {
  try {
    const team = await fetchAll42(api, `/teams/${teamId}`);
    if (!team) {
      logger.debug(`Team ${teamId} not found`);
    }
    return team;
  } catch (error) {
    logger.error(error);
    return null;
  }
}

export async function fetchLocationStats(
  //@ts-ignore
  api: Fast42,
  login: string,
  begin_at?: string,
): Promise<Record<string, string>[] | null> {
  try {
    const options = !!begin_at ? { begin_at: begin_at } : undefined;
    const locations = await fetchAll42(
      api,
      `/users/${login}/locations_stats`,
      options,
    );

    return locations;
  } catch (error) {
    logger.error(error);
    return null;
  }
}