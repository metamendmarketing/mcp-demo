import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Marquis data...');

  // 1. Create Brand
  const marquis = await prisma.brand.upsert({
    where: { domain: 'marquisspas.com' },
    update: {},
    create: {
      id: 'marquis',
      name: 'Marquis Spas',
      domain: 'marquisspas.com',
      themeConfig: {
        primary: '#1a365d',
        secondary: '#2d3748',
        accent: '#3182ce',
        logoUrl: '/brands/marquis/logo.svg',
      },
      active: true,
    },
  });

  // 2. Create Series
  const v21Series = await prisma.series.create({
    data: {
      brandId: marquis.id,
      name: 'Vector21 Swim Spas',
      category: 'swim_spa',
      positioningTier: 'luxury',
      description: 'The Vector21 series combines the features of a hot tub and swim spa.',
    },
  });

  // 3. Create Products
  const products = [
    {
      modelName: 'V150P',
      slug: 'v150p-swim-spa',
      brandId: marquis.id,
      seriesId: v21Series.id,
      seatsMin: 8,
      seatsMax: 8,
      jetCount: 39, // 36 + 3
      capacityGallons: 950,
      dryWeightLbs: 1800,
      lengthIn: 150,
      widthIn: 90,
      depthIn: 50,
      voltageOptions: ['240V'],
      amperage: '50 amp',
      marketingSummary: 'A huge party spa combining the features of a hot tub and swim spa.',
      usageTags: ['therapy', 'recreational'],
    },
    {
      modelName: 'V150W',
      slug: 'v150w-swim-spa',
      brandId: marquis.id,
      seriesId: v21Series.id,
      seatsMin: 4,
      seatsMax: 4,
      jetCount: 25, // 21 + 4
      capacityGallons: 1200,
      dryWeightLbs: 1700,
      lengthIn: 150,
      widthIn: 90,
      depthIn: 50,
      voltageOptions: ['240V'],
      amperage: '50 amp',
      marketingSummary: 'The personal aquatic multi-use gym you\'ve always wanted.',
      usageTags: ['fitness', 'workout'],
    },
    {
      modelName: 'V174S',
      slug: 'v174s-swim-spa',
      brandId: marquis.id,
      seriesId: v21Series.id,
      seatsMin: 4,
      seatsMax: 4,
      jetCount: 33, // 27 + 6
      capacityGallons: 1600,
      dryWeightLbs: 2325,
      lengthIn: 174,
      widthIn: 90,
      depthIn: 56,
      voltageOptions: ['240V'],
      amperage: '50 amp',
      marketingSummary: 'Pure exhilaration with true health benefits.',
      usageTags: ['fitness', 'therapy'],
    },
    {
      modelName: 'V174K',
      slug: 'v174k-swim-spa',
      brandId: marquis.id,
      seriesId: v21Series.id,
      seatsMin: 4,
      seatsMax: 4,
      jetCount: 37, // 31 + 6
      capacityGallons: 1600,
      dryWeightLbs: 2325,
      lengthIn: 174,
      widthIn: 90,
      depthIn: 56,
      voltageOptions: ['240V'],
      amperage: '50 amp',
      marketingSummary: 'High-performance swim-training and therapy.',
      usageTags: ['fitness', 'high-performance'],
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { slug: productData.slug },
      update: productData,
      create: productData,
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
