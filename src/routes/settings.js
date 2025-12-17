import express from "express";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validation.js";
import schemas from "../utils/schemas.js";

const router = express.Router();
const userController = new UserController();
const updateSettingsSchema = schemas.updateUserSchema;

/**
 * @swagger
 * /settings:
 *   get:
 *     summary: Get user preferences and settings
 *     description: Retrieves all user-specific settings including weight unit preference, default exercise parameters, and rest timer configuration.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weight_unit:
 *                   type: string
 *                   enum: [kg, lbs]
 *                   example: kg
 *                   description: Unit for displaying and storing weights
 *                 default_sets:
 *                   type: integer
 *                   minimum: 1
 *                   example: 3
 *                   description: Default number of sets for new exercises
 *                 default_reps:
 *                   type: integer
 *                   minimum: 1
 *                   example: 12
 *                   description: Default number of reps for new exercises
 *                 rest_timer:
 *                   type: integer
 *                   minimum: 0
 *                   example: 60
 *                   description: Default rest time between sets in seconds
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       404:
 *         description: User settings not found
 */
router.get("/", authMiddleware, async (req, res, next) => {
  await userController.getUserSettings(req, res, next);
});

/**
 * @swagger
 * /settings:
 *   put:
 *     summary: Update user preferences and settings
 *     description: Updates one or more user settings. Only provided fields are updated; others remain unchanged.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               weight_unit:
 *                 type: string
 *                 enum: [kg, lbs]
 *                 example: kg
 *                 description: Preferred unit for weight display and storage
 *               default_sets:
 *                 type: integer
 *                 minimum: 1
 *                 example: 4
 *                 description: Default number of sets to suggest for new exercises
 *               default_reps:
 *                 type: integer
 *                 minimum: 1
 *                 example: 10
 *                 description: Default number of reps to suggest for new exercises
 *               rest_timer:
 *                 type: integer
 *                 minimum: 0
 *                 example: 90
 *                 description: Default rest interval between sets in seconds
 *     responses:
 *       200:
 *         description: Settings updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weight_unit:
 *                   type: string
 *                 default_sets:
 *                   type: integer
 *                 default_reps:
 *                   type: integer
 *                 rest_timer:
 *                   type: integer
 *       400:
 *         description: Bad request - no fields provided to update
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       422:
 *         description: Validation error - invalid field values
 */
router.put(
  "/",
  authMiddleware,
  validate(updateSettingsSchema),
  async (req, res, next) => {
    await userController.updateUserSettings(req, res, next);
  }
);

/**
 * @swagger
 * /settings/reset:
 *   post:
 *     summary: Reset all settings to default values
 *     description: Resets all user settings to application defaults. Default values are kg for weight unit, 3 sets, 12 reps, and 60 seconds rest timer.
 *     tags: [Settings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings reset to defaults successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 weight_unit:
 *                   type: string
 *                   example: kg
 *                 default_sets:
 *                   type: integer
 *                   example: 3
 *                 default_reps:
 *                   type: integer
 *                   example: 12
 *                 rest_timer:
 *                   type: integer
 *                   example: 60
 *                 message:
 *                   type: string
 *                   example: Settings reset to defaults
 *       401:
 *         description: Unauthorized - token invalid or expired
 *       500:
 *         description: Server error resetting settings
 */
router.post("/reset", authMiddleware, async (req, res, next) => {
  await userController.resetUserSettings(req, res, next);
});

export default router;
