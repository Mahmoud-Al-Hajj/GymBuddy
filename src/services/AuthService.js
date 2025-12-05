import prisma from "../../prisma/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/jwt.js";

class AuthService {
  async login(email, password) {
    const user = await prisma.users.findUnique({ where: { email: email } });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid credentials");
    const token = generateToken(user.id);
    return { user, token };
  }

  async register(username, email, password) {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    const token = generateToken(user.id);
    return { user, token };
  }
}

export default AuthService;
