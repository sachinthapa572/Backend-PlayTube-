import { MongoError } from "mongodb";
import mongoose from "mongoose";
import { ApiError } from "@/utils/ApiError";

const connectdb = async (): Promise<mongoose.Connection> => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MOGO_URI}/${process.env.MOGO_DB_NAME}`
    );
    console.log(
      `\x1b[32m[MONGO] MongoDB connected !! DB Name:${connectionInstance.connection.name}\x1b[0m`
    );
    return connectionInstance.connection;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw new ApiError(500, `Mongoose error: ${error.message}`);
    } else if (error instanceof MongoError) {
      throw new ApiError(500, `MongoDB error: ${error.message}`);
    } else if (error instanceof Error) {
      throw new ApiError(500, `MongoDB connection error: ${error.message}`);
    } else {
      throw new ApiError(
        500,
        "An unknown error occurred during MongoDB connection"
      );
    }
  }
};

export default connectdb;
