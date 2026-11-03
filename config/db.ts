import mongoose from "mongoose";

const uri: string =
  process.env.NODE_ENV == "test"
    ? (process.env.MONGO_URI_TEST as string)
    : (process.env.MONGO_URI as string);

/*
 * Calling this function connects the server to the database.
 * A connection error is rethrown unchanged for the caller to handle.
 */
export default async (): Promise<void> => {
  await mongoose.connect(uri);
  console.log("Connected to database");
};
