const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../prisma/dev.db');
const db = new Database(dbPath);

const rules = require('../src/lib/recommendation/scoring-rules.json');

// ENHANCED SCORING LOGIC (Hardened State)
function scoreProducts(product, preferences) {
    let score = 0;
    
    // Robust parsing
    const safeParse = (d) => {
        if (typeof d !== 'string') return d;
        try { 
            const p = JSON.parse(d); 
            return typeof p === 'string' ? safeParse(p) : p;
        } catch(e) { return d; }
    };

    const usageTags = safeParse(product.usageTags) || [];
    const techFeatures = safeParse(product.techFeatures) || [];
    const seriesName = product.seriesName || '';
    const productCategory = product.category || 'hot_tub';
    const positioningTier = product.positioningTier || 'value';

    // 1. Capacity
    const targetCapacity = parseInt(preferences.capacity || '5');
    const seats = product.seatsMax || 0;
    const diff = Math.abs(seats - targetCapacity);
    if (diff === 0) score += 45;
    else if (diff <= 1) score += 35;
    else if (seats > targetCapacity && seats <= targetCapacity + 2) score += 25;

    // 2. Budget / Ownership
    const budgetMap = rules.budgets;
    const intent = preferences.ownership || 'balanced';
    if (intent === 'upgrade' && (positioningTier === 'luxury' || positioningTier === 'premium')) score += 50;
    else if (intent === 'discovery' && (positioningTier === 'value' || positioningTier === 'entry')) score += 40;

    if (preferences.budget === 'luxury' && positioningTier === 'luxury') score += 40;
    else if (preferences.budget && (budgetMap[preferences.budget] || []).includes(positioningTier)) score += 30;

    // 3. Primary Purpose
    const tagMap = rules.purposes;
    const usageFocus = preferences.primaryPurpose;
    const productTags = usageTags.map(tag => tag.toLowerCase());
    const matchedTags = usageFocus ? productTags.filter(tag => (tagMap[usageFocus] || []).includes(tag)) : [];
    
    if (matchedTags.length > 0) score += 50;
    else if (usageFocus === 'exercise' && productCategory === 'swim_spa') score += 45;

    // 4. Engineering Mastery
    let flow = product.pumpFlowGpm || 0;
    if (!flow && productCategory === 'swim_spa') flow = 400; // ATV Default

    if (flow >= 450) score += 40;
    else if (flow >= 320) score += 25;
    if (JSON.stringify(techFeatures).includes('VOLT') || seriesName.includes('Vector')) score += 15;

    // 5. Ergonomics
    const summary = (product.marketingSummary || '').toLowerCase();
    const isLounge = productTags.includes('lounge') || summary.includes('lounge') || product.loungeCount > 0;
    if (preferences.lounge === 'yes' && isLounge) score += 30;
    else if (preferences.lounge === 'no' && !isLounge) score += 20;

    // 6. Aesthetic
    const userAesthetic = preferences.aesthetic || 'modern';
    const isCurved = seriesName.includes('Crown') || seriesName.includes('Spirit') || seriesName.includes('Epic');
    if (userAesthetic === 'curved' && isCurved) score += 25;
    else if (userAesthetic === 'modern' && !isCurved) score += 20;

    // 6.5 Electrical & Climate
    const zipPrefix = (preferences.zipCode || '')[0];
    const isExtremeClimate = rules.climate.cold_prefixes.includes(zipPrefix);
    if (isExtremeClimate && (product.insulationType || '').toLowerCase().includes(rules.climate.insulation_keyword)) {
        score += rules.climate.score_boost;
    }

    // 6.6 Delivery Logistics
    if (preferences.delivery === 'tight') {
        const maxDim = rules.delivery.tight.max_dimension;
        if ((product.lengthIn || 0) <= maxDim && (product.widthIn || 0) <= maxDim) {
            score += rules.delivery.tight.score_boost;
        }
    } else if (preferences.delivery === 'easy' && (product.lengthIn || 0) > 90) {
        score += rules.delivery.easy.score_boost;
    }

    // 6.6 Tie-Breakers
    const seriesWeights = rules.series_weights;
    Object.entries(seriesWeights).forEach(([name, weight]) => {
      if (seriesName.includes(name)) score += weight;
    });

    return score;
}

const profiles = [
  { name: "FamilySocial", preferences: { capacity: '6', budget: 'mid', primaryPurpose: 'recreational', lounge: 'no', ownership: 'balanced', aesthetic: 'classic', zipCode: '90210' } },
  { name: "TherapyLuxury", preferences: { capacity: '4', budget: 'luxury', primaryPurpose: 'therapy', lounge: 'yes', ownership: 'upgrade', aesthetic: 'curved', zipCode: '02138' } },
  { name: "SoloWellness", preferences: { capacity: '2', budget: 'value', primaryPurpose: 'solo', lounge: 'no', ownership: 'discovery', aesthetic: 'modern', zipCode: '90001' } },
  { name: "AthleteExercise", preferences: { capacity: '6', budget: 'luxury', primaryPurpose: 'exercise', lounge: 'no', ownership: 'upgrade', aesthetic: 'modern', zipCode: '80111' } }
];

async function generateBaseline() {
  const products = db.prepare(`SELECT p.*, s.name as seriesName FROM Product p JOIN Series s ON p.seriesId = s.id`).all();
  const baseline = {};

  profiles.forEach(profile => {
    const scored = products.map(p => ({
      modelName: p.modelName,
      score: scoreProducts(p, profile.preferences)
    }));

    const maxScore = Math.max(...scored.map(s => s.score));
    const results = scored.map(s => ({
      model: s.modelName,
      match: maxScore > 0 ? Math.round((s.score / maxScore) * 100) : 0
    })).sort((a,b) => b.match - a.match).slice(0, 4);

    baseline[profile.name] = results;
  });

  fs.writeFileSync('scripts/scoring-baseline.json', JSON.stringify(baseline, null, 2));
  console.log("Baseline generated: scripts/scoring-baseline.json");
}

generateBaseline();
db.close();
