import Debug from 'debug'
import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import UserModel from '../models/User'

const debug = Debug('auth')
/*
 * Authorize the access with valid JWT in Authorization header using the Bearer schema
 * and adds the user to req.currentUser
 */
export const authorize = async (req: Request, res: Response, next: NextFunction) => {
  debug('middlewares.authorize is running')
  try {
    const authHeader = req.get('authorization') as string
    debug('authHeader:', authHeader && authHeader)
    const token = authHeader.replace(/^Bearer\s+/, "")
    debug('token:', token)
    const tokenKey: string = process.env.tokenKey as string;
    const decoded = await jwt.verify(token, tokenKey)
    debug('decoded:', decoded)

    const _currentUser = await UserModel.findById(decoded)
    let currentUser = _currentUser || undefined
    debug('currentUser:', currentUser)

    req.currentUser = currentUser

    debug('middlewares.authorize finished good')

    next()


  } catch (err) {
    debug('middlewares.authorize error:', err.message)
    res.status(400).send(err.message)
  }
}
