import rateLimit from "express-rate-limit";

const REQUEST_BY_DAY = 500;
// The e2e suite (client/playwright.config.ts) raises this; production keeps the default of 20.
const REQUEST_BY_MIN = Number(process.env.RATE_LIMIT_PER_MINUTE) || 20;

export const rateLimitByDay = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hrs in milliseconds
  limit: REQUEST_BY_DAY,
  legacyHeaders: true,
});

export const rateLimitByMinute = rateLimit({
  windowMs: 60 * 1000, // 1 min in milliseconds
  limit: REQUEST_BY_MIN,
  legacyHeaders: true,
});

export const appRateLimiter = [rateLimitByDay, rateLimitByMinute];
