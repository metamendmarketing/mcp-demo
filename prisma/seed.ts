import { prisma } from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

// Using the same singleton instance as the application to ensure path parity

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
  const productsRaw = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'prisma/marquis-products.json'), 'utf8'));

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
      // Find the first product in this series to get its positioning tier from JSON if available
      const firstProduct = productsRaw.find((p: any) => p.seriesName === sName);
      const jsonTier = firstProduct?.series?.positioningTier || firstProduct?.positioningTier;

      series = await prisma.series.create({
        data: {
          brandId: marquis.id,
          name: sName,
          category: (sName.toLowerCase().includes('swim') || sName.toLowerCase().includes('atv')) ? 'swim_spa' : 'hot_tub',
          positioningTier: jsonTier || (sName.includes('Crown') ? 'luxury' : (sName.includes('Elite') || sName.includes('Vector') ? 'premium' : 'value')),
          description: `${sName} by Marquis.`
        }
      });
    }
    seriesMap[sName] = series.id;
  }

  const calculateModelTier = (p: any) => {
    // If positioningTier is explicitly set in JSON, respect it
    if (p.positioningTier && p.positioningTier !== 'value') {
       return { tier: p.positioningTier, score: p.score || 85 };
    }

    let score = 0;
    
    // 1. Base Series Score
    if (p.seriesName.includes('Crown') || p.seriesName.includes('ATV')) score += 50;
    else if (p.seriesName.includes('Vector')) score += 35;
    else if (p.seriesName.includes('Elite')) score += 20;
    else if (p.seriesName.includes('Celebrity')) score += 0;

    // 2. Pump Performance (+10 per pump)
    score += (p.pumpCount || 1) * 10;

    // 3. Tech Features (+10 per high-spec feature)
    const highSpecFeatures = ['VOLT', 'HOTZones', 'ConstantCleanPlus', 'FullFoam'];
    (p.techFeatures || []).forEach((f: string) => {
      if (highSpecFeatures.includes(f)) score += 10;
    });

    // 4. Calibration
    let tier = 'value';
    if (score >= 80 || p.seriesName.includes('ATV')) tier = 'luxury';
    else if (score >= 60) tier = 'premium';
    else if (score >= 35) tier = 'mid';

    return { tier, score };
  };

  // Seed Products
  for (const p of productsRaw) {
    if (!p.jetCount && !p.dimensions && !p.marketingSummary) continue;

    const { tier, score } = calculateModelTier(p);

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
        pumpFlowGpm: p.pumpFlowGpm,
        insulationType: p.insulationType,
        filtration: JSON.stringify(p.filtration || {}),
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
        hotspots: JSON.stringify(ALL_HOTSPOTS[p.slug] || []),
        // @ts-ignore - positioningTier is in schema but Prisma type might be stale in IDE
        positioningTier: tier,
        score: score,
        estimatedMsrp: p.estimatedMsrp || null,
        staticHeroTitle: p.staticHeroTitle || null,
        staticHydrotherapy: p.staticHydrotherapy || null,
        staticClimate: p.staticClimate || null,
        staticDesign: p.staticDesign || null,
        staticEfficiency: p.staticEfficiency || null,
        staticDesignConsideration: p.staticDesignConsideration || null,
        staticReasons: JSON.stringify(p.staticReasons || [])
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
    },
    {
      term: 'Regal Hydrokinetic (RHK™) Jets',
      consumerExplanation: 'Exclusive to the Crown Series, these jets are designed for high-flow, low-pressure therapy that delivers massive volumes of water without the "sting" of traditional jets.',
      relatedFeatures: ['Crown Series', 'High-flow Therapy'],
    },
    {
      term: 'Jetpods',
      consumerExplanation: 'Directional and specialized jet modules exclusive to the Vector21 Series, allowing for precise control and interchangeable therapy experiences.',
      relatedFeatures: ['Vector21 Series', 'V-O-L-T System'],
    },
    {
      term: "H.O.T. Zones®",
      consumerExplanation: "High Output Therapy zones that target specific areas like the neck, shoulders, and lumbar with concentrated, high-pressure water for maximum therapeutic impact.",
      relatedFeatures: ["Deep Tissue Massage", "Targeted Therapy"]
    },
    {
      term: "Regal Whitewater-4™",
      consumerExplanation: "A massive, centrally-located jet that moves huge volumes of water (up to 400 GPM) for intensive leg and foot therapy without the 'sting' of traditional high-pressure jets.",
      relatedFeatures: ["Whitewater Jet", "Leg Therapy"]
    },
    {
      term: "V3 Throttle Control",
      consumerExplanation: "Proprietary valves that allow you to direct the full power of a pump to a single seat or individual H.O.T. Zones, giving you complete control over your massage intensity.",
      relatedFeatures: ["V-O-L-T System", "Custom Massage"]
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

  // Seed Brand Expertise
  const expertiseItems = [
    {
      key: "history",
      category: "Heritage",
      content: "Founded in 1980, Marquis has over 40 years of experience in hot tub design and manufacturing. The company has built a global reputation for quality products and a deep commitment to excellence. Employee-ownership is at the heart of our culture, ensuring every team member is personally invested in your ultimate satisfaction. Many of our customers have been part of the Marquis family for decades, a testament to our long-lasting quality and reliability."
    },
    {
      key: "manufacturing",
      category: "Engineering",
      content: "All Marquis spas are proudly handcrafted by skilled craftspeople in Las Vegas, Nevada, using a combination of domestic and imported components. While many in the industry have moved production abroad, Marquis remains steadfast on American soil, focusing on unsurpassed design, product quality, and customer service. Our facilities combine state-of-the-art technology with meticulously applied hand-craftsmanship to ensure every spa meets our high standards."
    },
    {
      key: "values",
      category: "Philosophy",
      content: "The Marquis philosophy is 'Elegant and Practical.' We believe a hot tub should be as beautiful as it is functional. Every design decision revolves around improving the user experience, from the therapeutic benefits of High-Flow Therapy to ergonomic details that fit the body naturally. Our goal is to provide the highest-quality, most energy-efficient, and easiest-to-maintain hot tubs in the world. We don't just build spas; we deliver 'The Ultimate Hot Tub Experience!™'"
    },
    {
      key: "philanthropy",
      category: "Community",
      content: "Marquis is a proud Corporate Sponsor of Make-A-Wish® since 2000. We are their preferred provider for hot tub and swim spa wishes across North America, helping children with critical health conditions find joy and relief in the soothing water of a spa. Together with our network of dealers, we have granted over 900 wishes and contributed more than $5 million in-kind and cash donations, believing that we have a responsibility to enrich the lives of everyone we touch."
    },
      {
        key: 'recognition',
        category: 'Awards',
        content: 'Marquis is a TradeCertified™ Overall Top Scoring Brand and a ConsumerAffairs Authorized Partner with over 800 verified reviews. They have received multiple "Best Buy" awards from WhatSpa? for the Crown Summit, Vector21 V94L, and Monaco Elite.',
      },
      {
        key: 'TEST_SOAK_CIVILITY',
        category: 'OWNERSHIP_EXPERIENCE',
        content: 'Marquis advocates for the "Test Soak" philosophy—encouraging customers to test every model they consider before purchasing to ensure the ergonomics and therapy perfectly match their body and needs.',
      },
  ];

  for (const item of expertiseItems) {
    // @ts-ignore - brandExpertise is in schema but Prisma type might be stale in IDE
    await prisma.brandExpertise.upsert({
      where: { brandId_key: { brandId: marquis.id, key: item.key } },
      update: { content: item.content, category: item.category },
      create: { 
        brandId: marquis.id, 
        key: item.key, 
        category: item.category, 
        content: item.content 
      }
    });
  }

  console.log(`Seed completed. Populated ${productsRaw.length} products, specialized glossary, and brand expertise.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
