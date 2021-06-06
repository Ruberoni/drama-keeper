/**
 * Import Modules
 */
import express from "express";
import ConnectDB from "./config/db";
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'

/**
 * Import Middlewares
 */
import { appRateLimiter } from './middlewares/rateLimiter'
import requestAuthorization from './middlewares/requestAuthorization'

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
ConnectDB();
const app = express();

/**
 * Apply Middlewares
 */
app.use(express.json());
app.use(cors({
  maxAge: 86000
}))
app.use(express.urlencoded({ extended: false }));
app.use(appRateLimiter) 
app.use(compression())
app.use(helmet())
app.use(requestAuthorization)

/**
 * Apply Routing
 */
app.use("/", indexRouter);

/**
 * Enable cors on options request
 */
app.options('*', cors({
  maxAge: 86000
}))

export default app;
