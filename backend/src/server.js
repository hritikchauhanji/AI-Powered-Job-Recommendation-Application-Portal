import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";
import serverless from "serverless-http";

dotenv.config();

const isVercel = !!process.env.VERCEL;

let handler;

const initServer = async () => {
  try {
    await connectDB();
    if (isVercel) {
      console.log("Running in Vercel serverless mode");
      handler = serverless(app);
    } else {
      const PORT = process.env.PORT || 8000;
      app.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

if (isVercel) {
  await initServer();
}

export { handler };
