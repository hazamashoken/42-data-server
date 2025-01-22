import type { Router } from 'express';
import webhookRoutes from '@/routes/webhook';
import { createRouter } from '@/utils/create';

export default createRouter((router: Router) => {
  router.use('/webhook', webhookRoutes);
});