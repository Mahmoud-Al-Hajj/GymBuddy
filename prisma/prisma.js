import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

// Handle graceful shutdown
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

export default prisma;
