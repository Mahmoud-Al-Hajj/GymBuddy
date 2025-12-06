import express from "express";
import PersonalBestController from "../controllers/PersonalBestController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const personalBestController = new PersonalBestController();

router.post("/", authMiddleware, async (req, res) => {
  await personalBestController.addPersonalBest(req, res);
});
router.get("/", authMiddleware, async (req, res) => {
  await personalBestController.getPersonalBests(req, res);
});
router.get("/exercise/:exerciseName", authMiddleware, async (req, res) => {
  await personalBestController.getPersonalBestByExercise(req, res);
});
router.delete("/:id", authMiddleware, async (req, res) => {
  await personalBestController.deletePersonalBest(req, res);
});

export default router;
