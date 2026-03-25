import { prisma } from '../src/lib/prisma';
import { scoreProducts, UserPreferences } from '../src/lib/recommendation/scoring';

async function audit() {
  const allProducts = await prisma.product.findMany({
    include: { series: true }
  });

  const scenarios: { name: string; prefs: UserPreferences }[] = [
    {
      name: "Luxury Therapy Focus",
      prefs: {
        primaryPurpose: 'therapy',
        capacity: '6',
        lounge: 'yes',
        electrical: '240v',
        zipCode: '90210',
        sunExposure: 'morning',
        placement: 'patio',
        focus: null,
        aesthetic: 'modern',
        maintenance: 'weekly',
        intensity: 'firm',
        budget: 'luxury',
        delivery: 'easy',
        ownership: 'upgrade'
      }
    },
    {
      name: "Mid-Range Social Focus",
      prefs: {
        primaryPurpose: 'recreational',
        capacity: '6',
        lounge: 'no',
        electrical: '240v',
        zipCode: '10001',
        sunExposure: 'shaded',
        placement: 'deck',
        focus: null,
        aesthetic: 'modern',
        maintenance: 'monthly',
        intensity: 'medium',
        budget: 'premium',
        delivery: 'standard',
        ownership: 'balanced'
      }
    },
    {
      name: "Entry Level Discovery",
      prefs: {
        primaryPurpose: 'relaxation',
        capacity: '4',
        lounge: 'yes',
        electrical: '110v',
        zipCode: '33101',
        sunExposure: 'direct',
        placement: 'ground',
        focus: null,
        aesthetic: 'rustic',
        maintenance: 'quarterly',
        intensity: 'soft',
        budget: 'entry',
        delivery: 'easy',
        ownership: 'discovery'
      }
    }
  ];

  console.log("=== RECOMMENDATION AUDIT REPORT ===");
  
  for (const scenario of scenarios) {
    console.log(`\nScenario: ${scenario.name}`);
    const results = scoreProducts(allProducts, scenario.prefs);
    const top4 = results.slice(0, 4);
    
    top4.forEach((r, i) => {
      console.log(`${i+1}. ${r.product.modelName} (${r.product.series?.name}) - Score: ${r.score}% [Tier: ${r.product.positioningTier}]`);
    });
  }
}

audit().catch(console.error);
