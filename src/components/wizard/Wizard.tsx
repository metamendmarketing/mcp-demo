'use client';

import React, { useState } from 'react';
import { 
  FirstAidKit, UsersThree, Wind, CornersOut, Users, ArrowsInCardinal, 
  Feather, Waveform, Speedometer, Robot, Wrench, Crown, Compass, 
  Plug, Lightning, Question, Wallet, Bank, Star, Diamond, Truck, Hammer, MapPin,
  Check, CaretRight, CaretLeft, Sparkle, ArrowRight, Info, NavigationArrow, CircleNotch, Target,
  Sun, CloudSun, Flame, Tree, Crosshair
} from '@phosphor-icons/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ProductDetailView, { type Product, type ScoredProduct } from '../products/ProductDetailView';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to format AI narrative text (bolding phrases with ** to <strong> and making them darker)
const formatRichText = (text: string) => {
  if (!text) return '';
  // Replace **text** with <strong class="text-slate-900 font-black">text</strong>
  return text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 font-black">$1</strong>');
};

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
  | 'ownership'
  | 'lat'
  | 'lng';

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
  lat?: number | null;
  lng?: number | null;
}

const QUESTIONS: {
  id: PreferenceKey;
  question: string;
  subtext: string;
  expertTip: (prefs: UserPreferences) => string;
  layout: 'grid' | 'split' | 'map' | 'slider';
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
      { value: 'therapy', label: 'Deep Hydrotherapy', tip: "Focused relief for chronic pain, athletic recovery, and targeted muscle tension.", image: '/mcp/demo/assets/therapy_premium.png', icon: <FirstAidKit weight="duotone" className="w-8 h-8 text-indigo-500" /> },
      { value: 'recreational', label: 'Social & Entertainment', tip: "Open seating, vibrant lighting, and space for family connection.", image: '/mcp/demo/assets/recreation_premium.png', icon: <UsersThree weight="duotone" className="w-8 h-8 text-sky-500" /> },
      { value: 'relaxation', label: 'Stress Relief & Sleep', tip: "Gentle bubbling, quiet operation, and ergonomic lounging for mental reset.", image: '/mcp/demo/assets/fitness_premium.png', icon: <Wind weight="duotone" className="w-8 h-8 text-teal-400" /> }
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
      { value: 'yes', label: 'Yes, include a Lounger', tip: "I prioritize solo, full-body relaxation.", icon: <CornersOut weight="duotone" className="w-8 h-8 text-marquis-blue" /> },
      { value: 'no', label: 'No, Open Seating', tip: "I want to maximize the number of seats available.", icon: <Users weight="duotone" className="w-8 h-8 text-slate-400" /> },
      { value: 'no-pref', label: 'No Preference', tip: "Show me the best matches for both layouts.", icon: <ArrowsInCardinal weight="duotone" className="w-8 h-8 text-amber-500" /> }
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
      { value: 'diverse-depth', label: 'Diverse Seat Depths', tip: "Varying heights for families with different physical profiles.", image: '/mcp/demo/assets/hydro_diverse_depths.jpg' },
      { value: 'neck-shoulders', label: 'Neck & Shoulders', tip: "Targeted collar jets for tension headaches.", image: '/mcp/demo/assets/hydro_lower_back.jpg' },
      { value: 'lower-back', label: 'Lower Back Focus', tip: "Deep penetration HK jets for lumbar relief.", image: '/mcp/demo/assets/hydro_neck_shoulders.jpg' },
      { value: 'full-body', label: 'Full Body Immersion', tip: "Comprehensive sequential massage profile.", image: '/mcp/demo/assets/hydro_full_body.png' }
    ],
    skip: (prefs) => prefs.capacity === '2-3'
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
      { value: 'gentle', label: 'Soothing Soak', tip: "Broad flow. Ideal for sensitive skin or simple relaxation.", icon: <Feather weight="duotone" className="w-8 h-8 text-teal-500" /> },
      { value: 'medium', label: 'Standard Vigorous', tip: "The perfect balance of active recovery and relaxation.", icon: <Waveform weight="duotone" className="w-8 h-8 text-marquis-blue" /> },
      { value: 'firm', label: 'High-Output Therapy', tip: "Maximum GPM flow designed to break down deep muscle tension.", icon: <Speedometer weight="duotone" className="w-8 h-8 text-indigo-600" /> }
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
      { value: 'automated', label: 'Automated Cleaning', tip: "Utilizes the ConstantClean+™ simplified in-line sanitation system.", icon: <Robot weight="duotone" className="w-8 h-8 text-marquis-blue" /> },
      { value: 'hands-on', label: 'Manual Management', tip: "Standard filtration with traditional chemistry dosing.", icon: <Wrench weight="duotone" className="w-8 h-8 text-slate-400" /> }
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
      { value: 'upgrade', label: 'Forever Spa Upgrade', tip: "I want the highest engineering specs and longevity (Crown/Vector).", icon: <Crown weight="duotone" className="w-8 h-8 text-amber-500" /> },
      { value: 'discovery', label: 'First Spa Discovery', tip: "I want the best value for a multi-year experience (Celebrity).", icon: <Compass weight="duotone" className="w-8 h-8 text-marquis-blue" /> }
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
      { value: 'morning', label: 'Morning Sun Only', tip: "Gentle warmth; cooler in the evenings.", icon: <Sun className="w-10 h-10 text-amber-500 mx-auto" weight="fill" /> },
      { value: 'afternoon', label: 'Afternoon / Late Sun', tip: "Intense heat during the peak of the day.", icon: <CloudSun className="w-10 h-10 text-orange-500 mx-auto" weight="fill" /> },
      { value: 'direct', label: 'Direct Sun All Day', tip: "Maximum solar gain; require DuraCover®.", icon: <Flame className="w-10 h-10 text-red-500 mx-auto" weight="fill" /> },
      { value: 'shaded', label: 'Heavy Shade / Covered', tip: "Under a roof, pergola, or dense trees.", icon: <Tree className="w-10 h-10 text-slate-400 mx-auto" weight="fill" /> }
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
      { value: '110v', label: '110V Plug & Play', tip: "Easy install. Best for temperate climates and smaller models.", icon: <Plug weight="duotone" className="w-8 h-8 text-blue-400" /> },
      { value: '240v', label: '240V Hardwired', tip: "Professional choice. Maximum heat retention and jet power.", icon: <Lightning weight="duotone" className="w-8 h-8 text-marquis-blue" /> },
      { value: 'help', label: 'Help me decide', tip: "I need more information on electrical requirements.", icon: <Question weight="duotone" className="w-8 h-8 text-slate-400" /> }
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
      { value: 'entry', label: 'Entry Tier', tip: "$5,000 - $8,000. Marquis quality in a standard equipment package.", icon: <Wallet weight="duotone" className="w-10 h-10 mx-auto text-slate-400" /> },
      { value: 'mid', label: 'Mid-Level Tier', tip: "$9,000 - $13,000. Upgraded filtration and additional massage pumps.", icon: <Bank weight="duotone" className="w-10 h-10 mx-auto text-marquis-blue" /> },
      { value: 'premium', label: 'Premium Tier', tip: "$14,000 - $18,000. High-flow GPM and full-foam insulation standard.", icon: <Star weight="duotone" className="w-10 h-10 mx-auto text-amber-400" /> },
      { value: 'luxury', label: 'Luxury Tier', tip: "$19,000+. The absolute pinnacle of hydrotherapy and aesthetic.", icon: <Diamond weight="duotone" className="w-10 h-10 mx-auto text-indigo-500" /> }
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
      { value: 'easy', label: 'Wide Open Access', tip: "Double-wide gates or zero steps. Standard delivery.", icon: <Truck weight="duotone" className="w-8 h-8 text-green-500" /> },
      { value: 'standard', label: 'Standard Clearance', tip: "Minimum 40-inch wide side gate with a clear, flat path.", icon: <Hammer weight="duotone" className="w-8 h-8 text-marquis-blue" /> },
      { value: 'tight', label: 'Tight / Complex Path', tip: "Narrow gates, stairs, or requires crane facilitation.", icon: <MapPin weight="duotone" className="w-8 h-8 text-red-500" /> }
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
    ownership: null,
    lat: null,
    lng: null
  });

  const [results, setResults] = useState<ScoredProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ScoredProduct | null>(null);
  const [aiNarrative, setAiNarrative] = useState<any>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [detectingLocation, setDetectingLocation] = useState(false);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          updatePreference('lat' as any, latitude);
          updatePreference('lng' as any, longitude);
          
          // Note: Marquis API Key is hardcoded here for the prototype as requested
          const apiKey = 'AIzaSyBJTMfCxb6VFz1vIK_7Jb52JZuDj_J2tks';
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          const data = await res.json();
          
          const result = data.results[0];
          if (result) {
            const city = result.address_components.find((c: any) => c.types.includes('locality'))?.long_name;
            const state = result.address_components.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name;
            const zip = result.address_components.find((c: any) => c.types.includes('postal_code'))?.long_name;
            
            if (city && state) {
              updatePreference('zipCode', `${city}, ${state}`);
            } else if (zip) {
              updatePreference('zipCode', zip);
            }
          }
        } catch (e) {
          console.error('Location detection failed', e);
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.error('Geolocation error', err);
        setDetectingLocation(false);
      }
    );
  };

  const updatePreference = (key: PreferenceKey, value: any) => {
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
    setProgress(0);
    setLoadingMessage("Meticulously analyzing your criteria...");
    
    // Smooth progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 98) {
          clearInterval(interval);
          return 98;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 200);

    const messages = [
      "Benchmarking hydro-flow dynamics...",
      "Matching shell aesthetics to your landscape...",
      "Optimizing thermal matrix for your climate...",
      "Synthesizing your Marquis Blueprint..."
    ];
    
    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      setLoadingMessage(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
    }, 1500);

    try {
      const res = await fetch('/mcp/demo/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });

      if (!res.ok) throw new Error('Recommendation failed');
      const data = await res.json();
      
      clearInterval(interval);
      clearInterval(msgInterval);
      setProgress(100);
      setLoadingMessage("Matching complete.");
      
      setTimeout(() => {
        setResults(data.scoredProducts);
        setStep('results');
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      clearInterval(msgInterval);
      setLoading(false);
    }
  };

  const handleSelectResult = async (res: ScoredProduct) => {
    setSelectedResult(res);
    setStep('details');
    setNarrativeLoading(true);
    
    try {
      const narrativeRes = await fetch('/mcp/demo/api/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: res.product, preferences }),
      });

      if (!narrativeRes.ok) throw new Error('Narrative failed');
      const narrativeData = await narrativeRes.json();
      setAiNarrative(narrativeData);
    } catch (err) {
      console.error(err);
    } finally {
      setNarrativeLoading(false);
    }
  };

  const getHeroImage = (product: Product) => {
    if (product.heroImageUrl && 
        !product.heroImageUrl.includes('therapy_premium.png') && 
        !product.heroImageUrl.includes('placeholder')) {
      return product.heroImageUrl;
    }
    if (product.slug) {
      const isCrown = product.slug.includes('crown');
      const ext = isCrown ? 'jpg' : 'png';
      return `/mcp/demo/assets/products/${product.slug}/hero.${ext}`;
    }
    return product.heroImageUrl || '/mcp/demo/assets/therapy_premium.png';
  };

  if (step === 'intro') {
    return (
      <div className="flex flex-col h-full bg-white animate-slick-reveal overflow-hidden relative">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <img src="/mcp/demo/assets/bg_pattern.png" className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-grow flex flex-col items-center justify-center p-8 md:p-12 text-center max-w-4xl mx-auto relative z-10">
           <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 rounded-[2rem] border-2 border-slate-200 flex items-center justify-center mb-8 shadow-sm">
              <Sparkle className="w-8 h-8 md:w-10 md:h-10 text-marquis-blue" weight="fill" />
           </div>
           <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.9] text-slate-800 tracking-tighter mb-6">
             The Marquis <span className="text-marquis-blue">Selector</span>
           </h1>
           <p className="text-lg md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl mb-12 italic">
              Experience the absolute pinnacle of hydrotherapy matching. Our algorithmic engine pairs your lifestyle with over 40 years of Marquis engineering.
           </p>
           <button onClick={() => setStep('question')} className="btn-marquis-premium px-12 md:px-16 py-5 md:py-6 rounded-2xl text-xl md:text-2xl font-black italic uppercase shadow-2xl hover:scale-105 transition-transform group">
              Get Started <CaretRight className="inline-block w-6 h-6 md:w-8 md:h-8 ml-2 group-hover:translate-x-1 transition-transform" weight="bold" />
           </button>
        </div>
        <div className="p-8 border-t border-slate-100 text-center relative z-10">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Engineering Fact-Based Matching | Est. 1980</p>
        </div>
      </div>
    );
  }

  if (step === 'question') {
    const q = QUESTIONS[currentQuestionIndex];
    return (
      <div className="flex flex-col h-full bg-white animate-slick-reveal overflow-hidden">
        <div className="bg-slate-50 p-6 md:p-10 border-b border-slate-200 shrink-0">
           <div className="max-w-4xl mx-auto">
             <div className="flex items-center gap-4 mb-3">
               <div className="w-10 h-10 bg-marquis-blue text-white rounded-xl flex items-center justify-center font-black italic shadow-lg">{currentQuestionIndex + 1}</div>
               <h2 className="text-3xl md:text-4xl font-black italic uppercase text-slate-800 tracking-tight leading-none">{q.question}</h2>
             </div>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-xs ml-14">{q.subtext}</p>
           </div>
        </div>
        <div className="flex-grow overflow-y-auto p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            {!q.bgImage && (
              <div className="flex items-start gap-4 mb-10 bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 max-w-2xl mx-auto">
                <div className="p-2 bg-white rounded-xl shadow-sm shrink-0"><Info className="w-5 h-5 text-marquis-blue" weight="bold" /></div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-marquis-blue mb-1">Expert Insight</h4>
                  <p 
                    className="text-sm md:text-base text-slate-600 font-medium leading-relaxed italic"
                    dangerouslySetInnerHTML={{ __html: `"${formatRichText(q.expertTip(preferences))}"` }}
                  />
                </div>
              </div>
            )}
            {q.layout === 'grid' && (
              <div className={cn("grid gap-6 mx-auto", q.options.length === 3 ? "grid-cols-1 md:grid-cols-3 max-w-4xl" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4")}>
                {q.options.map((opt) => (
                  <button key={opt.value} onClick={() => { updatePreference(q.id, opt.value); setTimeout(nextQuestion, 150); }} className={cn("group relative bg-white rounded-2xl border-2 p-6 text-left transition-all shadow-sm hover:shadow-lg flex flex-col items-center h-full min-h-[160px]", preferences[q.id] === opt.value ? "border-marquis-blue ring-2 ring-marquis-blue/20 bg-blue-50/20" : "border-slate-100/80 hover:border-marquis-blue/40")}>
                    {opt.image ? (
                      <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-slate-100">
                        <img src={opt.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={opt.label} />
                      </div>
                    ) : opt.icon ? (
                      <div className={cn("w-16 h-16 mb-6 rounded-2xl flex items-center justify-center transition-all", preferences[q.id] === opt.value ? "bg-marquis-blue text-white" : "bg-slate-50 text-marquis-blue/60 group-hover:text-marquis-blue")}>
                        {opt.icon}
                      </div>
                    ) : null}
                    <div className="text-center">
                      <h4 className="text-lg font-black uppercase italic mb-1 text-slate-800 tracking-wide">{opt.label}</h4>
                      {opt.tip && <p className="text-xs text-slate-500 font-medium leading-relaxed">{opt.tip}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {q.layout === 'split' && (
              <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative", q.bgImage ? "p-10 rounded-[40px] overflow-hidden shadow-2xl" : "")}>
                {q.bgImage && <><img src={q.bgImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="" /><div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/20 z-10" /></>}
                <div className="lg:col-span-5 relative z-20">
                  <div className={cn("p-8 rounded-3xl border shadow-sm", q.bgImage ? "bg-white/10 backdrop-blur-md border-white/20 text-white" : "bg-white border-slate-100")}>
                    <div 
                      className="text-lg font-medium leading-relaxed italic"
                      dangerouslySetInnerHTML={{ __html: `"${formatRichText(q.expertTip(preferences))}"` }}
                    />
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-4 relative z-20">
                  {q.options.map((opt) => (
                    <button key={opt.value} onClick={() => { updatePreference(q.id, opt.value); setTimeout(nextQuestion, 150); }} className={cn("w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all hover:shadow-md group", preferences[q.id] === opt.value ? "bg-white border-marquis-blue ring-2 ring-marquis-blue/20 scale-[1.02] shadow-xl" : "bg-white/95 border-slate-100/80 hover:border-marquis-blue/40")}>
                      <div className="flex items-center gap-6">
                        {opt.icon && <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all", preferences[q.id] === opt.value ? "bg-marquis-blue text-white" : "bg-slate-50 text-slate-400 group-hover:text-marquis-blue")}>{opt.icon}</div>}
                        <div className="flex flex-col text-left">
                          <span className="text-xl font-black uppercase italic text-slate-800 tracking-wide leading-none mb-1">{opt.label}</span>
                          {opt.tip && <p className="text-xs text-slate-500 font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{opt.tip}</p>}
                        </div>
                      </div>
                      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2", preferences[q.id] === opt.value ? "bg-marquis-blue border-marquis-blue text-white" : "bg-transparent border-slate-200")}>
                         {preferences[q.id] === opt.value ? <Check className="w-5 h-5" weight="bold" /> : <div className="w-2.5 h-2.5 rounded-full bg-current" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {q.layout === 'slider' && (
              <div className="relative p-10 rounded-[40px] overflow-hidden shadow-2xl min-h-[450px] flex items-center justify-center">
                {q.bgImage && <><img src={q.bgImage} className="absolute inset-0 w-full h-full object-cover z-0" alt="" /><div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 z-10" /></>}
                <div className="relative z-20 w-full max-w-2xl text-center space-y-12">
                   <h3 className="text-7xl md:text-9xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl">{preferences[q.id] || '5'}<span className="text-3xl md:text-4xl ml-2 text-blue-300">Adults</span></h3>
                   <input type="range" min="1" max="10" step="1" value={preferences[q.id] || '5'} onChange={(e) => updatePreference(q.id, e.target.value)} className="w-full h-4 bg-white/40 rounded-full appearance-none cursor-pointer accent-marquis-blue hover:bg-white/50 transition-all border border-white/20" />
                   <button onClick={nextQuestion} className="btn-marquis-premium px-12 py-5 rounded-2xl text-xl font-black italic uppercase shadow-2xl group">Confirm Capacity <CaretRight className="inline-block w-6 h-6 ml-2" weight="bold" /></button>
                </div>
              </div>
            )}
            {q.layout === 'map' && (
              <div className="max-w-md mx-auto space-y-8 text-center py-10">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <MapPin className="w-6 h-6 text-marquis-blue group-focus-within:animate-bounce transition-all" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Enter ZIP/Postal Code" 
                    className="w-full bg-white border-2 border-slate-200 focus:border-marquis-blue rounded-2xl pl-16 pr-24 py-5 text-2xl font-black italic uppercase text-center outline-none transition-all" 
                    value={preferences.zipCode || ''}
                    onChange={(e) => updatePreference('zipCode', e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && preferences.zipCode && nextQuestion()} 
                  />
                  <button 
                    onClick={handleDetectLocation}
                    disabled={detectingLocation}
                    title="Use My Current Location"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-slate-50 border border-slate-200 hover:bg-white hover:border-marquis-blue hover:shadow-md rounded-xl text-slate-400 hover:text-marquis-blue transition-all disabled:opacity-50 group/loc"
                  >
                    {detectingLocation ? (
                      <CircleNotch className="w-5 h-5 animate-spin" />
                    ) : (
                      <Crosshair className="w-6 h-6 group-hover/loc:scale-110 transition-transform" weight="bold" />
                    )}
                  </button>
                </div>

                <button 
                  onClick={nextQuestion} 
                  disabled={!preferences.zipCode}
                  className="btn-marquis-premium w-full py-5 rounded-2xl text-xl font-black italic uppercase shadow-xl disabled:opacity-50 disabled:grayscale transition-all"
                >
                  Confirm Location
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center shrink-0">
          <button onClick={prevQuestion} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-marquis-blue px-4 py-2 transition-colors"><CaretLeft className="w-5 h-5" weight="bold" /> Back</button>
          <div className="flex gap-1">{QUESTIONS.map((_, i) => (<div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all", i === currentQuestionIndex ? "bg-marquis-blue w-6" : "bg-slate-200")} />))}</div>
          <div className="text-xs font-black uppercase text-slate-400 tracking-widest">Step {currentQuestionIndex + 1} of {QUESTIONS.length}</div>
        </div>
      </div>
    );
  }

  if (step === 'blueprint') {
    return (
      <div className="flex flex-col h-full bg-slate-900 text-white animate-slick-reveal overflow-hidden">
        <div className="flex-grow flex flex-col items-center justify-center p-10 text-center max-w-4xl mx-auto space-y-12">
           <div className="space-y-4">
              <div className="w-20 h-20 bg-marquis-blue rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)]">
                <Sparkle className="w-10 h-10 text-white" weight="fill" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black italic uppercase leading-tight text-white italic">AI <span className="text-marquis-blue">Blueprint</span></h2>
           </div>
           
           {loading ? (
             <div className="w-full max-w-md flex flex-col items-center translate-y-4">
                {/* Large Slider-Style Percentage - Halved */}
                <div className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl mb-8">
                   {progress}<span className="text-xl md:text-2xl ml-1 text-marquis-blue opacity-50">%</span>
                </div>

                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mb-8 border border-white/5 shadow-inner">
                   <div 
                     className="h-full bg-marquis-blue shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all duration-300 ease-out" 
                     style={{ width: `${progress}%` }}
                   />
                </div>

                {/* Status Message Below - Styled to match premium "Expert Analysis" feel */}
                <div className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-marquis-blue animate-pulse min-h-[1.5em] text-center">
                  {loadingMessage}
                </div>
             </div>
           ) : (
             <button 
               onClick={handleRecommend} 
               disabled={loading} 
               className="btn-marquis-premium px-16 py-5 rounded-2xl text-xl font-black italic uppercase shadow-[0_0_50px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform"
             >
               Find my match!
             </button>
           )}
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-slick-reveal">
        <div className="bg-slate-900 p-8 md:p-12 text-center relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-marquis-blue/10 pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black italic uppercase text-white tracking-tight mb-2">Your Personalized Selection</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs">Meticulously matched based on your 14 expert criteria</p>
        </div>
        <div className="p-6 md:p-10 flex-grow overflow-y-auto">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             {results && results.slice(0, 4).map((res, i) => (
                  <div 
                    key={res.product.id} 
                    onClick={() => handleSelectResult(res)}
                    className={cn(
                      "bg-white rounded-3xl overflow-hidden shadow-md flex flex-col border transition-all duration-700 cursor-pointer hover:shadow-xl", 
                      i === 0 ? "border-amber-400 ring-4 ring-amber-400/20 shadow-2xl scale-[1.02] z-10" : "border-slate-100"
                    )}
                  >
                    <div className="w-full h-64 relative bg-slate-100 overflow-hidden group shrink-0">
                       <img src={getHeroImage(res.product)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={res.product.modelName} />
                       <div className={cn(
                         "absolute top-6 left-6 px-4 py-2 rounded-full text-xs font-black uppercase shadow-xl",
                         i === 0 ? "bg-amber-400 text-slate-900 border-2 border-amber-200" : "bg-marquis-blue text-white"
                       )}>
                         {i === 0 ? "★ Best Match" : (res.matchStrategy || "Expert Selection")}
                       </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow">
                          <h3 className="text-3xl font-black italic uppercase text-slate-800 leading-none mb-2">{res.product.modelName}</h3>
                          <div className="text-marquis-blue text-[10px] font-bold uppercase tracking-widest mb-4">
                             {res.product.seriesName || res.product.series?.name || 'Marquis'} | {res.product.positioningTier?.toUpperCase() || 'ELITE'}
                          </div>
                          <p className="text-slate-600 mb-8 line-clamp-3 leading-relaxed text-sm font-medium">{res.naturalNarrative || res.product.marketingSummary}</p>
                          <div className="btn-marquis-premium w-full py-4 text-sm rounded-xl font-black italic uppercase shadow-lg shadow-marquis-blue/20 text-center">Explore this option</div>
                    </div>
                  </div>
             ))}
           </div>
        </div>
      </div>
    );
  }

  if (step === 'details' && selectedResult) {
    return (
      <ProductDetailView 
        product={selectedResult.product}
        mode="influenced"
        aiNarrative={aiNarrative}
        reasons={selectedResult.reasons}
        preferences={preferences}
        onBack={() => setStep('results')}
        isLoading={narrativeLoading}
      />
    );
  }

  return null;
}
