const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../prisma/marquis-products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const getStaticData = (p) => {
  const name = p.modelName;
  const series = p.seriesName || '';
  const jets = p.jetCount || 0;
  const seats = p.seatsMax || 0;
  const lounge = p.loungeCount > 0 ? "full-body lounge" : "open-concept seating";
  const gallons = p.capacityGallons || 0;
  const summary = p.marketingSummary || '';

  // Helper to get series-specific build info
  const getBuildInfo = () => {
    if (series.includes('Crown')) return "full-foam insulation and the DuraShell® structure";
    if (series.includes('Vector')) return "architectural cabinet and high-density insulation package";
    return "rugged cabinet and straightforward mechanical systems with Icynene® foam";
  };

  // Helper to get series-specific filtration
  const getFiltration = () => {
    if (series.includes('Crown')) return "ConstantClean+™ system, managing water up to 51 times per day";
    if (series.includes('Vector')) return "V-O-L-T™ system and ConstantClean™ filtration";
    return "simple, effective ConstantClean™ filtration system";
  };

  const data = {
    staticHeroTitle: `The ${name}: ${series.includes('Crown') ? 'A Masterpiece of Hydrotherapy' : (series.includes('Vector') ? 'Precision Performance' : 'Your Social Sanctuary')}`,
    
    staticHydrotherapy: `${series.includes('Crown') ? `Featuring the Regal Hydrokinetic (RHK™) system, the ${name}` : `The ${name}`} delivers targeted relief through ${jets} precision-engineered jets, including a ${lounge} designed for ${series.includes('Crown') ? 'deep tissue penetration' : 'complete relaxation'}.`,
    
    staticClimate: `Built with ${getBuildInfo()}, the ${name} is engineered to maintain thermal integrity and minimize operational costs in any backyard environment.`,
    
    staticDesign: `The ${name} features a ${p.lengthIn ? `${p.lengthIn}x${p.widthIn}"` : 'spacious'} footprint optimized for ${seats} adults, balancing ${lounge} comfort with ${series.includes('Celebrity') ? 'maximum conversation space' : 'sophisticated ergonomics'}.`,
    
    staticEfficiency: `The ${getFiltration()} ensures the ${gallons > 0 ? `${gallons}-gallon` : 'high-volume'} water capacity remains crystal clear with minimal owner maintenance.`,
    
    staticDesignConsideration: `${series.includes('Crown') ? 'As a premier luxury spa, this' : 'This'} model offers an ideal balance of ${series.includes('Celebrity') ? 'reliability and social features' : 'performance and sophistication'} for ${series.includes('Crown') ? 'the most discerning owners' : 'active families'}.`,
    
    staticReasons: [
      `${series.includes('Crown') ? 'Regal Hydrokinetic (RHK™) high-flow' : 'Advanced Marquis hydro-flow'} system`,
      `${series.includes('Crown') ? 'ConstantClean+™' : 'ConstantClean™'} automated sanitation`,
      "DuraShell® structural longevity",
      series.includes('Vector') ? "V3 Throttle Control precision" : "Handcrafted Marquis build quality"
    ]
  };

  return data;
};

const updatedProducts = products.map(p => {
  const staticData = getStaticData(p);
  return { ...p, ...staticData };
});

fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2));
console.log('Successfully updated 29 products with static narratives.');
