import Debug from 'debug'
import jwt from 'jsonwebtoken'
import UserModel, { IUserDocument } from '../models/User'
const debug = Debug('auth') 

/**
 * Checks is email and password exist and are correct, then signs and return a JWT with the user id
 * @param {IUser}
 * @returns {string} The JWT with the user id
 */
export const login = async ({email, password} : IUserDocument) => {
  debug('services.AuthServices.Login is running with params:', email, password)
  // Checks user exist
  const User = await UserModel.find({email: email})
  debug('services.AuthServices.Login const User =', User)
  if (User.length === 0) {
    debug("services.AuthServices.Login user does not exist")
    throw new Error("User does not exist")
  }

  // If User exists, check password match
  const passwordsMatch = await User[0].verifyPassword(password)
  debug('services.AuthServices.Login const passwordsMatch =', passwordsMatch)
  if (!passwordsMatch) {
    debug("services.AuthServices.Login Password incorrect")
    throw new Error("Password incorrect")
  }
  // Set JWT
  const tokenKey: string = process.env.tokenKey as string;

  const token = jwt.sign(
    {_id: User[0]._id }, 
    tokenKey, 
    { expiresIn: '1h' })
  debug('services.AuthServices.Login const token =', token)

  return token
}
