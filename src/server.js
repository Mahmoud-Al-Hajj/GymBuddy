import express from "express";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import workoutRoutes from "./routes/workout.js";
import personalBestRoutes from "./routes/personalBest.js";
import progressPhotoRoutes from "./routes/progressPhoto.js";
import { apiLimiter } from "./middleware/RateLimitter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(apiLimiter);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/personal-bests", personalBestRoutes);
app.use("/api/progress-photos", progressPhotoRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
