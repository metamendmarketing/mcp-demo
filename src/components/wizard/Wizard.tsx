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
  const [aiNarrative, setAiNarrative] = useState<{heroTitle?: string; hydrotherapy?: string; climate?: string; design?: string; efficiency?: string; error?: string} | null>(null);
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

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-slick-reveal">
         {/* TOP ACTIONS */}
         <div className="flex justify-between items-center mb-6">
            <button onClick={() => setStep('results')} className="text-slate-500 hover:text-marquis-blue flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-2 sm:gap-4">
               <button className="hidden sm:block bg-white text-marquis-blue border-2 border-marquis-blue px-6 py-2 rounded-xl text-sm font-black italic uppercase hover:bg-marquis-blue/5 transition-all">Find Dealer</button>
               <button className="bg-marquis-blue text-white px-6 py-2 rounded-xl text-sm font-black italic uppercase shadow-xl hover:bg-blue-700 transition-all">Get Pricing</button>
            </div>
         </div>

         {/* HERO SECTION - COMPACT */}
         <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 mb-8 flex flex-col md:flex-row">
            <div className="md:w-1/2 relative bg-slate-50 border-r border-slate-100">
               <img src={heroImg} className="w-full h-full object-cover absolute inset-0" alt={product.modelName} />
               <div className="relative z-10 p-8 min-h-[350px] flex flex-col justify-end bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                  <div className="text-white/80 text-xs font-black uppercase tracking-widest mb-1 shadow-sm">Crown Series Collection</div>
                  <h3 className="text-5xl md:text-6xl font-black italic uppercase text-white leading-none drop-shadow-lg">{product.modelName}</h3>
               </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
               <h2 className="text-2xl md:text-3xl font-black italic uppercase text-slate-800 tracking-tight flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                  {narrativeLoading ? "Synthesizing Profile..." : (aiNarrative?.heroTitle || product.modelName)} 
                  <Sparkles className="w-6 h-6 text-marquis-blue flex-shrink-0" />
               </h2>
               
               {/* At a glance boxes */}
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                     <Maximize className="w-6 h-6 text-marquis-blue/80" />
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dimensions</div>
                       <div className="text-sm font-black italic uppercase text-slate-700">{product.lengthIn}x{product.widthIn}"</div>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                     <Users className="w-6 h-6 text-marquis-blue/80" />
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</div>
                       <div className="text-sm font-black italic uppercase text-slate-700">{product.seatsMin}-{product.seatsMax} Adults</div>
                     </div>
                  </div>
               </div>

               {/* Confirmation Bullets */}
               <div className="space-y-4 bg-blue-50/40 p-6 rounded-2xl border border-blue-100/50">
                  <div className="text-xs font-black text-marquis-blue uppercase tracking-widest mb-3">Why this is your perfect match</div>
                  {reasons.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="bg-marquis-blue text-white rounded-full p-1 mt-0.5"><Check className="w-3 h-3" /></div>
                      <p className="text-sm text-slate-700 font-semibold leading-snug">{r}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* INTERACTIVE HOTSPOTS - FULL WIDTH */}
         {product.overheadImageUrl && (
            <section className="mb-12">
               <div className="flex items-center gap-3 mb-6 px-2">
                 <Settings className="w-6 h-6 text-marquis-blue" />
                 <h4 className="text-2xl font-black italic uppercase text-slate-800">Interactive Feature Explorer</h4>
               </div>
               <div className="relative aspect-square md:aspect-video rounded-[32px] bg-[#f8fafc] group shadow-xl border border-slate-100 overflow-hidden">
                  <img src={product.overheadImageUrl} className="w-full h-full object-contain p-4 md:p-10" alt="Overhead View" />
                  
                  {/* Hotspots */}
                  {product.hotspots && (typeof product.hotspots === 'string' ? JSON.parse(product.hotspots) : product.hotspots).map((spot: any, i: number) => (
                    <div key={i} className="absolute group/spot transition-all z-20" style={{ top: `${spot.y}%`, left: `${spot.x}%` }}>
                      <button className="w-8 h-8 md:w-10 md:h-10 bg-marquis-blue text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse">
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none z-30">
                        <div className="text-sm font-black uppercase italic text-marquis-blue mb-2 border-b border-marquis-blue/30 pb-2">{spot.title}</div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{spot.description}</p>
                      </div>
                    </div>
                  ))}
               </div>
               <p className="text-center text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest italic animate-pulse">Hover over hotspots to reveal engineering details</p>
            </section>
         )}

         {/* HORIZONTAL AI STACK */}
         <section className="mb-12">
            <div className="flex items-center gap-3 mb-8 px-2">
              <BookOpen className="w-6 h-6 text-marquis-blue" />
              <h4 className="text-2xl font-black italic uppercase text-slate-800">AI Synthesized Blueprint</h4>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'hydrotherapy', title: 'Hydrotherapy & Wellness', bg: 'bg-indigo-50/30', border: 'border-indigo-100', iconBg: 'bg-indigo-100 text-indigo-600', icon: <Activity className="w-6 h-6" /> },
                { id: 'climate', title: 'Climate & Surroundings', bg: 'bg-sky-50/30', border: 'border-sky-100', iconBg: 'bg-sky-100 text-sky-600', icon: <Thermometer className="w-6 h-6" /> },
                { id: 'design', title: 'Design & Capacity', bg: 'bg-amber-50/30', border: 'border-amber-100', iconBg: 'bg-amber-100 text-amber-600', icon: <Users className="w-6 h-6" /> },
                { id: 'efficiency', title: 'Power & Maintenance', bg: 'bg-emerald-50/30', border: 'border-emerald-100', iconBg: 'bg-emerald-100 text-emerald-600', icon: <Zap className="w-6 h-6" /> }
              ].map((mod, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-[32px] border shadow-sm transition-all hover:shadow-md ${mod.bg} ${mod.border}`}>
                  <div className="md:w-1/3 flex items-start gap-5 border-b md:border-b-0 md:border-r border-slate-200/50 pb-4 md:pb-0 md:pr-6">
                     <div className={`p-4 rounded-2xl shadow-sm flex-shrink-0 ${mod.iconBg}`}>{mod.icon}</div>
                     <div className="pt-1">
                       <h3 className="text-xl font-black italic uppercase text-slate-900 leading-none">{mod.title}</h3>
                     </div>
                  </div>
                  <div className="md:w-2/3 md:pl-2">
                    {narrativeLoading ? (
                      <div className="space-y-3 animate-pulse pt-1">
                        <div className="h-3 bg-slate-200/60 rounded w-full"></div>
                        <div className="h-3 bg-slate-200/60 rounded w-5/6"></div>
                        <div className="h-3 bg-slate-200/60 rounded w-4/6"></div>
                      </div>
                    ) : (aiNarrative as any)?.error ? (
                      <div className="text-red-500 text-sm font-medium">Generation Failed: {(aiNarrative as any).error}</div>
                    ) : (
                      <div className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold prose prose-slate" dangerouslySetInnerHTML={{ __html: (aiNarrative as any)?.[mod.id] || "Synthesizing your personalized profile..." }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
         </section>

         {/* COMPARISON TABLE */}
         <section className="mb-14">
            <div className="flex items-center gap-3 mb-6 px-2">
              <Scale className="w-6 h-6 text-marquis-blue" />
              <h4 className="text-2xl font-black italic uppercase text-slate-800">Competitive Edge</h4>
            </div>
            
            <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-100">
               <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
                 <div className="col-span-2 p-5 md:p-8 font-black text-xs uppercase tracking-widest text-slate-400 flex items-end">Core Technology</div>
                 <div className="col-span-1 p-5 md:p-8 font-black italic text-lg md:text-2xl uppercase text-slate-900 border-l border-slate-200 bg-white">
                     {product.modelName}
                     <div className="text-[10px] sm:text-xs text-marquis-blue font-bold tracking-widest not-italic mt-1">Marquis Crown</div>
                 </div>
                 <div className="col-span-1 p-5 md:p-8 font-black italic text-lg md:text-2xl uppercase text-slate-400 border-l border-slate-200">
                     Industry<br className="hidden md:block"/> Standard
                     <div className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-widest not-italic mt-1">Comparable</div>
                 </div>
               </div>
               
               {[
                 { feature: "Therapy Flow Protocol", desc: "How water is managed and driven to the jets", marquis: "V-O-L-T™ System (High Volume, Low Pressure)", comp: "Standard High-Pressure Manifolds" },
                 { feature: "Targeted Intensity", desc: "Specialized zones for deep tissue", marquis: "H.O.T. Zones™ (High Output Therapy)", comp: "Basic Seat Configurations" },
                 { feature: "Sanitation Automation", desc: "Water care management", marquis: "SmartClean™ Software Architecture", comp: "Manual Timer Cycles" },
                 { feature: "Thermal Retention", desc: "Insulation for cold climates", marquis: "MaximizR™ Full-Foam Matrix", comp: "Partial Foam / Perimeter" },
                 { feature: "Structural Integrity", desc: "Exterior cabinet material", marquis: "DuraWood™ Extruded Profiling", comp: "Hollow Synthetic Panels" }
               ].map((row, i) => (
                 <div key={i} className="grid grid-cols-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                   <div className="col-span-2 p-5 md:p-8 flex flex-col justify-center">
                      <div className="text-sm md:text-base font-black uppercase text-slate-700">{row.feature}</div>
                      <div className="text-xs text-slate-400 font-medium mt-1">{row.desc}</div>
                   </div>
                   <div className="col-span-1 p-5 md:p-8 text-xs md:text-sm font-black text-marquis-blue flex flex-col justify-center border-l border-slate-100 bg-blue-50/10">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-marquis-blue flex-shrink-0 mt-0.5 hidden md:block" />
                        <span className="leading-snug">{row.marquis}</span>
                      </div>
                   </div>
                   <div className="col-span-1 p-5 md:p-8 text-xs md:text-sm font-bold text-slate-400 flex flex-col justify-center border-l border-slate-100">
                      <span className="leading-snug">{row.comp}</span>
                   </div>
                 </div>
               ))}
            </div>
         </section>

         {/* BOTTOM CTAS */}
         <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-marquis-blue/30 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Star className="w-64 h-64" />
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black italic uppercase text-white mb-6 relative z-10 leading-none">Your Sanctuary<br/>Awaits.</h3>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto font-medium text-base md:text-lg relative z-10">Lock in your personalized blueprint {product.modelName} spec sheet by contacting an Authorized Marquis Dealer.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
               <button className="bg-white text-marquis-blue px-10 py-5 rounded-2xl text-sm md:text-base font-black italic uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">Find Nearest Dealer</button>
               <button className="bg-marquis-blue border-2 border-marquis-blue text-white px-10 py-5 rounded-2xl text-sm md:text-base font-black italic uppercase shadow-xl hover:bg-transparent transition-all">Get Local Pricing</button>
            </div>
         </div>
      </div>
    );
  }

  return null;
}

