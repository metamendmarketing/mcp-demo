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
    const targetCapacity = parseInt(preferences.capacity || '4');
    const seats = product.seatsMax || 0;
    if (seats >= targetCapacity) {
      // Exact match bonus for "Laser Focus"
      const isExact = (seats === targetCapacity || (targetCapacity === 6 && seats === 6));
      score += isExact ? 45 : 40;
      reasons.push(isExact 
        ? `Perfectly proportioned for your target capacity of ${targetCapacity} guests.`
        : `Spacious ${seats}-seat design exceeds your requirements for social comfort.`);
    }

    // 2. Budget / Ownership Intent (Max 50 points)
    const budgetMap: Record<string, string[]> = {
      'entry': ['value'],
      'mid': ['value', 'mid'],
      'premium': ['mid', 'premium'],
      'luxury': ['premium', 'luxury']
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

    if (preferences.budget && budgetMap[preferences.budget]?.includes(positioningTier)) {
      score += 30;
      // Already covered by intent usually, but adding a specific budget match reasoning if needed
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
    if (product.pumpFlowGpm && product.pumpFlowGpm >= 320) {
      score += 25;
      reasons.push(`High-flow ${product.pumpFlowGpm} GPM plumbing system provides professional-grade hydrotherapy intensity.`);
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
    const isCurved = product.modelName?.includes('Crown') || product.modelName?.includes('Spirit') || product.modelName?.includes('Epic');
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

    // 6.6 Precision Tie-Breakers (0-10 small points)
    if (seriesName === 'Crown') score += 5;
    else if (seriesName.includes('Vector')) score += 3;
    else if (seriesName === 'Marquis Elite') score += 1;

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
