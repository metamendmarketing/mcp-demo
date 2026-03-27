/**
 * Wizard.tsx
 * 
 * The primary interactive driver of the Marquis Buying Assistant.
 * This component manages a 15-step immersive discovery process, capturing 
 * user lifestyle preferences, technical requirements, and aesthetic tastes.
 * 
 * Features:
 * - Real-time "Expert Tips" based on current user selections.
 * - Dynamic layouts (Grid, Split, Slider, Map) for engaging interactions.
 * - High-Fidelity API integration for heuristic/AI recommendations.
 * - Responsive, premium design with framer-motion transitions.
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ExpertSelectionPass from '../shared/ExpertSelectionPass';
import { 
  FirstAidKit, UsersThree, Wind, CornersOut, Users, ArrowsInCardinal, 
  Feather, Waveform, Speedometer, Robot, Wrench, Crown, Compass, 
  Plug, Lightning, Question, Wallet, Bank, Star, Diamond, Truck, Hammer, MapPin,
  Check, CaretRight, CaretLeft, Sparkle, ArrowRight, Info, NavigationArrow, CircleNotch, Target,
  Sun, CloudSun, Flame, Tree, Crosshair, Plus, Printer, House, Waves, Package, Thermometer, 
  BatteryCharging
} from '@phosphor-icons/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ProductDetailView, { type Product, type ScoredProduct } from '../products/ProductDetailView';

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
    bgImage: '/mcp/demo/assets/bg_ownership_material.png',
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
    bgImage: '/mcp/demo/assets/season_split.png',
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
    capacity: '5',
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
          // Note: Marquis API Key is hardcoded here for the prototype as requested
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
          const data = await res.json();
          const components = data.results[0]?.address_components || [];
          const city = components.find((c: any) => c.types.includes('locality'))?.long_name;
          const state = components.find((c: any) => c.types.includes('administrative_area_level_1'))?.short_name;
          const zip = components.find((c: any) => c.types.includes('postal_code'))?.long_name;
          
          if (city && state) {
            updatePreference('zipCode', `${city}, ${state}`);
          } else if (zip) {
            updatePreference('zipCode', zip);
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
    setProgress(0);
    setLoadingMessage("Analyzing user preferences...");
    
    // Start fetch in background
    let recommendationData: any = null;
    let narrativeData: any = null;
    let recommendationReady = false;

    const fetchTask = (async () => {
      try {
        const res = await fetch('/mcp/demo/api/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ preferences }),
        });
        const data = await res.json();
        
        const safeParse = (data: any, fallback: any = []) => {
          if (typeof data === 'string') {
            try { return JSON.parse(data); } catch (e) { return fallback; }
          }
          return data || fallback;
        };

        recommendationData = data.results?.map((r: any) => ({
          ...r,
          product: {
            ...r.product,
            usageTags: safeParse(r.product.usageTags),
            shellColors: safeParse(r.product.shellColors),
            cabinetColors: safeParse(r.product.cabinetColors),
            hotspots: safeParse(r.product.hotspots)
          }
        }));
        
        recommendationReady = true;

        // Start pre-fetch of narrative in the background, but DON'T block the transition based on it
        if (recommendationData && recommendationData.length > 0) {
          fetch('/mcp/demo/api/narrative', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ preferences, product: recommendationData[0].product }),
          }).then(n => n.json()).then(data => {
            narrativeData = data;
            setAiNarrative({ ...data, productSlug: recommendationData[0].product.slug });
          }).catch(e => console.error('Background narrative failed', e));
        }
      } catch (err) {
        console.error('Recommendation failed', err);
        recommendationReady = true; 
      }
    })();

    // Redistributed Timing Simulation (Paced for ~32-38s actual backend duration)
    console.log("[Wizard] Multi-Phase Analytical Simulation Started (v5 - Balanced)");
    for (let i = 0; i <= 99; i++) {
       const shouldAccelerate = recommendationReady;
       setProgress(i);
       
       // User-Preferred Status Messages
       if (i < 20) setLoadingMessage("Analyzing user preferences...");
       else if (i < 45) setLoadingMessage("Reviewing model specifications...");
       else if (i < 75) setLoadingMessage("Identifying suitable options...");
       else setLoadingMessage("Finalizing matches...");

       let delay = 60; // Phase 1: Engagement (0-15%)
       
       if (i >= 15 && i < 85) {
         // Phase 2: Heavy lifting - Randomized (15-85%)
         // Paced to last ~30-32 seconds if not accelerated (avg 450ms)
         delay = shouldAccelerate ? 30 : (200 + Math.random() * 700);
       } else if (i >= 85) {
         // Phase 3: Paced/Accelerated Finish (85-99%)
         delay = shouldAccelerate ? 20 : Math.max(100, 300 - (i - 85) * 15);
       }
       
       await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Wait for actual data if we hit 99 before it arrives
    if (!recommendationReady) {
       setLoadingMessage("Securing final match data...");
       while (!recommendationReady) {
          await new Promise(r => setTimeout(r, 200));
       }
    }
    
    // Satisfaction Fulfillment: Zip to 100 and transition
    setProgress(100);
    setLoadingMessage("Matching Complete!");
    // Reduced hold for more instant "Finish" feel
    await new Promise(r => setTimeout(r, 150)); 

    // transition
    if (typeof window !== 'undefined' && recommendationData) {
      localStorage.setItem('marquis_recommendations', JSON.stringify(recommendationData));
    }
    setResults(recommendationData || []);
    setStep('results');
    setLoading(false);
  };

  const handleSelectResult = (res: ScoredProduct) => {
    setSelectedResult(res);
    setStep('details');
    window.scrollTo(0, 0);
    if (!aiNarrative || aiNarrative.productSlug !== res.product.slug) {
      setNarrativeLoading(true);
      fetch('/mcp/demo/api/narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preferences, product: res.product }),
      })
        .then(n => n.json())
        .then(data => setAiNarrative({ ...data, productSlug: res.product.slug }))
        .finally(() => setNarrativeLoading(false));
    }
  };

  const getHeroImage = (product: Product) => {
    // 1. Prioritize DB URL if it's explicitly set and NOT the generic fallback
    if (product.heroImageUrl && 
        !product.heroImageUrl.includes('therapy_premium.png') && 
        !product.heroImageUrl.includes('placeholder')) {
      return product.heroImageUrl;
    }

    // 2. Fallback to constructed path for local assets
    if (product.slug) {
      const isCrown = product.slug.includes('crown');
      const isJpgVector = product.slug.includes('v65l') || product.slug.includes('v77l');
      const ext = (isCrown || isJpgVector) ? 'jpg' : 'png';
      return `/mcp/demo/assets/products/${product.slug}/hero.${ext}`;
    }

    // 3. Absolute fallback
    return product.heroImageUrl || '/mcp/demo/assets/therapy_premium.png';
  };

  const StepHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="bg-gradient-to-r from-marquis-light-blue to-marquis-blue w-full py-6 px-6 text-center shadow-md relative overflow-hidden text-white shrink-0">
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
         <div className="absolute inset-0 bg-slate-900/40" />
         <div className="p-8 pb-16 md:p-16 flex flex-col items-center justify-center text-center relative z-10 flex-grow min-h-[550px]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase text-white mb-6 leading-[1.1] drop-shadow-xl max-w-2xl">
               Expertly <span className="text-marquis-blue">Matched.</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl mb-10 font-medium drop-shadow-md">
               Discover Marquis models thoughtfully selected to match your lifestyle, powered by your personal preferences.
            </p>
            <button 
              onClick={() => setStep('question')}
              className="btn-marquis-premium px-12 py-5 rounded-2xl text-xl font-black italic uppercase shadow-2xl group hover:scale-105 transition-transform flex items-center gap-3 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors" />
              Get Started <ArrowRight className="w-6 h-6" weight="bold" />
            </button>
         </div>

         {/* Restored Priority Feature Row */}
         <div className="relative z-10 bg-black/40 backdrop-blur-xl border-t border-white/10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
               <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Extraordinary Quality</h4>
               <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">Built to rigorous standards.</p>
            </div>
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
               <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">World-Class Performance</h4>
               <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">V-O-L-T™ hydrotherapy delivery.</p>
            </div>
            <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
               <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">Meticulously Crafted</h4>
               <p className="text-white/60 text-[10px] font-medium uppercase tracking-widest">Made in the USA.</p>
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
                <div className="p-2 bg-white rounded-xl shadow-sm shrink-0"><Info className="w-5 h-5 text-marquis-blue" weight="bold" /></div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest text-marquis-blue mb-1">Expert Insight</h4>
                  <p className="text-sm md:text-base text-slate-600 font-medium leading-relaxed italic">"{q.expertTip(preferences)}"</p>
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
              <div className={cn("grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative", q.bgImage ? "p-10 rounded-[40px] overflow-hidden shadow-2xl min-h-[550px]" : "")}>
                {q.bgImage && <><img src={q.bgImage} className="absolute inset-0 w-full h-full object-cover object-center z-0" alt="" /><div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-slate-900/10 z-10" /></>}
                <div className="lg:col-span-5 relative z-20">
                  <div className={cn("p-8 rounded-3xl border shadow-sm", q.bgImage ? "bg-white/10 backdrop-blur-md border-white/20 text-white" : "bg-white border-slate-100")}>
                    <p className="text-lg font-medium leading-relaxed italic">"{q.expertTip(preferences)}"</p>
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
              <div className="relative p-10 rounded-[40px] overflow-hidden shadow-2xl min-h-[550px] flex items-center justify-center">
                {q.bgImage && <><img src={q.bgImage} className="absolute inset-0 w-full h-full object-cover object-center z-0" alt="" /><div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 z-10" /></>}
                <div className="relative z-20 w-full max-w-2xl text-center space-y-12">
                   <h3 className="text-7xl md:text-9xl font-black italic uppercase text-white tracking-tighter drop-shadow-2xl">{preferences[q.id] || '5'}<span className="text-3xl md:text-4xl ml-2 text-blue-300">Adults</span></h3>
                   <input type="range" min="1" max="10" step="1" value={preferences[q.id] || '5'} onChange={(e) => updatePreference(q.id, e.target.value)} className="w-full h-4 bg-white/20 rounded-full appearance-none cursor-pointer accent-marquis-blue hover:bg-white/30 transition-all border border-white/20" />
                   <button onClick={nextQuestion} className="btn-marquis-premium px-12 py-5 rounded-2xl text-xl font-black italic uppercase shadow-2xl group">Confirm Capacity <CaretRight className="inline-block w-6 h-6 ml-2" weight="bold" /></button>
                </div>
              </div>
            )}
            {q.layout === 'map' && (
              <div className={cn("relative p-10 rounded-[40px] overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[600px]", q.bgImage ? "w-full" : "max-w-md mx-auto space-y-8 text-center py-10")}>
                {q.bgImage && <><img src={q.bgImage} className="absolute inset-0 w-full h-full object-cover object-center z-0" alt="" /><div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-900/90 z-10" /></>}
                <div className="relative z-20 w-full max-w-md space-y-8 text-center">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                      <MapPin className="w-6 h-6 text-marquis-blue group-focus-within:animate-bounce transition-all" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Enter ZIP/Postal Code" 
                      className="w-full bg-white border-2 border-slate-200 focus:border-marquis-blue rounded-2xl pl-16 pr-16 py-5 text-2xl font-black italic uppercase text-center outline-none transition-all placeholder:text-marquis-blue/30" 
                      value={preferences.zipCode || ''}
                      onChange={(e) => updatePreference('zipCode', e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && preferences.zipCode && nextQuestion()} 
                    />
                    <button 
                      onClick={handleDetectLocation}
                      disabled={detectingLocation}
                      title="Use My Current Location"
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 border border-marquis-blue/40 hover:bg-marquis-blue hover:text-white rounded-xl shadow-sm text-marquis-blue transition-all disabled:opacity-50 group/loc"
                    >
                      {detectingLocation ? (
                        <CircleNotch className="w-5 h-5 animate-spin" />
                      ) : (
                        <Crosshair className="w-6 h-6 group-hover/loc:rotate-90 transition-transform duration-500" weight="bold" />
                      )}
                    </button>
                  </div>

                  <button 
                    onClick={nextQuestion} 
                    disabled={!preferences.zipCode}
                    className="btn-marquis-premium w-full py-5 rounded-2xl text-xl font-black italic uppercase shadow-xl transition-all"
                  >
                    Confirm Location
                  </button>
                </div>
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
      <div className="flex flex-col h-full relative overflow-hidden animate-slick-reveal">
        {/* Sharp High-End Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-100 opacity-90"
          style={{ backgroundImage: "url('/mcp/demo/assets/epic_beauty.jpg')" }}
        />
        <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-[1px]" />
        
        <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10 relative z-10 text-center">
           <div className="bg-slate-900/40 backdrop-blur-2xl w-full max-w-3xl rounded-[40px] p-8 md:p-14 flex flex-col items-center space-y-10 shadow-[0_30px_100px_rgba(0,0,0,0.6)] border border-white/5">
              
              {/* Stylish Sparkle Icon Replacement */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-marquis-blue/20 rounded-full flex items-center justify-center border border-marquis-blue/30 shadow-[0_0_40px_rgba(48,103,151,0.4)] animate-pulse">
                <Sparkle weight="duotone" className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>

              <div className="space-y-4">
                 <h2 className="text-2xl md:text-3xl font-black uppercase text-white tracking-[0.15em] leading-tight">
                    Precision Picks <span className="text-marquis-blue drop-shadow-[0_0_15px_rgba(48,103,151,0.5)]">for Your Life Style.</span>
                 </h2>
              </div>

              {/* Short-Text Preference Confirmation Boxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-2xl px-4">
                 {[
                   { id: 'capacity', label: 'Capacity', mapping: (v: string) => `${v} Adults` },
                   { id: 'aesthetic', label: 'Theme', mapping: (v: string) => ({ modern: 'Modern', rustic: 'Rustic', tropical: 'Tropical', classic: 'Classic' }[v] || v) },
                   { id: 'budget', label: 'Tier', mapping: (v: string) => ({ entry: 'Entry', mid: 'Mid-Level', premium: 'Premium', luxury: 'Luxury' }[v] || v) },
                   { id: 'primaryPurpose', label: 'Focus', mapping: (v: string) => ({ therapy: 'Therapy', recreational: 'Social', relaxation: 'Relax' }[v] || v) }
                 ].map((box) => {
                   const val = preferences[box.id as keyof UserPreferences];
                   if (!val) return null;
                   const shortLabel = box.mapping(val);
                   return (
                     <div key={box.id} className="bg-[#1e293b]/60 backdrop-blur-md border border-white/10 rounded-2xl p-3 md:p-4 text-left shadow-lg">
                        <div className="text-[8px] md:text-[9px] font-black uppercase text-marquis-blue tracking-[0.2em] mb-1">{box.label}</div>
                        <div className="text-white font-black text-[10px] md:text-xs uppercase italic truncate">
                          {shortLabel}
                        </div>
                     </div>
                   );
                 })}
              </div>
              
              {loading ? (
                <div className="w-full flex flex-col items-center">
                   {/* Percentage */}
                   <div className="text-4xl md:text-5xl font-black italic uppercase text-white tracking-tighter mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                      {progress}<span className="text-xl ml-1 text-marquis-blue font-black">%</span>
                   </div>

                   <div className="w-full max-w-md h-2 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/10">
                      <div 
                        className="h-full bg-marquis-blue shadow-[0_0_20px_rgba(48,103,151,0.8)] transition-all duration-300 ease-out" 
                        style={{ width: `${progress}%` }}
                      />
                   </div>

                   {/* Standard White Status Message */}
                   <div className="text-xs md:text-sm font-medium text-white min-h-[1.5em] tracking-wide">
                     {loadingMessage}
                   </div>
                </div>
              ) : (
                <button 
                  onClick={handleRecommend} 
                  disabled={loading} 
                  className="btn-marquis-premium px-20 py-6 rounded-2xl text-2xl font-black italic uppercase shadow-[0_20px_40px_rgba(48,103,151,0.4)] hover:scale-105 active:scale-95 transition-all"
                >
                  Find my match!
                </button>
              )}
           </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-slick-reveal">
        <div className="bg-gradient-to-r from-marquis-light-blue to-marquis-blue w-full py-6 px-6 text-center shadow-md relative overflow-hidden text-white shrink-0">
          <div className="relative z-10 flex justify-between items-center max-w-5xl mx-auto">
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-black italic uppercase leading-none drop-shadow-sm">Your Personalized Selection</h2>
              <p className="text-sm font-medium text-white/90 mt-1">Meticulously matched based on your 14 expert criteria.</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/20 px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-95 group"
            >
              <Printer className="w-5 h-5 text-white animate-pulse group-hover:animate-none" weight="bold" />
              <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Print / PDF Selection</span>
              <span className="text-xs font-black uppercase tracking-widest sm:hidden">Print</span>
            </button>
          </div>
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

        <ExpertSelectionPass 
          preferences={preferences} 
          results={results || []} 
          currentProduct={results?.[0]?.product ? { ...results[0].product, reasons: results[0].reasons } : null} 
        />
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
        results={results || undefined}
        onBack={() => setStep('results')}
        isLoading={narrativeLoading}
        zip={preferences.zipCode || undefined}
      />
    );
  }

  return null;
}
