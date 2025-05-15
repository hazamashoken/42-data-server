import type { Router } from "express";
import webhookRoutes from "../routes/webhook.js";
import internalRoutes from "../routes/internalRoutes.js"
import { createRouter } from "../utils/create.js";

export default createRouter((router: Router) => {
  router.use("/internal", internalRoutes),
  router.use("/webhook", webhookRoutes)
});
