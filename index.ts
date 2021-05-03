/**
 * Import Modules
 */
import express from "express";
import ConnectDB from "./config/db";
import cors from 'cors'

/**
 * Import routes
 */
import indexRouter from "./routes/index";

/**
 * Initial configuration
 */
ConnectDB();

/**
 * Import Middlewares
 */

const app = express();

/**
 * Apply Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

/**
 * Apply Routing
 */
app.use("/", indexRouter);

export default app;
