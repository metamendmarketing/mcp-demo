import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Standard Prisma Client for Marquis Buying Assistant.
 * 
 * Powered by Supabase (Postgres). 
 * This version eliminates all serverless engine crashes and
 * supports real-time Admin Tool saves.
 */
function createPrismaClient() {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
