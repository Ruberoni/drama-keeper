import rateLimit from 'express-rate-limit';

const REQUEST_BY_DAY = 500
const REQUEST_BY_MIN = 20

export const rateLimitByDay = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: REQUEST_BY_DAY,
  headers: true,
});

export const rateLimitByMinute = rateLimit({
  windowMs: 60 * 1000, // 1 min in milliseconds
  max: REQUEST_BY_MIN,
  headers: true,
});

export const appRateLimiter = [rateLimitByDay, rateLimitByMinute]