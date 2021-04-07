/**
 * Import Modules
 */
import dotenv from "dotenv";
import express from "express";
import Debug from "debug";
import mongoose from "mongoose";
import ConnectDB from "./config/db"

/**
 * Import routes
 */
import indexRouter from "./routes/index";

/**
 * Initial configuration
 */
dotenv.config();
const debug = Debug("http");
ConnectDB()


/**
 * Import Middlewares
 */

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
