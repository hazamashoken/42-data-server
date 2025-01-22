import { createHandler } from '@/utils/create';
import { BackendError } from '@/utils/errors';

export function authenticate({ secret }: {
    secret: string;
}) {
  return createHandler(async (req, res, next) => {
    const x_secret = req.headers['x-secret'];

    if (!x_secret) {
      throw new BackendError('UNAUTHORIZED', {
        message: 'Authorization token not found',
      });
    }

    if (x_secret !== secret) {
      throw new BackendError('UNAUTHORIZED', {
        message: 'Invalid authorization token',
      });
    }

    next();
  });
}