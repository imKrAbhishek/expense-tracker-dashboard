import { PrismaClient } from '@prisma/client';

// Prevents multiple client instances in dev (hot-reload) from exhausting DB connections
const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
