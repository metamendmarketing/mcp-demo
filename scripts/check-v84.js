const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkV84() {
  const p = await prisma.product.findUnique({
    where: { slug: 'marquis-vector21-v84' }
  });
  console.log('Product V84 found:', !!p);
  if (p) {
    console.log('Series Name:', p.seriesName);
    console.log('Shell Colors Type:', typeof p.shellColors);
    console.log('Shell Colors Value:', p.shellColors);
    console.log('Cabinet Colors Value:', p.cabinetColors);
  }
}

checkV84().finally(() => prisma.$disconnect());
