import express from "express";
import ProgressPhotoController from "../controllers/ProgressPhotoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/Upload.js";

const router = express.Router();
router.use(authMiddleware);
const progressPhotoController = new ProgressPhotoController();

router.post("/", uploadMiddleware.single("image"), async (req, res) => {
  await progressPhotoController.addProgressPhoto(req, res);
});

router.get("/", async (req, res) => {
  await progressPhotoController.getProgressPhotos(req, res);
});
router.delete("/:id", async (req, res) => {
  await progressPhotoController.deleteProgressPhoto(req, res);
});

export default router;
