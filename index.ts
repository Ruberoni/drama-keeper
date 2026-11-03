/**
 * Import Modules
 */
import express from "express";
import ConnectDB from "./config/db";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";

/**
 * Import Middlewares
 */
import { appRateLimiter } from "./middlewares/rateLimiter";
import requestAuthorization from "./middlewares/requestAuthorization";

/**
 * Import routes
 */
import indexRouter from "./routes/index";

/**
 * Import configuration
 */

/**
 * Initial configuration
 */
// Without a database the API can't serve anything: exit so the platform restarts it
// (as the old unhandled rejection did). Tests import this file, so they only log.
ConnectDB().catch((err) => {
  console.error(err);
  if (process.env.NODE_ENV !== "test") process.exit(1);
});
const app = express();

// Railway's edge proxy sits in front of the API: trust one hop so req.ip (and the rate
// limiter's key) is the client's address, not the proxy's.
app.set("trust proxy", 1);

/**
 * Apply Middlewares
 */
app.use(express.json());
// Also answers CORS preflight (OPTIONS) requests for every route.
app.use(
  cors({
    maxAge: 86000,
  }),
);
app.use(express.urlencoded({ extended: false }));
app.use(appRateLimiter);
app.use(compression());
app.use(helmet());
app.use(requestAuthorization);

/**
 * Apply Routing
 */
app.use("/", indexRouter);

export default app;
