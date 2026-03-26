import { prisma } from '../src/lib/prisma';
import { scoreProducts, UserPreferences } from '../src/lib/recommendation/scoring';

async function runAudit() {
  const products = await prisma.product.findMany({
    include: { series: true }
  });

  const stats: Record<string, { count: number, series: string }> = {};
  products.forEach(p => stats[p.modelName] = { count: 0, series: p.series?.name || 'Unknown' });

  const seriesStats: Record<string, number> = {};

  const capacities = ['2', '4', '6', '8'];
  const budgets = ['value', 'mid', 'premium', 'luxury'];
  const purposes = ['recreational', 'therapy', 'wellness', 'solo'];
  const zipCodes = ['00000', '90000', '30000']; 
  const aesthetics = ['modern', 'curved', 'classic'];
  const lounges = ['yes', 'no'];
  const ownerships = ['discovery', 'balanced', 'upgrade'];

  let totalSims = 0;

  console.log("Starting Simulation Audit...");

  for (const cap of capacities) {
    for (const bud of budgets) {
      for (const purp of purposes) {
        for (const zip of zipCodes) {
          for (const aes of aesthetics) {
            for (const lng of lounges) {
              for (const own of ownerships) {
                const answers: UserPreferences = {
                  zipCode: zip,
                  capacity: cap,
                  budget: bud,
                  primaryPurpose: purp,
                  lounge: lng,
                  electrical: 'neutral',
                  ownership: own,
                  aesthetic: aes,
                  sunExposure: 'partial',
                  placement: 'deck',
                  focus: 'balanced',
                  maintenance: 'low',
                  intensity: 'medium',
                  delivery: 'easy'
                };

                const results = scoreProducts(products as any, answers);
                const top4 = results.slice(0, 4);

                top4.forEach(res => {
                  const modelName = res.product.modelName;
                  stats[modelName].count++;
                  const sName = res.product.series?.name || 'Unknown';
                  seriesStats[sName] = (seriesStats[sName] || 0) + 1;
                });

                totalSims++;
              }
            }
          }
        }
      }
    }
  }

  console.log(`\n--- Audit Results (${totalSims} Permutations) ---`);
  
  const sortedSeries = Object.entries(seriesStats).sort((a,b) => b[1] - a[1]);
  console.log("\nSeries Frequency (Top 4 Appearances):");
  sortedSeries.forEach(([name, count]) => {
    const percentage = ((count / (totalSims * 4)) * 100).toFixed(1);
    console.log(`${name.padEnd(25)}: ${count} appearances (${percentage}%)`);
  });

  const sortedModels = Object.entries(stats).sort((a,b) => b[1].count - a[1].count);
  console.log("\nTop 15 Most Frequent Models:");
  sortedModels.slice(0, 15).forEach(([name, data]) => {
    console.log(`${name.padEnd(20)} (${data.series.padEnd(15)}): ${data.count}`);
  });

  console.log("\nLeast Frequent Models:");
  sortedModels.filter(m => m[1].count > 0).slice(-10).forEach(([name, data]) => {
    console.log(`${name.padEnd(20)} (${data.series.padEnd(15)}): ${data.count}`);
  });

  const neverMatched = sortedModels.filter(m => m[1].count === 0);
  if (neverMatched.length > 0) {
    console.log("\nModels NEVER Matched:");
    neverMatched.forEach(([name, data]) => {
      console.log(`${name.padEnd(20)} (${data.series.padEnd(15)})`);
    });
  }
}

runAudit()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
