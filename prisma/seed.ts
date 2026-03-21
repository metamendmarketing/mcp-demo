import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';

// Use the same adapter setup as src/lib/prisma.ts
const dbPath = path.resolve('c:/dev2/prisma/dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Clear existing data for a clean seed
  await prisma.product.deleteMany({ where: { brandId: 'marquis' } });
  await prisma.series.deleteMany({ where: { brandId: 'marquis' } });
  
  // Find or create the Marquis brand
  let marquis = await prisma.brand.findFirst({ where: { domain: 'marquisspas.com' } });
  if (!marquis) {
    marquis = await prisma.brand.create({
      data: {
        name: 'Marquis',
        domain: 'marquisspas.com',
        logoUrl: '/mcp/demo/assets/marquis_logo.png',
        themeConfig: {
          primary: '#88a65e',
          secondary: '#306797',
          accent: '#ffffff',
          fontFamily: 'Inter, sans-serif'
        }
      }
    });
  }

  // Create Crown Series
  const crownSeries = await prisma.series.create({
    data: {
      brandId: marquis.id,
      name: 'Crown Series',
      category: 'hot_tub',
      positioningTier: 'luxury',
      description: 'The ultimate hot tub experience with V-O-L-T™ flow management.'
    }
  });

  // Seed Models
  const products = [
    {
      modelName: 'Summit',
      slug: 'marquis-crown-summit',
      seatsMin: 7,
      seatsMax: 7,
      jetCount: 65,
      lengthIn: 94,
      widthIn: 94,
      depthIn: 36,
      capacityGallons: 400, // Estimated
      loungeCount: 0,
      voltageOptions: ["240V"],
      heroImageUrl: 'https://www.marquisspas.com/media/177319/summit_beauty.jpg',
      overheadImageUrl: 'https://www.marquisspas.com/media/177314/2021_crown_summit_overhead.jpg',
      usageTags: ["therapy", "social", "large-family"],
      hotspots: [
        { id: "hot-zone-leg", x: 50, y: 75, label: "Whitewater-4™ Jet", description: "This monster jet in the footwell provides incredible leg and foot therapy, moving massive volumes of water without the sting." },
        { id: "hot-zone-back", x: 15, y: 15, label: "H.O.T. Zone™", description: "High Output Therapy zones target the back and shoulders with concentrated precision." },
        { id: "controls", x: 92, y: 50, label: "MQTouch™ Control", description: "The color touch-screen interface allows you to orchestrate your entire spa experience with a tap." }
      ]
    },
    {
      modelName: 'Epic',
      slug: 'marquis-crown-epic',
      seatsMin: 6,
      seatsMax: 6,
      jetCount: 53,
      lengthIn: 90,
      widthIn: 90,
      depthIn: 36,
      loungeCount: 1,
      voltageOptions: ["240V"],
      heroImageUrl: 'https://www.marquisspas.com/media/177319/summit_beauty.jpg', // Placeholder
      usageTags: ["therapy", "comfort", "lounge"]
    },
    {
      modelName: 'Spirit',
      slug: 'marquis-crown-spirit',
      seatsMin: 3,
      seatsMax: 4,
      jetCount: 32,
      lengthIn: 85,
      widthIn: 66,
      depthIn: 36,
      capacityGallons: 265,
      loungeCount: 1,
      voltageOptions: ["110V", "240V"], // Often 110V compatible
      heroImageUrl: 'https://www.marquisspas.com/media/177319/summit_beauty.jpg', // Placeholder
      usageTags: ["compact", "couples", "therapy"]
    },
    {
      modelName: 'Euphoria',
      slug: 'marquis-crown-euphoria',
      seatsMin: 7,
      seatsMax: 7,
      jetCount: 53,
      lengthIn: 90,
      widthIn: 90,
      depthIn: 36,
      capacityGallons: 380,
      loungeCount: 0,
      voltageOptions: ["240V"],
      heroImageUrl: 'https://www.marquisspas.com/media/177319/summit_beauty.jpg', // Placeholder
      usageTags: ["therapy", "large-family", "social"]
    },
    {
      modelName: 'Resort',
      slug: 'marquis-crown-resort',
      seatsMin: 5,
      seatsMax: 5,
      jetCount: 50,
      lengthIn: 85,
      widthIn: 85,
      depthIn: 36,
      capacityGallons: 360,
      loungeCount: 2, // Dual Adirondack loungers
      voltageOptions: ["240V"],
      heroImageUrl: 'https://www.marquisspas.com/media/177319/summit_beauty.jpg', // Placeholder
      usageTags: ["lounge", "therapy", "comfort"]
    },
    {
      modelName: 'Wish',
      slug: 'marquis-crown-wish',
      seatsMin: 5,
      seatsMax: 5,
      jetCount: 30, // 2-pump model
      lengthIn: 77,
      widthIn: 77,
      depthIn: 36,
      capacityGallons: 300, // Estimated based on dimensions
      loungeCount: 1, // Full-body lounge
      voltageOptions: ["240V"],
      heroImageUrl: 'https://www.marquisspas.com/media/177319/summit_beauty.jpg', // Placeholder
      usageTags: ["lounge", "compact", "relaxation"]
    }
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: {
        ...productData,
        brandId: marquis!.id,
        seriesId: crownSeries.id,
        standardFeatures: JSON.stringify(["MQTouch", "V-O-L-T Flow", "SmartClean"]),
        hotspots: JSON.stringify(productData.hotspots || []),
        usageTags: JSON.stringify(productData.usageTags || []),
        voltageOptions: JSON.stringify(productData.voltageOptions || [])
      } as any
    });
  }

  console.log('Seed completed for Marquis Crown Series.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
