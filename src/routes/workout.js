import express from "express";
import WorkoutController from "../controllers/WorkoutController.js";
import Joi from "joi";

const router = express.Router();
const workoutController = new WorkoutController();

const createWorkoutSchema = Joi.object({
  name: Joi.string().required(),
  date: Joi.date().optional(),
  exercises: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        sets: Joi.number().required(),
        reps: Joi.number().required(),
        weight: Joi.number().optional(),
      })
    )
    .required(),
});

router.post("/", async (req, res) => {
  const { error } = createWorkoutSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
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
