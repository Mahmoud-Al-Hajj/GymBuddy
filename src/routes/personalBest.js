import express from "express";
import PersonalBestController from "../controllers/PersonalBestController.js";

const router = express.Router();
const personalBestController = new PersonalBestController();

router.post("/", async (req, res) => {
  await personalBestController.addPersonalBest(req, res);
});
router.get("/", async (req, res) => {
  await personalBestController.getPersonalBests(req, res);
});
router.get("/exercise/:exerciseName", async (req, res) => {
  await personalBestController.getPersonalBestByExercise(req, res);
});
router.delete("/:id", async (req, res) => {
  await personalBestController.deletePersonalBest(req, res);
});

export default router;
