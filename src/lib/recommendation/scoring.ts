import { Product } from '@prisma/client';

export type UserPreferences = {
  seatingNeeds: number;
  priority: 'fitness' | 'therapy' | 'recreational';
  maxLengthIn?: number;
};

export type ScoredProduct = {
  product: Product;
  score: number;
  reasons: string[];
};

/**
 * Scores and ranks products based on user preferences.
 * Higher score = better match.
 */
export function scoreProducts(products: Product[], preferences: UserPreferences): ScoredProduct[] {
  return products.map(product => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Seating Score (Max 40 points)
    const seatsMax = product.seatsMax || 0;
    if (seatsMax >= preferences.seatingNeeds && preferences.seatingNeeds > 0) {
      score += 40;
      reasons.push(`Perfectly accommodates your ${preferences.seatingNeeds}-person household.`);
    } else if (seatsMax > 0 && preferences.seatingNeeds > 0) {
      score += 10;
      reasons.push(`A bit smaller than your ideal group size, but more compact.`);
    }

    // 2. Priority Matching (Max 40 points)
    // Note: In SQLite, JSON fields are stored as strings
    const usageTags = typeof product.usageTags === 'string' 
      ? JSON.parse(product.usageTags) 
      : (product.usageTags as string[] || []);
    
    if (preferences.priority === 'fitness') {
      if (usageTags.includes('fitness') || usageTags.includes('workout') || usageTags.includes('high-performance')) {
        score += 40;
        reasons.push(`Optimized for aquatic fitness and training.`);
      }
    } else if (preferences.priority === 'therapy') {
      if (usageTags.includes('therapy')) {
        score += 40;
        reasons.push(`Advanced hydrotherapy jet configurations.`);
      }
    } else if (preferences.priority === 'recreational') {
      if (usageTags.includes('recreational') || usageTags.includes('therapy')) {
        score += 40;
        reasons.push(`Spacious layout perfect for relaxation and socializing.`);
      }
    }

    // 3. Space Constraints (Penalty)
    if (preferences.maxLengthIn && product.lengthIn) {
      if (product.lengthIn > preferences.maxLengthIn) {
        score -= 200; // Hard disqualifier
        reasons.push(`Exceeds your available space of ${preferences.maxLengthIn} inches.`);
      }
    }

    return {
      product,
      score,
      reasons
    };
  }).sort((a, b) => b.score - a.score);
}
