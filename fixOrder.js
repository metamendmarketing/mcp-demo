const fs = require('fs');
let code = fs.readFileSync('c:/dev2/src/components/wizard/Wizard.tsx', 'utf8');

// The original blocks
const blockZip = `  {
    id: 'zipCode',
    question: "Where will your oasis be located?",
    subtext: "Your climate and elevation affect heating efficiency.",
    expertTip: "High-altitude and colder regions require our MaximizR™ full-foam insulation to maintain consistent 104°F temperatures efficiently. We factor your ZIP code to determine thermal load.",
    layout: 'map',
    options: []
  },`;

const blockSunOriginal = `  {
    id: 'sunExposure',
    question: "What is the primary backyard orientation?",
    subtext: "Understanding UV exposure dictates cover life and energy retention.",
    expertTip: "We ask this to determine your thermal load. A hot tub facing full Southern exposure will experience significant solar gain, reducing heating costs but accelerating UV degradation on standard covers. In this scenario, we will specifically mandate a premium Weathershield™ or ProLast™ cover to protect your investment.",
    layout: 'grid',
    options: [
      { value: 'morning', label: 'Morning Sun', tip: "Gentle Eastern exposure.", icon: <Sun className="w-10 h-10 text-amber-500 mx-auto" /> },
      { value: 'afternoon', label: 'Afternoon Sun', tip: "Intense Western exposure.", icon: <Sunset className="w-10 h-10 text-orange-500 mx-auto" /> },
      { value: 'direct', label: 'Full Day Direct', tip: "Maximum Southern exposure.", icon: <Flame className="w-10 h-10 text-red-500 mx-auto" /> },
      { value: 'shaded', label: 'Predominantly Shaded', tip: "Under trees or awnings.", icon: <Cloud className="w-10 h-10 text-slate-400 mx-auto" /> }
    ]
  },`;

const blockPlacement = `  {
    id: 'placement',
    question: "Where will the hot tub be placed?",
    subtext: "Site preparation dictates the structural requirements.",
    expertTip: "A filled hot tub commands a massive structural load—often exceeding 4,000 lbs. Ground installations require a leveled crushed rock base or a poured concrete pad (minimum 4 inches thick). If you select 'Wood Deck', you must have a structural engineer verify that your joists can support 150 lbs. per square foot.",
    layout: 'grid',
    options: [
      { value: 'deck', label: 'Wood/Composite Deck', tip: "Requires joist load-bearing verification.", image: '/mcp/demo/assets/placement_deck_1774073130622.png' },
      { value: 'patio', label: 'Concrete/Paver Patio', tip: "Standard solid foundation.", image: '/mcp/demo/assets/placement_patio_1774073144196.png' },
      { value: 'indoor', label: 'Indoor/Sunroom', tip: "Requires dedicated ventilation planning.", image: '/mcp/demo/assets/placement_indoor_1774073157297.png' },
      { value: 'ground', label: 'New Ground Site', tip: "Requires level EZ-Pad or crushed rock base.", image: '/mcp/demo/assets/placement_ground_1774073171701.png' }
    ]
  },`;

const combinedOriginal = blockZip + '\n' + blockSunOriginal + '\n' + blockPlacement;

// The new blocks
const blockSunNew = `  {
    id: 'sunExposure',
    question: "How much sun does this exact spot receive?",
    subtext: "Understanding UV exposure dictates cover life and energy retention.",
    expertTip: "We ask this to determine your thermal load. A hot tub sitting in direct sunlight all day will experience significant solar gain, reducing heating costs but accelerating UV degradation on standard vinyl covers. In a high-sun scenario, we will specifically mandate a premium Weathershield™ or ProLast™ fabric cover to protect your investment.",
    layout: 'grid',
    options: [
      { value: 'morning', label: 'Morning Sun Only', tip: "Gentle warmth; cooler in the evenings.", icon: <Sun className="w-10 h-10 text-amber-500 mx-auto" /> },
      { value: 'afternoon', label: 'Afternoon / Late Sun', tip: "Intense heat during the peak of the day.", icon: <Sunset className="w-10 h-10 text-orange-500 mx-auto" /> },
      { value: 'direct', label: 'Direct Sun All Day', tip: "Maximum solar gain; minimal shade.", icon: <Flame className="w-10 h-10 text-red-500 mx-auto" /> },
      { value: 'shaded', label: 'Heavy Shade / Covered', tip: "Under a roof, pergola, or dense trees.", icon: <TreePine className="w-10 h-10 text-emerald-600 mx-auto" /> }
    ]
  },`;

const combinedNew = blockPlacement + '\n' + blockSunNew + '\n' + blockZip;

code = code.replace(combinedOriginal, combinedNew);

fs.writeFileSync('c:/dev2/src/components/wizard/Wizard.tsx', code);
console.log("Reordered and updated text successfully");
