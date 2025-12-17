import { PrismaClient } from "@prisma/client";
import logger from "../src/config/logger.js";

const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "stdout", level: "error" },
    { emit: "stdout", level: "warn" },
  ],
});
// Log slow queries
prisma.$on("query", (e) => {
  if (e.duration > 100) {
    logger.warn({
      type: "slow_query",
      duration: `${e.duration}ms`,
      query: e.query.substring(0, 100), // First 100 chars only
    });
  }
});

process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
