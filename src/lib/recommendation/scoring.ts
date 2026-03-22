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
  return products.map(product => {
    let score = 0;
    const reasons: string[] = [];

    const usageTags = typeof product.usageTags === 'string' 
      ? JSON.parse(product.usageTags) 
      : (product.usageTags || []);

    const series = product.series?.name || product.series || '';
    const seriesName = typeof series === 'string' ? series : series.name || '';
    const positioningTier = product.positioningTier || product.series?.positioningTier || 'value';

    // 1. Capacity (Max 40 points)
    const seatsMax = product.seatsMax || 0;
    const targetCapacity = preferences.capacity === '6+' ? 6 : preferences.capacity === '4-5' ? 4 : 2;
    if (seatsMax >= targetCapacity) {
      score += 40;
      reasons.push(`${product.modelName} perfectly accommodates your group size of ${targetCapacity}+ adults.`);
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

    // 3. Primary Purpose & Therapy Tags (Max 40 points)
    if (preferences.primaryPurpose && usageTags.includes(preferences.primaryPurpose)) {
      score += 40;
      reasons.push(`Specifically blueprint-matched for your goal of ${preferences.primaryPurpose}.`);
    }

    // 4. Engineering Mastery (V-O-L-T and GPM)
    if (preferences.intensity === 'firm') {
      const gpm = product.pumpFlowGpm || 0;
      if (gpm >= 320) {
        score += 30;
        reasons.push(`High Technical Authority: Dual 240V pumps move ${gpm} Gallons Per Minute for aggressive recovery.`);
      } else if (gpm > 0) {
        score += 15;
        reasons.push(`Superior flow dynamics compared to traditional high-pressure/low-volume systems.`);
      }
    }

    // 5. Ergonomic Focus (Diverse Depth)
    if (preferences.focus === 'diverse-depth') {
      if (seriesName === 'Crown' || product.modelName.includes('Resort') || product.modelName.includes('Summit')) {
        score += 25;
        reasons.push(`Engineered with diverse seat depths to accommodate a wide range of user heights and immersion levels.`);
      }
    } else if (preferences.focus && usageTags.includes(preferences.focus)) {
      score += 15;
      reasons.push(`Targeted RHK™ jet clusters mapped to your focus on ${preferences.focus}.`);
    }

    // 6. Maintenance Style
    if (preferences.maintenance === 'automated' && usageTags.includes('constantclean')) {
      score += 20;
      reasons.push("Features ConstantClean+™ automated sanitation protocols for 90% manual reduction.");
    }

    // Normalize final score to 0-100 range
    const finalScore = Math.min(Math.max(score, 0), 100);

    return {
      product,
      score: finalScore,
      reasons
    };
  }).sort((a, b) => b.score - a.score);
}
