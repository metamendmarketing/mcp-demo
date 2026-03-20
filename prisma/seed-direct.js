const Database = require('better-sqlite3');
const path = require('path');

// Ensure we use the correct database path relative to this script
const dbPath = path.join(__dirname, 'dev.db');
const db = new Database(dbPath);

try {
  console.log(`Directly seeding Marquis data into ${dbPath}...`);

  // Disable foreign keys during seeding to avoid constraint errors
  db.exec('PRAGMA foreign_keys = OFF;');

  // 1. Insert Brand
  const brandId = 'marquis';
  db.prepare(`
    INSERT OR REPLACE INTO Brand (id, name, domain, themeConfig, active, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    brandId,
    'Marquis Spas',
    'marquisspas.com',
    JSON.stringify({
      primary: '#1a365d',
      secondary: '#2d3748',
      accent: '#3182ce',
    }),
    1, // active
    new Date().toISOString(),
    new Date().toISOString()
  );

  // 2. Insert Series
  const seriesId = 'v21-swim-spas';
  db.prepare(`
    INSERT OR REPLACE INTO Series (id, brandId, name, category, positioningTier, description, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    seriesId,
    brandId,
    'Vector21 Swim Spas',
    'swim_spa',
    'luxury',
    'The Vector21 series combines the features of a hot tub and swim spa.',
    new Date().toISOString(),
    new Date().toISOString()
  );

  // 3. Insert Products
  const products = [
    {
      id: 'p-v150p',
      modelName: 'V150P',
      slug: 'v150p-swim-spa',
      seatsMin: 8,
      seatsMax: 8,
      jetCount: 39,
      capacityGallons: 950,
      dryWeightLbs: 1800,
      lengthIn: 150,
      widthIn: 90,
      depthIn: 50,
      usageTags: JSON.stringify(['therapy', 'recreational']),
      marketingSummary: 'A huge party spa combining the features of a hot tub and swim spa.',
    },
    {
      id: 'p-v150w',
      modelName: 'V150W',
      slug: 'v150w-swim-spa',
      seatsMin: 4,
      seatsMax: 4,
      jetCount: 25,
      capacityGallons: 1200,
      dryWeightLbs: 1700,
      lengthIn: 150,
      widthIn: 90,
      depthIn: 50,
      usageTags: JSON.stringify(['fitness', 'workout']),
      marketingSummary: 'The personal aquatic multi-use gym you\'ve always wanted.',
    },
    {
      id: 'p-v174s',
      modelName: 'V174S',
      slug: 'v174s-swim-spa',
      seatsMin: 4,
      seatsMax: 4,
      jetCount: 33,
      capacityGallons: 1600,
      dryWeightLbs: 2325,
      lengthIn: 174,
      widthIn: 90,
      depthIn: 56,
      usageTags: JSON.stringify(['fitness', 'therapy']),
      marketingSummary: 'Pure exhilaration with true health benefits.',
    },
    {
      id: 'p-v174k',
      modelName: 'V174K',
      slug: 'v174k-swim-spa',
      seatsMin: 4,
      seatsMax: 4,
      jetCount: 37,
      capacityGallons: 1600,
      dryWeightLbs: 2325,
      lengthIn: 174,
      widthIn: 90,
      depthIn: 56,
      usageTags: JSON.stringify(['fitness', 'high-performance']),
      marketingSummary: 'High-performance swim-training and therapy.',
    },
  ];

  const insertProduct = db.prepare(`
    INSERT OR REPLACE INTO Product (
      id, brandId, seriesId, modelName, slug, status, 
      seatsMin, seatsMax, jetCount, capacityGallons, dryWeightLbs, 
      lengthIn, widthIn, depthIn, usageTags, marketingSummary, 
      createdAt, updatedAt, loungeCount, completenessScore,
      standardFeatures, optionalFeatures, shellColors, cabinetColors
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of products) {
    insertProduct.run(
      p.id,
      brandId,
      seriesId,
      p.modelName,
      p.slug,
      'active',
      p.seatsMin,
      p.seatsMax,
      p.jetCount,
      p.capacityGallons,
      p.dryWeightLbs,
      p.lengthIn,
      p.widthIn,
      p.depthIn,
      p.usageTags,
      p.marketingSummary,
      new Date().toISOString(),
      new Date().toISOString(),
      0, // loungeCount
      1.0, // completenessScore
      '[]', '[]', '[]', '[]' // features/colors default JSON
    );
  }

  // Re-enable foreign keys
  db.exec('PRAGMA foreign_keys = ON;');
  console.log('Seeding complete successfully.');
} catch (error) {
  console.error('Seeding failed:', error);
} finally {
  db.close();
}
