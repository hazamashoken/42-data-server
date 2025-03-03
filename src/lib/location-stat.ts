import { fetchLocationStats } from "../api/fetches.js";
import { api } from "../api/intra.js";
import { logger } from "../logger.js";
import * as R from "remeda";
import { db } from "../db/db.js";
import {locationStats} from "../schema/location-stat.js";

function timeStringToSeconds(timeString: string) {
    const [hours, minutes, rest] = timeString.split(":");
    const [seconds, milliseconds] = rest!.split(".");
    
    return (
        parseInt(hours!, 10) * 3600 +
        parseInt(minutes!, 10) * 60 +
        parseInt(seconds!, 10) +
        (milliseconds ? parseFloat("0." + milliseconds) : 0)
    );
  }

export async function processLocationsStat(begin_at?: string) {
    const users = await db.query.cursusUsers.findMany({
      where: (cursusUser, {eq, and, isNull}) => and(eq(cursusUser.cursusId, 21), isNull(cursusUser.endAt)),
    });
    logger.info(users)
  
    for (const user of users) {
      logger.info(user.login);
      const locationStat = await fetchLocationStats(api, user.login!, begin_at);
      if (!locationStat || R.isEmpty(locationStat[0]!)) {
        continue;
      }
      logger.info(user.login);
  
      for (const location of locationStat) {
        for (const date in location) {
          const payload = {
            id: `${user.userId}-${date}`,
            user: user.userId,
            date: new Date(date),
            duration: timeStringToSeconds(location[date]!).toString(),
          };
          
          try {
            logger.info(`Inserting location stat for ${user.login} on ${date}`);
            await db.insert(locationStats).values(payload).onConflictDoUpdate({
                target: locationStats.id,
                set: {
                    user: payload.user,
                    date: payload.date,
                    duration: payload.duration,
                }
            })
          } catch (error) {
            logger.error(error);
          }

        }
      }
  
    }
  }