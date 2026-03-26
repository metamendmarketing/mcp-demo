const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../prisma/dev.db');
const db = new Database(dbPath);

const rules = require('../src/lib/recommendation/scoring-rules.json');

function scoreProducts(product, preferences) {
    let score = 0;
    let usageTags = [];
    if (typeof product.usageTags === 'string' && product.usageTags.trim().startsWith('[')) {
      try { usageTags = JSON.parse(product.usageTags); } catch (e) {}
    } else if (Array.isArray(product.usageTags)) {
      usageTags = product.usageTags;
    }

    const seriesName = product.seriesName || '';
    const positioningTier = product.positioningTier || 'value';

    // 1. Capacity (Max 45 points)
    const targetCapacity = parseInt(preferences.capacity || '5');
    const seats = product.seatsMax || 0;
    const diff = Math.abs(seats - targetCapacity);
    if (diff === 0) score += 45;
    else if (diff <= 1) score += 35;
    else if (seats > targetCapacity && seats <= targetCapacity + 2) score += 25;

    // 2. Budget / Ownership Intent (Max 50 points)
    const budgetMap = rules.budgets;
    const intent = preferences.ownership || 'balanced';
    if (intent === 'upgrade' && (positioningTier === 'luxury' || positioningTier === 'premium')) score += 50;
    else if (intent === 'discovery' && (positioningTier === 'value' || positioningTier === 'entry')) score += 40;

    if (preferences.budget === 'luxury' && positioningTier === 'luxury') score += 40;
    else if (preferences.budget === 'luxury' && positioningTier === 'premium') score += 20;
    else if (preferences.budget && (budgetMap[preferences.budget] || []).includes(positioningTier)) score += 30;

    // 3. Primary Purpose (Max 50 points)
    const tagMap = rules.purposes;
    const usageFocus = preferences.primaryPurpose;
    const productTags = (usageTags || []).map(tag => tag.toLowerCase());
    const matchedTags = usageFocus ? productTags.filter(tag => (tagMap[usageFocus] || []).includes(tag)) : [];
    if (matchedTags.length > 0) score += 50;

    // 4. Engineering Mastery (Max 40 points)
    const flow = product.pumpFlowGpm || 0;
    if (flow >= 450) score += 40;
    else if (flow >= 320) score += 25;
    if (JSON.stringify(product.standardFeatures || '').includes('VOLT')) score += 15;

    // 5. Ergonomic Focus (Max 30 points)
    if (preferences.lounge === 'yes' && ((usageTags || []).includes('lounge') || JSON.stringify(product.marketingSummary || '').toLowerCase().includes('lounge'))) score += 30;
    else if (preferences.lounge === 'no' && !(usageTags || []).includes('lounge')) score += 20;

    // 6. Aesthetic (Max 25 points)
    const userAesthetic = preferences.aesthetic || 'modern';
    const isCurved = seriesName.includes('Crown') || seriesName.includes('Spirit') || seriesName.includes('Epic');
    if (userAesthetic === 'curved' && isCurved) score += 25;
    else if (userAesthetic === 'modern' && !isCurved) score += 20;

    // 6.5 Electrical & Climate (Max 35 points)
    const zipPrefix = (preferences.zipCode || '')[0];
    const isExtremeClimate = rules.climate.cold_prefixes.includes(zipPrefix);
    if (isExtremeClimate && (product.insulationType || '').toLowerCase().includes(rules.climate.insulation_keyword)) {
        score += rules.climate.score_boost;
    }
    if (preferences.electrical === '110v' && (product.electricalAmps || 0) <= 20) score += 20;
    else if (preferences.electrical === '240v' && (product.electricalAmps || 0) >= 30) score += 10;

    // 6.6 Delivery Logistics (Max 20 points)
    if (preferences.delivery === 'tight') {
        const maxDim = rules.delivery.tight.max_dimension;
        if ((product.lengthIn || 0) <= maxDim && (product.widthIn || 0) <= maxDim) {
            score += rules.delivery.tight.score_boost;
        }
    } else if (preferences.delivery === 'easy' && (product.lengthIn || 0) > 90) {
        score += rules.delivery.easy.score_boost;
    }

    // 6.6 Precision Tie-Breakers (0-15 small points)
    const seriesWeights = rules.series_weights;
    Object.entries(seriesWeights).forEach(([name, weight]) => {
      if (seriesName.includes(name)) score += weight;
    });


    return score;
}

function runAudit() {
  const products = db.prepare(`SELECT p.*, s.name as seriesName FROM Product p JOIN Series s ON p.seriesId = s.id`).all();
  const stats = {};
  products.forEach(p => stats[p.modelName] = { count: 0, series: p.seriesName || 'Unknown' });
  const seriesStats = {};

  const capacities = ['2', '4', '6', '8'];
  const budgets = ['value', 'mid', 'premium', 'luxury'];
  const purposes = ['recreational', 'therapy', 'wellness', 'solo', 'exercise', 'athletes'];
  const zipCodes = ['00000', '30000']; 
  const aesthetics = ['modern', 'curved', 'classic'];
  const lounges = ['yes', 'no'];
  const ownerships = ['discovery', 'balanced', 'upgrade'];

  let totalSims = 0;
  let midBudgetSims = 0;
  const midBudgetSeriesStats = {};

  console.log("Starting DB Simulation Audit (Deep Pass)...");

  for (const cap of capacities) {
    for (const bud of budgets) {
      for (const purp of purposes) {
        for (const zip of zipCodes) {
          for (const aes of aesthetics) {
            for (const lng of lounges) {
              for (const own of ownerships) {
                const answers = { zipCode: zip, capacity: cap, budget: bud, primaryPurpose: purp, lounge: lng, electrical: '240v', ownership: own, aesthetic: aes, delivery: 'easy' };
                const scored = products.map(p => ({ product: p, score: scoreProducts(p, answers) }));
                const maxRawScore = Math.max(...scored.map(s => s.score));
                const results = scored.map(s => ({ ...s, finalScore: maxRawScore > 0 ? Math.round((s.score / maxRawScore) * 100) : 0 })).sort((a,b) => b.finalScore - a.finalScore);
                const top4 = results.slice(0, 4);

                top4.forEach(res => {
                  const modelName = res.product.modelName;
                  if (stats[modelName]) stats[modelName].count++;
                  const sName = res.product.seriesName || 'Unknown';
                  seriesStats[sName] = (seriesStats[sName] || 0) + 1;
                  
                  if (bud === 'mid') {
                    midBudgetSeriesStats[sName] = (midBudgetSeriesStats[sName] || 0) + 1;
                  }
                });

                totalSims++;
                if (bud === 'mid') midBudgetSims++;
              }
            }
          }
        }
      }
    }
  }

  console.log(`\n--- Audit Results (${totalSims} Permutations) ---`);
  
  const sortedSeries = Object.entries(seriesStats).sort((a,b) => b[1] - a[1]);
  console.log("\nGLOBAL Series Frequency (Top 4 Appearances):");
  sortedSeries.forEach(([name, count]) => {
    const percentage = ((count / (totalSims * 4)) * 100).toFixed(1);
    console.log(`${name.padEnd(25)}: ${count} appearances (${percentage}%)`);
  });

  const sortedMidSeries = Object.entries(midBudgetSeriesStats).sort((a,b) => b[1] - a[1]);
  console.log("\nMID BUDGET Series Frequency (Top 4 Appearances):");
  sortedMidSeries.forEach(([name, count]) => {
    const percentage = ((count / (midBudgetSims * 4)) * 100).toFixed(1);
    console.log(`${name.padEnd(25)}: ${count} appearances (${percentage}%)`);
  });

  const sortedModels = Object.entries(stats).sort((a,b) => b[1].count - a[1].count);
  console.log("\nTop 15 Most Frequent Models:");
  sortedModels.slice(0, 15).forEach(([name, data]) => {
    console.log(`${name.padEnd(20)} (${data.series.padEnd(15)}): ${data.count}`);
  });

  const neverMatched = sortedModels.filter(m => m[1].count === 0);
  if (neverMatched.length > 0) {
    console.log("\nModels NEVER Matched:");
    neverMatched.forEach(([name, data]) => {
      console.log(`${name.padEnd(20)} (${data.series.padEnd(15)})`);
    });
  }
}

runAudit();
db.close();
