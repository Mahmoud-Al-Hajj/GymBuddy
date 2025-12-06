import express from "express";
import WorkoutController from "../controllers/WorkoutController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validation from "../middleware/validation.js";
import schemas from "../utils/schemas.js";
import Joi from "joi";

const router = express.Router();
const workoutController = new WorkoutController();

const createWorkoutSchema = schemas.createWorkoutSchema;

router.post(
  "/",
  authMiddleware,
  validation(createWorkoutSchema),
  async (req, res) => {
    await workoutController.createWorkout(req, res);
  }
);
router.get("/", authMiddleware, async (req, res) => {
  await workoutController.getWorkoutsByUserId(req, res);
});
router.get("/:id", authMiddleware, async (req, res) => {
  await workoutController.getWorkoutById(req, res);
});
router.put("/:id", authMiddleware, async (req, res) => {
  await workoutController.updateWorkout(req, res);
});
router.delete("/:id", authMiddleware, async (req, res) => {
  await workoutController.deleteWorkout(req, res);
});

export default router;
