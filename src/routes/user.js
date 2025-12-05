import express from "express";
import Joi from "joi";
import UserController from "../controllers/UserController.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const userController = new UserController();

router.get("/profile", async (req, res) => {
  await userController.getUserById(req, res);
});
router.post("/profile", async (req, res) => {
  await userController.updateUser(req, res);
});
router.delete("/profile", async (req, res) => {
  await userController.deleteUser(req, res);
});

export default router;
