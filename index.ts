/**
 * Import Modules
 */
import dotenv from "dotenv";
import express from "express";
import dbg from "debug";

/**
 * Import routes
 */
import indexRouter from "./routes/index";

/**
 * Import Middlewares
 */

dotenv.config();
const app = express();

/**
 * Apply Middlewares
 */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Apply Routing
 */
app.use("/", indexRouter);

export default app;
