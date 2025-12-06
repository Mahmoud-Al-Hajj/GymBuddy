import express from "express";
import WorkoutController from "../controllers/WorkoutController.js";
import validation from "../middleware/validation.js";
import schemas from "../utils/schemas.js";
import Joi from "joi";

const router = express.Router();
const workoutController = new WorkoutController();

const addExerciseSchema = schemas.addExerciseSchema;
const completeExerciseSchema = schemas.completeExerciseSchema;

router.post("/", validation(addExerciseSchema), async (req, res) => {
  await workoutController.addExercise(req, res);
});

router.put("/:id", validation(addExerciseSchema), async (req, res) => {
  await workoutController.updateExercise(req, res);
});

router.delete("/:id", async (req, res) => {
  await workoutController.deleteExercise(req, res);
});
router.post(
  "/:id/complete",
  validation(completeExerciseSchema),
  async (req, res) => {
    await workoutController.completeExercise(req, res);
  }
);

export default router;
