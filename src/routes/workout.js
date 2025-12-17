import express from "express";
import WorkoutController from "../controllers/WorkoutController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validation from "../middleware/validation.js";
import schemas from "../utils/schemas.js";

const router = express.Router();
const workoutController = new WorkoutController();

const createWorkoutSchema = schemas.createWorkoutSchema;
const addExerciseSchema = schemas.addExerciseSchema;
const completeExerciseSchema = schemas.completeExerciseSchema;

// ============ WORKOUT ROUTES ============

/**
 * @swagger
 * /workouts:
 *   post:
 *     summary: Create a new workout with exercises
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - exercises
 *             properties:
 *               name:
 *                 type: string
 *                 example: Chest and Triceps
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-12-17T10:30:00Z
 *               exercises:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - sets
 *                     - reps
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Bench Press
 *                     sets:
 *                       type: integer
 *                       minimum: 1
 *                       example: 4
 *                     reps:
 *                       type: integer
 *                       minimum: 1
 *                       example: 8
 *                     weight:
 *                       type: number
 *                       example: 100.5
 *     responses:
 *       201:
 *         description: Workout created successfully with exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 exercises:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       sets:
 *                         type: integer
 *                       reps:
 *                         type: integer
 *                       weight:
 *                         type: number
 *       400:
 *         description: Validation error or workout must have at least one exercise
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authMiddleware,
  validation(createWorkoutSchema),
  async (req, res, next) => {
    await workoutController.createWorkout(req, res, next);
  }
);

/**
 * @swagger
 * /workouts:
 *   get:
 *     summary: Get all workouts for authenticated user
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workouts ordered by most recent
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   exercises:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         sets:
 *                           type: integer
 *                         reps:
 *                           type: integer
 *                         weight:
 *                           type: number
 *                         completed:
 *                           type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, async (req, res, next) => {
  await workoutController.getWorkoutsByUserId(req, res, next);
});

/**
 * @swagger
 * /workouts/{id}:
 *   get:
 *     summary: Get a specific workout by ID
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Workout ID
 *     responses:
 *       200:
 *         description: Workout details with all exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 notes:
 *                   type: string
 *                 exercises:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       sets:
 *                         type: integer
 *                       reps:
 *                         type: integer
 *                       weight:
 *                         type: number
 *                       completed:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.get("/:id", authMiddleware, async (req, res, next) => {
  await workoutController.getWorkoutById(req, res, next);
});

/**
 * @swagger
 * /workouts/{id}:
 *   put:
 *     summary: Update a workout
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Workout Name
 *               date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *                 example: Great workout session
 *     responses:
 *       200:
 *         description: Workout updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.put("/:id", authMiddleware, async (req, res, next) => {
  await workoutController.updateWorkout(req, res, next);
});

/**
 * @swagger
 * /workouts/{id}:
 *   delete:
 *     summary: Delete a workout (cascades to exercises)
 *     tags: [Workouts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Workout deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.delete("/:id", authMiddleware, async (req, res, next) => {
  await workoutController.deleteWorkout(req, res, next);
});

// ============ EXERCISE ROUTES ============

/**
 * @swagger
 * /workouts/{workoutId}/exercises:
 *   post:
 *     summary: Add an exercise to a workout
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - sets
 *               - reps
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dumbbell Curls
 *               sets:
 *                 type: integer
 *                 minimum: 1
 *                 example: 3
 *               reps:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *               weight:
 *                 type: number
 *                 example: 25.0
 *     responses:
 *       201:
 *         description: Exercise added to workout
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 sets:
 *                   type: integer
 *                 reps:
 *                   type: integer
 *                 weight:
 *                   type: number
 *                 completed:
 *                   type: boolean
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout not found
 */
router.post(
  "/:workoutId/exercises",
  authMiddleware,
  validation(addExerciseSchema),
  async (req, res, next) => {
    await workoutController.addExercise(req, res, next);
  }
);

/**
 * @swagger
 * /workouts/exercises/{exerciseId}:
 *   put:
 *     summary: Update an exercise
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               sets:
 *                 type: integer
 *                 minimum: 1
 *               reps:
 *                 type: integer
 *                 minimum: 1
 *               weight:
 *                 type: number
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Exercise updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 sets:
 *                   type: integer
 *                 reps:
 *                   type: integer
 *                 weight:
 *                   type: number
 *                 completed:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.put("/exercises/:exerciseId", authMiddleware, async (req, res, next) => {
  await workoutController.updateExercise(req, res, next);
});

/**
 * @swagger
 * /workouts/exercises/{exerciseId}:
 *   delete:
 *     summary: Delete an exercise from a workout
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Exercise deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.delete(
  "/exercises/:exerciseId",
  authMiddleware,
  async (req, res, next) => {
    await workoutController.deleteExercise(req, res, next);
  }
);

/**
 * @swagger
 * /workouts/exercises/{exerciseId}/complete:
 *   post:
 *     summary: Mark exercise as completed
 *     tags: [Exercises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - completed
 *             properties:
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Exercise completion status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 completed:
 *                   type: boolean
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise not found
 */
router.post(
  "/exercises/:exerciseId/complete",
  authMiddleware,
  validation(completeExerciseSchema),
  async (req, res, next) => {
    await workoutController.completeExercise(req, res, next);
  }
);

export default router;
