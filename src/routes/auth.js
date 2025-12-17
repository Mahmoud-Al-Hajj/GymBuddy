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

router.post("/login", authLimiter, validate(loginSchema), async (req, res) => {
  await userController.login(req, res);
});

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  async (req, res) => {
    await userController.register(req, res);
  }
);

export default router;
