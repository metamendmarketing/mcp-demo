import { PrismaClient } from '@prisma/client';
import Database from 'better-sqlite3';

async function migrate() {
  const sqlite = new Database('prisma/dev.db');
  const prisma = new PrismaClient();

  console.log('--- Starting Migration: SQLite -> Postgres ---');

  // 1. Brands
  const brands = sqlite.prepare('SELECT * FROM Brand').all();
  console.log(`Migrating ${brands.length} Brands...`);
  for (const b of (brands as any[])) {
    await prisma.brand.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        name: b.name,
        domain: b.domain,
        logoUrl: b.logoUrl,
        themeConfig: JSON.parse(b.themeConfig),
        active: b.active === 1,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
      }
    });
  }

  // 2. Series
  const series = sqlite.prepare('SELECT * FROM Series').all();
  console.log(`Migrating ${series.length} Series...`);
  for (const s of (series as any[])) {
    await prisma.series.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        brandId: s.brandId,
        name: s.name,
        category: s.category,
        positioningTier: s.positioningTier,
        description: s.description,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
      }
    });
  }

  // 3. Products
  const products = sqlite.prepare('SELECT * FROM Product').all();
  console.log(`Migrating ${products.length} Products...`);
  for (const p of (products as any[])) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        brandId: p.brandId,
        seriesId: p.seriesId,
        modelName: p.modelName,
        slug: p.slug,
        status: p.status,
        heroImageUrl: p.heroImageUrl,
        overheadImageUrl: p.overheadImageUrl,
        seatsMin: p.seatsMin,
        seatsMax: p.seatsMax,
        loungeCount: p.loungeCount,
        jetCount: p.jetCount,
        capacityGallons: p.capacityGallons,
        dryWeightLbs: p.dryWeightLbs,
        fullWeightLbs: p.fullWeightLbs,
        pumpFlowGpm: p.pumpFlowGpm,
        electricalAmps: p.electricalAmps,
        lengthIn: p.lengthIn,
        widthIn: p.widthIn,
        depthIn: p.depthIn,
        voltageOptions: p.voltageOptions ? JSON.parse(p.voltageOptions) : undefined,
        amperage: p.amperage,
        heaterKw: p.heaterKw,
        pumpConfig: p.pumpConfig ? JSON.parse(p.pumpConfig) : undefined,
        filtration: p.filtration ? JSON.parse(p.filtration) : undefined,
        insulationType: p.insulationType,
        hotspots: JSON.parse(p.hotspots),
        standardFeatures: JSON.parse(p.standardFeatures),
        optionalFeatures: JSON.parse(p.optionalFeatures),
        shellColors: JSON.parse(p.shellColors),
        cabinetColors: JSON.parse(p.cabinetColors),
        marketingSummary: p.marketingSummary,
        therapySummary: p.therapySummary,
        usageTags: JSON.parse(p.usageTags),
        positioningTier: p.positioningTier,
        score: p.score,
        estimatedMsrp: p.estimatedMsrp,
        sourceUrl: p.sourceUrl,
        sourceLastSeenAt: p.sourceLastSeenAt ? new Date(p.sourceLastSeenAt) : null,
        completenessScore: p.completenessScore,
        staticHeroTitle: p.staticHeroTitle,
        staticHydrotherapy: p.staticHydrotherapy,
        staticClimate: p.staticClimate,
        staticDesign: p.staticDesign,
        staticEfficiency: p.staticEfficiency,
        staticDesignConsideration: p.staticDesignConsideration,
        staticReasons: JSON.parse(p.staticReasons),
        createdAt: new Date(p.createdAt),
        updatedAt: new Date(p.updatedAt),
      }
    });
  }

  // 4. Glossary
  const glossary = sqlite.prepare('SELECT * FROM FeatureGlossary').all();
  console.log(`Migrating ${glossary.length} Glossary items...`);
  for (const g of (glossary as any[])) {
    await prisma.featureGlossary.upsert({
      where: { id: g.id },
      update: {},
      create: {
        id: g.id,
        brandId: g.brandId,
        term: g.term,
        consumerExplanation: g.consumerExplanation,
        approvedClaims: g.approvedClaims ? JSON.parse(g.approvedClaims) : undefined,
        prohibitedClaims: g.prohibitedClaims ? JSON.parse(g.prohibitedClaims) : undefined,
        relatedFeatures: g.relatedFeatures ? JSON.parse(g.relatedFeatures) : undefined,
        createdAt: new Date(g.createdAt),
        updatedAt: new Date(g.updatedAt),
      }
    });
  }

  // 5. Dealers
  const dealers = sqlite.prepare('SELECT * FROM Dealer').all();
  console.log(`Migrating ${dealers.length} Dealers...`);
  for (const d of (dealers as any[])) {
    await prisma.dealer.upsert({
      where: { id: d.id },
      update: {},
      create: {
        id: d.id,
        brandId: d.brandId,
        dealerName: d.dealerName,
        address: d.address,
        city: d.city,
        stateProvince: d.stateProvince,
        postalCode: d.postalCode,
        country: d.country,
        lat: d.lat,
        lng: d.lng,
        phone: d.phone,
        email: d.email,
        website: d.website,
        hours: d.hours ? JSON.parse(d.hours) : undefined,
        isServiceOnly: d.isServiceOnly === 1,
        source: d.source,
        active: d.active === 1,
        createdAt: new Date(d.createdAt),
        updatedAt: new Date(d.updatedAt),
      }
    });
  }

  // 6. Expertise
  const expertise = sqlite.prepare('SELECT * FROM BrandExpertise').all();
  console.log(`Migrating ${expertise.length} Expertise items...`);
  for (const e of (expertise as any[])) {
    await prisma.brandExpertise.upsert({
      where: { id: e.id },
      update: {},
      create: {
        id: e.id,
        brandId: e.brandId,
        key: e.key,
        category: e.category,
        content: e.content,
        updatedAt: new Date(e.updatedAt),
      }
    });
  }

  console.log('--- Migration Complete! ---');
  await prisma.$disconnect();
}

migrate().catch(e => {
  console.error(e);
  process.exit(1);
});
