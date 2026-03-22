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
      reasons.push(`${product.modelName} perfectly accommodates your group size of ${targetCapacity}+.`);
    }

    // 2. Budget Alignment
    const budgetMap: Record<string, string> = {
      'entry': 'value',
      'mid': 'value',
      'premium': 'premium',
      'luxury': 'luxury'
    };
    
    if (preferences.budget && budgetMap[preferences.budget] === positioningTier) {
      score += 50;
      reasons.push(`Matches your ${preferences.budget} investment target for the ${series.name || 'Marquis'} line.`);
    } else if (preferences.budget) {
      const tiers = ['value', 'premium', 'luxury'];
      const target = budgetMap[preferences.budget];
      const diff = Math.abs(tiers.indexOf(target) - tiers.indexOf(positioningTier));
      if (diff === 1) {
        score += 25;
        reasons.push(`Excellent ${positioningTier} tier alternative within reach of your budget.`);
      }
    }

    // 3. Primary Purpose & Therapy Tags
    if (preferences.primaryPurpose && usageTags.includes(preferences.primaryPurpose)) {
      score += 40;
      reasons.push(`Precision-engineered for ${preferences.primaryPurpose}.`);
    }

    // 4. Series & Positioning Boost
    if (positioningTier === 'luxury') {
      score += 20;
      reasons.push("Features flagship materials and advanced filtration systems.");
    } else if (positioningTier === 'premium') {
      reasons.push("Balanced performance with premium hydrotherapy features.");
    }

    // 5. Lounge Preference
    const hasLounge = usageTags.includes('lounge');
    if (preferences.lounge === 'yes' && hasLounge) {
      score += 20;
      reasons.push(`Includes the high-performance lounge seat you requested.`);
    } else if (preferences.lounge === 'no' && !hasLounge) {
      score += 20;
      reasons.push("Open seating design prioritizes social connection and movement.");
    }

    // 6. Intensity / Physical Focus
    if (preferences.intensity === 'firm') {
      if (product.jetCount > 50) {
        score += 15;
        reasons.push("High-pressure jet configuration for deep muscle recovery.");
      } else if (usageTags.includes('firm')) {
        score += 10;
        reasons.push("Tuned for firm, invigorating therapeutic pressure.");
      }
    }

    if (preferences.physicalFocus && usageTags.includes(preferences.physicalFocus)) {
      score += 15;
      reasons.push(`Specialized ${preferences.physicalFocus} jet patterns included.`);
    }

    // Normalize final score to 0-100 range for display
    const finalScore = Math.min(Math.max(score, 0), 100);

    return {
      product,
      score: finalScore,
      reasons
    };
  }).sort((a, b) => b.score - a.score);
}
