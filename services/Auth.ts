import Debug from 'debug'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from "google-auth-library"
import UserModel, { IUserDocument } from '../models/User'
const debug = Debug('auth') 
let googleClient: OAuth2Client | undefined
// Created lazily so GOOGLE_CLIENT_ID is read after env loading
const getGoogleClient = () => (googleClient ??= new OAuth2Client(process.env.GOOGLE_CLIENT_ID))

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

/**
 * Verifies a Google Identity Services ID token (the `credential` the client
 * receives) and returns the verified profile. Throws if the token is invalid,
 * has the wrong audience, or the email is not verified.
 */
export const verifyGoogleIdToken = async (idToken: string) => {
  if (!idToken || typeof idToken !== "string") {
    throw new Error("Google login error: missing credential");
  }
  const ticket = await getGoogleClient().verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email) {
    throw new Error("Google login error");
  }
  if (!payload.email_verified) {
    throw new Error("Google email is not verified");
  }
  return { googleId: payload.sub, email: payload.email };
};

export const googleLogin = async (idToken: string) => {
  const { googleId, email } = await verifyGoogleIdToken(idToken);
  const User = await UserModel.findOneAndUpdate(
    { $or: [{ googleId }, { email }] },
    { googleId, email },
    { upsert: true, new: true }
  );
  if (!User) {
    // This part should never be executed thanks to `upsert` option
    throw new Error("User does not exist");
  }
  const JWT = jwt.sign({ _id: User._id }, process.env.tokenKey as string, {
    expiresIn: "1h",
  });
  return JWT;
};
