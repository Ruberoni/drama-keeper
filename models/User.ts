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

import { Schema, model, Document } from "mongoose";
import isEmail from "validator/lib/isEmail";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (val: string) => isEmail(val),
      message: "{VALUE} is not an email"
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 7
  },
});

export interface IUser extends Document {
  email: string;
  password: string;
}

/*
 *	Encrypt the password before saving
 */
userSchema.pre<IUser>("save", async function (next) {
  try {
    if (!this.password) throw Error("Unexpected error, user has not password");
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(this.password, salt);
    this.password = encryptedPassword;
    next();
  } catch (err) {
    next(err);
  }
});

/*
 * Verify a password attempt with the real password.
 * @params {string} passwordAttempt
 */
userSchema.methods.verifyPassword = async function (
  this: IUser,
  passwordAttempt: string
) {
  return await bcrypt.compare(passwordAttempt, this.password);
};

const User = model<IUser>("User", userSchema);

export default User;
