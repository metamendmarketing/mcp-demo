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

    // 1. Capacity (Max 40 points)
    const seatsMax = product.seatsMax || 0;
    const targetCapacity = preferences.capacity === '6+' ? 6 : preferences.capacity === '4-5' ? 4 : 2;
    if (seatsMax >= targetCapacity) {
      score += 40;
      reasons.push(`${product.modelName} perfectly fits ${seatsMax} adults.`);
    }

    // 2. Primary Purpose (Max 40 points)
    if (preferences.primaryPurpose && usageTags.includes(preferences.primaryPurpose)) {
      score += 40;
      reasons.push(`Optimized for your goal of ${preferences.primaryPurpose}.`);
    }

    // 3. Lounge Preference (Max 20 points)
    const hasLounge = usageTags.includes('lounge');
    if (preferences.lounge === 'yes' && hasLounge) {
      score += 20;
      reasons.push(`Includes the full-body lounge seat you requested.`);
    } else if (preferences.lounge === 'no' && !hasLounge) {
      score += 20;
      reasons.push(`Provides open social seating without a lounge.`);
    }

    // 4. Physical Focus (Max 30 points)
    if (preferences.physicalFocus) {
      const focusTag = preferences.physicalFocus.replace('neck-shoulders', 'neck-jets').replace('legs-feet', 'foot-well');
      if (usageTags.includes(focusTag) || usageTags.includes('high-jet-count')) {
        score += 30;
        reasons.push(`Features specific H.O.T. Zone therapy for your ${preferences.physicalFocus}.`);
      }
    }

    // 5. Electrical / Performance (Max 20 points)
    if (preferences.electrical === '240v' && product.jetCount > 40) {
      score += 20;
      reasons.push(`High-performance V-O-L-T™ system paired with 240V power.`);
    }

    // 6. Intensity (Max 20 points)
    if (preferences.intensity === 'firm' && product.jetCount > 50) {
      score += 20;
      reasons.push(`Maximum jet pressure for deep tissue relief.`);
    }

    // Ensure score is at least 0 and max 100 for percentage display
    const finalScore = Math.min(Math.max(score, 0), 100);

    return {
      product,
      score: finalScore,
      reasons
    };
  }).sort((a, b) => b.score - a.score);
}
