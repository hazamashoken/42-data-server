import { RmqQueue } from "../types/rmq_queue.js";
// @ts-ignore
import ips from "../data/ip.json" with { type: "json" };
import { rmqTrackerWH } from "../discord/webhook-sender.js";
// import { deviceCache } from "./cache.js";

import { logger as defaultLogger } from "../logger.js";

const logger = defaultLogger.child({ service: "rmq_queue_parser" });

const { DEEPTHOUGHT_RMQ_URL, DEEPTHOUGHT_AUTH } = process.env;

let deadList: string[] = [];

export async function checkRMQQueue() {
  try {
    const res = await fetch(`${DEEPTHOUGHT_RMQ_URL}/api/queues`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(DEEPTHOUGHT_AUTH!).toString(
          "base64"
        )}`,
      },
    });
    if (!res.ok) {
      const data = await res.json();
      logger.error(
        "Failed to fetch RMQ queue: " + JSON.stringify(data, null, 2)
      );
      return;
    }
    const queues: RmqQueue[] = await res.json();

    const hostnames = queues.map((queue) => queue.name);

    const dead = ips.filter(
      (ip) => !hostnames.find((host) => host.includes(ip))
    );

    const alive = ips.filter((ip) => !dead.includes(ip));

    const comeAlive = [];

    const goneDead = [];

    for (const deadIp of dead) {
      if (!deadList.some((ip) => deadIp === ip)) {
        goneDead.push(deadIp);
      }
    }
    for (const aliveIp of alive) {
      if (deadList.some((ip) => aliveIp === ip)) {
        comeAlive.push(aliveIp);
      }
    }

    deadList = dead;

    await rmqTrackerWH(comeAlive, goneDead);
  } catch (error) {
    logger.error(error);
  }
}
