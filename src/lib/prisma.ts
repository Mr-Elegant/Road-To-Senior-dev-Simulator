import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Auth queries contain credential hashes and session identifiers. Keep raw
    // Prisma errors out of logs; API handlers return redacted errors instead.
    log: process.env.NODE_ENV === 'development' ? ['warn'] : [],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

