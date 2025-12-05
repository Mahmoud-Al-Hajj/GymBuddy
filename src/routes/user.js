import express from "express";
import Joi from "joi";
import UserController from "../controllers/UserController.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const userController = new UserController();

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).required(),
  gender: Joi.string().valid("male", "female").optional(),
  age: Joi.number().integer().min(10).max(100).optional(),
  weight: Joi.number().positive().max(180).optional(),
  height: Joi.number().positive().max(250).optional(),
});

router.get("/profile", async (req, res) => {
  await userController.getUserById(req, res);
});
router.post("/profile", async (req, res) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, error: error.details[0].message });
  }
  await userController.updateUser(req, res);
});
router.delete("/profile", async (req, res) => {
  await userController.deleteUser(req, res);
});

export default router;
