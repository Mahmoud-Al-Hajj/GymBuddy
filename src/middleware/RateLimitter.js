import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 900,
  message: { error: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === "/health" || req.path === "/health/ready",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // Only 5 attempts per 15 minutes
  message: { error: "Too many login attempts, try again later" },
  skipSuccessfulRequests: true, // Reset on successful login
  standardHeaders: true,
  legacyHeaders: false,
});
