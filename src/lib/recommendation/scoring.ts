import { Product } from '@prisma/client';

/**
 * Structured user preferences captured from the 15-step Marquis Wizard.
 * Used as the primary input for the heuristic weighting engine.
 */
export type UserPreferences = {
  primaryPurpose: string | null; // e.g., 'therapy', 'exercise', 'social'
  capacity: string | null;       // Number of seats as a string
  lounge: string | null;         // 'yes' | 'no'
  electrical: string | null;     // '110v' | '240v'
  zipCode: string | null;        // Used for climate-specific insulation weighting
  sunExposure: string | null;
  placement: string | null;
  focus: string | null;
  aesthetic: string | null;      // 'modern' | 'curved' | 'classic'
  maintenance: string | null;
  intensity: string | null;
  budget: string | null;         // 'value' | 'mid' | 'luxury'
  delivery: string | null;       // 'tight' | 'easy'
  ownership: string | null;      // 'discovery' | 'upgrade' | 'reliable'
};

/**
 * A product paired with its calculated heuristic score and justification reasons.
 */
export type ScoredProduct = {
  product: any;
  score: number;
  reasons: string[];
};

/**
 * Recursively parses a JSON string or returns the value if already an object/array.
 * Essential for handling SQLite "String" columns that may hold nested JSON data (like hotspots or techFeatures)
 * without risking double-encoding errors.
 */
function safeJsonParse(data: any): any {
  if (typeof data !== 'string') return data;
  try {
    const parsed = JSON.parse(data);
    return typeof parsed === 'string' ? safeJsonParse(parsed) : parsed;
  } catch (e) {
    return data;
  }
}

/**
 * Core heuristic engine for the Marquis Buying Assistant.
 * Ranks all products against user preferences to find the best lifestyle matches.
 * 
 * @param products - Collection of all Marquis products (hot tubs and swim spas)
 * @param preferences - User-provided wizard responses
 * @returns Sorted collection of products with relative match percentages
 */
export function scoreProducts(products: any[], preferences: UserPreferences): ScoredProduct[] {
  const scoredRawWeights = products.map(product => {
    let score = 0;
    const reasons: string[] = [];

    // Robust parsing for flexible data schema
    const usageTags = safeJsonParse(product.usageTags) || [];
    const techFeatures = safeJsonParse(product.techFeatures) || [];
    
    const series = product.series?.name || product.series || '';
    const seriesName = typeof series === 'string' ? series : series.name || '';
    const productCategory = product.category || product.series?.category || 'hot_tub';
    const positioningTier = product.positioningTier || product.series?.positioningTier || 'value';

    // 1. Capacity Optimization (Max 45 points)
    const targetCapacity = parseInt(preferences.capacity || '5');
    const seats = product.seatsMax || 0;
    const diff = Math.abs(seats - targetCapacity);
    
    if (diff === 0) {
      score += 45;
      reasons.push(`Precision-matched for your target occupancy of ${targetCapacity} guests.`);
    } else if (diff <= 1) {
      score += 35;
      reasons.push(`Highly optimized ${seats}-seat configuration aligns with your ${targetCapacity}-person capacity goal.`);
    } else if (seats > targetCapacity && seats <= targetCapacity + 2) {
      score += 25;
      reasons.push(`Spacious ${seats}-seat blueprint offers additional seating margin for social versatile.`);
    }

    // 2. Budget / Ownership Intent (Max 50 points)
    const budgetMap: Record<string, string[]> = {
      'entry': ['value'],
      'mid': ['value', 'mid'],
      'premium': ['mid', 'premium'],
      'luxury': ['luxury']
    };
    
    const intent = preferences.ownership || 'balanced';
    if (intent === 'upgrade' && (positioningTier === 'luxury' || positioningTier === 'premium')) {
      score += 50;
      reasons.push(`Premium component selection and build quality match your requirement for long-term luxury durability.`);
    } else if (intent === 'discovery' && (positioningTier === 'value' || positioningTier === 'entry')) {
      score += 40;
      reasons.push(`Efficiency-first engineering delivers the highest value-to-performance ratio in its class.`);
    }

    if (preferences.budget === 'luxury' && positioningTier === 'luxury') {
      score += 40;
      reasons.push(`High-end structural investment matches your target for a flagship-tier ownership experience.`);
    } else if (preferences.budget && budgetMap[preferences.budget]?.includes(positioningTier)) {
      score += 30;
      reasons.push(`Aligns with your preferred ${preferences.budget} price-to-performance tier.`);
    }

    // 3. Primary Purpose & Tag Matching (Max 50 points)
    const tagMap: Record<string, string[]> = {
      'recreational': ['social', 'family', 'recreational'],
      'therapy': ['hydrotherapy', 'recovery', 'therapy'],
      'wellness': ['relaxation', 'wellness', 'soft'],
      'solo': ['relaxation', 'soft', 'solo', 'intimate', 'small'],
      'exercise': ['exercise', 'fitness', 'swim', 'performance'],
      'athletes': ['recovery', 'performance', 'firm', 'deep']
    };

    const usageFocus = preferences.primaryPurpose;
    const productTags = (Array.isArray(usageTags) ? usageTags : []).map((t: string) => t.toLowerCase());
    const matchedTags = usageFocus ? productTags.filter((tag: string) => tagMap[usageFocus]?.includes(tag)) : [];
    
    if (matchedTags.length > 0) {
      score += 50;
      reasons.push(`Specialized features and configuration are purpose-built for ${usageFocus} utility.`);
    } else if (usageFocus === 'exercise' && productCategory === 'swim_spa') {
      score += 45; // Category-level match even if specific tags are missing
      reasons.push(`Swim-optimized vessel specifically designed for aquatic fitness and exercise.`);
    }

    // 4. Engineering & Fluid Dynamics (Max 40 points)
    let flow = product.pumpFlowGpm || 0;
    
    // Default flow weighting for Swim Spas (ATVs) if data is null
    if (!flow && productCategory === 'swim_spa') flow = 400; // Assume high-output for all ATVs

    if (flow >= 450) {
      score += 40;
      reasons.push(`Mastery-tier ${flow} GPM high-volume delivery provides unmatched hydrotherapy intensity.`);
    } else if (flow >= 320) {
      score += 25;
      reasons.push(`High-flow ${flow} GPM plumbing system provides professional-grade hydrotherapy.`);
    }

    if (JSON.stringify(techFeatures).includes('VOLT') || seriesName.includes('Vector')) {
      score += 15;
      reasons.push(`Advanced V-O-L-T™ system delivers precision-targeted water pressure and kinetic control.`);
    }

    // 5. Ergonomic Focus (Lounge vs Open) (Max 30 points)
    const summary = (product.marketingSummary || '').toLowerCase();
    const isLounge = productTags.includes('lounge') || summary.includes('lounge') || product.loungeCount > 0;
    
    if (preferences.lounge === 'yes' && isLounge) {
      score += 30;
      reasons.push(`Full-body Hydrotherapy Lounge configuration directly supports your recovery objectives.`);
    } else if (preferences.lounge === 'no' && !isLounge) {
      score += 20;
      reasons.push(`Open-seating blueprint maximizes party capacity and conversation flow.`);
    }

    // 6. Aesthetic & Architecture (Max 25 points)
    const userAesthetic = preferences.aesthetic || 'modern';
    const isCurved = seriesName.includes('Crown') || seriesName.includes('Spirit') || seriesName.includes('Epic');
    if (userAesthetic === 'curved' && isCurved) {
      score += 25;
      reasons.push(`Organic, curved architectural lines complement your preferred aesthetic.`);
    } else if (userAesthetic === 'modern' && !isCurved) {
      score += 20;
      reasons.push(`Sleek, geometric design aligns with contemporary architectural standards.`);
    }

    // 6.5 Precision Tie-Breakers (0-20 points)
    if (seriesName.includes('Crown')) score += 15;
    else if (seriesName.includes('ATV') || productCategory === 'swim_spa') score += 12; // Boost ATV visibility
    else if (seriesName.includes('Vector')) score += 8;
    else if (seriesName.includes('Elite')) score += 3;
    else if (seriesName.includes('Celebrity')) score += 1;

    // Spec density tie-breakers
    if ((product.jetCount || 0) > 50) score += 3;
    if (product.positioningTier === 'luxury') score += 2;

    return {
      product,
      score,
      reasons
    };
  });

  // 7. Relative Re-scaling (Top match normalized to 100%)
  const maxRawScore = Math.max(...scoredRawWeights.map((s: any) => s.score));
  
  return scoredRawWeights.map((s: any) => {
    let finalPercentage = 0;
    if (maxRawScore > 0) {
      finalPercentage = Math.round((s.score / maxRawScore) * 100);
    }
    
    return {
      ...s,
      score: finalPercentage
    };
  }).sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
}
