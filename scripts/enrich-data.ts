import fs from 'fs';
import path from 'path';

const productsPath = path.resolve(process.cwd(), 'prisma/marquis-products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

function enrichProduct(product: any) {
  // 1. Enrich Therapy Summary if missing
  if (!product.therapySummary && product.marketingSummary) {
    const sentences = product.marketingSummary.split('. ');
    // Use the most therapy-focused sentence or the first one if not found
    const therapySentence = sentences.find((s: string) => 
      s.toLowerCase().includes('therapy') || 
      s.toLowerCase().includes('massage') || 
      s.toLowerCase().includes('jet') || 
      s.toLowerCase().includes('h.o.t') ||
      s.toLowerCase().includes('v-o-l-t')
    ) || sentences[0];
    
    product.therapySummary = therapySentence.endsWith('.') ? therapySentence : therapySentence + '.';
  }

  // 2. Enrich Usage Tags
  const tags = new Set(product.usageTags || []);
  const text = (product.marketingSummary + ' ' + (product.therapySummary || '')).toLowerCase();

  if (text.includes('hydrotherapy') || text.includes('therapy') || text.includes('massage')) tags.add('hydrotherapy');
  if (text.includes('social') || text.includes('gathering') || text.includes('seats six') || text.includes('seats seven')) tags.add('social');
  if (text.includes('relax') || text.includes('rejuvenate') || text.includes('escape')) tags.add('relaxation');
  if (text.includes('lounge') || text.includes('commander’s lounge')) tags.add('lounge');
  
  if (product.jetCount > 40) tags.add('firm');
  else if (product.jetCount > 0) tags.add('soft');

  if (text.includes('athlete') || text.includes('performance') || text.includes('recovery')) tags.add('recovery');
  if (text.includes('family')) tags.add('family');

  product.usageTags = Array.from(tags);

  return product;
}

const enrichedProducts = products.map(enrichProduct);

fs.writeFileSync(productsPath, JSON.stringify(enrichedProducts, null, 2));
console.log(`Enriched ${enrichedProducts.length} products in marquis-products.json`);
