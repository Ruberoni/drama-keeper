/**
## Login
POST `/login`

## Register
POST `/register`
**/

import * as authServices from "../../services/Auth";
import { Request, Response } from "express";
import { errorMessage } from "../../utils/errors";

export const login = async (req: Request, res: Response) => {
  const authData = req.body;
  try {
    const token = await authServices.login(authData);

    return res.json({ message: "Logged In", token });
  } catch (err) {
    return res.status(400).send(errorMessage(err));
  }
};

export const proc = async (req: Request, res: Response) => {
  try {
    res.send(`Welcome to a protected route ${req.currentUser?.email}`);
  } catch (err) {
    res.status(400).send(errorMessage(err));
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token: googleToken } = req.body;
    const token = await authServices.googleLogin(googleToken);

    return res.json({ message: "Logged In", token });
  } catch {
    return res.status(401).send("Invalid Google credential");
  }
};
