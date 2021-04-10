/*
 * Here goes the controllers for user routes: /api/users
 *
 *   RESUME:
 *
 * - For retrieveng all the users:
 *   getAllUsers
 *
 * - For creating an user:
 *   creteUser
 */

import UserModel from "../../models/User";
import Debug from "debug";
import { Response, Request } from "express";

const debug = Debug("user");

/*
 * Send all the users as the response.
 */
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  debug("CONTROLLER: getAllUsers | EXECUTED");
  try {
    const users = await UserModel.find();
    res.send(users);
    debug("CONTROLLER: getAllUsers | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: getAllUsers | ERROR:", err.message);
    res.status(400).send(err.message);
  }
};

/*
 * Creates an user.
 * req.body has to have the information needes for creating an user document.
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<void | Response> => {
  debug("CONTROLLER: createUser | EXECUTED");

  try {
    const userInfo = req.body;
    await UserModel.create(userInfo);
    res.send("User created");
    debug("CONTROLLER: createUser | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: createUser | ERROR:", err.message);
    res.status(400).send(err.message);
  }
};
