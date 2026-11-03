/**
# User

### Fields

- Email - String - required
- Password - String - required

### Pre-hooks

- Before **Save:** Checks email already registered, encrypt password

### Methods

- Compare Passwords
**/

import { Schema, model, Model, HydratedDocument } from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt";

export interface IUser {
  email: string;
  // Users created through Google sign-in have no password.
  password?: string;
  googleId?: string;
}

export interface IUserMethods {
  verifyPassword(passwordAttempt: string): Promise<boolean>;
}

export type UserModel = Model<IUser, Record<string, never>, IUserMethods>;
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (val: string) => isEmail(val),
      message: "{VALUE} is not an email",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 7,
  },
  googleId: String,
});

/*
 * Encrypt the password before saving, only when it was set or changed,
 * so re-saving a user doesn't hash the hash.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password)
    throw new Error("Unexpected error, user has not password");
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/*
 * Verify a password attempt with the real password.
 * Users without a password (Google-only) never match.
 * @params {string} passwordAttempt
 */
userSchema.methods.verifyPassword = async function (passwordAttempt: string) {
  if (!this.password || typeof passwordAttempt !== "string") return false;
  return await bcrypt.compare(passwordAttempt, this.password);
};

const User = model<IUser, UserModel>("User", userSchema);

export default User;
