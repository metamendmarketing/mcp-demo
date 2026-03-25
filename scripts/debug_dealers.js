const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debug() {
  try {
    const dealers = await prisma.dealer.findMany({
      where: { brandId: 'marquis' }
    });
    console.log(`Found ${dealers.length} Marquis dealers.`);
    dealers.forEach(d => {
      console.log(`- ${d.dealerName}: Lat=${d.lat}, Lng=${d.lng}, Zip=${d.postalCode}`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

debug();
