import { PrismaClient } from "@prisma/client";

// Standard Next.js singleton pattern: in dev, hot-reloading would otherwise
// create a new PrismaClient (and a new connection pool) on every file save.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
