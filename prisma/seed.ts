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
  });  // Seed Models
  const products = [
    {
      modelName: 'Summit',
      slug: 'marquis-crown-summit',
      seatsMin: 7,
      seatsMax: 7,
      jetCount: 65,
      pumpFlowGpm: 480,
      dryWeightLbs: 1100,
      fullWeightLbs: 5020,
      capacityGallons: 470,
      electricalAmps: 50,
      lengthIn: 94,
      widthIn: 94,
      depthIn: 36,
      loungeCount: 0,
      voltageOptions: ["240V"],
      heroImageUrl: '/mcp/demo/assets/products/marquis-crown-summit/hero.jpg',
      overheadImageUrl: '/mcp/demo/assets/products/marquis-crown-summit/overhead.jpg',
      usageTags: ["therapy", "social", "large-family"],
      marketingSummary: "The Crown Series Summit is designed as a spacious, comfortable retreat to relax and recharge. With four H.O.T. Zones and an open layout, it delivers flexible, effective therapy with plenty of room to stretch out.",
      therapySummary: "Three side-by-side Adirondack Chairs provide full-body support, while four additional hydromassage seats offer targeted relief and direct access to the powerful Regal Whitewater-4 jet.",
      shellColors: ["Alba", "Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun", "Winter Solstice"],
      cabinetColors: ["Granite", "Timber"],
      standardFeatures: ["V-O-L-T System", "ConstantClean+", "H.O.T. Zones", "Specialized Massage Seats", "MQTouch Control"],
      optionalFeatures: ["Jewel LED Lighting", "Bluetooth Audio System", "MicroSilk", "ControlMySpa"],
      hotspots: [
        { id: "hot-zone-leg", x: 50, y: 75, label: "Whitewater-4 Jet", description: "This monster jet in the footwell provides incredible leg and foot therapy, moving massive volumes of water without the sting." },
        { id: "hot-zone-back", x: 15, y: 15, label: "H.O.T. Zone", description: "High Output Therapy zones target the back and shoulders with concentrated precision." },
        { id: "controls", x: 92, y: 50, label: "MQTouch Control", description: "The color touch-screen interface allows you to orchestrate your entire spa experience with a tap." },
        { id: "massage-seats", x: 30, y: 30, label: "Specialized Massage Seats", description: "Flexible and varied massage options for any mood.", imageUrl: "/mcp/demo/assets/products/marquis-crown-summit/details/massage-seats.jpg" }
      ]
    },
    {
      modelName: 'Epic',
      slug: 'marquis-crown-epic',
      seatsMin: 6,
      seatsMax: 6,
      jetCount: 53,
      pumpFlowGpm: 480,
      dryWeightLbs: 850,
      fullWeightLbs: 4103,
      capacityGallons: 390,
      electricalAmps: 50,
      lengthIn: 90,
      widthIn: 90,
      depthIn: 36,
      loungeCount: 1,
      voltageOptions: ["240V"],
      heroImageUrl: '/mcp/demo/assets/products/marquis-crown-epic/hero.jpg',
      overheadImageUrl: '/mcp/demo/assets/products/marquis-crown-epic/overhead.jpg',
      usageTags: ["therapy", "comfort", "lounge"],
      marketingSummary: "Designed for a premium hydrotherapy experience, featuring sculpted, multilevel seating for six and the most H.O.T. Zones in the collection.",
      therapySummary: "Includes a full-body Adirondack Chair and a Geyser Seat for neck, shoulder and spine relief. Five H.O.T. Zones target the Lumbar, Shoulder, and Feet.",
      shellColors: ["Alba", "Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun", "Winter Solstice"],
      cabinetColors: ["Granite", "Timber"],
      standardFeatures: ["V-O-L-T System", "ConstantClean+", "H.O.T. Zones", "Specialized Massage Seats", "MQTouch Control"],
      optionalFeatures: ["Jewel LED Lighting", "Bluetooth Audio System", "MicroSilk", "ControlMySpa"],
      hotspots: [
        { id: "adirondack", x: 25, y: 25, label: "Adirondack Chair", description: "A deeply sculpted seat providing full-body support and deep, targeted relief from neck to feet." },
        { id: "geyser", x: 75, y: 75, label: "Geyser Seat", description: "Strategically designed to surround you in warmth while focusing therapy on the neck, shoulders, and spine." },
        { id: "massage-seats", x: 50, y: 50, label: "Specialized Massage Seats", description: "Experience a variety of sensations for all-in-one therapy.", imageUrl: "/mcp/demo/assets/products/marquis-crown-epic/details/massage-seats.jpg" }
      ]
    },
    {
      modelName: 'Spirit',
      slug: 'marquis-crown-spirit',
      seatsMin: 3,
      seatsMax: 4,
      jetCount: 32,
      pumpFlowGpm: 240,
      dryWeightLbs: 460,
      fullWeightLbs: 2670,
      capacityGallons: 265,
      electricalAmps: 50,
      lengthIn: 85,
      widthIn: 66,
      depthIn: 36,
      loungeCount: 1,
      voltageOptions: ["110V", "240V"],
      heroImageUrl: '/mcp/demo/assets/products/marquis-crown-spirit/hero.jpg',
      overheadImageUrl: '/mcp/demo/assets/products/marquis-crown-spirit/overhead.jpg',
      usageTags: ["compact", "couples", "therapy"],
      marketingSummary: "A perfect sanctuary for one, two, or three people. Its compact size masks a surprising abundance of features that far exceed its footprint.",
      therapySummary: "Features a soothing lounge with Shoulder H.O.T. Zone jets for full-body therapy and a deep therapy seat with Lumbar H.O.T. Zone jets.",
      shellColors: ["Alba", "Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun", "Winter Solstice"],
      cabinetColors: ["Granite", "Timber"],
      standardFeatures: ["MQTouch", "Regal Whitewater-4", "H.O.T. Zones", "Dynamic Flow Control", "SmartClean", "ConstantClean+", "Full-Foam"],
      optionalFeatures: ["Jewel LED Lighting", "Bluetooth Audio System", "MicroSilk", "ControlMySpa"],
      hotspots: [
        { id: "lounge", x: 30, y: 50, label: "Therapy Lounge", description: "A soothing full-body lounge with dedicated Shoulder H.O.T. Zone jets for targeted tension relief." },
        { id: "cooldown", x: 85, y: 15, label: "Elevated Seat", description: "An ideal spot for warming up or cooling down, also serving as an easy entry/exit point." },
        { id: "massage-seats", x: 60, y: 60, label: "Specialized Massage Seats", description: "A peaceful location to re-center and relax.", imageUrl: "/mcp/demo/assets/products/marquis-crown-spirit/details/massage-seats.jpg" }
      ]
    },
    {
      modelName: 'Euphoria',
      slug: 'marquis-crown-euphoria',
      seatsMin: 7,
      seatsMax: 7,
      jetCount: 53,
      pumpFlowGpm: 480,
      dryWeightLbs: 825,
      fullWeightLbs: 3994,
      capacityGallons: 380,
      electricalAmps: 50,
      lengthIn: 90,
      widthIn: 90,
      depthIn: 36,
      loungeCount: 0,
      voltageOptions: ["240V"],
      heroImageUrl: '/mcp/demo/assets/products/marquis-crown-euphoria/hero.jpg',
      overheadImageUrl: '/mcp/demo/assets/products/marquis-crown-euphoria/overhead.jpg',
      usageTags: ["therapy", "large-family", "social"],
      marketingSummary: "Designed for shared relaxation and balanced comfort. Its symmetrical layout includes seven multilevel seats for a group experience.",
      therapySummary: "Two side-by-side deep therapy seats provide full-body massage, with five H.O.T. Zones providing targeted relief for every guest.",
      shellColors: ["Alba", "Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun", "Winter Solstice"],
      cabinetColors: ["Granite", "Timber"],
      standardFeatures: ["V-O-L-T System", "ConstantClean+", "H.O.T. Zones", "Specialized Massage Seats", "MQTouch Control"],
      optionalFeatures: ["Jewel LED Lighting", "Bluetooth Audio System", "MicroSilk", "ControlMySpa"],
      hotspots: [
        { id: "deep-therapy", x: 20, y: 20, label: "Deep Therapy Seats", description: "Side-by-side therapy seats offer a comprehensive full-body massage without feeling crowded." },
        { id: "whitewater", x: 50, y: 50, label: "Regal Whitewater-4", description: "Centrally located to provide massive volumes of water for powerful leg and foot therapy in every seat." },
        { id: "massage-seats", x: 80, y: 20, label: "Specialized Massage Seats", description: "The ultimate shared relaxation experience.", imageUrl: "/mcp/demo/assets/products/marquis-crown-euphoria/details/massage-seats.jpg" }
      ]
    },
    {
      modelName: 'Resort',
      slug: 'marquis-crown-resort',
      seatsMin: 5,
      seatsMax: 5,
      jetCount: 50,
      pumpFlowGpm: 400,
      dryWeightLbs: 760,
      fullWeightLbs: 3762,
      capacityGallons: 360,
      electricalAmps: 50,
      lengthIn: 85,
      widthIn: 85,
      depthIn: 36,
      loungeCount: 2,
      voltageOptions: ["240V"],
      heroImageUrl: '/mcp/demo/assets/products/marquis-crown-resort/hero.jpg',
      overheadImageUrl: '/mcp/demo/assets/products/marquis-crown-resort/overhead.jpg',
      usageTags: ["lounge", "therapy", "comfort"],
      marketingSummary: "The perfect place to entertain or unwind. Features a spacious open layout with dual Adirondack chairs for a resort-style experience.",
      therapySummary: "Dual Adirondack Chairs provide targeted Lumbar and Shoulder relief, along with powerful leg and foot therapy via the Whitewater-4 jet.",
      shellColors: ["Alba", "Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun", "Winter Solstice"],
      cabinetColors: ["Granite", "Timber"],
      standardFeatures: ["MQTouch", "Regal Whitewater-4", "H.O.T. Zones", "Dynamic Flow Control", "SmartClean", "ConstantClean+", "Full-Foam"],
      optionalFeatures: ["Jewel LED Lighting", "Bluetooth Audio System", "MicroSilk", "ControlMySpa"],
      hotspots: [
        { id: "adirondack-1", x: 20, y: 30, label: "Adirondack Chair", description: "Features Lumbar H.O.T. Zone jets for targeted relief in a supportive, relaxed posture." },
        { id: "adirondack-2", x: 70, y: 30, label: "Adirondack Chair", description: "Features Shoulder H.O.T. Zone jets to melt away upper-body tension after a long day." },
        { id: "massage-seats", x: 45, y: 75, label: "Specialized Massage Seats", description: "A resort-style experience in your own backyard.", imageUrl: "/mcp/demo/assets/products/marquis-crown-resort/details/massage-seats.jpg" }
      ]
    },
    {
      modelName: 'Destiny',
      slug: 'marquis-crown-destiny',
      seatsMin: 7,
      seatsMax: 7,
      jetCount: 41,
      pumpFlowGpm: 400,
      dryWeightLbs: 700,
      fullWeightLbs: 3289,
      capacityGallons: 310,
      electricalAmps: 50,
      lengthIn: 85,
      widthIn: 85,
      depthIn: 36,
      loungeCount: 0,
      voltageOptions: ["240V"],
      heroImageUrl: '/mcp/demo/assets/products/marquis-crown-destiny/hero.jpg',
      overheadImageUrl: '/mcp/demo/assets/products/marquis-crown-destiny/overhead.jpg',
      usageTags: ["social", "therapy", "compact-group"],
      marketingSummary: "The ultimate in hydrotherapy versatility, featuring three deep therapy seats and two side-by-side Adirondack Chairs.",
      therapySummary: "Five H.O.T. Zones provide customizable massage intensity, matched with the Regal Whitewater-4 jet for powerful lower-body therapy.",
      shellColors: ["Alba", "Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun", "Winter Solstice"],
      cabinetColors: ["Granite", "Timber"],
      standardFeatures: ["MQTouch", "Regal Whitewater-4", "H.O.T. Zones", "Dynamic Flow Control", "SmartClean", "ConstantClean+", "Full-Foam"],
      optionalFeatures: ["Jewel LED Lighting", "Bluetooth Audio System", "MicroSilk", "ControlMySpa"],
      hotspots: [
        { id: "social-seating", x: 50, y: 20, label: "Open Social Seating", description: "The non-lounge layout maximizes space for conversation while ensuring everyone has a dedicated therapy seat." },
        { id: "hot-zone-foot", x: 50, y: 80, label: "Foot H.O.T. Zone", description: "Targeted high-output therapy for tired feet, a favorite for athletes and active families." },
        { id: "massage-seats", x: 20, y: 50, label: "Specialized Massage Seats", description: "Versatile hydrotherapy for every guest.", imageUrl: "/mcp/demo/assets/products/marquis-crown-destiny/details/massage-seats.jpg" }
      ]
    },
    {
      modelName: 'Wish',
      slug: 'marquis-crown-wish',
      seatsMin: 5,
      seatsMax: 5,
      jetCount: 30,
      pumpFlowGpm: 320,
      dryWeightLbs: 600,
      fullWeightLbs: 2771,
      capacityGallons: 265,
      electricalAmps: 50,
      lengthIn: 77,
      widthIn: 77,
      depthIn: 36,
      loungeCount: 1,
      voltageOptions: ["240V"],
      heroImageUrl: '/mcp/demo/assets/products/marquis-crown-wish/hero.jpg',
      overheadImageUrl: '/mcp/demo/assets/products/marquis-crown-wish/overhead.jpg',
      usageTags: ["lounge", "compact", "relaxation"],
      marketingSummary: "The perfect combination of space and intimacy, featuring a full-body lounge and deep therapy seating in a compact footprint.",
      therapySummary: "Includes an elevated cooldown seat and a full-body Adirondack lounge with Lumbar H.O.T. Zone jets.",
      shellColors: ["Alba", "Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun", "Winter Solstice"],
      cabinetColors: ["Granite", "Timber"],
      standardFeatures: ["MQTouch", "Regal Whitewater-4", "H.O.T. Zones", "Dynamic Flow Control", "SmartClean", "ConstantClean+", "Full-Foam"],
      optionalFeatures: ["Jewel LED Lighting", "Bluetooth Audio System", "MicroSilk", "ControlMySpa"],
      hotspots: [
        { id: "full-body-lounge", x: 30, y: 60, label: "Body Lounge", description: "Sculpted to cradles your body from head to toe, delivering sustained, multi-point pressure relief." },
        { id: "cooldown", x: 80, y: 20, label: "Cooldown Seat", description: "Avoid overheating by using this slightly elevated seat during longer social sessions." },
        { id: "massage-seats", x: 50, y: 50, label: "Specialized Massage Seats", description: "Intimate and effective hydrotherapy.", imageUrl: "/mcp/demo/assets/products/marquis-crown-wish/details/massage-seats.jpg" }
      ]
    }
  ];

  for (const productData of products as any[]) {
    await prisma.product.create({
      data: {
        ...productData,
        brandId: marquis!.id,
        seriesId: crownSeries.id,
        standardFeatures: JSON.stringify(productData.standardFeatures || []),
        optionalFeatures: JSON.stringify(productData.optionalFeatures || []),
        shellColors: JSON.stringify(productData.shellColors || []),
        cabinetColors: JSON.stringify(productData.cabinetColors || []),
        hotspots: JSON.stringify(productData.hotspots || []),
        usageTags: JSON.stringify(productData.usageTags || []),
        voltageOptions: JSON.stringify(productData.voltageOptions || [])
      }
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
