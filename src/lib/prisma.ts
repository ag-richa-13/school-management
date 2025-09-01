// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Ensure we use a global variable in development to avoid creating multiple clients
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

// Only assign to global in development
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
