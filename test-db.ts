import { prisma } from './src/lib/prisma';

async function main() {
  try {
    console.log('Testing Prisma query...');
    const products = await prisma.product.findMany();
    console.log(`Success! Found ${products.length} products.`);
    if (products.length > 0) {
      console.log('First product name:', products[0].name);
    }
  } catch (error: any) {
    console.error('Prisma query failed:', error);
    if (error.stack) console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

main();
