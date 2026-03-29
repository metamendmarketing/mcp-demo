import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating SystemPrompt table manually...');
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SystemPrompt" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "SystemPrompt_pkey" PRIMARY KEY ("id")
      );
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS "SystemPrompt_key_key" ON "SystemPrompt"("key");
    `);

    console.log('Table created or already exists.');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
