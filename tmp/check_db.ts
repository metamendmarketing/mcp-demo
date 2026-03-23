import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

async function main() {
  const dbPath = path.resolve('c:/dev2/prisma/dev.db');
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  const prisma = new PrismaClient({ adapter } as any);

  const productCount = await prisma.product.count();
  const products = await prisma.product.findMany({
    include: { series: true }
  });

  console.log(`Total Products: ${productCount}`);
  products.forEach(p => {
    console.log(` - ${p.modelName} (${p.series.name}) [${p.series.category}]`);
  });

  await prisma.$disconnect();
}

main();
