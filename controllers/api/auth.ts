/**
## Login
POST `/login`

## Register
POST `/register`
**/

import UserModel from '../../models/User'
import * as authServices from '../../services/Auth'
import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  const authData = req.body
  try {
    const token = await authServices.login(authData)
    
    return res.json({message: 'Logged In', token})

  } catch(err) {
    return res.status(400).send(err.message)
  }
}  

export const proc = async (req: Request, res: Response) => {
  try {
    
    res.send(`Welcome to a protected route ${req.currentUser?.email}`)
  } catch (err) {
    res.status(400).send(err.message)
  }
 
}