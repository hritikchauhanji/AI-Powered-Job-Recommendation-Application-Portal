import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    isConnected = true;
    console.log(
      `\n MongoDB connected ! DB host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection error: ", error);
    process.exit(1);
  }
};

export { connectDB };
