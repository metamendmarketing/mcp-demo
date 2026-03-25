import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
  const dealers = await prisma.dealer.findMany({
    include: { brand: true }
  });
  console.log(`Total Dealers: ${dealers.length}`);
  dealers.forEach(d => {
    console.log(`- ${d.dealerName} (ID: ${d.id}, Brand: ${d.brandId}, Lat: ${d.lat}, Lng: ${d.lng})`);
  });
  await prisma.$disconnect();
}

check();
