import express from "express";
import ProgressPhotoController from "../controllers/ProgressPhotoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadMiddleware } from "../middleware/Upload.js";

const router = express.Router();
router.use(authMiddleware);
const progressPhotoController = new ProgressPhotoController();

/**
 * @swagger
 * /progress-photos:
 *   post:
 *     summary: Upload a new progress photo
 *     description: Uploads a progress tracking photo associated with a specific workout. Photos are stored in Supabase cloud storage.
 *     tags: [Progress Photos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - workoutId
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPG, PNG, GIF, WebP). Max 5MB
 *               workoutId:
 *                 type: integer
 *                 example: 42
 *                 description: ID of the associated workout
 *     responses:
 *       201:
 *         description: Progress photo uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 workout_id:
 *                   type: integer
 *                 image_url:
 *                   type: string
 *                   format: uri
 *                   description: URL to access the uploaded image
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Invalid request - missing file or invalid format
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       413:
 *         description: File too large (max 5MB)
 *       500:
 *         description: Error uploading to cloud storage
 */
router.post("/", uploadMiddleware.single("image"), async (req, res, next) => {
  await progressPhotoController.addProgressPhoto(req, res, next);
});

/**
 * @swagger
 * /progress-photos:
 *   get:
 *     summary: Retrieve all progress photos
 *     description: Gets all progress photos for the authenticated user, ordered by most recent date first. Includes image URLs for direct access.
 *     tags: [Progress Photos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of progress photos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   workout_id:
 *                     type: integer
 *                   image_url:
 *                     type: string
 *                     format: uri
 *                     description: Direct URL to the image in cloud storage
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       500:
 *         description: Server error retrieving photos
 */
router.get("/", async (req, res, next) => {
  await progressPhotoController.getProgressPhotos(req, res, next);
});

/**
 * @swagger
 * /progress-photos/{id}:
 *   delete:
 *     summary: Delete a progress photo
 *     description: Permanently deletes a specific progress photo. The image file is also removed from cloud storage. This action cannot be undone.
 *     tags: [Progress Photos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 28
 *         description: ID of the progress photo to delete
 *     responses:
 *       204:
 *         description: Progress photo deleted successfully
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       404:
 *         description: Progress photo not found
 *       500:
 *         description: Error deleting from cloud storage
 */
router.delete("/:id", async (req, res, next) => {
  await progressPhotoController.deleteProgressPhoto(req, res, next);
});

export default router;
