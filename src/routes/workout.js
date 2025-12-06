import express from "express";
import WorkoutController from "../controllers/WorkoutController.js";
import validation from "../middleware/validation.js";
import schemas from "../utils/schemas.js";
import Joi from "joi";

const router = express.Router();
const workoutController = new WorkoutController();

const createWorkoutSchema = schemas.createWorkoutSchema;

router.post("/", validation(createWorkoutSchema), async (req, res) => {
  await workoutController.createWorkout(req, res);
});
router.get("/", async (req, res) => {
  await workoutController.getWorkoutsByUserId(req, res);
});
router.get("/:id", async (req, res) => {
  await workoutController.getWorkoutById(req, res);
});
router.put("/:id", async (req, res) => {
  await workoutController.updateWorkout(req, res);
});
router.delete("/:id", async (req, res) => {
  await workoutController.deleteWorkout(req, res);
});

export default router;
