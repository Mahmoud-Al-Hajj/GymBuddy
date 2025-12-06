import express from "express";
import WorkoutController from "../controllers/WorkoutController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validation from "../middleware/validation.js";
import schemas from "../utils/schemas.js";
import Joi from "joi";

const router = express.Router();
const workoutController = new WorkoutController();

const createWorkoutSchema = schemas.createWorkoutSchema;
const addExerciseSchema = schemas.addExerciseSchema;
const completeExerciseSchema = schemas.completeExerciseSchema;

// ============ WORKOUT ROUTES ============
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

// ============ EXERCISE ROUTES ============
router.post(
  "/:workoutId/exercises",
  authMiddleware,
  validation(addExerciseSchema),
  async (req, res) => {
    await workoutController.addExercise(req, res);
  }
);

router.put("/exercises/:exerciseId", authMiddleware, async (req, res) => {
  await workoutController.updateExercise(req, res);
});

router.delete("/exercises/:exerciseId", authMiddleware, async (req, res) => {
  await workoutController.deleteExercise(req, res);
});

router.post(
  "/exercises/:exerciseId/complete",
  authMiddleware,
  validation(completeExerciseSchema),
  async (req, res) => {
    await workoutController.completeExercise(req, res);
  }
);

export default router;
