import type { Router } from "express";
import webhookRoutes from "../routes/webhook.js";
import { createRouter } from "../utils/create.js";

export default createRouter((router: Router) => {
  router.use("/webhook", webhookRoutes);
});
