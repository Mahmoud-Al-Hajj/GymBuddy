import express from "express";
import Joi from "joi";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validation.js";
import schemas from "../utils/schemas.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const userController = new UserController();
const updateUserSchema = schemas.updateUserSchema;

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 username:
 *                   type: string
 *                 age:
 *                   type: integer
 *                 weight:
 *                   type: number
 *                 height:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get("/profile", authMiddleware, async (req, res, next) => {
  await userController.getUserById(req, res);
});

/**
 * @swagger
 * /users/profile:
 *   post:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               age:
 *                 type: integer
 *               weight:
 *                 type: number
 *               height:
 *                 type: number
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Validation error
 */
router.post(
  "/profile",
  authMiddleware,
  validate(updateUserSchema),
  async (req, res, next) => {
    await userController.updateUser(req, res, next);
  }
);

/**
 * @swagger
 * /users/profile:
 *   delete:
 *     summary: Delete user account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete("/profile", authMiddleware, async (req, res, next) => {
  await userController.deleteUser(req, res, next);
});

export default router;
