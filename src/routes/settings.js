import express from "express";
import Joi from "joi";
import UserController from "../controllers/UserController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validation.js";
import schemas from "../utils/schemas.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const userController = new UserController();
const updateSettingsSchema = schemas.updateUserSchema;

router.get("/", authMiddleware, async (req, res) => {
  await userController.getUserSettings(req, res);
});

router.put(
  "/",
  authMiddleware,
  validate(updateSettingsSchema),
  async (req, res) => {
    await userController.updateUserSettings(req, res);
  }
);

router.post("/reset", authMiddleware, async (req, res) => {
  await userController.resetUserSettings(req, res);
});

export default router;
