const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../prisma/marquis-products.json');
const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const getStaticData = (p) => {
  const name = p.modelName;
  const series = p.seriesName;

  if (series.includes('Crown')) {
    return {
      staticHeroTitle: `The ${name}: A Masterpiece of Hydrotherapy`,
      staticHydrotherapy: `The ${name} features the Regal Hydrokinetic (RHK™) system, delivering massive water volume at low pressure for deep tissue penetration without the 'sting' of traditional jets.`,
      staticClimate: "Built with full-foam insulation and the DuraShell® structure, this model is engineered to maintain thermal integrity in any environment.",
      staticDesign: "The Crown Series design philosophy focuses on sophisticated ergonomics and 'The Big 3': High-Flow Therapy, ConstantClean+™, and Diverse Seating.",
      staticEfficiency: "The ConstantClean+™ system manages water sanitation up to 51 times per day, significantly reducing maintenance time.",
      staticDesignConsideration: "As a premier luxury spa, this model requires professional electrical installation (50A/60A) to support its parallel pump and heater performance.",
      staticReasons: [
        "Regal Hydrokinetic (RHK™) high-flow system",
        "ConstantClean+™ automated sanitation",
        "DuraShell® structural longevity",
        "Handcrafted in the USA"
      ]
    };
  } else if (series.includes('Vector')) {
    return {
      staticHeroTitle: `The ${name}: Precision Engineered Performance`,
      staticHydrotherapy: `Driven by the V-O-L-T™ system, the ${name} provides a laminar flow experience that eliminates turbulence and focuses power through interchangeable Jetpods.`,
      staticClimate: "The architectural cabinet and high-density insulation package are designed for maximum efficiency and modern backyard aesthetics.",
      staticDesign: "Vector21 models feature a bold, geometric design that maximizes the interior footprint while providing surgical control over massage intensity.",
      staticEfficiency: "V3 Throttle Control valves allow you to direct 100% of pump power to individual seats or H.O.T. Zone® clusters.",
      staticDesignConsideration: "The modular Jetpod system allows for future therapy customization, ensuring the spa evolves with your wellness needs.",
      staticReasons: [
        "V-O-L-T™ system with laminar flow",
        "Interchangeable Jetpod therapy system",
        "V3 Throttle Control for precise power",
        "Architectural modern aesthetic"
      ]
    };
  } else if (series.includes('Elite')) {
    return {
      staticHeroTitle: `The ${name}: High-Performance Value`,
      staticHydrotherapy: `The Elite series delivers the famous Marquis 'Big 3' experience—High-Flow Therapy, ConstantClean™, and Diverse Seating—at an exceptional value point.`,
      staticClimate: "Constructed with durable materials and efficient insulation, the Elite is designed for reliable performance across all four seasons.",
      staticDesign: "A balanced design that prioritizes seating comfort and traditional aesthetics, making it a timeless addition to any outdoor space.",
      staticEfficiency: "Features the proven ConstantClean™ filtration system and high-efficiency pumps for reduced operational costs.",
      staticDesignConsideration: "A perfect balance of footprint and feature density, offering premium hydrotherapy without the premium price tag.",
      staticReasons: [
        "High-Flow hydrotherapy delivery",
        "ConstantClean™ water management",
        "Durable, long-lasting construction",
        "Exceptional price-to-performance ratio"
      ]
    };
  } else if (series.includes('Celebrity')) {
    return {
      staticHeroTitle: `The ${name}: Your Social Sanctuary`,
      staticHydrotherapy: `Celebrity spas focus on social hydrotherapy, providing a relaxing and fun environment for family and friends with Marquis' signature water quality.`,
      staticClimate: "Built to provide years of enjoyment with minimal upkeep, featuring a rugged cabinet and straightforward mechanical systems.",
      staticDesign: "Designed with an open-concept philosophy to maximize conversation space and ease of movement.",
      staticEfficiency: "The simple, effective filtration system ensures crystal-clear water with straightforward maintenance protocols.",
      staticDesignConsideration: "An ideal choice for first-time owners looking for a reliable, high-quality spa for social and recreational use.",
      staticReasons: [
        "Social-first open seating layout",
        "Simple, reliable mechanical systems",
        "Excellent Marquis build quality",
        "Vibrant lighting and water features"
      ]
    };
  } else if (series.toLowerCase().includes('atv')) {
    return {
      staticHeroTitle: `The ${name}: The Ultimate Aquatic Trainer`,
      staticHydrotherapy: `ATV swim spas are engineered for both high-performance aquatic training and deep-tissue hydrotherapy, offering a professional-grade swim current.`,
      staticClimate: "Constructed with marine-grade materials to withstand the heavy loads and intense use of a swim spa environment.",
      staticDesign: "The dual-purpose design provides a dedicated swim lane for fitness and specialized therapy seats for post-workout recovery.",
      staticEfficiency: "Equipped with high-volume swim pumps and advanced filtration to handle larger water volumes and high bather loads.",
      staticDesignConsideration: "Requires a level, reinforced foundation capable of supporting over 15,000 lbs of water and equipment.",
      staticReasons: [
        "Professional-grade swim current system",
        "Dual-purpose fitness and therapy zones",
        "High-volume aquatic filtration",
        "Unsurpassed structural integrity"
      ]
    };
  }
  return {};
};

const updatedProducts = products.map(p => {
  const staticData = getStaticData(p);
  return { ...p, ...staticData };
});

fs.writeFileSync(filePath, JSON.stringify(updatedProducts, null, 2));
console.log('Successfully updated 29 products with static narratives.');
