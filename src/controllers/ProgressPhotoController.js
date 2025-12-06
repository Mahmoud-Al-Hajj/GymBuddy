import ProgressPhotoService from "../services/ProgressPhotoService.js";

class ProgressPhotoController {
  constructor() {
    this.progressPhotoService = new ProgressPhotoService();
  }

  async addProgressPhoto(req, res) {
    try {
      const userId = req.user.id;
      const { workoutId, imageUrl } = req.body;
      const photo = await this.progressPhotoService.addProgressPhoto(
        userId,
        workoutId,
        imageUrl
      );
      res.status(201).json(photo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getProgressPhotos(req, res) {
    try {
      const userId = req.user.id;
      const photos = await this.progressPhotoService.getProgressPhotos(userId);
      res.status(200).json(photos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProgressPhoto(req, res) {
    try {
      const { id } = req.params;
      await this.progressPhotoService.deleteProgressPhoto(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}
export default ProgressPhotoController;
