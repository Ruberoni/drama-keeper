/*
 * Here goes the controllers for user routes: /api/users
 *
 *   RESUME:
 *
 * - For retrieve all the users:
 *   getAllUsers
 *
 * - For creating an user:
 *   creteUser
 *
 * - For delete an user:
 *   deleteUserById
 *
 * - For updating an user:
 *   updateUserById
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
    res.json({message: "User Created"});
    debug("CONTROLLER: createUser | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: createUser | ERROR:", err.message);
    res.status(400).send(err.message);
  }
};

/*
 * Deletes a user by id. 
 */
export const deleteUserById = async (
  req: Request,
  res: Response
  ): Promise<void | Response> => {
  debug("CONTROLLER: deleteUserById | EXECUTED");
  try {
    const id = req.params.id;
    await UserModel.findByIdAndDelete(id);
    res.send("User deleted");
    debug("CONTROLLER: deleteUserById | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: deleteUserById | ERROR:", err.message);
    res.status(400).send(err.message);
  }
};

/*
 * Updates a user by id.
 * req.body has to have the information needes for creating an user document.
 */
export const updateUserById = async (
  req: Request,
  res: Response
  ): Promise<void | Response> => {
  debug("CONTROLLER: updateUserById | EXECUTED");
  try {
    const id = req.params.id;
    const userInfo = req.body;

    await UserModel.findByIdAndUpdate(id, userInfo);

    res.send("User updated");
    debug("CONTROLLER: updateUserById | FINISHED GOOD");
  } catch (err) {
    debug("CONTROLLER: updateUserById | ERROR:", err.message);
    res.status(400).send(err.message);
  }
}