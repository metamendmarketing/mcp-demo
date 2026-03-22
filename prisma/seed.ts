import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use the same adapter setup as src/lib/prisma.ts
const dbPath = path.resolve('c:/dev2/prisma/dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const productsRaw = JSON.parse(fs.readFileSync(path.resolve('c:/dev2/prisma/marquis-products.json'), 'utf8'));

  // Clear existing data for a clean seed
  // (Optional: keep existing brands if you want, but here we reset Marquis)
  await prisma.product.deleteMany({ where: { brandId: 'marquis' } });
  await prisma.series.deleteMany({ where: { brandId: 'marquis' } });
  
  // Find or create the Marquis brand
  let marquis = await prisma.brand.findFirst({ where: { domain: 'marquisspas.com' } });
  if (!marquis) {
    marquis = await prisma.brand.create({
      data: {
        id: 'marquis',
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

  // Create Series lookup
  const seriesNames = [...new Set(productsRaw.map((p: any) => p.seriesName))] as string[];
  const seriesMap: Record<string, string> = {};

  for (const sName of seriesNames) {
    let series = await prisma.series.findFirst({ where: { name: sName, brandId: marquis.id } });
    if (!series) {
      series = await prisma.series.create({
        data: {
          brandId: marquis.id,
          name: sName,
          category: sName.toLowerCase().includes('swim') ? 'swim_spa' : 'hot_tub',
          positioningTier: sName.includes('Crown') ? 'luxury' : (sName.includes('Elite') ? 'premium' : 'value'),
          description: `${sName} by Marquis.`
        }
      });
    }
    seriesMap[sName] = series.id;
  }

  // Seed Products
  for (const p of productsRaw) {
    // Skip placeholder/accessory pages that look like products
    if (!p.jetCount && !p.dimensions && !p.marketingSummary) continue;

    await prisma.product.create({
      data: {
        brandId: marquis.id,
        seriesId: seriesMap[p.seriesName],
        modelName: p.modelName.replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()), // Title Case
        slug: p.slug,
        status: 'active',
        heroImageUrl: p.heroImageUrl,
        overheadImageUrl: p.overheadImageUrl,
        seatsMin: p.seatsMin || p.seatsMax,
        seatsMax: p.seatsMax,
        jetCount: p.jetCount,
        capacityGallons: p.capacityGallons,
        dryWeightLbs: p.dryWeightLbs,
        fullWeightLbs: p.fullWeightLbs,
        lengthIn: p.lengthIn,
        widthIn: p.widthIn,
        depthIn: p.depthIn,
        marketingSummary: p.marketingSummary,
        standardFeatures: JSON.stringify(p.standardFeatures || []),
        optionalFeatures: JSON.stringify(p.optionalFeatures || []),
        shellColors: JSON.stringify(p.shellColors || []),
        cabinetColors: JSON.stringify(p.cabinetColors || []),
        usageTags: JSON.stringify(p.usageTags || []),
        voltageOptions: JSON.stringify([p.electricalAmps === 50 ? "240V" : "110V/240V"]),
        hotspots: JSON.stringify([]) // To be populated by AI or manual later
      }
    });
  }

  // Seed Feature Glossary
  const glossaryItems = [
    {
      term: "ConstantClean™",
      consumerExplanation: "Marquis' proprietary water management system that cleans the water up to 51 times a day. It uses high-flow filtration and integrated sanitation to keep water crystal clear with minimal effort.",
      relatedFeatures: ["SmartClean", "In-line Sanitation"]
    },
    {
      term: "V-O-L-T™ System",
      consumerExplanation: "Vector-Optimized Laminar Therapy system delivers more water with less turbulence, providing a deeper, more effective massage without the 'sting' of traditional jets.",
      relatedFeatures: ["V3 Throttle Control", "Jetpods"]
    },
    {
      term: "High-flow Therapy",
      consumerExplanation: "A system designed to move massive volumes of water at low pressure, ensuring a deep-tissue massage that is both powerful and comfortable.",
      relatedFeatures: ["Whitewater-4 jet", "H.O.T. Zones"]
    },
    {
      term: "MicroSilk®",
      consumerExplanation: "Oxygen skin therapy that produces billions of tiny, oxygen-rich microbubbles that clean pores, stimulate collagen, and improve skin health.",
      relatedFeatures: ["Skin Health", "Relaxation"]
    }
  ];

  for (const item of glossaryItems) {
    await prisma.featureGlossary.upsert({
      where: { brandId_term: { brandId: marquis.id, term: item.term } },
      update: { consumerExplanation: item.consumerExplanation, relatedFeatures: JSON.stringify(item.relatedFeatures) },
      create: { 
        brandId: marquis.id, 
        term: item.term, 
        consumerExplanation: item.consumerExplanation, 
        relatedFeatures: JSON.stringify(item.relatedFeatures) 
      }
    });
  }

  console.log(`Seed completed. Populated ${productsRaw.length} products and specialized glossary.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
