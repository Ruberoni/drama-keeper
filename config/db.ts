import mongoose from "mongoose";
import Debug from 'debug'

const debug = Debug('db')

const uri: string = process.env.NODE_ENV == 'test' ? process.env.MONGO_URI_TEST as string : process.env.MONGO_URI as string;

/*
 * Calling this function connects the server to the database
 * In an error, the error is thrown to be handled by the server error handler
 */
export default async (): Promise<void> => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    debug("Connected to database");
  } catch (err) {
    throw new Error(err);
  }
};
