import type { UserDocument } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserDocument | undefined;
    }
  }
}
