import express, { urlencoded, json } from "express";
import cors from "cors";
import { mw as requestIp } from "request-ip";
import rateLimit from "express-rate-limit";
import { errorHandler, handle404Error } from "./utils/errors.js";
import consola from "consola";
import { logger } from "./utils/logger.js";
import routes from "./routes/routes.js";
import "./api/intra.js";

const { PORT } = process.env;

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use(requestIp());
app.set("trust proxy", true);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    handler: (req, res) => {
      consola.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: "Too many requests in a short time. Please try in a minute.",
      });
    },
  })
);

app.use(logger);

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

app.listen(PORT, () => {
  consola.log(`Server is running on port http://localhost:${PORT}`);
});
