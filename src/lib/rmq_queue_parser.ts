import consola from "consola";
import { RmqQueue } from "../types/rmq_queue.js";
// @ts-ignore
import ips from "../data/ip.json" with { type: "json" };
import { rmqTrackerWH } from "../discord/webhook-sender.js";

const { DEEPTHOUGHT_RMQ_URL, DEEPTHOUGHT_AUTH } = process.env;

export async function checkRMQQueue() {
  try {
    consola.info(`${Buffer.from(DEEPTHOUGHT_AUTH!).toString("base64")}`);
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
      consola.error(
        "Failed to fetch RMQ queue: " + JSON.stringify(data, null, 2)
      );
      return;
    }
    const queues: RmqQueue[] = await res.json();

    const hostnames = queues.map((queue) => queue.name);

    const missing = ips.filter(
      (ip) => !hostnames.find((host) => host.includes(ip))
    );

    await rmqTrackerWH(missing);
  } catch (error) {
    consola.error(error);
  }
}
