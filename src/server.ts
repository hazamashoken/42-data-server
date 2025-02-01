import "dotenv/config.js";
import express, { urlencoded, json } from "express";
import cors from "cors";
import { mw as requestIp } from "request-ip";
import rateLimit from "express-rate-limit";
import { errorHandler, handle404Error } from "./utils/errors.js";
import { logger as middleLogger  } from "./utils/logger.js";
import routes from "./routes/routes.js";
import "./api/intra.js";
import { cronRMQ } from "./cron/check-devices.js";
import { logger } from "./logger.js";

const { PORT, PROXY } = process.env;

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use(requestIp());

function checkProxy(proxySetting: string) {
  if (proxySetting === "true") {
    return true;
  } else if (proxySetting === "false") {
    return false;
    //@ts-ignore
  } else if (!isNaN(proxySetting) && Number(proxySetting) >= 0) {
    return Number(proxySetting);
  } else {
    throw new Error("Invalid proxy setting");
  }
}
app.set("trust proxy", checkProxy(PROXY!));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
      logger.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: "Too many requests in a short time. Please try in a minute.",
      });
    },
  })
);

app.use(middleLogger);

app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the API!",
  });
});

app.get("/healthcheck", (_req, res) => {
  res.json({
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use("/api", routes);

app.all("*", handle404Error);
app.use(errorHandler);

// cronCheckIPAlive.start();
// sendWebhookDownStatus.start();
cronRMQ.start();

app.listen(PORT, () => {
  logger.info(`Server is running on port http://localhost:${PORT}`);
});
