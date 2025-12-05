import express from "express";
import WorkoutController from "../controllers/WorkoutController.js";

const router = express.Router();
const workoutController = new WorkoutController();

router.post("/", async (req, res) => {
  await workoutController.addExercise(req, res);
});

router.put("/:id", async (req, res) => {
  await workoutController.updateExercise(req, res);
});
router.delete("/:id", async (req, res) => {
  await workoutController.deleteExercise(req, res);
});
router.post("/:id/complete", async (req, res) => {
  await workoutController.completeExercise(req, res);
});

export default router;
