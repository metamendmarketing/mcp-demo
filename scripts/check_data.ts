import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      modelName: true,
      therapySummary: true,
      marketingSummary: true
    }
  });

  console.log(`Total Products: ${products.length}`);
  const missingTherapy = products.filter(p => !p.therapySummary || p.therapySummary === "");
  console.log(`Missing Therapy Summary: ${missingTherapy.length}`);
  missingTherapy.forEach(p => console.log(` - ${p.modelName}`));

  const missingMarketing = products.filter(p => !p.marketingSummary || p.marketingSummary === "");
  console.log(`Missing Marketing Summary: ${missingMarketing.length}`);
  missingMarketing.forEach(p => console.log(` - ${p.modelName}`));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
