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

router.get("/profile", authMiddleware, async (req, res) => {
  await userController.getUserById(req, res);
});
router.post(
  "/profile",
  authMiddleware,
  validate(updateUserSchema),
  async (req, res) => {
    await userController.updateUser(req, res);
  }
);

router.delete("/profile", authMiddleware, async (req, res) => {
  await userController.deleteUser(req, res);
});

export default router;
