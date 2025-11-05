import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";
import { app } from "../src/app.js";
import serverless from "serverless-http";

dotenv.config();

let handler;

const initServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");

    handler = serverless(app);
    return handler;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
};

const handlerPromise = initServer();

export default async function vercelHandler(req, res) {
  const resolvedHandler = await handlerPromise;
  return resolvedHandler(req, res);
}
