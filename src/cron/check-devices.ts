import { CronJob } from "cron";
// import ping from "ping";
// import ips from "../data/ip.json";
// import { deviceCache } from "../lib/cache.js";
// import { deviceTrackerWH } from "../discord/webhook-sender.js";
import { checkRMQQueue } from "../lib/rmq_queue_parser.js";
import { processLocationsStat } from "../lib/location-stat.js";
// import consola from "consola";

// const hosts = ips;
// const hosts = ["c3r1s1", "c1r1s2", "c1r1s3"];

// export const cronCheckIPAlive = CronJob.from({
//   cronTime: "*/5 * * * *",
//   onTick: function () {
//     hosts.forEach(function (host) {
//       ping.sys.probe(host, function (isAlive) {
//         if (!isAlive) {
//           deviceCache.set(host, isAlive);
//         }
//       });
//     });
//   },
//   timeZone: "Asia/Singapore",
// });

// export const sendWebhookDownStatus = CronJob.from({
//   cronTime: "*/5 * * * *",
//   onTick: async function () {
//     await deviceTrackerWH();
//   },
//   timeZone: "Asia/Singapore",
// });
export const cronRMQ = CronJob.from({
  cronTime: "*/1 * * * *",
  onTick: async function () {
    await checkRMQQueue();
  },
  timeZone: "Asia/Singapore",
});

export const cronJobLocationsStat = CronJob.from({
  cronTime: "0 * * * *",
  onTick: async function () {
    await processLocationsStat();
  },
  timeZone: "Asia/Singapore",
});
