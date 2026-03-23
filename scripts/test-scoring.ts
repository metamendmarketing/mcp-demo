import { prisma } from '../src/lib/prisma';
import { scoreProducts } from '../src/lib/recommendation/scoring';

async function main() {
  const products = await prisma.product.findMany({ include: { series: true } });
  
  const prefs = {
    primaryPurpose: 'recreational',
    capacity: '6+',
    lounge: 'no',
    electrical: '240v',
    zipCode: '90210',
    sunExposure: 'direct',
    placement: 'patio',
    focus: 'lower-back',
    aesthetic: 'modern',
    maintenance: 'automated',
    intensity: 'firm',
    budget: 'luxury',
    delivery: 'easy',
    ownership: 'upgrade'
  };

  const scored = scoreProducts(products, prefs as any);
  console.log('--- SCORING CALIBRATION TEST ---');
  scored.slice(0, 5).forEach(s => {
    console.log(`${s.product.modelName.padEnd(20)} | Match: ${s.score}% | Reasons: ${s.reasons.length}`);
  });
}

main().catch(console.error);
