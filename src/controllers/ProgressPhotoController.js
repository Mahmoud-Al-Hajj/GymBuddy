import ProgressPhotoService from "../services/ProgressPhotoService.js";
import { uploadProgressPhoto } from "../utils/upload.js";

class ProgressPhotoController {
  constructor() {
    this.progressPhotoService = new ProgressPhotoService();
  }

  async addProgressPhoto(req, res, next) {
    try {
      const userId = req.user.id;
      const { workoutId } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      if (!workoutId) {
        return res.status(400).json({ error: "workoutId is required" });
      }

      // Upload to Supabase Storage
      const imageUrl = await uploadProgressPhoto(file);

      // Save to database with image URL
      const photo = await this.progressPhotoService.addProgressPhoto(
        userId,
        workoutId,
        imageUrl
      );
      res.status(201).json(photo);
    } catch (error) {
      next(error);
    }
  }

  async getProgressPhotos(req, res, next) {
    try {
      const userId = req.user.id;
      const photos = await this.progressPhotoService.getProgressPhotos(userId);
      res.status(200).json(photos);
    } catch (error) {
      next(error);
    }
  }

  async deleteProgressPhoto(req, res, next) {
    try {
      const userId = req.user.id;
      await this.progressPhotoService.deleteProgressPhoto(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
export default ProgressPhotoController;
