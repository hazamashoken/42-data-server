import consola from "consola";
import { Team } from "./interfaces.js";

const fetchAll42 = async function (
  //@ts-ignore
  api: Fast42,
  path: string,
  params: { [key: string]: string } = {}
): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const pages = await api.getAllPages(path, params);
      consola.log(
        `Retrieving API items: ${pages.length} pages for path ${path}`
      );

      // Fetch all pages
      let i = 0;
      const pageItems = await Promise.all(
        //@ts-ignore
        pages.map(async (page) => {
          consola.log(`Fetching page ${++i}/${pages.length}`);
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
      return reject(err);
    }
  });
};

//@ts-ignore
export async function fetchTeam(api: Fast42, teamId: string): Team[] | null {
  try {
    const team = await fetchAll42(api, `/teams/${teamId}`);
    if (!team) {
      consola.error(`Team ${teamId} not found`);
    }
    return team;
  } catch (error) {
    consola.error(error);
    return null;
  }
}
