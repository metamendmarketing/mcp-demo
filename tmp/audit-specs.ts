import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function audit() {
  const products = await prisma.product.findMany({
    include: { series: true }
  });

  console.log(`Auditing ${products.length} products...\n`);

  const issues = [];

  for (const p of products) {
    const missing = [];
    if (!p.lengthIn) missing.push('lengthIn');
    if (!p.widthIn) missing.push('widthIn');
    if (!p.depthIn) missing.push('depthIn');
    if (!p.jetCount) missing.push('jetCount');
    if (!p.pumpFlowGpm) missing.push('pumpFlowGpm');

    if (missing.length > 0) {
      issues.push({
        id: p.id,
        name: p.modelName,
        slug: p.slug,
        series: p.series?.name,
        missing
      });
    }
  }

  if (issues.length === 0) {
    console.log('No missing specs found!');
  } else {
    console.log(`Found ${issues.length} products with missing specs:\n`);
    console.log(JSON.stringify(issues, null, 2));
  }

  await prisma.$disconnect();
}

audit();
