import { logger as wsLogger } from '../logger.js';
import type { NextFunction, Request, Response } from 'express';

export function logger(req: Request, _res: Response, next: NextFunction) {
  const ip = req.ip;
  const method = req.method;
  const url = req.url;
  const version = req.httpVersion;
  const userAgent = req.headers['user-agent'];

  const message = `${ip} [${method}] ${url} HTTP/${version} ${userAgent}`;

  if (url === "/healthcheck") {
    next();
  }
  
  wsLogger.info(message);

  next();
}