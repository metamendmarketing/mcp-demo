'use client';

import React, { useState } from 'react';
import { 
  Check, ChevronRight, RotateCcw, Zap, Users, Star, Maximize, UserCheck, 
  MessageSquare, MapPin, Droplets, Heart, Sparkles, ArrowRight, Info, ChevronLeft, Plus,
  Compass, Sun, CloudSun, Sunset, Cloud, Box, Home, TreePine, Activity, Flame, Droplet,
  Waves, Palette, LayoutGrid, Leaf, Settings, Wrench, Battery, BatteryCharging, Gauge,
  Wallet, Landmark, Gem, Hammer, Truck, Thermometer
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PreferenceKey = 
  | 'primaryPurpose' 
  | 'capacity' 
  | 'lounge' 
  | 'electrical' 
  | 'zipCode' 
  | 'sunExposure' 
  | 'placement' 
  | 'physicalFocus' 
  | 'aesthetic' 
  | 'maintenance' 
  | 'intensity' 
  | 'budget' 
  | 'installationReady' 
  | 'deliveryAccess';

export interface UserPreferences {
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
}

interface Product {
  id: string;
  modelName: string;
  slug: string;
  marketingSummary: string;
  lengthIn: number;
  widthIn: number;
  depthIn: number;
  jetCount: number;
  seatsMin: number;
  seatsMax: number;
  usageTags: string[];
  overheadImageUrl?: string;
  hotspots?: any[];
}

interface ScoredProduct {
  product: Product;
  score: number;
  reasons: string[];
}

const QUESTIONS: {
  id: PreferenceKey;
  question: string;
  subtext: string;
  expertTip: string;
  layout: 'grid' | 'split' | 'map' | 'slider';
  bgImage?: string;
  options: { label: string; value: string; icon?: React.ReactNode; image?: string; tip?: string }[];
}[] = [
  {
    id: 'primaryPurpose',
    question: "What is your primary goal?",
    subtext: "Your intention dictates the flow management and jet configurations we recommend.",
    expertTip: "The physical architecture of a Marquis spa changes based on your answer. Therapy-focused models utilize our proprietary V-O-L-T™ flow system to drive massive, low-pressure water volume for deep tissue penetration. Conversely, recreational models prioritize open-concept seating, ambient waterline lighting, and spacious footwells for group entertaining.",
    layout: 'grid',
    options: [
      { value: 'therapy', label: 'Deep Hydrotherapy', tip: "Focused relief for chronic pain, athletic recovery, and targeted muscle tension.", image: '/mcp/demo/assets/therapy_premium.png' },
      { value: 'recreational', label: 'Social & Entertainment', tip: "Open seating, vibrant lighting, and space for family connection.", image: '/mcp/demo/assets/recreation_premium.png' },
      { value: 'relaxation', label: 'Stress Relief & Sleep', tip: "Gentle bubbling, quiet operation, and ergonomic lounging for mental reset.", image: '/mcp/demo/assets/fitness_premium.png' }
    ]
  },
  {
    id: 'capacity',
    question: "What seating capacity fits your lifestyle?",
    subtext: "Determine your footprint. Remember, larger tubs offer more varied seat depths.",
    expertTip: "Capacity isn't solely about how many people you plan to host. A 6+ person model offers a significantly larger interior footprint, providing diverse jet patterns and varying seat depths. This is crucial if your family has significant height differences. For solo or couples therapy, a 2-3 person blueprint maximizes efficiency without sacrificing power.",
    layout: 'grid',
    options: [
      { value: '2-3', label: '2-3 Adults', tip: "Intimate, highly efficient footprint perfect for smaller patios.", image: '/mcp/demo/assets/capacity_intimate_1774075207167.png' },
      { value: '4-5', label: '4-5 Adults', tip: "The standard family size, offering a mix of lounges and deep bucket seats.", image: '/mcp/demo/assets/capacity_family_1774075222333.png' },
      { value: '6+', label: '6+ Adults', tip: "Ultimate entertainment hubs with massive open seating specifications.", image: '/mcp/demo/assets/capacity_entertaining_1774075235674.png' }
    ]
  },
  {
    id: 'lounge',
    question: "Do you prefer a dedicated lounge seat?",
    subtext: "A fully reclined seat designed for intense, full-body immersion.",
    expertTip: "Loungers provide the absolute best full-body hydrotherapy sequence, targeting your neck down to your calves simultaneously. However, a lounge seat consumes the footprint of approximately two standard upright seats. If your goal is maximizing headcount for parties, we recommend an open-seating model.",
    layout: 'split',
    bgImage: '/mcp/demo/assets/bg_lounge_1774075579221.png',
    options: [
      { value: 'yes', label: 'Yes, include a Lounger', tip: "I prioritize solo, full-body relaxation.", icon: <Maximize className="w-8 h-8" /> },
      { value: 'no', label: 'No, Open Seating', tip: "I want to maximize the number of seats available.", icon: <Users className="w-8 h-8" /> },
      { value: 'no-pref', label: 'No Preference', tip: "Show me the best matches for both layouts.", icon: <Star className="w-8 h-8" /> }
    ]
  },
  {
    id: 'electrical',
    question: "What is your electrical capacity?",
    subtext: "Determines heating speed and parallel pump performance.",
    expertTip: "This is a critical infrastructure decision. 110V 'Plug and Play' models can connect to a standard household outlet, making installation trivial. However, they cannot run the 4kW heater and high-speed pumps simultaneously. If you live in a cold climate or demand aggressive jet pressure, a dedicated 240V hardwired line is essential.",
    layout: 'split',
    bgImage: '/mcp/demo/assets/bg_electrical_night_1774075976736.png',
    options: [
      { value: '110v', label: '110V Plug & Play', tip: "Easy install via standard outlet. Heater pauses when jets are on high.", icon: <Battery className="w-8 h-8 text-blue-400" /> },
      { value: '240v', label: '240V Hardwired', tip: "Requires an electrician. Maximum parallel performance and rapid heating.", icon: <BatteryCharging className="w-8 h-8 text-marquis-blue" /> },
      { value: 'help', label: 'Help me decide', tip: "I need more information on electrical requirements.", icon: <Info className="w-8 h-8 text-slate-400" /> }
    ]
  },
  {
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
  },  {
    id: 'sunExposure',
    question: "How much sun does this exact spot receive?",
    subtext: "Understanding UV exposure dictates cover life and energy retention.",
    expertTip: "We ask this to determine your thermal load. A hot tub sitting in direct sunlight all day will experience significant solar gain, reducing heating costs but accelerating UV degradation on standard vinyl covers. In a high-sun scenario, we will specifically mandate a premium Weathershield™ or ProLast™ fabric cover to protect your investment.",
    layout: 'grid',
    options: [
      { value: 'morning', label: 'Morning Sun Only', tip: "Gentle warmth; cooler in the evenings.", icon: <Sun className="w-10 h-10 text-amber-500 mx-auto" /> },
      { value: 'afternoon', label: 'Afternoon / Late Sun', tip: "Intense heat during the peak of the day.", icon: <Sunset className="w-10 h-10 text-orange-500 mx-auto" /> },
      { value: 'direct', label: 'Direct Sun All Day', tip: "Maximum solar gain; minimal shade.", icon: <Flame className="w-10 h-10 text-red-500 mx-auto" /> },
      { value: 'shaded', label: 'Heavy Shade / Covered', tip: "Under a roof, pergola, or dense trees.", icon: <TreePine className="w-10 h-10 text-slate-400 mx-auto" /> }
    ]
  },
  {
    id: 'zipCode',
    question: "What is your Zip Code?",
    subtext: "Your precise climate and elevation affect heating efficiency.",
    expertTip: "High-altitude and colder regions require our MaximizR™ full-foam insulation to maintain consistent 104°F temperatures efficiently. We factor your ZIP code to determine thermal load.",
    layout: 'map',
    options: []
  },

  {
    id: 'physicalFocus',
    question: "Where do you need the most physical relief?",
    subtext: "We will prioritize specific High Output Therapy (H.O.T.) Zones.",
    expertTip: "Each Marquis seat is engineered differently. If you suffer from plantar fasciitis or standing fatigue, we will filter for models equipped with the Geyser Jet system in the footwell. If neck tension is your primary complaint, we focus on models featuring our specialized Neck and Shoulder collar down-draft jets.",
    layout: 'grid',
    options: [
      { value: 'neck-shoulders', label: 'Neck & Shoulders', tip: "Targeted collar jets for tension headaches.", icon: <Activity className="w-10 h-10 mx-auto" /> },
      { value: 'lower-back', label: 'Lower Back & Lumbar', tip: "Deep penetration HK jets for sciatica.", icon: <Waves className="w-10 h-10 mx-auto" /> },
      { value: 'legs-feet', label: 'Legs & Feet', tip: "Reflexology and calf massage zones.", icon: <Droplet className="w-10 h-10 mx-auto" /> },
      { value: 'full-body', label: 'Total Immersion', tip: "Comprehensive sequential massage.", icon: <Heart className="w-10 h-10 mx-auto" /> }
    ]
  },
  {
    id: 'aesthetic',
    question: "What is your backyard's aesthetic design?",
    subtext: "We will harmonize the spa's exterior cabinet and shell colors.",
    expertTip: "A hot tub is a massive visual focal point. We want it to blend seamlessly into your architecture. 'Sleek & Modern' homes pair perfectly with our stark Midnight Canyon shells and monochromatic Slate cabinets. For a 'Warm Rustic' environment, we lean toward Tuscan Sun acrylics layered against natural wood-grain textures.",
    layout: 'grid',
    options: [
      { value: 'modern', label: 'Sleek & Modern', tip: "Monochrome, glass, stark lines.", image: '/mcp/demo/assets/aesthetic_modern_1774073072031.png' },
      { value: 'rustic', label: 'Warm & Rustic', tip: "Heavy timber, natural stone, earth tones.", image: '/mcp/demo/assets/aesthetic_rustic_1774073087013.png' },
      { value: 'tropical', label: 'Island Tropical', tip: "Lush greens, teaks, resort-style.", image: '/mcp/demo/assets/aesthetic_tropical_1774073099414.png' },
      { value: 'classic', label: 'Timeless Classic', tip: "Brick, manicured lawns, white trim.", image: '/mcp/demo/assets/aesthetic_classic_1774073116007.png' }
    ]
  },
  {
    id: 'maintenance',
    question: "What is your expected maintenance profile?",
    subtext: "Determine your tolerance for manual water chemistry.",
    expertTip: "Water care shouldn't feel like a chemistry degree. If you select 'Automated', we will equip your model with the ConstantClean+™ system featuring in-line SmartChlor and ozonators, which manages 90% of sanitization automatically. If you prefer a hands-on approach and lower upfront costs, traditional manual dosing is available.",
    layout: 'split',
    bgImage: '/mcp/demo/assets/bg_maintenance_1774073867138.png',
    options: [
      { value: 'automated', label: 'Set it and Forget it', tip: "Requires the ConstantClean+™ automated inline sanitation system upgrade.", icon: <Settings className="w-8 h-8 text-marquis-blue" /> },
      { value: 'hands-on', label: 'I enjoy the ritual', tip: "Standard filtration with manual weekly chemical balancing.", icon: <Wrench className="w-8 h-8 text-slate-400" /> }
    ]
  },
  {
    id: 'intensity',
    question: "Preferred Hydrotherapy Intensity?",
    subtext: "Are you looking for a gentle soak or aggressive deep tissue manipulation?",
    expertTip: "Pump horsepower doesn't equal pressure—flow dynamics do. For a 'Firm Deep Tissue' massage, we require models with dedicated dual-speed pumps routed through High-Kinetic (HK) massage jets. If you prefer 'Gentle', we prioritize High-Volume, Low-Pressure (HVLP) broad orifice jets that move water smoothly over the skin without stinging.",
    layout: 'split',
    bgImage: '/mcp/demo/assets/bg_intensity_1774073882614.png',
    options: [
      { value: 'gentle', label: 'Gentle Relaxation', tip: "Broad, smooth water flow. Ideal for sensitive skin or simple soaking.", icon: <Cloud className="w-8 h-8" /> },
      { value: 'medium', label: 'Medium Vigorous', tip: "The perfect balance of soothing soak and active muscle recovery.", icon: <Waves className="w-8 h-8" /> },
      { value: 'firm', label: 'Aggressive Deep Tissue', tip: "High-kinetic jets designed to break down lactic acid and deep knots.", icon: <Gauge className="w-8 h-8" /> }
    ]
  },
  {
    id: 'budget',
    question: "What is your comfortable investment range?",
    subtext: "We respect your budget and will maximize the value within it.",
    expertTip: "While the initial sticker price matters, true cost of ownership is found in energy efficiency. A 'Premium' tier tub from our Crown Series features full-foam insulation that dramatically reduces monthly electrical costs. An 'Entry' level tub will save you thousands today, but may cost slightly more per month to operate in freezing temperatures.",
    layout: 'grid',
    options: [
      { value: 'entry', label: 'Entry Tier', tip: "$5,000 - $8,000. Basic foam, standard jets, unmatched Marquis reliability.", icon: <Wallet className="w-10 h-10 mx-auto" /> },
      { value: 'mid', label: 'Standard Tier', tip: "$9,000 - $13,000. Upgraded insulation, more pumps, advanced lighting.", icon: <Landmark className="w-10 h-10 mx-auto" /> },
      { value: 'premium', label: 'Premium Tier', tip: "$14,000 - $18,000. Full-foam MaximizR, comprehensive V-O-L-T™ therapy.", icon: <Star className="w-10 h-10 mx-auto" /> },
      { value: 'luxury', label: 'Luxury Tier', tip: "$19,000+. The pinnacle of hydrotherapy, automation, and aesthetic design.", icon: <Gem className="w-10 h-10 mx-auto" /> }
    ]
  },
  {
    id: 'installationReady',
    question: "What is your current project timeline?",
    subtext: "Are we delivering next week, or are you breaking ground next year?",
    expertTip: "Timing affects availability. If you are 'Ready to go', we will prioritize in-stock models available at your local dealer immediately. If you are in the planning phase, we can explore custom-ordered shell and cabinet combinations straight from the factory, which carry a 6-8 week lead time.",
    layout: 'split',
    options: [
      { value: 'ready', label: 'I am ready to buy', tip: "Site is leveled, electrical is routed, and budget is secured.", icon: <Zap className="w-8 h-8 text-yellow-500" /> },
      { value: 'planning', label: 'I am just researching', tip: "Still formulating the backyard design and gathering quotes.", icon: <Compass className="w-8 h-8 text-marquis-blue" /> }
    ]
  },
  {
    id: 'deliveryAccess',
    question: "Final Step: Backyard Delivery Access?",
    subtext: "We need to physically move a 900lb shell into your space.",
    expertTip: "A standard hot tub measures about 36 to 40 inches tall when placed on its side for delivery on a spa dolly. If your side gate offers 40+ inches of clearance, delivery is smooth. However, if you have tight switchbacks, steep stairs, or narrow alleyways, we may need to coordinate a specialized crane drop.",
    layout: 'split',
    options: [
      { value: 'easy', label: 'Wide Open Access', tip: "Double-wide gates or zero steps. Standard 2-man delivery.", icon: <Truck className="w-8 h-8" /> },
      { value: 'standard', label: 'Standard Clearance', tip: "Minimum 40-inch wide side gate with a clear, flat path.", icon: <Hammer className="w-8 h-8" /> },
      { value: 'tight', label: 'Tight / Complex Path', tip: "Narrow gates, stairs, or requires crane facilitation.", icon: <MapPin className="w-8 h-8" /> }
    ]
  }
];

const COMPETITORS: Record<string, { name: string; model: string; jets: number; capacity: string; highlights: string[] }> = {
  'Summit': { name: 'Hot Spring', model: 'Grandee', jets: 43, capacity: '7 Adults', highlights: ['Moto-Massage DX', 'FiberCor Insulation', 'No-Bypass Filtration'] },
  'Epic': { name: 'Bullfrog', model: 'A8', jets: 54, capacity: '6 Adults', highlights: ['JetPak Therapy', 'H2Air Technology', 'Wood-free Frame'] },
  'Euphoria': { name: 'Hot Spring', model: 'Sovereign', jets: 28, capacity: '6 Adults', highlights: ['Tri-X Filtration', 'Silent-Flo 5000', 'Energy Smart System'] },
  'Resort': { name: 'Bullfrog', model: 'M9', jets: 60, capacity: '8 Adults', highlights: ['Elite Exterior', 'Advanced Water Care', 'M-Series JetPaks'] },
  'Spirit': { name: 'Hot Spring', model: 'Jetsetter', jets: 22, capacity: '3 Adults', highlights: ['Luminescence Lighting', 'FreshWater Salt', 'WaveMaster Pump'] },
  'Wish': { name: 'Bullfrog', model: 'X7', jets: 36, capacity: '5 Adults', highlights: ['Leak-guard Plumb', 'High-Output Pumps', 'StableBase Design'] }
};

export default function Wizard() {
  const [step, setStep] = useState<'intro' | 'question' | 'blueprint' | 'results' | 'details'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [preferences, setPreferences] = useState<UserPreferences>({
    primaryPurpose: null,
    capacity: null,
    lounge: null,
    electrical: null,
    zipCode: null,
    sunExposure: null,
    placement: null,
    physicalFocus: null,
    aesthetic: null,
    maintenance: null,
    intensity: null,
    budget: null,
    installationReady: null,
    deliveryAccess: null,
  });
  
  const [results, setResults] = useState<ScoredProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ScoredProduct | null>(null);
  const [aiNarrative, setAiNarrative] = useState<{heroTitle?: string; summaryBullets?: string[]; hydrotherapy?: string; climate?: string; design?: string; efficiency?: string; error?: string} | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  const updatePreference = (key: PreferenceKey, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setStep('blueprint');
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      setStep('intro');
    }
  };

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const res = await fetch('/mcp/demo/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences }),
      });
      const data = await res.json();
      const formattedResults = data.results?.map((r: any) => ({
        ...r,
        product: {
          ...r.product,
          usageTags: typeof r.product.usageTags === 'string' ? JSON.parse(r.product.usageTags) : r.product.usageTags
        }
      }));
      setResults(formattedResults || []);
      setStep('results');


      if (formattedResults && formattedResults.length > 0) {
        setNarrativeLoading(true);
        try {
          const narrativeRes = await fetch('/mcp/demo/api/narrative', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preferences, product: formattedResults[0].product }),
          });
          const narrativeData = await narrativeRes.json();
          setAiNarrative(narrativeData);
        } catch (narrativeError) {
          console.error('Narrative failed', narrativeError);
        } finally {
          setNarrativeLoading(false);
        }
      }
    } catch (err) {
      console.error('Recommendation failed', err);
    } finally {
      setLoading(false);
    }
  };

  const getHeroImage = (modelCode: string) => {
    if (modelCode.includes('Summit')) return 'https://www.marquisspas.com/media/177319/summit_beauty.jpg';
    if (modelCode.includes('Epic')) return 'https://www.marquisspas.com/media/177319/summit_beauty.jpg';
    return '/mcp/demo/assets/therapy_premium.png';
  };

  const StepHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="bg-gradient-to-r from-marquis-light-blue to-marquis-blue w-full py-6 px-6 text-center shadow-md relative overflow-hidden text-white">
      <div className="relative z-10 space-y-1">
        <h3 className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">The Ultimate Hot Tub Experience®</h3>
        <h2 className="text-xl md:text-2xl font-black italic uppercase leading-none drop-shadow-sm">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-white/90 mt-1">{subtitle}</p>}
      </div>
      <div className="absolute bottom-0 left-0 h-1 bg-marquis-green transition-all duration-500 ease-out" style={{ width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }} />
    </div>
  );

  if (step === 'intro') {
    return (
      <div className="flex flex-col h-full bg-[url('/mcp/demo/assets/intro_bg.png')] bg-cover bg-center relative overflow-hidden animate-slick-reveal">
         <div className="absolute inset-0 bg-slate-900/50" />
         <div className="p-8 pb-16 md:p-16 flex flex-col items-center justify-center text-center relative z-10 flex-grow min-h-[500px]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase text-white mb-6 leading-[1.1] drop-shadow-xl max-w-2xl">
               Find the perfect <br /> <span className="text-marquis-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">hot tub for you.</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-xl mb-10 font-medium drop-shadow-md">
               "Create the ultimate relaxation oasis in your own backyard with meticulous refinement and obsessive attention to detail."
            </p>
            <button 
              onClick={() => setStep('question')}
              className="btn-marquis-premium px-12 py-4 rounded-full text-base font-bold flex items-center gap-3 shadow-2xl hover:scale-105 transition-transform"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 w-full bg-white/10 backdrop-blur-md border-t border-white/20 text-center relative z-10">
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/20">
               <div className="text-white font-bold uppercase mb-1 drop-shadow-md">Extraordinary Quality</div>
               <div className="text-white/80 text-xs">Built to rigorous standards.</div>
            </div>
            <div className="p-6 border-b md:border-b-0 md:border-r border-white/20">
               <div className="text-white font-bold uppercase mb-1 drop-shadow-md">World-Class Performance</div>
               <div className="text-white/80 text-xs">V-O-L-T™ hydrotherapy delivery.</div>
            </div>
            <div className="p-6">
               <div className="text-white font-bold uppercase mb-1 drop-shadow-md">Meticulously Crafted</div>
               <div className="text-white/80 text-xs">Made in the USA.</div>
            </div>
         </div>
      </div>
    );
  }

  if (step === 'question') {
    const q = QUESTIONS[currentQuestionIndex];
    
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-slick-reveal overflow-hidden">
        <StepHeader title={q.question} subtitle={q.subtext} />
        
        <div className="flex-grow overflow-y-auto px-6 py-8 md:p-10">
          <div className="max-w-6xl mx-auto">
            {q.layout !== 'split' && q.expertTip && (
              <div className="mb-8 p-6 bg-blue-50/50 border border-blue-100/50 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-white rounded-xl shadow-sm shrink-0">
                  <Info className="w-5 h-5 text-marquis-blue" />
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-marquis-blue mb-1">Expert Insight</h4>
                  <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed italic">
                    "{q.expertTip}"
                  </p>
                </div>
              </div>
            )}
            
            {q.layout === 'grid' && (
              <div className={cn(
                "grid gap-6 mx-auto",
                q.options.length === 3 
                  ? "grid-cols-1 md:grid-cols-3 max-w-4xl" 
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              )}>
                {q.options.map((opt, i) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updatePreference(q.id, opt.value);
                      setTimeout(nextQuestion, 150);
                    }}
                    className={cn(
                      "group relative bg-white rounded-2xl border-2 p-6 text-left transition-all shadow-sm hover:shadow-lg flex flex-col justify-start items-center h-full min-h-[160px]",
                      preferences[q.id] === opt.value ? "border-marquis-blue ring-2 ring-marquis-blue/20 bg-blue-50/20" : "border-slate-100/80 hover:border-marquis-blue/40"
                    )}
                  >
                    {opt.image ? (
                      <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-slate-100">
                        <img src={opt.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={opt.label} />
                      </div>
                    ) : opt.icon ? (
                      <div className={cn(
                        "w-16 h-16 mb-6 rounded-2xl flex items-center justify-center transition-all duration-300",
                        preferences[q.id] === opt.value ? "bg-marquis-blue text-white shadow-xl shadow-marquis-blue/30 scale-105" : "bg-slate-50 text-marquis-blue/60 group-hover:bg-blue-50/80 group-hover:text-marquis-blue group-hover:scale-105"
                      )}>
                        {opt.icon}
                      </div>
                    ) : null}
                    <div className="flex flex-col flex-grow w-full items-center justify-start text-center mt-auto">
                      <h4 className="text-xl font-black uppercase italic mb-2 text-slate-800 tracking-wide">{opt.label}</h4>
                      {opt.tip && <p className="text-sm text-slate-500 font-medium leading-relaxed">{opt.tip}</p>}
                    </div>
                    
                    {/* Selected state indicator */}
                    <div className={cn(
                      "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                      preferences[q.id] === opt.value ? "bg-marquis-blue text-white opacity-100 scale-100" : "bg-transparent text-transparent opacity-0 scale-50"
                    )}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {q.layout === 'split' && (
              <div className={cn(
                "grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative",
                q.bgImage ? "p-10 rounded-[40px] overflow-hidden shadow-2xl" : ""
              )}>
                {q.bgImage && (
                  <>
                    <img src={q.bgImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/20 z-10" />
                  </>
                )}
                
                <div className="lg:col-span-5 space-y-6 relative z-20">
                  <div className={cn(
                    "p-8 rounded-3xl border shadow-sm relative overflow-hidden",
                    q.bgImage ? "bg-white/10 backdrop-blur-md border-white/20 text-white" : "bg-white border-slate-100"
                  )}>
                    <div className={cn(
                      "absolute top-0 left-0 w-2 h-full",
                      q.bgImage ? "bg-white/50" : "bg-marquis-blue"
                    )} />
                    <div className={cn(
                      "flex items-center gap-3 mb-4",
                      q.bgImage ? "text-blue-200" : "text-marquis-blue"
                    )}>
                      <Info className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase tracking-widest">Expert Insight</span>
                    </div>
                    <p className={cn(
                      "text-lg font-medium leading-relaxed italic",
                      q.bgImage ? "text-white" : "text-slate-700"
                    )}>
                      "{q.expertTip}"
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-4 relative z-20">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updatePreference(q.id, opt.value);
                        setTimeout(nextQuestion, 150);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all hover:shadow-md group",
                        preferences[q.id] === opt.value ? "bg-white border-marquis-blue ring-2 ring-marquis-blue/20 scale-[1.02] shadow-xl" : "bg-white/95 border-slate-100/80 hover:border-marquis-blue/40"
                      )}
                    >
                      <div className="flex items-center gap-6">
                        {opt.icon && (
                          <div className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shrink-0",
                            preferences[q.id] === opt.value ? "bg-marquis-blue text-white shadow-lg shadow-marquis-blue/20" : "bg-slate-50 text-slate-400 group-hover:bg-blue-50/50 group-hover:text-marquis-blue"
                          )}>
                            {opt.icon}
                          </div>
                        )}
                        <div className="flex flex-col text-left">
                          <span className="text-xl font-black uppercase italic text-slate-800 tracking-wide">{opt.label}</span>
                          {opt.tip && <span className="text-sm text-slate-500 font-medium mt-1">{opt.tip}</span>}
                        </div>
                      </div>
                      
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 border-2",
                        preferences[q.id] === opt.value ? "bg-marquis-blue border-marquis-blue text-white" : "bg-transparent border-slate-200 text-slate-300 group-hover:border-marquis-blue/30 group-hover:bg-blue-50/30 group-hover:text-marquis-blue"
                      )}>
                        {preferences[q.id] === opt.value ? <Check className="w-5 h-5 mx-auto" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {q.layout === 'map' && (
              <div className="max-w-md mx-auto space-y-8 text-center py-10">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-marquis-blue/20 blur-3xl rounded-full" />
                  <MapPin className="w-20 h-20 text-marquis-blue relative z-10 mx-auto animate-bounce duration-1000" />
                </div>
                <div className="space-y-4">
                   <input 
                      type="text" 
                      placeholder="Enter Delivery Zip Code"
                      className="w-full bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 text-2xl font-black italic uppercase text-center focus:border-marquis-blue focus:ring-4 focus:ring-marquis-blue/10 outline-none transition-all placeholder:text-slate-300"
                      onChange={(e) => updatePreference('zipCode', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && nextQuestion()}
                   />
                   <p className="text-sm text-slate-500 font-medium">We use this to calculate local sunrise/sunset and climate stress.</p>
                   <button 
                     onClick={nextQuestion}
                     className="btn-marquis-premium w-full py-4 rounded-2xl text-lg font-black italic uppercase shadow-xl"
                   >
                     Confirm Location
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center">
          <button 
            onClick={prevQuestion}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-marquis-blue transition-colors px-4 py-2"
          >
            <ChevronLeft className="w-5 h-5" /> Back
          </button>
          
          <div className="flex gap-1">
            {QUESTIONS.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all",
                  i === currentQuestionIndex ? "bg-marquis-blue w-6" : "bg-slate-200"
                )} 
              />
            ))}
          </div>
          
          <div className="text-xs font-black uppercase text-slate-400 tracking-widest">
            Step {currentQuestionIndex + 1} of {QUESTIONS.length}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'blueprint') {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-white animate-slick-reveal">
        <div className="flex-grow flex flex-col items-center justify-center p-10 text-center max-w-4xl mx-auto space-y-10">
           <div className="space-y-4">
              <div className="w-20 h-20 bg-marquis-blue rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                 <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-none">AI Blueprint <br/><span className="text-marquis-blue">Generated.</span></h2>
              <p className="text-slate-400 text-lg">We've synthesized your 14 data points into a personalized hydrotherapy profile.</p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[
                { label: 'Environment', val: preferences.sunExposure },
                { label: 'Usage', val: preferences.primaryPurpose },
                { label: 'Intensity', val: preferences.intensity },
                { label: 'Aesthetic', val: preferences.aesthetic }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left backdrop-blur-sm">
                  <div className="text-[10px] font-bold text-marquis-blue uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-sm font-black uppercase italic truncate">{item.val?.toUpperCase() || 'CALCULATING'}</div>
                </div>
              ))}
           </div>

           <button 
             onClick={handleRecommend}
             disabled={loading}
             className="btn-marquis-premium px-16 py-5 rounded-2xl text-xl font-black italic uppercase shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-pulse"
           >
             {loading ? 'Synthesizing Match...' : 'Reveal My Perfection'}
           </button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-slick-reveal">
        <StepHeader title="Your Personalized Selection" subtitle="Meticulously matched based on your 14 expert criteria." />
        
        <div className="p-6 md:p-10 flex-grow">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             {results && results.slice(0, 2).map((res, i) => {
               const heroImg = getHeroImage(res.product.modelName);
               return (
                 <div key={res.product.id} className={cn(
                   "bg-white rounded-3xl overflow-hidden shadow-md flex flex-col border transition-all duration-700 animate-in fade-in slide-in-from-bottom",
                   i === 0 ? "border-marquis-blue ring-2 ring-marquis-blue/10 shadow-xl" : "border-slate-100"
                 )}>
                   <div className="w-full h-64 relative bg-slate-100 overflow-hidden group">
                      <img src={heroImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={res.product.modelName} />
                      {i === 0 && (
                          <div className="absolute top-6 left-6 bg-marquis-blue px-4 py-2 rounded-full text-xs font-black uppercase text-white shadow-xl">The Gold Standard Match</div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 flex justify-between text-white">
                         <div className="text-sm font-bold"><Zap className="inline w-4 h-4 mr-1 text-marquis-blue"/> {res.product.jetCount} Jets</div>
                         <div className="text-sm font-bold"><Heart className="inline w-4 h-4 mr-1 text-marquis-blue"/> {res.score}% Match</div>
                      </div>
                   </div>
                   
                   <div className="p-8 flex flex-col flex-grow">
                      <div className="mb-6">
                          <h3 className="text-3xl font-black italic uppercase text-slate-800 leading-none mb-2">{res.product.modelName}</h3>
                          <div className="text-marquis-blue text-xs font-bold uppercase tracking-widest">Crown Series Collection</div>
                      </div>
                      
                      <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">"{res.product.marketingSummary}"</p>

                      <button 
                        onClick={() => { setSelectedResult(res); setStep('details'); window.scrollTo(0,0); }}
                        className="btn-marquis-premium w-full py-4 text-sm rounded-xl font-black italic uppercase shadow-lg shadow-marquis-blue/20"
                      >
                        Explore My Blueprint
                      </button>
                   </div>
                 </div>
               );
             })}
           </div>
        </div>
      </div>
    );
  }

  if (step === 'details' && selectedResult) {
    const { product, reasons } = selectedResult;
    const heroImg = getHeroImage(product.modelName);
    const competitor = COMPETITORS[product.modelName] || { name: 'Market', model: 'Equivalent', jets: 45, capacity: '6-7 Adults', highlights: ['Standard Filtration', 'Basic Jets'] };

    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* TOP NAV BAR */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <button onClick={() => setStep('results')} className="group text-slate-500 hover:text-marquis-blue flex items-center gap-3 font-black text-xs uppercase tracking-widest transition-colors">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to matches
            </button>
            <div className="flex gap-4">
               <button className="bg-marquis-blue text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic">Get Pricing</button>
               <button className="border-2 border-slate-200 text-slate-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest italic">Find Dealer</button>
            </div>
          </div>
        </div>

        {/* TIER 1: THE EXECUTIVE VERDICT (HERO) */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
               <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-tr from-marquis-blue/20 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                  <div className="relative bg-white p-4 rounded-[60px] shadow-2xl overflow-hidden border border-slate-100">
                     <img src={heroImg} className="w-full h-[500px] object-cover rounded-[48px] transform group-hover:scale-102 transition-transform duration-[2000ms]" alt={product.modelName} />
                  </div>
               </div>
            </div>
            
            <div className="lg:col-span-5 space-y-8">
               <div className="space-y-2">
                  <div className="text-marquis-blue text-sm font-black uppercase tracking-[0.3em] mb-4">The Verdict</div>
                  <h1 className="text-5xl md:text-7xl font-black italic uppercase text-slate-900 leading-[0.9] tracking-tighter">
                    {narrativeLoading ? "Synthesizing..." : (aiNarrative?.heroTitle || product.modelName)}
                  </h1>
               </div>

               <div className="space-y-4 pt-6">
                  {narrativeLoading || !aiNarrative?.summaryBullets ? (
                    [1,2,3,4].map(i => (
                      <div key={i} className="flex gap-4 items-center animate-pulse">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex-shrink-0" />
                        <div className="h-4 bg-slate-200 rounded w-full" />
                      </div>
                    ))
                  ) : (
                    aiNarrative.summaryBullets.map((bullet, i) => (
                      <div key={i} className="flex gap-4 items-start animate-in fade-in slide-in-from-right fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="bg-marquis-blue text-white p-2 rounded-xl mt-1 flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-lg text-slate-600 font-bold leading-tight">{bullet}</p>
                      </div>
                    ))
                  )}
               </div>

               <div className="pt-8 grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Configuration</div>
                    <div className="text-xl font-black italic uppercase text-slate-900">{product.seatsMax} Adults</div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Jet Topology</div>
                    <div className="text-xl font-black italic uppercase text-slate-900">{product.jetCount} V-O-L-T™</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* TIER 2: THE MARQUIS MIRROR (COMPARISON) */}
        <section className="bg-white py-24 border-y border-slate-100 overflow-hidden relative mb-20">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-marquis-blue/5 rounded-full blur-[120px] -z-10" />
          <div className="max-w-5xl mx-auto px-6 text-center mb-16">
            <h2 className="text-4xl font-black italic uppercase text-slate-900 mb-4">The Marquis Mirror</h2>
            <p className="text-slate-500 font-medium text-lg">Direct technical comparison against leading market alternatives.</p>
          </div>

          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-3 gap-0 border-2 border-slate-900 rounded-[40px] overflow-hidden shadow-2xl bg-white">
              {/* HEADERS */}
              <div className="p-8 bg-slate-900 text-slate-400 font-black uppercase tracking-widest text-[10px] flex items-end">Technical Spec</div>
              <div className="p-8 bg-marquis-blue text-white text-center">
                <div className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Your Match</div>
                <div className="text-2xl font-black italic uppercase tracking-tighter">Marquis {product.modelName}</div>
              </div>
              <div className="p-8 bg-slate-100 text-slate-900 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Leading Alternative</div>
                <div className="text-2xl font-black italic uppercase tracking-tighter">{competitor.name} {competitor.model}</div>
              </div>

              {/* ROWS */}
              {[
                { label: 'Flow Architecture', marquis: 'Proprietary V-O-L-T™ Flow', other: 'Standard PVC Multi-Stage' },
                { label: 'Jet Volume', marquis: `${product.jetCount} High-Velocity`, other: `${competitor.jets} Restricted-Line` },
                { label: 'Insulation System', marquis: 'MaximizR™ Full-Foam', other: 'Partial-Fill / Loose' },
                { label: 'Water Management', marquis: 'SmartClean™ Automated', other: 'Traditional Cartridge' }
              ].map((row, i) => (
                <React.Fragment key={i}>
                  <div className="p-8 border-t border-slate-100 font-bold text-slate-500 text-sm flex items-center">{row.label}</div>
                  <div className="p-8 border-t border-slate-100 bg-marquis-blue/5 text-marquis-blue font-black italic uppercase text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> {row.marquis}
                  </div>
                  <div className="p-8 border-t border-slate-100 text-slate-500 font-medium text-center flex items-center justify-center italic">
                    {row.other}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </section>

        {/* TIER 3: THE DEEP DIVE (COLOR-RICH HORIZONTALS) */}
        <section className="space-y-0">
          {[
            { 
              id: 'hydrotherapy', 
              title: 'Hydrotherapy & Wellness', 
              icon: <Activity className="w-12 h-12" />, 
              bg: 'bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#0a192f]', 
              textColor: 'text-white',
              accent: 'text-marquis-blue',
              img: '/mcp/demo/assets/therapy_premium.png'
            },
            { 
              id: 'climate', 
              title: 'Climate & Surroundings', 
              icon: <Thermometer className="w-12 h-12" />, 
              bg: 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0f9ff]', 
              textColor: 'text-slate-900',
              accent: 'text-marquis-blue',
              img: '/mcp/demo/assets/fitness_premium.png'
            },
            { 
              id: 'design', 
              title: 'Design & Capacity', 
              icon: <Users className="w-12 h-12" />, 
              bg: 'bg-gradient-to-br from-[#fafaf9] via-[#f5f5f4] to-[#fafaf9]', 
              textColor: 'text-slate-900',
              accent: 'text-marquis-blue',
              img: '/mcp/demo/assets/recreation_premium.png'
            },
            { 
              id: 'efficiency', 
              title: 'Power & Maintenance', 
              icon: <Zap className="w-12 h-12" />, 
              bg: 'bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#064e3b]', 
              textColor: 'text-white',
              accent: 'text-green-400',
              img: '/mcp/demo/assets/bg_electrical.png'
            }
          ].map((mod, i) => (
            <div key={i} className={`py-32 ${mod.bg}`}>
              <div className="max-w-7xl mx-auto px-6">
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-20 items-center`}>
                  <div className={i % 2 === 1 ? 'lg:order-last' : ''}>
                     <div className="relative group">
                        <div className={`absolute -inset-2 bg-gradient-to-r from-marquis-blue to-transparent blur-xl opacity-0 group-hover:opacity-40 transition-opacity`} />
                        <img src={mod.img} className="w-full h-[500px] object-cover rounded-[50px] shadow-2xl relative z-10" alt={mod.title} />
                     </div>
                  </div>
                  
                  <div className="space-y-8">
                     <div className={`${mod.accent} bg-white/10 w-24 h-24 rounded-3xl flex items-center justify-center p-6 backdrop-blur-xl border border-white/20`}>
                        {mod.icon}
                     </div>
                     <h2 className={`text-5xl font-black italic uppercase ${mod.textColor} tracking-tight leading-none`}>{mod.title}</h2>
                     {narrativeLoading ? (
                        <div className="space-y-4 animate-pulse pt-4">
                           <div className="h-4 bg-white/20 rounded w-full"></div>
                           <div className="h-4 bg-white/20 rounded w-5/6"></div>
                           <div className="h-4 bg-white/20 rounded w-4/6"></div>
                        </div>
                     ) : (
                        <div 
                          className={`text-xl font-medium leading-[1.8] ${mod.textColor === 'text-white' ? 'text-slate-300' : 'text-slate-600'} prose prose-invert opacity-95`}
                          dangerouslySetInnerHTML={{ __html: (aiNarrative as any)?.[mod.id] || "Analyzing engineering tolerances..." }}
                        />
                     )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* INTERACTIVE FEATURE MAP SECTION */}
        <section className="bg-slate-900 py-32 overflow-hidden relative mt-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-marquis-blue/10 rounded-full blur-[150px]" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h4 className="text-marquis-blue text-sm font-black uppercase tracking-[0.3em] mb-4">The Blueprints</h4>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase text-white mb-4 leading-none">Engineering Detail</h2>
              <p className="text-slate-400 font-medium text-lg">Hover specify engineering hotspots to reveal proprietary hardware.</p>
            </div>

            {product.overheadImageUrl && (
              <div className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-[60px] backdrop-blur-3xl shadow-2xl">
                 <div className="relative aspect-square md:aspect-video rounded-[40px] bg-black/20 group overflow-hidden">
                    <img 
                      src={product.overheadImageUrl} 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-[5000ms]" 
                      alt="Overhead View" 
                    />
                    
                    {/* Hotspots */}
                    {product.hotspots && (typeof product.hotspots === 'string' ? JSON.parse(product.hotspots) : product.hotspots).map((spot: any, i: number) => (
                      <div 
                        key={i}
                        className="absolute group/spot transition-all z-20"
                        style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                      >
                        <button className="w-10 h-10 bg-marquis-blue text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-150 active:scale-95 transition-all animate-pulse">
                          <Plus className="w-6 h-6" />
                        </button>
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-72 bg-white text-slate-900 p-6 rounded-3xl shadow-2xl opacity-0 group-hover/spot:opacity-100 transition-all scale-90 group-hover/spot:scale-100 pointer-events-none z-30 border border-slate-100">
                          <div className="text-xs font-black uppercase italic text-marquis-blue mb-2 tracking-widest">{spot.title}</div>
                          <p className="text-sm text-slate-600 leading-relaxed font-bold">{spot.description}</p>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white" />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
          </div>
        </section>

        {/* FINAL CTA FOOTER */}
        <section className="bg-white py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
             <div className="text-marquis-blue text-sm font-black uppercase tracking-[0.3em] mb-4 text-center">Final Decision</div>
            <h2 className="text-5xl md:text-8xl font-black italic uppercase text-slate-900 mb-12 leading-[0.8] tracking-tighter text-center">Ready to anchor your lifestyle?</h2>
            <div className="flex flex-col md:flex-row gap-6 justify-center">
              <button className="bg-marquis-blue text-white px-12 py-8 rounded-[40px] text-xl font-black italic uppercase shadow-2xl shadow-marquis-blue/30 transform hover:-translate-y-2 transition-transform">Download My Blueprint (PDF)</button>
              <button className="border-4 border-slate-900 text-slate-900 px-12 py-8 rounded-[40px] text-xl font-black italic uppercase transform hover:-translate-y-2 transition-transform">Find Local Dealer</button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return null;
}
