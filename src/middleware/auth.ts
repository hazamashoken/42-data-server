import { createHandler } from "../utils/create.js";
import { BackendError } from "../utils/errors.js";

import { logger as defaultLogger } from "../logger.js";

const logger = defaultLogger.child({ service: "middleware/auth" });

export function authenticate({ secret }: { secret: string }) {
  return createHandler(async (req, _, next) => {
    const x_secret = req.headers["x-secret"];

    if (!x_secret) {
      throw new BackendError("UNAUTHORIZED", {
        message: "Authorization token not found",
      });
    }
    
    if (x_secret !== secret) {
      logger.info({ message: "Invalid authorization token", x_secret });
      throw new BackendError("UNAUTHORIZED", {
        message: "Invalid authorization token",
      });
    }

    next();
  });
}
