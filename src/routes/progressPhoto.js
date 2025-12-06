import express from "express";
import ProgressPhotoController from "../controllers/ProgressPhotoController";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const progressPhotoController = new ProgressPhotoController();

router.post("/", authMiddleware, async (req, res) => {
  await progressPhotoController.addProgressPhoto(req, res);
});
router.get("/", authMiddleware, async (req, res) => {
  await progressPhotoController.getProgressPhotos(req, res);
});
router.delete("/:id", authMiddleware, async (req, res) => {
  await progressPhotoController.deleteProgressPhoto(req, res);
});

export default router;
