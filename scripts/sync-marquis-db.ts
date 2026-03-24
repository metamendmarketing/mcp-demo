import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function sync() {
  const data = JSON.parse(fs.readFileSync('prisma/marquis-products.json', 'utf8'));
  
  console.log(`Starting sync for ${data.length} products...`);

  for (const p of data) {
    await prisma.product.update({
      where: { slug: p.slug },
      data: {
        shellColors: JSON.stringify(p.shellColors),
        cabinetColors: JSON.stringify(p.cabinetColors),
        // Ensure seatsMax/Min are also synced in case they were updated
        seatsMin: p.seatsMin,
        seatsMax: p.seatsMax,
        marketingSummary: p.marketingSummary
      }
    });
  }

  console.log('Database synchronization complete.');
  await prisma.$disconnect();
}

sync().catch(console.error);
