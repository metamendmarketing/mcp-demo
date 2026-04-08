import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const p = await prisma.product.findFirst({
    where: { slug: 'marquis-celebrity-broadway' }
  });
  console.log('Broadway:', JSON.stringify({
    modelName: p?.modelName,
    seatsMin: p?.seatsMin,
    seatsMax: p?.seatsMax
  }, null, 2));
  await prisma.$disconnect();
}

check();
