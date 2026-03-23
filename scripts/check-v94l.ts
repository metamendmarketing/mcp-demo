import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkV94L() {
  const v94l = await prisma.product.findFirst({
    where: { modelName: 'V94L' }
  });
  console.log('V94L Data:', JSON.stringify(v94l, null, 2));
  await prisma.$disconnect();
}

checkV94L();
