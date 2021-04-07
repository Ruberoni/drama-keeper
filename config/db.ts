import mongoose from "mongoose"; 

const uri =
  "mongodb+srv://RubenDB:zv3dTCTWZX4fQ3ox@main-db.qfh1y.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

/*
 * Calling this function connects the server to the database
 * In an error, the error is thrown to be handled by the server error handler
 */
export default async () : Promise<void> => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to database');
  } catch (err) {
    throw new Error(err);
  }
}