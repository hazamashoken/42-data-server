import { createHandler } from "../utils/create.js";
import { BackendError } from "../utils/errors.js";

export function authenticate({ secret }: { secret: string }) {
  return createHandler(async (req, _, next) => {
    const x_secret = req.headers["x-secret"];

    if (!x_secret) {
      throw new BackendError("UNAUTHORIZED", {
        message: "Authorization token not found",
      });
    }

    if (x_secret !== secret) {
      throw new BackendError("UNAUTHORIZED", {
        message: "Invalid authorization token",
      });
    }

    next();
  });
}
