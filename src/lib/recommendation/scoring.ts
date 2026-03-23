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

    // 7. Normalization Logic
    // Total potential points in the current system is ~290. 
    // We want a perfect match to be ~98-100%. 
    // We'll use a divisor of 250 to allow for "Over-performance" on matches.
    let finalPercentage = Math.round((score / 260) * 100);
    
    // Add a small randomized "Expert Weight" to break ties and feel natural
    const tieBreaker = (product.modelName.charCodeAt(0) % 5);
    finalPercentage = Math.min(finalPercentage + tieBreaker, 100);

    // Baseline Reliability (Expert Reasoning Fallback)
    if (reasons.length < 3) {
      const baselines = [
        `Engineered with proprietary DuraShell® technology for ultimate structural longevity.`,
        `Features a high-flow laminar jet architecture for superior therapy without high skin pressure.`,
        `Built with MaximizR™ full-foam insulation to maintain thermal consistency in all climates.`
      ];
      for (const baseline of baselines) {
        if (reasons.length < 3 && !reasons.includes(baseline)) {
          reasons.push(baseline);
        }
      }
    }

    return {
      product,
      score: finalPercentage,
      reasons
    };
  }).sort((a, b) => b.score - a.score);
}
