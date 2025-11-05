import express from "express";
import { errorHandler } from "./middlewares/error.middleware.js";
import healthcheckRouter from "./routes/health.routes.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import jobRouter from "./routes/job.routes.js";
import applicationRouter from "./routes/application.routes.js";

const app = express();

app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Root endpoint
app.get("/", (_, res) => {
  res.json({
    message: "AI-Powered Job Recommendation And Application Portal Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/api/v1/health",
    },
  });
});

//routes
app.use("/api/v1/health", healthcheckRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/applications", applicationRouter);

app.use(errorHandler);

export { app };
