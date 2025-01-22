var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/server.ts
import express, { urlencoded, json } from "express";
import cors from "cors";
import { mw as requestIp } from "request-ip";
import rateLimit from "express-rate-limit";

// src/routes/webhook.ts
import "express";

// src/db/db.ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  logtimeRelations: () => logtimeRelations,
  logtimes: () => logtimes,
  users: () => users,
  usersRelations: () => usersRelations
});
import { relations } from "drizzle-orm";
import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
var users = sqliteTable("user", {
  id: text().primaryKey(),
  login: text()
});
var logtimes = sqliteTable("logtime", {
  id: int().primaryKey(),
  userId: text(),
  date: text(),
  time: int()
  // in seconds
}, (t) => [unique().on(t.userId, t.date)]);
var usersRelations = relations(users, ({ many }) => ({
  logtime: many(logtimes)
}));
var logtimeRelations = relations(logtimes, ({ one }) => ({
  user: one(users, {
    fields: [logtimes.userId],
    references: [users.id]
  })
}));

// src/db/db.ts
var db = drizzle(process.env.DB_FILE_NAME, { schema: schema_exports });

// src/handlers/locations.ts
import consola from "consola";
async function handleLocation(req, res, next) {
  const body = req.body;
  const userLogin = body.user.login;
  const userId = body.user.id.toString();
  const beginAt = new Date(body.begin_at);
  const endAt = new Date(body.end_at);
  const date = beginAt.toDateString();
  const time = (endAt.getTime() - beginAt.getTime()) / 1e3;
  try {
    let user = db.query.users.findFirst({
      where: (users2, { eq }) => eq(users2.id, userId)
    });
    if (!user) {
      await db.insert(users).values({ id: userId, login: userLogin }).returning();
    }
    await db.insert(logtimes).values({ userId, date, time }).onConflictDoUpdate({
      target: [logtimes.userId, logtimes.date],
      set: { time }
    });
  } catch (error) {
    consola.error(error);
  }
}

// src/utils/create.ts
import { Router } from "express";
function createRouter(callback) {
  const router = Router();
  callback(router);
  return router;
}
function createHandler(schemaOrHandler, handler) {
  return async (req, res, next) => {
    try {
      if (handler) {
        const schema = schemaOrHandler;
        schema.parse(req);
        await handler(req, res, next);
      } else {
        const handler2 = schemaOrHandler;
        await handler2(req, res, next);
      }
    } catch (error) {
      next(error);
    }
  };
}

// src/utils/errors.ts
function getStatusFromErrorCode(code) {
  switch (code) {
    case "BAD_REQUEST":
    case "VALIDATION_ERROR":
      return 400;
    case "UNAUTHORIZED":
    case "INVALID_PASSWORD":
      return 401;
    case "NOT_FOUND":
    case "USER_NOT_FOUND":
      return 404;
    case "METHOD_NOT_ALLOWED":
      return 405;
    case "NOT_ACCEPTABLE":
      return 406;
    case "REQUEST_TIMEOUT":
      return 408;
    case "CONFLICT":
      return 409;
    case "GONE":
      return 410;
    case "LENGTH_REQUIRED":
      return 411;
    case "PRECONDITION_FAILED":
      return 412;
    case "PAYLOAD_TOO_LARGE":
      return 413;
    case "URI_TOO_LONG":
      return 414;
    case "UNSUPPORTED_MEDIA_TYPE":
      return 415;
    case "RANGE_NOT_SATISFIABLE":
      return 416;
    case "EXPECTATION_FAILED":
      return 417;
    case "TEAPOT":
      return 418;
    case "INTERNAL_ERROR":
      return 500;
    default:
      return 500;
  }
}
function getMessageFromErrorCode(code) {
  switch (code) {
    case "BAD_REQUEST":
      return "The request is invalid.";
    case "VALIDATION_ERROR":
      return "The request contains invalid or missing fields.";
    case "UNAUTHORIZED":
      return "You are not authorized to access this resource.";
    case "NOT_FOUND":
      return "The requested resource was not found.";
    case "USER_NOT_FOUND":
      return "The user was not found.";
    case "INTERNAL_ERROR":
      return "An internal server error occurred.";
    case "CONFLICT":
      return "The request conflicts with the current state of the server.";
    case "INVALID_PASSWORD":
      return "The password is incorrect.";
    default:
      return "An internal server error occurred.";
  }
}
var BackendError = class extends Error {
  code;
  details;
  constructor(code, {
    message,
    details
  } = {}) {
    super(message ?? getMessageFromErrorCode(code));
    this.code = code;
    this.details = details;
  }
};
function errorHandler(error, req, res, _next) {
  let statusCode = 500;
  let code;
  let message;
  let details;
  const ip = req.ip;
  const url = req.originalUrl;
  const method = req.method;
  if (error instanceof BackendError) {
    message = error.message;
    code = error.code;
    details = error.details;
    statusCode = getStatusFromErrorCode(code);
  }
  if (error.code === "ECONNREFUSED") {
    code = "INTERNAL_ERROR";
    message = "The DB crashed maybe because they dont like you :p";
    details = error;
  }
  code = code ?? "INTERNAL_ERROR";
  message = message ?? getMessageFromErrorCode(code);
  details = details ?? error;
  console.error(`${ip} [${method}] ${url} ${code} - ${message}`);
  res.status(statusCode).json({
    code,
    message,
    details
  });
}
function handle404Error(_req, res) {
  const code = "NOT_FOUND";
  res.status(getStatusFromErrorCode(code)).json({
    code,
    message: "Route not found",
    details: "The route you are trying to access does not exist"
  });
}

// src/middleware/auth.ts
function authenticate({ secret }) {
  return createHandler(async (req, res, next) => {
    const x_secret = req.headers["x-secret"];
    if (!x_secret) {
      throw new BackendError("UNAUTHORIZED", {
        message: "Authorization token not found"
      });
    }
    if (x_secret !== secret) {
      throw new BackendError("UNAUTHORIZED", {
        message: "Invalid authorization token"
      });
    }
    next();
  });
}

// src/routes/webhook.ts
var { WH_LOCATION_SECRET } = process.env;
var webhook_default = createRouter((router) => {
  router.post("/location", authenticate({ secret: WH_LOCATION_SECRET }), handleLocation);
});

// src/server.ts
import consola3 from "consola";

// src/utils/logger.ts
import consola2 from "consola";
function logger(req, _res, next) {
  const ip = req.ip;
  const method = req.method;
  const url = req.url;
  const version = req.httpVersion;
  const userAgent = req.headers["user-agent"];
  const message = `${ip} [${method}] ${url} HTTP/${version} ${userAgent}`;
  consola2.log(message);
  next();
}

// src/routes/routes.ts
var routes_default = createRouter((router) => {
  router.use("/webhook", webhook_default);
});

// src/server.ts
var { PORT } = process.env;
var app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use(requestIp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1e3,
    max: 100,
    handler: (req, res) => {
      consola3.warn(`DDoS Attempt from ${req.ip}`);
      res.status(429).json({
        error: "Too many requests in a short time. Please try in a minute."
      });
    }
  })
);
app.use(logger);
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the API!"
  });
});
app.get("/healthcheck", (_req, res) => {
  res.json({
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});
app.use("/api", routes_default);
app.all("*", handle404Error);
app.use(errorHandler);
app.listen(PORT, () => {
  consola3.log(`Server is running on port http://localhost:${PORT}`);
});
