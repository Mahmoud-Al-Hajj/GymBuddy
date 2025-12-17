import express from "express";
import PersonalBestController from "../controllers/PersonalBestController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const personalBestController = new PersonalBestController();

/**
 * @swagger
 * /personal-bests:
 *   post:
 *     summary: Record a new personal best for an exercise
 *     description: Creates a new personal best record. Compares with existing records to determine if it's a new PR.
 *     tags: [Personal Bests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - workoutId
 *               - exerciseName
 *               - weight
 *               - reps
 *             properties:
 *               workoutId:
 *                 type: integer
 *                 example: 42
 *                 description: ID of the workout this personal best is from
 *               exerciseName:
 *                 type: string
 *                 example: Bench Press
 *                 description: Name of the exercise
 *               weight:
 *                 type: number
 *                 example: 135.5
 *                 description: Weight lifted (in kg or lbs based on user settings)
 *               reps:
 *                 type: integer
 *                 minimum: 1
 *                 example: 5
 *                 description: Number of reps completed
 *     responses:
 *       201:
 *         description: Personal best recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 workoutId:
 *                   type: integer
 *                 exerciseName:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 reps:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *       200:
 *         description: Record saved but not a new personal best
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Not a new personal best
 *       400:
 *         description: Validation error or missing required fields
 *       401:
 *         description: Unauthorized - token invalid or expired
 */
router.post("/", authMiddleware, async (req, res, next) => {
  await personalBestController.addPersonalBest(req, res, next);
});

/**
 * @swagger
 * /personal-bests:
 *   get:
 *     summary: Get all personal bests for the authenticated user
 *     description: Retrieves a complete list of all personal best records for the authenticated user, ordered by most recent.
 *     tags: [Personal Bests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all personal bests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   workoutId:
 *                     type: integer
 *                   exerciseName:
 *                     type: string
 *                   weight:
 *                     type: number
 *                   reps:
 *                     type: integer
 *                   date:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       500:
 *         description: Server error retrieving personal bests
 */
router.get("/", authMiddleware, async (req, res, next) => {
  await personalBestController.getPersonalBests(req, res, next);
});

/**
 * @swagger
 * /personal-bests/exercise/{exerciseName}:
 *   get:
 *     summary: Get personal best record for a specific exercise
 *     description: Retrieves the highest personal best record for a specific exercise by name.
 *     tags: [Personal Bests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseName
 *         required: true
 *         schema:
 *           type: string
 *         example: Bench Press
 *         description: Name of the exercise to query
 *     responses:
 *       200:
 *         description: Personal best record for the exercise
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 workout_id:
 *                   type: integer
 *                 exercise_name:
 *                   type: string
 *                 weight:
 *                   type: number
 *                 reps:
 *                   type: integer
 *                 date:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       404:
 *         description: No personal best found for this exercise
 */
router.get(
  "/exercise/:exerciseName",
  authMiddleware,
  async (req, res, next) => {
    await personalBestController.getPersonalBestByExercise(req, res, next);
  }
);

/**
 * @swagger
 * /personal-bests/{id}:
 *   delete:
 *     summary: Delete a personal best record
 *     description: Permanently deletes a specific personal best record by ID. This action cannot be undone.
 *     tags: [Personal Bests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 15
 *         description: ID of the personal best record to delete
 *     responses:
 *       204:
 *         description: Personal best record deleted successfully
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       404:
 *         description: Personal best record not found
 */
router.delete("/:id", authMiddleware, async (req, res, next) => {
  await personalBestController.deletePersonalBest(req, res, next);
});

export default router;
