import express from "express";
import ProgressPhotoController from "../controllers/ProgressPhotoController";

const router = express.Router();
const progressPhotoController = new ProgressPhotoController();

router.post("/", async (req, res) => {
  await progressPhotoController.addProgressPhoto(req, res);
});
router.get("/", async (req, res) => {
  await progressPhotoController.getProgressPhotos(req, res);
});
router.delete("/:id", async (req, res) => {
  await progressPhotoController.deleteProgressPhoto(req, res);
});

export default router;
