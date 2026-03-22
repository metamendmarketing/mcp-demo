import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Use the same adapter setup as src/lib/prisma.ts
const dbPath = path.resolve('c:/dev2/prisma/dev.db');
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter } as any);

const ALL_HOTSPOTS: Record<string, any[]> = {
  'marquis-crown-summit': [
    { id: "hot-zone-leg", x: 50, y: 75, label: "Whitewater-4 Jet", description: "This monster jet in the footwell provides incredible leg and foot therapy, moving massive volumes of water without the sting." },
    { id: "hot-zone-back", x: 15, y: 15, label: "H.O.T. Zone", description: "High Output Therapy zones target the back and shoulders with concentrated precision." },
    { id: "controls", x: 92, y: 50, label: "MQTouch Control", description: "The color touch-screen interface allows you to orchestrate your entire spa experience with a tap." },
    { id: "massage-seats", x: 30, y: 30, label: "Specialized Massage Seats", description: "Flexible and varied massage options for any mood.", imageUrl: "/mcp/demo/assets/products/marquis-crown-summit/details/massage-seats.jpg" }
  ],
  'marquis-crown-epic': [
    { id: "adirondack", x: 25, y: 25, label: "Adirondack Chair", description: "A deeply sculpted seat providing full-body support and deep, targeted relief from neck to feet." },
    { id: "geyser", x: 75, y: 75, label: "Geyser Seat", description: "Strategically designed to surround you in warmth while focusing therapy on the neck, shoulders, and spine." },
    { id: "massage-seats", x: 50, y: 50, label: "Specialized Massage Seats", description: "Experience a variety of sensations for all-in-one therapy.", imageUrl: "/mcp/demo/assets/products/marquis-crown-epic/details/massage-seats.jpg" }
  ],
  'marquis-crown-euphoria': [
    { id: "deep-therapy", x: 20, y: 20, label: "Deep Therapy Seats", description: "Side-by-side therapy seats offer a comprehensive full-body massage without feeling crowded." },
    { id: "whitewater", x: 50, y: 50, label: "Regal Whitewater-4", description: "Centrally located to provide massive volumes of water for powerful leg and foot therapy in every seat." },
    { id: "massage-seats", x: 80, y: 20, label: "Specialized Massage Seats", description: "The ultimate shared relaxation experience.", imageUrl: "/mcp/demo/assets/products/marquis-crown-euphoria/details/massage-seats.jpg" }
  ],
  'marquis-crown-resort': [
    { id: "adirondack-1", x: 20, y: 30, label: "Adirondack Chair", description: "Features Lumbar H.O.T. Zone jets for targeted relief in a supportive, relaxed posture." },
    { id: "adirondack-2", x: 70, y: 30, label: "Adirondack Chair", description: "Features Shoulder H.O.T. Zone jets to melt away upper-body tension after a long day." },
    { id: "massage-seats", x: 45, y: 75, label: "Specialized Massage Seats", description: "A resort-style experience in your own backyard.", imageUrl: "/mcp/demo/assets/products/marquis-crown-resort/details/massage-seats.jpg" }
  ],
  'marquis-crown-destiny': [
    { id: "social-seating", x: 50, y: 20, label: "Open Social Seating", description: "The non-lounge layout maximizes space for conversation while ensuring everyone has a dedicated therapy seat." },
    { id: "hot-zone-foot", x: 50, y: 80, label: "Foot H.O.T. Zone", description: "Targeted high-output therapy for tired feet, a favorite for athletes and active families." },
    { id: "massage-seats", x: 20, y: 50, label: "Specialized Massage Seats", description: "Versatile hydrotherapy for every guest.", imageUrl: "/mcp/demo/assets/products/marquis-crown-destiny/details/massage-seats.jpg" }
  ],
  'marquis-crown-spirit': [
    { id: "lounge", x: 30, y: 50, label: "Therapy Lounge", description: "A soothing full-body lounge with dedicated Shoulder H.O.T. Zone jets for targeted tension relief." },
    { id: "cooldown", x: 85, y: 15, label: "Elevated Seat", description: "An ideal spot for warming up or cooling down, also serving as an easy entry/exit point." },
    { id: "massage-seats", x: 60, y: 60, label: "Specialized Massage Seats", description: "A peaceful location to re-center and relax.", imageUrl: "/mcp/demo/assets/products/marquis-crown-spirit/details/massage-seats.jpg" }
  ],
  'marquis-crown-wish': [
    { id: "full-body-lounge", x: 30, y: 60, label: "Body Lounge", description: "Sculpted to cradles your body from head to toe, delivering sustained, multi-point pressure relief." },
    { id: "cooldown", x: 80, y: 20, label: "Cooldown Seat", description: "Avoid overheating by using this slightly elevated seat during longer social sessions." },
    { id: "massage-seats", x: 50, y: 50, label: "Specialized Massage Seats", description: "Intimate and effective hydrotherapy.", imageUrl: "/mcp/demo/assets/products/marquis-crown-wish/details/massage-seats.jpg" }
  ],
  'marquis-vector21-v84l': [
    { id: "swedish-lounge", x: 78, y: 22, label: "Swedish Massage Lounge", description: "Focused on long, soothing strokes and total body relaxation. Uses massive water volume for a deep, rhythmic soak." },
    { id: "relaxation-seat", x: 88, y: 50, label: "Relaxation Massage Seat", description: "A gentle yet firm massage designed to reduce stress and improve circulation in the upper and lower back." },
    { id: "shiatsu-seat", x: 74, y: 78, label: "Shiatsu Massage Seat", description: "Utilizes targeted high-pressure points to release deep muscle tension and stimulate vital pressure points." },
    { id: "deep-tissue-seat", x: 22, y: 76, label: "Deep-Tissue Massage Seat", description: "Aggressive jet configuration for intense muscle recovery and lactic acid breakdown after physical exertion." },
    { id: "massage-seats", x: 45, y: 45, label: "Vector Optimized Therapy", description: "Proprietary V-O-L-T™ system delivers more water with less turbulence.", imageUrl: "/mcp/demo/assets/products/marquis-crown-euphoria/details/massage-seats.jpg" }
  ]
};

async function main() {
  const productsRaw = JSON.parse(fs.readFileSync(path.resolve('c:/dev2/prisma/marquis-products.json'), 'utf8'));

  // Clear existing data for a clean seed
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
        modelName: p.modelName,
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
        hotspots: JSON.stringify(ALL_HOTSPOTS[p.slug] || [])
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
