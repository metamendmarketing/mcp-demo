import { Product } from '@prisma/client';

export type UserPreferences = {
  primaryPurpose: string | null;
  capacity: string | null;
  lounge: string | null;
  electrical: string | null;
  zipCode: string | null;
  sunExposure: string | null;
  placement: string | null;
  focus: string | null;
  aesthetic: string | null;
  maintenance: string | null;
  intensity: string | null;
  budget: string | null;
  delivery: string | null;
  ownership: string | null;
};

export type ScoredProduct = {
  product: any;
  score: number;
  reasons: string[];
};

export function scoreProducts(products: any[], preferences: UserPreferences): ScoredProduct[] {
  const scoredRawWeights = products.map(product => {
    let score = 0;
    const reasons: string[] = [];

    const usageTags = typeof product.usageTags === 'string' 
      ? JSON.parse(product.usageTags) 
      : (product.usageTags || []);

    const series = product.series?.name || product.series || '';
    const seriesName = typeof series === 'string' ? series : series.name || '';
    const positioningTier = product.positioningTier || product.series?.positioningTier || 'value';

    // 1. Capacity (Max 45 points)
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
    
    // Ownership Intent Bias
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
    } else if (preferences.budget === 'luxury' && positioningTier === 'premium') {
      score += 20;
    } else if (preferences.budget && budgetMap[preferences.budget]?.includes(positioningTier)) {
      score += 30;
    }

    // 3. Primary Purpose (Max 50 points)
    const tagMap: Record<string, string[]> = {
      'recreational': ['social', 'recreational'],
      'therapy': ['hydrotherapy', 'recovery', 'therapy'],
      'wellness': ['relaxation', 'wellness', 'soft'],
      'solo': ['relaxation', 'soft', 'solo', 'intimate']
    };

    const usageFocus = preferences.primaryPurpose;
    const productTags = usageTags.map((tag: string) => tag.toLowerCase());
    const matchedTags = usageFocus ? productTags.filter((tag: string) => tagMap[usageFocus]?.includes(tag)) : [];
    
    if (matchedTags.length > 0) {
      score += 50;
      reasons.push(`V-O-L-T™ system and seating layout are purpose-built for your focus on ${usageFocus} utility.`);
    }

    // 4. Engineering Mastery (V-O-L-T and GPM) (Max 40 points)
    const flow = product.pumpFlowGpm || 0;
    if (flow >= 450) {
      score += 40;
      reasons.push(`Mastery-tier ${flow} GPM high-volume delivery system (Crown/Vector exclusive) provides unmatched hydrotherapy intensity.`);
    } else if (flow >= 320) {
      score += 25;
      reasons.push(`High-flow ${flow} GPM plumbing system provides professional-grade hydrotherapy intensity.`);
    }

    if (JSON.stringify(product.techFeatures || []).includes('VOLT')) {
      score += 15;
      reasons.push(`Advanced V-O-L-T™ system delivers precision-targeted water pressure and kinetic control.`);
    }

    // 5. Ergonomic Focus (Lounge vs Open) (Max 30 points)
    if (preferences.lounge === 'yes' && (usageTags.includes('lounge') || JSON.stringify(product.therapySummary || '').toLowerCase().includes('lounge'))) {
      score += 30;
      reasons.push(`Full-body Hydrotherapy Lounge configuration directly supports your recovery objectives.`);
    } else if (preferences.lounge === 'no' && !usageTags.includes('lounge')) {
      score += 20;
      reasons.push(`Open-seating blueprint maximizes party capacity and conversation flow.`);
    }

    // 6. Aesthetic (Max 25 points)
    const userAesthetic = preferences.aesthetic || 'modern';
    const isCurved = seriesName.includes('Crown') || seriesName.includes('Spirit') || seriesName.includes('Epic');
    if (userAesthetic === 'curved' && isCurved) {
      score += 25;
      reasons.push(`Organic, curved architectural lines complement your preferred modern outdoor aesthetic.`);
    } else if (userAesthetic === 'modern' && !isCurved) {
      score += 20;
      reasons.push(`Sleek, geometric cabinetry design aligns with contemporary architectural standards.`);
    }

    // 6.5 Electrical & Climate (Max 35 points)
    const zipPrefix = preferences.zipCode?.[0];
    const isExtremeClimate = ['0', '1', '2', '5'].includes(zipPrefix || '');
    if (isExtremeClimate && product.insulationType?.toLowerCase().includes('foam')) {
      score += 15;
      reasons.push(`Full-foam MaximizR™ insulation is mandatory for your extreme ${preferences.zipCode} climate.`);
    }

    if (preferences.electrical === '110v' && (product.electricalAmps || 0) <= 20) {
      score += 20;
      reasons.push(`Verified "Plug & Play" 110V compatibility for simplified electrical installation.`);
    } else if (preferences.electrical === '240v' && (product.electricalAmps || 0) >= 30) {
      score += 10;
      reasons.push(`Dedicated 240V hardwired line ensures peak parallel heater and pump performance.`);
    }

    // 6.6 Delivery Logistics (Max 20 points)
    if (preferences.delivery === 'tight' && (product.lengthIn || 0) <= 84 && (product.widthIn || 0) <= 84) {
      score += 20;
      reasons.push(`Optimized 84-inch footprint explicitly selected to facilitate maneuverability through your restricted access path.`);
    } else if (preferences.delivery === 'easy' && (product.lengthIn || 0) > 90) {
      score += 10;
      reasons.push(`Exploiting your wide-open delivery access to accommodate this high-capacity flagship blueprint.`);
    }

    // 6.6 Precision Tie-Breakers (0-15 small points)
    if (seriesName.includes('Crown')) score += 15;
    else if (seriesName.includes('Vector')) score += 8;
    else if (seriesName.includes('Elite')) score += 3;
    else if (seriesName.includes('Celebrity')) score += 1;

    if ((product.jetCount || 0) > 50) score += 2;
    if ((product.pumpFlowGpm || 0) > 350) score += 2;

    return {
      product,
      score,
      reasons
    };
  });

  // 7. Relative Scaling (The user requested the top match ALWAYS be 100%)
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
