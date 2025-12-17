import express from "express";
import Joi from "joi";
import UserController from "../controllers/UserController.js";
import validate from "../middleware/validation.js";
import schemas from "../utils/schemas.js";
import { authLimiter } from "../middleware/RateLimitter.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const userController = new UserController();

const loginSchema = schemas.loginSchema;
const registerSchema = schemas.registerSchema;

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  async (req, res, next) => {
    await userController.register(req, res, next);
  }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       429:
 *         description: Too many login attempts
 */
router.post(
  "/login",
  authLimiter,
  validate(loginSchema),
  async (req, res, next) => {
    await userController.login(req, res, next);
  }
);
export default router;
