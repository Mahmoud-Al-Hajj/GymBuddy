import express from "express";
import WorkoutController from "../controllers/WorkoutController.js";
import Joi from "joi";

const router = express.Router();
const workoutController = new WorkoutController();

const addExerciseSchema = Joi.object({
  name: Joi.string().required(),
  sets: Joi.number().positive().required(),
  reps: Joi.number().positive().required(),
  weight: Joi.number().positive().optional(),
});

const completeExerciseSchema = Joi.object({
  completed: Joi.boolean().required(),
});

router.post("/", async (req, res) => {
  const { error } = addExerciseSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  await workoutController.addExercise(req, res);
});

router.put("/:id", async (req, res) => {
  const { error } = addExerciseSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  await workoutController.updateExercise(req, res);
});
router.delete("/:id", async (req, res) => {
  await workoutController.deleteExercise(req, res);
});
router.post("/:id/complete", async (req, res) => {
  const { error } = completeExerciseSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  await workoutController.completeExercise(req, res);
});

export default router;
