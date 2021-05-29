/**
 * Import Modules
 */
import express from "express";
import ConnectDB from "./config/db";
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'

/**
 * Import Middlewares
 */
import { appRateLimiter } from './middlewares/rateLimiter'

/**
 * Import routes
 */
import indexRouter from "./routes/index";

/**
 * Import configuration
 */
import { corsOptions } from './config'

/**
 * Initial configuration
 */
ConnectDB();
const app = express();

/**
 * Apply Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appRateLimiter) 
app.use(compression())
app.use(helmet())
app.use(cors(corsOptions))

/**
 * Apply Routing
 */
app.use("/", indexRouter);

export default app;
