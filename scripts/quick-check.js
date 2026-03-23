const { PrismaClient } = require('@prisma/client');

// Simple script to check V94L seats in DB
async function run() {
  const prisma = new PrismaClient();
  try {
    const product = await prisma.product.findFirst({
      where: { modelName: 'V94L' }
    });
    console.log('V94L SEATS:', product.seatsMin, '-', product.seatsMax);
  } finally {
    await prisma.$disconnect();
  }
}

run();
