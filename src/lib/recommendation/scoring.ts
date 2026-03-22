import { Product } from '@prisma/client';

export type UserPreferences = {
  primaryPurpose: string | null;
  capacity: string | null;
  lounge: string | null;
  electrical: string | null;
  zipCode: string | null;
  sunExposure: string | null;
  placement: string | null;
  physicalFocus: string | null;
  aesthetic: string | null;
  maintenance: string | null;
  intensity: string | null;
  budget: string | null;
  installationReady: string | null;
  deliveryAccess: string | null;
};

export type ScoredProduct = {
  product: any; // Using any for Prisma Product to avoid strict type issues with new fields
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

    const series = product.series || {};
    const positioningTier = series.positioningTier || 'value';

    // 1. Capacity (Max 40 points)
    const seatsMax = product.seatsMax || 0;
    const targetCapacity = preferences.capacity === '6+' ? 6 : preferences.capacity === '4-5' ? 4 : 2;
    if (seatsMax >= targetCapacity) {
      score += 40;
      reasons.push(`${product.modelName} fits your capacity needs.`);
    }

    // 2. Budget Alignment (Major weight: 50 points)
    // Budget tiers: entry, mid, premium, luxury
    // Positioning tiers: value, premium, luxury
    const budgetMap: Record<string, string> = {
      'entry': 'value',
      'mid': 'value',
      'premium': 'premium',
      'luxury': 'luxury'
    };
    
    if (preferences.budget && budgetMap[preferences.budget] === positioningTier) {
      score += 50;
      reasons.push(`Aligns perfectly with your investment range.`);
    } else if (preferences.budget) {
      // One tier off boost (20 points)
      const tiers = ['value', 'premium', 'luxury'];
      const target = budgetMap[preferences.budget];
      const diff = Math.abs(tiers.indexOf(target) - tiers.indexOf(positioningTier));
      if (diff === 1) score += 20;
    }

    // 3. Primary Purpose (Max 40 points)
    if (preferences.primaryPurpose && usageTags.includes(preferences.primaryPurpose)) {
      score += 40;
      reasons.push(`Optimized for ${preferences.primaryPurpose}.`);
    }

    // 4. Luxury/Positioning Weight
    if (positioningTier === 'luxury') score += 20; // Luxury models get a baseline boost for quality/features

    // 5. Lounge Preference (Max 20 points)
    const hasLounge = usageTags.includes('lounge');
    if (preferences.lounge === 'yes' && hasLounge) {
      score += 20;
      reasons.push(`Includes the lounge seat you prefer.`);
    } else if (preferences.lounge === 'no' && !hasLounge) {
      score += 20;
    }

    // 6. Intensity / Physical Focus
    if (preferences.intensity === 'firm' && product.jetCount > 50) score += 15;
    if (preferences.physicalFocus && usageTags.includes(preferences.physicalFocus)) score += 15;

    // Normalize final score to 0-100 range for display
    const finalScore = Math.min(Math.max(score, 0), 100);

    return {
      product,
      score: finalScore,
      reasons
    };
  }).sort((a, b) => b.score - a.score);
}
