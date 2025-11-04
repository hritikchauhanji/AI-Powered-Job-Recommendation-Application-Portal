import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import healthcheckRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static("public"));

//routes
app.use("/api/v1/health", healthcheckRouter);
app.use("/api/v1/auth", authRouter);

app.use(errorHandler);

export { app };
