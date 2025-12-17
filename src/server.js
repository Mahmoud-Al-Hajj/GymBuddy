import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import dotenv from "dotenv";
import logger from "./config/logger.js";
import config from "./config/index.js";
import prisma from "../prisma/prisma.js";

import requestLogger from "./middleware/requestLogger.js";
import errorHandler from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/RateLimitter.js";

import swaggerUi from "swagger-ui-express";
import swagger from "./config/swagger.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import workoutRoutes from "./routes/workout.js";
import personalBestRoutes from "./routes/personalBest.js";
import progressPhotoRoutes from "./routes/progressPhoto.js";
import settingsRoutes from "./routes/settings.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors(config.cors));
//compression helps with reducing the size of the response body and hence increasing the speed of app
app.use(compression({ level: 6, threshold: 1024 }));
//the xss use is to prevent cross site scripting attacks

app.use(apiLimiter);
app.use(requestLogger);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.use(express.static("public"));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));

app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    // 30 seconds
    logger.warn({
      type: "request_timeout",
      method: req.method,
      path: req.path,
      userId: req.user?.id,
    });
    res.status(408).json({ error: "Request timeout" });
  });
  next();
});

// Swagger API Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/personal-bests", personalBestRoutes);
app.use("/api/progress-photos", progressPhotoRoutes);
app.use("/api/settings", settingsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use(errorHandler);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${config.port} (${config.nodeEnv})`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error({
    type: "unhandledRejection",
    reason: reason?.message || reason,
    promise,
  });
  process.exit(1);
});

// Uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error({
    type: "uncaughtException",
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
