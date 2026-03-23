'use client';

import React, { useState } from 'react';
import { 
  Check, ChevronRight, RotateCcw, Zap, Users, Star, Maximize, UserCheck, BookOpen, Scale,
  MessageSquare, MapPin, Droplets, Heart, Sparkles, ArrowRight, Info, ChevronLeft, Plus,
  Compass, Sun, CloudSun, Sunset, Cloud, Box, Home, TreePine, Activity, Flame, Droplet,
  Waves, Palette, LayoutGrid, Leaf, Settings, Wrench, Battery, BatteryCharging, Gauge,
  Wallet, Landmark, Gem, Hammer, Truck, Thermometer, Loader2, Send, CheckCircle2
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
  | 'focus' 
  | 'aesthetic' 
  | 'maintenance' 
  | 'intensity' 
  | 'budget' 
  | 'delivery'
  | 'ownership';

export interface UserPreferences {
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
}

// BRAIN 2.0 - INLINED GROUNDED Q&A COMPONENT
interface AskTheBrainProps {
  productId?: string;
  productName?: string;
  preferences?: any;
}

function AskTheBrain({ productId, productName, preferences }: AskTheBrainProps) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ answer: string; citedFeatures?: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/mcp/demo/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, productId, preferences }),
      });

      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError("I'm having trouble connecting to my knowledge base right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden mt-12 mb-20 group transition-all hover:shadow-2xl">
      <div className="bg-slate-900 p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-marquis-blue/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-marquis-blue p-4 rounded-2xl shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase text-white leading-none mb-2">Question? Ask us.</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Grounded in 40+ years of Marquis expertise</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Engineering Verified</span>
          </div>
        </div>
      </div>

      <div className="p-8 md:p-10">
        <form onSubmit={handleAsk} className="relative mb-8">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., How does the ConstantClean system work?"
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 pl-8 pr-20 text-lg font-semibold text-slate-800 focus:outline-none focus:border-marquis-blue focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!question.trim() || loading}
            className="absolute right-3 top-3 bottom-3 aspect-square bg-marquis-blue text-white rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group/btn"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : <Send className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            "How does ConstantClean™ work?",
            "Crown vs Vector series?",
            "What is V-O-L-T™ therapy?",
            "Maintenance requirements?"
          ].map((q, i) => (
            <button 
              key={i} 
              type="button"
              onClick={() => setQuestion(q)}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {loading && (
          <div className="space-y-4 py-4">
            <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse" />
            <div className="h-4 bg-slate-100 rounded-full w-4/6 animate-pulse" />
          </div>
        )}

        {error && (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex gap-4 items-start animate-in fade-in slide-in-from-top-2">
            <Info className="w-6 h-6 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700 font-bold">{error}</p>
          </div>
        )}

        {response && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-6 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Response:</span>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-xl text-slate-700 font-semibold leading-relaxed mb-8 italic">
                "{response.answer}"
              </p>
            </div>

          </div>
        )}

      </div>
      
      <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Marquis Engineering | Fact-Based Precision</p>
      </div>
    </div>
  );
}

interface Product {
  id: string;
  modelName: string;
  slug: string;
  marketingSummary?: string;
  therapySummary?: string;
  lengthIn: number;
  widthIn: number;
  depthIn: number;
  jetCount: number;
  seatsMin: number;
  seatsMax: number;
  capacityGallons?: number;
  dryWeightLbs?: number;
  fullWeightLbs?: number;
  pumpFlowGpm?: number;
  electricalAmps?: number;
  usageTags: string[] | string;
  heroImageUrl?: string;
  overheadImageUrl?: string;
  hotspots?: any[];
  shellColors?: string[] | string;
  cabinetColors?: string[] | string;
  series?: { name: string; positioningTier?: string };
  positioningTier?: string;
  score?: number;
  estimatedMsrp?: number;
}

interface ScoredProduct {
  product: Product;
  score: number;
  reasons: string[];
  matchStrategy?: string;
  naturalNarrative?: string;
  designConsiderations?: string;
}

const QUESTIONS: {
  id: PreferenceKey;
  question: string;
  subtext: string;
  expertTip: (prefs: UserPreferences) => string;
  layout: 'grid' | 'split' | 'map' | 'slider' | 'custom-inquiry';
  bgImage?: string;
  options: { label: string; value: string; icon?: React.ReactNode; image?: string; tip?: string }[];
  skip?: (prefs: UserPreferences) => boolean;
}[] = [
  {
    id: 'primaryPurpose',
    question: "What is your primary goal?",
    subtext: "Your intention dictates the flow management and jet configurations we recommend.",
    expertTip: () => "The physical architecture of a Marquis spa changes based on your answer. Therapy-focused models utilize our proprietary V-O-L-T™ flow system to drive massive, low-pressure water volume for deep tissue penetration. Conversely, recreational models prioritize open-concept seating, ambient waterline lighting, and spacious footwells for group entertaining.",
    layout: 'grid',
    options: [
      { value: 'therapy', label: 'Deep Hydrotherapy', tip: "Focused relief for chronic pain, athletic recovery, and targeted muscle tension.", image: '/mcp/demo/assets/therapy_premium.png' },
      { value: 'recreational', label: 'Social & Entertainment', tip: "Open seating, vibrant lighting, and space for family connection.", image: '/mcp/demo/assets/recreation_premium.png' },
      { value: 'relaxation', label: 'Stress Relief & Sleep', tip: "Gentle bubbling, quiet operation, and ergonomic lounging for mental reset.", image: '/mcp/demo/assets/fitness_premium.png' }
    ]
  },
  {
    id: 'capacity',
    question: "How many guests should your Marquis accommodate?",
    subtext: "Slide to select your target seating capacity (1-10 adults).",
    expertTip: (prefs) => {
      if (prefs.primaryPurpose === 'recreational') return "Since you're looking for social entertainment, remember that larger 6+ person models offer a massive interior footprint, allowing for diverse jet patterns without sacrificing open seating space.";
      return "Capacity isn't solely about how many people you plan to host. A correctly sized model ensures every guest has an optimized hydrotherapy sequence without crowding the footwell.";
    },
    layout: 'slider',
    bgImage: '/mcp/demo/assets/v150_beauty.jpg',
    options: []
  },
  {
    id: 'lounge',
    question: "Do you prefer a dedicated lounge seat?",
    subtext: "A fully reclined seat designed for intense, full-body immersion.",
    expertTip: (prefs) => {
      if (prefs.primaryPurpose === 'recreational') return "In a social-first spa, remember that a lounge seat consumes the footprint of approximately two standard upright seats. If you plan on hosting large groups, an open-seating blueprint is usually the professional recommendation.";
      return "Loungers provide the absolute best full-body hydrotherapy sequence, targeting your neck down to your calves simultaneously. If your goal is solo recovery, a lounge is essential.";
    },
    layout: 'split',
    bgImage: '/mcp/demo/assets/bg_lounge_1774075579221.png',
    options: [
      { value: 'yes', label: 'Yes, include a Lounger', tip: "I prioritize solo, full-body relaxation.", icon: <Maximize className="w-8 h-8" /> },
      { value: 'no', label: 'No, Open Seating', tip: "I want to maximize the number of seats available.", icon: <Users className="w-8 h-8" /> },
      { value: 'no-pref', label: 'No Preference', tip: "Show me the best matches for both layouts.", icon: <Star className="w-8 h-8" /> }
    ]
  },
  {
    id: 'focus',
    question: "Select your primary hydrotherapy profile.",
    subtext: "Diverse seat depths allow for a variety of body types and immersion levels.",
    expertTip: (prefs) => {
      if (prefs.capacity === '4-5') return "For a 4-5 person family, 'Diverse Seating' is critical. It ensures that everyone—from kids to tall adults—has a seat depth that provides comfortable immersion without being overwhelmed by the water line.";
      return "The Crown Series is engineered with 'The Big 3'—High Flow, ConstantClean, and Diverse Seating. By selecting 'Depth Variety,' we prioritize models like the Crown Resort, which features deep bucket seats for back therapy alongside shallower seating for diverse family heights.";
    },
    layout: 'grid',
    options: [
      { value: 'diverse-depth', label: 'Diverse Seat Depths', tip: "Varying heights for families with different physical profiles.", icon: <Maximize className="w-10 h-10 mx-auto" /> },
      { value: 'neck-shoulders', label: 'Neck & Shoulders', tip: "Targeted collar jets for tension headaches.", icon: <Activity className="w-10 h-10 mx-auto" /> },
      { value: 'lower-back', label: 'Lower Back Focus', tip: "Deep penetration HK jets for lumbar relief.", icon: <Waves className="w-10 h-10 mx-auto" /> },
      { value: 'full-body', label: 'Full Body Immersion', tip: "Comprehensive sequential massage profile.", icon: <Heart className="w-10 h-10 mx-auto" /> }
    ],
    skip: (prefs) => prefs.capacity === '2-3' // Intimate tubs have less seat-depth variety than large models
  },
  {
    id: 'intensity',
    question: "Preferred Hydrotherapy Intensity?",
    subtext: "High-Volume, Low-Pressure (HVLP) is the Marquis difference.",
    expertTip: (prefs) => {
      if (prefs.focus === 'lower-back') return "For targeted lumbar relief, the V-O-L-T™ system is essential. It moves massive water volume (GPM) rather than just pressure, allowing for deep-tissue penetration that relaxes the muscles without the sting of high-pressure 'needle' jets.";
      return "Marquis utilizes the V-O-L-T™ system to drive massive water volume (GPM) rather than just high pressure (PSI). High-flow systems are the key to effective hydrotherapy that doesn't irritate the skin.";
    },
    layout: 'split',
    bgImage: '/mcp/demo/assets/bg_intensity_1774073882614.png',
    options: [
      { value: 'gentle', label: 'Soothing Soak', tip: "Broad flow. Ideal for sensitive skin or simple relaxation.", icon: <Cloud className="w-8 h-8" /> },
      { value: 'medium', label: 'Standard Vigorous', tip: "The perfect balance of active recovery and relaxation.", icon: <Waves className="w-8 h-8" /> },
      { value: 'firm', label: 'High-Output Therapy', tip: "Maximum GPM flow designed to break down deep muscle tension.", icon: <Gauge className="w-8 h-8" /> }
    ]
  },
  {
    id: 'maintenance',
    question: "Desired Water Management Style?",
    subtext: "Integrity of water care defines the lifetime of the spa.",
    expertTip: (prefs) => {
      if (prefs.primaryPurpose === 'recreational') return "Since social hospitality is your goal, we prioritize the ConstantClean+™ system. It manages 90% of the sanitation ritual automatically, so you can focus on your guests rather than the chemistry.";
      return "Our ConstantClean+™ system is the gold standard of the industry. By selecting 'Automated Integrity,' we equip your model with dual-sanitation (Ozone + In-line) for nearly maintenance-free water care.";
    },
    layout: 'split',
    bgImage: '/mcp/demo/assets/bg_maintenance_1774073867138.png',
    options: [
      { value: 'automated', label: 'Automated Integrity', tip: "Utilizes the ConstantClean+™ simplified in-line sanitation system.", icon: <Settings className="w-8 h-8 text-marquis-blue" /> },
      { value: 'hands-on', label: 'Manual Management', tip: "Standard filtration with traditional chemistry dosing.", icon: <Wrench className="w-8 h-8 text-slate-400" /> }
    ],
  },
  {
    id: 'aesthetic',
    question: "What is your backyard's aesthetic design?",
    subtext: "We will harmonize the spa's exterior cabinet and shell colors.",
    expertTip: () => "A hot tub is a massive visual focal point. We want it to blend seamlessly into your architecture. 'Sleek & Modern' homes pair perfectly with our stark Midnight Canyon shells and monochromatic Slate cabinets. For a 'Warm Rustic' environment, we lean toward Tuscan Sun acrylics layered against natural wood-grain textures.",
    layout: 'grid',
    options: [
      { value: 'modern', label: 'Sleek & Modern', tip: "Monochrome, glass, stark lines.", image: '/mcp/demo/assets/aesthetic_modern_1774073072031.png' },
      { value: 'rustic', label: 'Warm & Rustic', tip: "Heavy timber, natural stone, earth tones.", image: '/mcp/demo/assets/aesthetic_rustic_1774073087013.png' },
      { value: 'tropical', label: 'Island Tropical', tip: "Lush greens, teaks, resort-style.", image: '/mcp/demo/assets/aesthetic_tropical_1774073099414.png' },
      { value: 'classic', label: 'Timeless Classic', tip: "Brick, manicured lawns, white trim.", image: '/mcp/demo/assets/aesthetic_classic_1774073116007.png' }
    ]
  },
  {
    id: 'ownership',
    question: "Is this a first spa discovery or a forever upgrade?",
    subtext: "The duration of ownership dictates the engineering specs we prioritize.",
    expertTip: (prefs) => {
      if (prefs.primaryPurpose === 'therapy') return "If this is your 'Forever Spa' for chronic therapy, we bias toward our Crown Series. For a first-time 'Discovery' at a high-value entry point, our Celebrity series provides the famous Marquis quality.";
      return "If this is your 'Forever Spa', we will bias toward our Crown and Vector21 Series. If you are 'Discovering' for a short-term residence, our Celebrity series provides the famous Marquis quality at a high-value entry point.";
    },
    layout: 'split',
    options: [
      { value: 'upgrade', label: 'Forever Spa Upgrade', tip: "I want the highest engineering specs and longevity (Crown/Vector).", icon: <Gem className="w-8 h-8 text-amber-500" /> },
      { value: 'discovery', label: 'First Spa Discovery', tip: "I want the best value for a multi-year experience (Celebrity).", icon: <Compass className="w-8 h-8 text-marquis-blue" /> }
    ]
  },
  {
    id: 'zipCode',
    question: "Delivery Zip/Postal Code?",
    subtext: "Precisely calculating local sunrise and climate stress.",
    expertTip: () => "Elevation and climate are the primary drivers of energy cost. We cross-reference your Zip/Postal code with local heating index data to ensure the insulation package (standard vs MaximizR™) is appropriate for your region.",
    layout: 'map',
    options: []
  },
  {
    id: 'sunExposure',
    question: "What is the typical sun exposure for the site?",
    subtext: "Understanding UV load dictates cover specifications.",
    expertTip: (prefs) => {
      if (prefs.placement === 'ground') return "In high-sun ground-level scenarios, we mandate the **DuraCover®** upgrade. Direct sunlight accelerates UV degradation on standard vinyl; DuraCover® is specifically designed to double the lifespan in intense environments.";
      return "Direct sunlight accelerates UV degradation on standard vinyl. In high-sun scenarios, we mandate the **DuraCover®** or **WeatherShield™** fabric upgrades, which are specifically designed to double the lifespan of the cover in intense UV environments.";
    },
    layout: 'grid',
    options: [
      { value: 'morning', label: 'Morning Sun Only', tip: "Gentle warmth; cooler in the evenings.", icon: <Sun className="w-10 h-10 text-amber-500 mx-auto" /> },
      { value: 'afternoon', label: 'Afternoon / Late Sun', tip: "Intense heat during the peak of the day.", icon: <Sunset className="w-10 h-10 text-orange-500 mx-auto" /> },
      { value: 'direct', label: 'Direct Sun All Day', tip: "Maximum solar gain; require DuraCover®.", icon: <Flame className="w-10 h-10 text-red-500 mx-auto" /> },
      { value: 'shaded', label: 'Heavy Shade / Covered', tip: "Under a roof, pergola, or dense trees.", icon: <TreePine className="w-10 h-10 text-slate-400 mx-auto" /> }
    ]
  },
  {
    id: 'electrical',
    question: "Confirmed electrical capacity?",
    subtext: "Determining the parallel performance of pumps and heaters.",
    expertTip: (prefs) => {
      if (prefs.capacity === '2-3') return "For smaller 2-3 person models, 110V 'Plug & Play' is a highly efficient choice. However, for 100% therapy performance where heater and pumps run in parallel, a 240V dedicated line is the professional recommendation.";
      return "For 100% therapy performance, a 240V dedicated line allows the heater and high-flow pumps to run simultaneously. If you select 110V, the heater will pause when the jets are on High to protect your household circuit. In colder climates, 240V is always the professional recommendation.";
    },
    layout: 'split',
    bgImage: '/mcp/demo/assets/bg_electrical_night_1774075976736.png',
    options: [
      { value: '110v', label: '110V Plug & Play', tip: "Easy install. Best for temperate climates and smaller models.", icon: <Battery className="w-8 h-8 text-blue-400" /> },
      { value: '240v', label: '240V Hardwired', tip: "Professional choice. Maximum heat retention and jet power.", icon: <BatteryCharging className="w-8 h-8 text-marquis-blue" /> },
      { value: 'help', label: 'Help me decide', tip: "I need more information on electrical requirements.", icon: <Info className="w-8 h-8 text-slate-400" /> }
    ]
  },
  {
    id: 'placement',
    question: "Where will the hot tub be placed?",
    subtext: "Site preparation dictates the structural requirements.",
    expertTip: (prefs) => {
       if (prefs.capacity === '6+') return "A filled 6+ person hot tub commands a massive structural load—often exceeding 5,000 lbs. Ground installations require a leveled crushed rock base or a poured concrete pad (minimum 4 inches thick). Decks require structural verification.";
       return "A filled hot tub commands a massive structural load—often exceeding 4,000 lbs. Ground installations require a leveled crushed rock base or a poured concrete pad (minimum 4 inches thick). If you select 'Wood Deck', you must have a structural engineer verify load-bearing.";
    },
    layout: 'grid',
    options: [
      { value: 'deck', label: 'Wood/Composite Deck', tip: "Requires joist load-bearing verification.", image: '/mcp/demo/assets/placement_deck_1774073130622.png' },
      { value: 'patio', label: 'Concrete/Paver Patio', tip: "Standard solid foundation.", image: '/mcp/demo/assets/placement_patio_1774073144196.png' },
      { value: 'indoor', label: 'Indoor/Sunroom', tip: "Requires dedicated ventilation planning.", image: '/mcp/demo/assets/placement_indoor_1774073157297.png' },
      { value: 'ground', label: 'New Ground Site', tip: "Requires level EZ-Pad or crushed rock base.", image: '/mcp/demo/assets/placement_ground_1774073171701.png' }
    ]
  },
  {
    id: 'budget',
    question: "What is your comfortable investment range?",
    subtext: "Market conditions vary; we help you find the absolute best value.",
    expertTip: (prefs) => {
      if (prefs.ownership === 'upgrade') return "Since this is your 'Forever Upgrade', balancing upfront costs against the lifetime efficiency of **MaximizR™** insulation is key. A premium tier Marquis often pays for itself via lower monthly utility bills over 10-15 years.";
      return "Initial sticker price is only one part of the equation. We help you balance upfront costs against the lifetime efficiency of the **MaximizR™** insulation and the **ConstantClean™** sanitization suite.";
    },
    layout: 'grid',
    options: [
      { value: 'entry', label: 'Entry Tier', tip: "$5,000 - $8,000. Marquis quality in a standard equipment package.", icon: <Wallet className="w-10 h-10 mx-auto" /> },
      { value: 'mid', label: 'Mid-Level Tier', tip: "$9,000 - $13,000. Upgraded filtration and additional massage pumps.", icon: <Landmark className="w-10 h-10 mx-auto" /> },
      { value: 'premium', label: 'Premium Tier', tip: "$14,000 - $18,000. High-flow GPM and full-foam insulation standard.", icon: <Star className="w-10 h-10 mx-auto" /> },
      { value: 'luxury', label: 'Luxury Tier', tip: "$19,000+. The absolute pinnacle of hydrotherapy and aesthetic.", icon: <Gem className="w-10 h-10 mx-auto" /> }
    ]
  },
  {
    id: 'delivery',
    question: "Describe your delivery access.",
    subtext: "We need 40 inches of clearance to walk a spa into position.",
    expertTip: (prefs) => {
      if (prefs.placement === 'deck') return "Delivering to a wood deck often requires specialized 'Spa Dollies' and a minimum 40-inch clearance. If your gates are narrower or stairs are involved, we may need to coordinate a crane lift for precise positioning.";
      return "Logistics are managed via specialized 'Spa Dollies'. If your gates or path are narrower than 40 inches, or if you have steep stairs, we may need to coordinate a crane lift. We will factors these complexities into our model recommendations.";
    },
    layout: 'split',
    options: [
      { value: 'easy', label: 'Wide Open Access', tip: "Double-wide gates or zero steps. Standard delivery.", icon: <Truck className="w-8 h-8" /> },
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
    zipCode: '',
    sunExposure: null,
    placement: null,
    focus: null,
    aesthetic: null,
    maintenance: null,
    intensity: null,
    budget: null,
    delivery: null,
    ownership: null
  });

  // Magnifier state
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, relX: 0, relY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    setMagnifierPos({ 
      x: e.pageX, 
      y: e.pageY, 
      relX: (x / width) * 100, 
      relY: (y / height) * 100 
    });
  };
  
  const [results, setResults] = useState<ScoredProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ScoredProduct | null>(null);
  const [aiNarrative, setAiNarrative] = useState<{heroTitle?: string; hydrotherapy?: string; climate?: string; design?: string; efficiency?: string; designConsideration?: string; error?: string} | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);

  const updatePreference = (key: PreferenceKey, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const nextQuestion = () => {
    let nextIndex = currentQuestionIndex + 1;
    while (nextIndex < QUESTIONS.length && QUESTIONS[nextIndex].skip?.(preferences)) {
      nextIndex++;
    }

    if (nextIndex < QUESTIONS.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setStep('blueprint');
    }
  };

  const prevQuestion = () => {
    let prevIndex = currentQuestionIndex - 1;
    while (prevIndex >= 0 && QUESTIONS[prevIndex].skip?.(preferences)) {
      prevIndex--;
    }

    if (prevIndex >= 0) {
      setCurrentQuestionIndex(prevIndex);
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

  const getHeroImage = (product: Product) => {
    // Fail-safe: Use the slug-based directory structure (Database URLs for non-Crown are untrustworthy re: extensions)
    if (product.slug) {
      const isCrown = product.slug.includes('crown');
      // Vector series is inconsistent: 65L and 77L are JPG, others are PNG
      const isJpgVector = product.slug.includes('v65l') || product.slug.includes('v77l');
      const ext = (isCrown || isJpgVector) ? 'jpg' : 'png';
      return `/mcp/demo/assets/products/${product.slug}/hero.${ext}`;
    }

    // Fallback if no slug
    if (product.heroImageUrl && !product.heroImageUrl.includes('therapy_premium')) return product.heroImageUrl;
    
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
               Expertly Matched.
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl mb-10 font-medium drop-shadow-md">
               Our AI analyzes 14 expert criteria to find the one perfect Marquis model for your lifestyle.
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
                    "{q.expertTip(preferences)}"
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
                      "{q.expertTip(preferences)}"
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

            {q.layout === 'slider' && (
              <div className="relative p-10 rounded-[40px] overflow-hidden shadow-2xl min-h-[450px] flex items-center justify-center">
                {q.bgImage && (
                  <>
                    <img src={q.bgImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 z-10" />
                  </>
                )}
                
                <div className="relative z-20 w-full max-w-2xl text-center space-y-12">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-marquis-blue/20 backdrop-blur-md rounded-full border border-marquis-blue/30 text-marquis-blue mb-4">
                       <Users className="w-5 h-5" />
                       <span className="text-xs font-black uppercase tracking-widest text-white">Seating Capacity</span>
                    </div>
                    <h3 className="text-7xl md:text-9xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl">
                      {preferences[q.id] || '5'}<span className="text-3xl md:text-4xl ml-2 text-blue-300">Adults</span>
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      step="1"
                      value={preferences[q.id] || '5'}
                      onChange={(e) => updatePreference(q.id, e.target.value)}
                      className="w-full h-4 bg-white/20 rounded-full appearance-none cursor-pointer accent-marquis-blue hover:bg-white/30 transition-all border border-white/10"
                    />
                    <div className="flex justify-between text-white/40 text-[10px] font-black uppercase tracking-widest px-1">
                      <span>1 Adult</span>
                      <span>5 Adults</span>
                      <span>10 Adults</span>
                    </div>
                  </div>
                  <button 
                    onClick={nextQuestion}
                    className="btn-marquis-premium px-12 py-5 rounded-2xl text-xl font-black italic uppercase shadow-2xl group"
                  >
                    Confirm Capacity <ChevronRight className="inline-block w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
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
             {results && results.slice(0, 4).map((res, i) => {
               const heroImg = getHeroImage(res.product);
               const seriesName = res.product.series?.name || "Premium Series";
               return (
                 <div key={res.product.id} className={cn(
                   "bg-white rounded-3xl overflow-hidden shadow-md flex flex-col border transition-all duration-700 animate-in fade-in slide-in-from-bottom",
                   i === 0 ? "border-amber-400 ring-4 ring-amber-400/20 shadow-2xl scale-[1.02] z-10" : "border-slate-100"
                 )}>
                   <div className="w-full h-64 relative bg-slate-100 overflow-hidden group">
                      <img src={heroImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={res.product.modelName} />
                      <div className={cn(
                        "absolute top-6 left-6 px-4 py-2 rounded-full text-xs font-black uppercase text-white shadow-xl z-20",
                        i === 0 ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-900 border border-amber-300/50" : "bg-marquis-blue"
                      )}>
                        {res.matchStrategy || (i === 0 ? "The Gold Standard Match" : "Expert Selection")}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 flex justify-between text-white">
                         <div className="text-sm font-bold"><Zap className="inline w-4 h-4 mr-1 text-marquis-blue"/> {res.product.jetCount} Jets</div>
                         <div className="text-sm font-bold"><Heart className="inline w-4 h-4 mr-1 text-marquis-blue"/> {res.score}% Match</div>
                      </div>
                   </div>
                   
                   <div className="p-8 flex flex-col flex-grow">
                      <div className="mb-6">
                          <h3 className="text-3xl font-black italic uppercase text-slate-800 leading-none mb-2">{res.product.modelName}</h3>
                          <div className="text-marquis-blue text-xs font-bold uppercase tracking-widest">
                            {res.product.series?.name || 'Marquis'} {res.product.positioningTier ? `| ${res.product.positioningTier.charAt(0).toUpperCase() + res.product.positioningTier.slice(1)}` : ''}
                          </div>
                      </div>
                      
                      <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed">
                        {res.naturalNarrative || res.product.marketingSummary}
                      </p>

                      <button 
                        onClick={() => { 
                          setSelectedResult(res); 
                          setStep('details'); 
                          window.scrollTo(0,0);
                          // Trigger fresh narrative for THIS specific product
                          setNarrativeLoading(true);
                          fetch('/mcp/demo/api/narrative', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ preferences, product: res.product }),
                          })
                            .then(n => n.json())
                            .then(data => setAiNarrative(data))
                            .catch(e => console.error('Narrative swap failed', e))
                            .finally(() => setNarrativeLoading(false));
                        }}
                        className="btn-marquis-premium w-full py-4 text-sm rounded-xl font-black italic uppercase shadow-lg shadow-marquis-blue/20"
                      >
                        Explore this option
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
    const heroImg = getHeroImage(product);

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
                  <div className="text-white/80 text-xs font-black uppercase tracking-widest mb-1 shadow-sm">
                    {product.series?.name || 'Marquis'} {product.positioningTier ? `| ${product.positioningTier.charAt(0).toUpperCase() + product.positioningTier.slice(1)}` : ''}
                  </div>
                  <h3 className="text-5xl md:text-6xl font-black italic uppercase text-white leading-none drop-shadow-lg">{product.modelName}</h3>
               </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
               <h2 className="text-2xl md:text-3xl font-black italic uppercase text-slate-800 tracking-tight flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                  {narrativeLoading ? "Expert Analysis..." : (aiNarrative?.heroTitle || product.modelName)} 
                  <Sparkles className="w-6 h-6 text-marquis-blue flex-shrink-0" />
               </h2>
               
                {/* At a glance boxes */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Maximize className="w-6 h-6 text-marquis-blue/80" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Footprint</div>
                        <div className="text-sm font-black italic uppercase text-slate-700">{product.lengthIn}x{product.widthIn}x{product.depthIn}"</div>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Users className="w-6 h-6 text-marquis-blue/80" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</div>
                        <div className="text-sm font-black italic uppercase text-slate-700">
                          {product.seatsMax !== null && product.seatsMax !== undefined ? (
                            <>
                              {product.seatsMin && product.seatsMin !== product.seatsMax ? `${product.seatsMin}-${product.seatsMax}` : product.seatsMax} Adults
                            </>
                          ) : (
                            "Expert Spec"
                          )}
                        </div>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Zap className="w-6 h-6 text-amber-500" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hydro-Flow</div>
                        <div className="text-sm font-black italic uppercase text-slate-700">{product.pumpFlowGpm || 160} GPM</div>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Waves className="w-6 h-6 text-marquis-blue/80" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Water Volume</div>
                        <div className="text-sm font-black italic uppercase text-slate-700">{product.capacityGallons || 400} gal</div>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <Box className="w-6 h-6 text-slate-400" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weight (Full)</div>
                        <div className="text-sm font-black italic uppercase text-slate-700">{product.fullWeightLbs || 4500} lbs</div>
                      </div>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                      <BatteryCharging className="w-6 h-6 text-emerald-500" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Electrical</div>
                        <div className="text-sm font-black italic uppercase text-slate-700">{product.electricalAmps || 50}A Config</div>
                      </div>
                   </div>
                </div>

               {/* Design Considerations / Trade-offs */}
               {(selectedResult.designConsiderations || aiNarrative?.designConsideration) && (
                  <div className="mb-8 bg-amber-50/30 p-6 rounded-2xl border border-amber-100/50">
                     <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Info className="w-3 h-3" />
                       Design Consideration
                     </div>
                     <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                       {aiNarrative?.designConsideration || selectedResult.designConsiderations}
                     </p>
                  </div>
               )}

                {/* Confirmation Bullets */}
                 <div className="space-y-4 bg-blue-50/40 p-6 rounded-2xl border border-blue-100/50">
                    <div className="text-xs font-black text-marquis-blue uppercase tracking-widest mb-3">Therapy Objective</div>
                    <p className="text-sm text-slate-700 font-bold leading-relaxed italic">
                      "{product.therapySummary || (
                        product.series?.name === 'Crown' ? 'The ultimate in hydrotherapy and wellness engineering, designed for complete physical and mental rejuvenation.' :
                        product.series?.name?.includes('Vector') ? 'Velocity-optimized hydrotherapy focused on precise control and high-volume flow for targeted recovery.' :
                        product.series?.name === 'Marquis Elite' ? 'High-performance hydrotherapy combined with exceptional durability for a professional-grade home spa experience.' :
                        'A balanced, engineering-focused hydrotherapy experience designed for daily wellness and relaxation.'
                      )}"
                    </p>
                  
                  <div className="text-xs font-black text-marquis-blue uppercase tracking-widest mb-3 border-t border-blue-100 pt-4">Expert Reasoning</div>
                  {reasons.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="bg-marquis-blue text-white rounded-full p-1 mt-0.5"><Check className="w-3 h-3" /></div>
                      <p className="text-sm text-slate-700 font-semibold leading-snug">{r}</p>
                    </div>
                  ))}
               </div>

               {/* COLOR EXPLORER - NEW */}
               {(product.shellColors || product.cabinetColors) && (
                 <div className="mt-8 border-t border-slate-100 pt-8">
                    <div className="text-[10px] font-black text-marquis-blue uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Palette className="w-3 h-3" />
                      Curated Finishes
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {/* Shell Colors */}
                       {typeof product.shellColors === 'string' ? JSON.parse(product.shellColors).map((color: string, i: number) => (
                         <div key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase">{color}</div>
                       )) : Array.isArray(product.shellColors) && product.shellColors.map((color: string, i: number) => (
                         <div key={i} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase">{color}</div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
         </div>


          {/* INTERACTIVE HOTSPOTS - FULL WIDTH */}
          {product.overheadImageUrl && (
            <section className="mb-12">
               <div className="flex items-center gap-3 mb-6 px-2">
                 <Settings className="w-6 h-6 text-marquis-blue" />
                 <h4 className="text-2xl font-black italic uppercase text-slate-800">Interactive Feature Explorer</h4>
               </div>
               <div 
                 className="relative aspect-square md:aspect-video rounded-[32px] bg-[#f8fafc] group shadow-xl border border-slate-100 overflow-hidden cursor-crosshair"
                 onMouseEnter={() => setShowMagnifier(true)}
                 onMouseLeave={() => setShowMagnifier(false)}
                 onMouseMove={handleMouseMove}
               >
                  <img 
                    src={product.overheadImageUrl && !product.overheadImageUrl.includes('default') 
                      ? product.overheadImageUrl 
                      : `/mcp/demo/assets/products/${product.slug}/overhead.jpg`
                    } 
                    className="w-full h-full object-contain p-4 md:p-10 transition-opacity duration-300 group-hover:opacity-40" 
                    alt="Overhead View" 
                  />
                  
                  {/* Magnifier Lens */}
                  {showMagnifier && (
                    <div 
                      className="fixed pointer-events-none z-50 w-48 h-48 rounded-full border-4 border-white shadow-[0_0_20px_rgba(0,0,0,0.3)] overflow-hidden bg-white"
                      style={{ 
                        left: magnifierPos.x - 96, 
                        top: magnifierPos.y - 96,
                        backgroundImage: `url(${product.overheadImageUrl && !product.overheadImageUrl.includes('default') ? product.overheadImageUrl : `/mcp/demo/assets/products/${product.slug}/overhead.jpg`})`,
                        backgroundPosition: `${magnifierPos.relX}% ${magnifierPos.relY}%`,
                        backgroundSize: '400%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  )}

                  {/* Hotspots */}
                  {product.hotspots && (typeof product.hotspots === 'string' ? JSON.parse(product.hotspots) : product.hotspots).map((spot: any, i: number) => {
                    const isTop = spot.y < 35;
                    const isBottom = spot.y > 65;
                    const isRight = spot.x > 75;
                    const isLeft = spot.x < 25;

                    return (
                      <div key={i} className="absolute group/spot transition-all z-20" style={{ top: `${spot.y}%`, left: `${spot.x}%` }}>
                        <button className="w-8 h-8 md:w-10 md:h-10 bg-marquis-blue text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse border-2 border-white">
                          <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        
                        {/* Tooltip with Smart Positioning */}
                        <div className={cn(
                          "absolute mb-4 w-72 bg-slate-900/95 backdrop-blur-md text-white p-0 overflow-hidden rounded-2xl shadow-2xl opacity-0 group-hover/spot:opacity-100 transition-all pointer-events-none z-30 border border-white/10 translate-y-2 group-hover/spot:translate-y-0",
                          isTop ? "top-full mt-4" : "bottom-full mb-4",
                          isRight ? "right-0" : isLeft ? "left-0" : "left-1/2 -translate-x-1/2"
                        )}>
                          {spot.imageUrl && (
                            <div className="w-full h-32 overflow-hidden border-b border-white/10">
                              <img src={spot.imageUrl} className="w-full h-full object-cover" alt={spot.label} />
                            </div>
                          )}
                          <div className="p-5">
                            <div className="text-sm font-black uppercase italic text-marquis-blue mb-2 border-b border-marquis-blue/30 pb-2">{spot.label}</div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">{spot.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
               </div>
               <p className="text-center text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest italic animate-pulse">Use the magnifier to inspect jets or hover over hotspots for therapy details</p>
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
                     <div className="text-[10px] sm:text-xs text-marquis-blue font-bold tracking-widest not-italic mt-1">
                        {product.series?.name || 'Marquis'} {product.positioningTier ? `| ${product.positioningTier.charAt(0).toUpperCase() + product.positioningTier.slice(1)}` : ''}
                     </div>
                 </div>
                 <div className="col-span-1 p-5 md:p-8 font-black italic text-lg md:text-2xl uppercase text-slate-400 border-l border-slate-200">
                     Industry<br className="hidden md:block"/> Standard
                     <div className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-widest not-italic mt-1">Comparable</div>
                 </div>
               </div>
               
               {[
                 { feature: "Market Positioning", desc: "Tiered Engineering Level", marquis: `${product.positioningTier?.toUpperCase() || 'ELITE'}`, comp: "Entry / Mid-Range" },
                 { feature: "Engineering Score", desc: "Quantified Feature Density", marquis: `${product.score || 85}/100`, comp: "60-65/100" },
                 { feature: "Hydraulic Efficiency", desc: "Total system flow rate (GPM)", marquis: `${product.pumpFlowGpm || 480} GPM (Velocity-Optimized)`, comp: "Standard 160-220 GPM" },
                 { feature: "Jet Architecture", desc: "Proprietary laminar flow tech", marquis: `${product.jetCount} Velocity-Treated Jets`, comp: "Standard Multi-Stage Jets" },
                 { feature: "Sanitation Logic", desc: "Advanced water care automation", marquis: "ConstantClean+™ System", comp: "Basic Filtration Cycles" },
                 { feature: "Thermal Matrix", desc: "Insulation and shell durability", marquis: "MaximizR™ Full-Foam / DuraShell®", comp: "Partial Spray / Standard Acrylic" },
                 { feature: "Load Capacity", desc: "Engineering weight tolerance", marquis: `${product.fullWeightLbs || 5020} lbs (Heavy Duty)`, comp: "~4,200 lbs (Standard Build)" }
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

          {/* GROUNDED Q&A FEATURE - Brain 2.0 */}
          <section className="mt-12 mb-24">
            <AskTheBrain 
              productId={product?.id} 
              productName={product?.modelName} 
              preferences={preferences} 
            />
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

