import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Use absolute path for dev database
const dbPath = path.resolve(process.cwd(), 'prisma/dev.db');
console.log(`[PRISMA] Initializing client with DB at: ${dbPath}`);

const adapter = new PrismaBetterSqlite3({ 
  url: `file:${dbPath.replace(/\\/g, '/')}` 
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
