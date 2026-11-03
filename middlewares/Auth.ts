import Debug from "debug";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User";
import { errorMessage } from "../utils/errors";

const debug = Debug("auth");
/*
 * Authorize the access with valid JWT in Authorization header using the Bearer schema
 * and adds the user to req.currentUser
 */
export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  debug("middlewares.authorize is running");
  try {
    const authHeader = req.get("authorization") as string;
    debug("authHeader:", authHeader && authHeader);
    const token = authHeader.replace(/^Bearer\s+/, "");
    debug("token:", token);
    const tokenKey: string = process.env.tokenKey as string;
    const decoded = jwt.verify(token, tokenKey, { algorithms: ["HS256"] });
    debug("decoded:", decoded);
    const userId =
      typeof decoded === "object" && decoded !== null
        ? (decoded as { _id?: unknown })._id
        : undefined;
    if (typeof userId !== "string") throw new Error("Invalid token payload");

    // A valid token for a deleted user must not reach the routes:
    // find({ user: undefined }) would match every film without an owner.
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) throw new Error("User does not exist");
    debug("currentUser:", currentUser);

    req.currentUser = currentUser;

    debug("middlewares.authorize finished good");

    next();
  } catch (err) {
    debug("middlewares.authorize error:", errorMessage(err));
    res.status(400).send(errorMessage(err));
  }
};
