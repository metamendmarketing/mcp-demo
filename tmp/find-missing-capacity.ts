import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const products = await prisma.product.findMany({
    where: { 
      OR: [
        { seatsMax: null },
        { seatsMin: null }
      ]
    },
    select: { modelName: true, slug: true, seatsMin: true, seatsMax: true }
  });
  
  console.log(`Found ${products.length} products with missing capacity:`);
  products.forEach(p => console.log(`- ${p.modelName} (${p.slug}): ${p.seatsMin}-${p.seatsMax}`));
  
  await prisma.$disconnect();
}

check();
