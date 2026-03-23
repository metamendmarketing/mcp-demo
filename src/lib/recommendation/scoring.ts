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
    if (preferences.ownership === 'upgrade' && (positioningTier === 'premium' || positioningTier === 'luxury')) {
      score += 25;
      reasons.push(`Built with high-longevity MaximizR™ insulation and full-foam engineering for a "forever" investment.`);
    } else if (preferences.ownership === 'discovery' && positioningTier === 'value') {
      score += 15;
      reasons.push(`An ideal high-value entry point into the Marquis experience.`);
    }

    if (preferences.budget && budgetMap[preferences.budget]?.includes(positioningTier)) {
      score += 25;
      reasons.push(`Mathematically aligned with your ${preferences.budget} investment range.`);
    }

    // 2.5 Lounge Preference (Max 15 points)
    if (preferences.lounge === 'yes' && (product.loungeCount || 0) > 0) {
      score += 15;
      reasons.push(`Features a dedicated full-body lounge seat for sequential hydrotherapy.`);
    } else if (preferences.lounge === 'no' && (product.loungeCount || 0) === 0) {
      score += 10;
      reasons.push(`Open-seating blueprint maximizes party capacity and conversation flow.`);
    }

    // 3. Primary Purpose & Therapy Tags (Max 50 points)
    const tagMap: Record<string, string[]> = {
      'recreational': ['social', 'recreational'],
      'therapy': ['hydrotherapy', 'recovery', 'therapy'],
      'athletic': ['recovery', 'athletic', 'performance'],
      'solo': ['relaxation', 'soft', 'solo', 'intimate']
    };

    const targetTags = preferences.primaryPurpose ? tagMap[preferences.primaryPurpose] || [] : [];
    const hasTagMatch = usageTags.some((tag: string) => targetTags.includes(tag.toLowerCase()));
    
    if (hasTagMatch) {
      score += 50;
      reasons.push(`Specifically blueprint-matched for your goal of ${preferences.primaryPurpose}.`);
    }

    // 4. Engineering Mastery (V-O-L-T and GPM) (Max 40 points)
    if (preferences.intensity === 'firm') {
      const gpm = product.pumpFlowGpm || 0;
      if (gpm >= 320) {
        score += 40;
        reasons.push(`High Technical Authority: Dual 240V pumps move ${gpm} Gallons Per Minute for aggressive recovery.`);
      } else if (gpm > 0) {
        score += 20;
        reasons.push(`Superior flow dynamics compared to traditional high-pressure/low-volume systems.`);
      }
    }

    // 5. Ergonomic Focus (Diverse Depth) (Max 30 points)
    if (preferences.focus === 'diverse-depth') {
      if (seriesName === 'Crown' || product.modelName.includes('Resort') || product.modelName.includes('Summit')) {
        score += 30;
        reasons.push(`Engineered with diverse seat depths to accommodate a wide range of user heights and immersion levels.`);
      }
    } else if (preferences.focus && usageTags.some((t: string) => t.toLowerCase() === preferences.focus)) {
      score += 20;
      reasons.push(`Targeted RHK™ jet clusters mapped to your focus on ${preferences.focus}.`);
    }

    // 6. Maintenance Style (Max 20 points)
    if (preferences.maintenance === 'automated' && (usageTags.includes('constantclean') || JSON.stringify(product.filtration || {}).toLowerCase().includes('constantclean'))) {
      score += 20;
      reasons.push("Features ConstantClean+™ automated sanitation protocols for 90% manual reduction.");
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
