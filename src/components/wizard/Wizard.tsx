'use client';

import React, { useState } from 'react';
import { 
  Check, ChevronRight, RotateCcw, Zap, Users, Star, Maximize, UserCheck, 
  MessageSquare, MapPin, Droplets, Heart, Sparkles, ArrowRight, Info, ChevronLeft, Plus,
  Compass, Sun, CloudSun, Sunset, Cloud, Box, Home, TreePine, Activity, Flame, Droplet,
  Waves, Palette, LayoutGrid, Leaf, Settings, Wrench, Battery, BatteryCharging, Gauge,
  Wallet, Landmark, Gem, Hammer, Truck
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
  options: { label: string; value: string; icon?: React.ReactNode; image?: string; tip?: string }[];
}[] = [
  {
    id: 'primaryPurpose',
    question: "What is the primary purpose of your hot tub?",
    subtext: "Your goal determines the jet configuration and flow management system.",
    expertTip: "Therapy-focused models use V-O-L-T™ flow to target deep muscle groups, while social models prioritize open seating and ambient lighting.",
    layout: 'grid',
    options: [
      { value: 'therapy', label: 'Therapy & Healing', image: '/mcp/demo/assets/therapy_premium.png', icon: <Activity className="w-8 h-8" /> },
      { value: 'recreational', label: 'Quality Time', image: '/mcp/demo/assets/recreation_premium.png', icon: <Users className="w-8 h-8" /> },
      { value: 'relaxation', label: 'Relaxation', image: '/mcp/demo/assets/fitness_premium.png', icon: <Heart className="w-8 h-8" /> }
    ]
  },
  {
    id: 'capacity',
    question: "What seating capacity do you need?",
    subtext: "From intimate retreats to ultimate entertainment hubs.",
    expertTip: "A 4-5 person tub is our most popular for families, but 6+ models provide the 'Ultimate Entertainment' experience.",
    layout: 'grid',
    options: [
      { value: '2-3', label: '2-3 Adults', icon: <Users className="w-8 h-8 opacity-60" /> },
      { value: '4-5', label: '4-5 Adults', icon: <Users className="w-8 h-8 opacity-80" /> },
      { value: '6+', label: '6+ Adults', icon: <Users className="w-8 h-8 opacity-100" /> }
    ]
  },
  {
    id: 'lounge',
    question: "Do you prefer a lounge seat?",
    subtext: "A reclined seat for full-body immersion.",
    expertTip: "Loungers are incredible for full-body therapy, but they take up the space of about two upright seats. Consider if you prioritize 'me-time' or 'we-time'.",
    layout: 'split',
    options: [
      { value: 'yes', label: 'Yes, I want to lounge', tip: "Best for solitary relaxation.", icon: <Maximize className="w-6 h-6" /> },
      { value: 'no', label: 'No, more open seating', tip: "Best for social gatherings.", icon: <Users className="w-6 h-6" /> },
      { value: 'no-pref', label: 'No preference', tip: "I'm open to both.", icon: <Star className="w-6 h-6" /> }
    ]
  },
  {
    id: 'electrical',
    question: "What is your electrical setup?",
    subtext: "110V (Plug-and-Play) vs 240V (Dedicated Circuit).",
    expertTip: "240V systems allow the heater and pumps to run at full speed simultaneously—crucial for cold climates and intense therapy.",
    layout: 'split',
    options: [
      { value: '110v', label: '110V Plug Play', tip: "Easy install, standard outlet.", icon: <Battery className="w-6 h-6" /> },
      { value: '240v', label: '240V Hardwired', tip: "Maximum performance and heat.", icon: <BatteryCharging className="w-6 h-6" /> },
      { value: 'help', label: 'Help me decide', tip: "We'll recommend based on usage.", icon: <Info className="w-6 h-6" /> }
    ]
  },
  {
    id: 'zipCode',
    question: "Where will your oasis be located?",
    subtext: "Your climate and elevation affect heating efficiency.",
    expertTip: "High-altitude and colder regions require our MaximizR™ full-foam insulation to maintain consistent 104°F temperatures efficiently.",
    layout: 'map',
    options: []
  },
  {
    id: 'sunExposure',
    question: "What is the Backyard Orientation?",
    subtext: "Sun exposure affects your cover's lifespan and daily water temps.",
    expertTip: "Direct afternoon sun in the south requires a premium ProLast™ cover to prevent UV degradation and maintain energy efficiency.",
    layout: 'grid',
    options: [
      { value: 'morning', label: 'Morning Sun', icon: <Sun className="w-8 h-8 text-amber-500" /> },
      { value: 'afternoon', label: 'Afternoon Sun', icon: <Sunset className="w-8 h-8 text-orange-500" /> },
      { value: 'direct', label: 'Full Day Direct', icon: <Flame className="w-8 h-8 text-red-500" /> },
      { value: 'shaded', label: 'Predominantly Shaded', icon: <Cloud className="w-8 h-8 text-slate-400" /> }
    ]
  },
  {
    id: 'placement',
    question: "Where will the hot tub be placed?",
    subtext: "Site preparation is key to a lifetime of enjoyment.",
    expertTip: "A 'Ground' placement often requires a concrete pad or EZ-Pad, while a 'Deck' requires structural verification for filled weights (often 3,000+ lbs).",
    layout: 'grid',
    options: [
      { value: 'deck', label: 'Wood/Composite Deck', icon: <Box className="w-8 h-8" /> },
      { value: 'patio', label: 'Concrete/Paver Patio', icon: <MapPin className="w-8 h-8" /> },
      { value: 'indoor', label: 'Indoor/Sunroom', icon: <Home className="w-8 h-8" /> },
      { value: 'ground', label: 'New Ground Site', icon: <TreePine className="w-8 h-8" /> }
    ]
  },
  {
    id: 'physicalFocus',
    question: "Where do you need the most relief?",
    subtext: "Our V-O-L-T™ system targets specific H.O.T. Zones.",
    expertTip: "If you select 'Neck & Shoulders', we'll prioritize seats with specialized collar jets and high-output therapy zones.",
    layout: 'grid',
    options: [
      { value: 'neck-shoulders', label: 'Neck & Shoulders', icon: <Activity className="w-8 h-8" /> },
      { value: 'lower-back', label: 'Lower Back', icon: <Waves className="w-8 h-8" /> },
      { value: 'legs-feet', label: 'Legs & Feet', icon: <Droplet className="w-8 h-8" /> },
      { value: 'full-body', label: 'Full Body', icon: <Heart className="w-8 h-8" /> }
    ]
  },
  {
    id: 'aesthetic',
    question: "What is your aesthetic preference?",
    subtext: "Harmonize your spa with your environment.",
    expertTip: "A 'Modern' look pairs our Durashell® interior with monochrome cabinets, while 'Rustic' highlights earth tones and wood-grain textures.",
    layout: 'grid',
    options: [
      { value: 'modern', label: 'Sleek & Modern', icon: <LayoutGrid className="w-8 h-8 text-slate-800" /> },
      { value: 'rustic', label: 'Warm & Rustic', icon: <Palette className="w-8 h-8 text-amber-700" /> },
      { value: 'tropical', label: 'Island Tropical', icon: <Leaf className="w-8 h-8 text-teal-600" /> },
      { value: 'classic', label: 'Timeless Classic', icon: <Star className="w-8 h-8 text-indigo-700" /> }
    ]
  },
  {
    id: 'maintenance',
    question: "What is your maintenance profile?",
    subtext: "From fully automated to hands-on care.",
    expertTip: "ConstantClean+™ and SmartClean™ technology can automate 90% of water care, so you spend more time soaking and less time testing.",
    layout: 'split',
    options: [
      { value: 'automated', label: 'Set it and Forget it', tip: "Automated sanitization systems.", icon: <Settings className="w-6 h-6" /> },
      { value: 'hands-on', label: 'I enjoy the ritual', tip: "Manual water care.", icon: <Wrench className="w-6 h-6" /> }
    ]
  },
  {
    id: 'intensity',
    question: "Preferred Hydrotherapy Intensity?",
    subtext: "Gentle bubbling vs. deep tissue penetration.",
    expertTip: "HK jets provide 'Deep Tissue' massage, while our Multi-Touch jets offer a 'Relaxing' broader sensation.",
    layout: 'split',
    options: [
      { value: 'gentle', label: 'Gentle Relaxation', tip: "Soothing flow.", icon: <Cloud className="w-6 h-6" /> },
      { value: 'medium', label: 'Medium/Vigorous', tip: "Balanced therapy.", icon: <Waves className="w-6 h-6" /> },
      { value: 'firm', label: 'Firm Deep Tissue', tip: "High impact targeting.", icon: <Gauge className="w-6 h-6" /> }
    ]
  },
  {
    id: 'budget',
    question: "Your Investment Range?",
    subtext: "We have a Marquis for every backyard.",
    expertTip: "While initial cost matters, our Vector21 and Crown Series offer significantly lower long-term energy costs due to high-density insulation.",
    layout: 'grid',
    options: [
      { value: 'entry', label: 'Entry ($5k - $8k)', icon: <Wallet className="w-8 h-8" /> },
      { value: 'mid', label: 'Standard ($9k - $13k)', icon: <Landmark className="w-8 h-8" /> },
      { value: 'premium', label: 'Premium ($14k - $18k)', icon: <Star className="w-8 h-8" /> },
      { value: 'luxury', label: 'Luxury ($19k+)', icon: <Gem className="w-8 h-8" /> }
    ]
  },
  {
    id: 'installationReady',
    question: "Installation Readiness?",
    subtext: "Are you ready to install or just dreaming?",
    expertTip: "Professional site evaluation by a Marquis dealer is crucial before delivery to ensure permanent access and electrical compliance.",
    layout: 'split',
    options: [
      { value: 'ready', label: 'Ready to go', tip: "I have a site and budget.", icon: <Zap className="w-6 h-6" /> },
      { value: 'planning', label: 'Just planning', tip: "Still researching.", icon: <Compass className="w-6 h-6" /> }
    ]
  },
  {
    id: 'deliveryAccess',
    question: "Final Step: Backyard Access?",
    subtext: "Clearance for delivery and final placement.",
    expertTip: "Most tubs need at least 38\" of vertical clearance. If access is tight, we can coordinate specialized dollies or even crane services.",
    layout: 'split',
    options: [
      { value: 'easy', label: 'Wide open access', tip: "Standard truck delivery.", icon: <Truck className="w-6 h-6" /> },
      { value: 'standard', label: 'Standard side gate', tip: "Minimum 38 inch clearance.", icon: <Hammer className="w-6 h-6" /> },
      { value: 'tight', label: 'Tight/Complex paths', tip: "Requires special equipment.", icon: <MapPin className="w-6 h-6" /> }
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
            {q.layout === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {q.options.map((opt, i) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      updatePreference(q.id, opt.value);
                      setTimeout(nextQuestion, 150);
                    }}
                    className={cn(
                      "group relative bg-white rounded-2xl border-2 p-6 text-left transition-all shadow-sm hover:shadow-lg flex flex-col justify-between h-full min-h-[160px]",
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
                    <div>
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
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-marquis-blue" />
                    <div className="flex items-center gap-3 text-marquis-blue mb-4">
                      <Info className="w-6 h-6" />
                      <span className="text-xs font-bold uppercase tracking-widest">Expert Insight</span>
                    </div>
                    <p className="text-lg text-slate-700 font-medium leading-relaxed italic">
                      "{q.expertTip}"
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-7 space-y-4">
                  {q.options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        updatePreference(q.id, opt.value);
                        setTimeout(nextQuestion, 150);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-6 bg-white rounded-2xl border-2 transition-all hover:shadow-md group",
                        preferences[q.id] === opt.value ? "border-marquis-blue bg-blue-50/30 scale-[1.02]" : "border-slate-100/80 hover:border-marquis-blue/40"
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
      <div className="max-w-7xl mx-auto px-6 py-10 animate-slick-reveal">
        <button onClick={() => setStep('results')} className="group text-slate-500 hover:text-marquis-blue flex items-center gap-3 mb-10 font-black text-xs uppercase tracking-widest transition-colors">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to matches
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-slate-100 p-2">
              <img src={heroImg} className="w-full h-[400px] object-cover rounded-[32px]" alt={product.modelName} />
            </div>

            <div className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100">
               <h3 className="text-5xl font-black italic uppercase text-slate-900 mb-2 leading-none">{product.modelName}</h3>
               <div className="text-marquis-blue text-sm font-black uppercase tracking-widest mb-8">Marquis Crown Series</div>
               
               <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Dimensions</div>
                    <div className="text-lg font-black italic uppercase">{product.lengthIn}x{product.widthIn}"</div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Seating</div>
                    <div className="text-lg font-black italic uppercase">{product.seatsMax} Adults</div>
                  </div>
               </div>

               <div className="space-y-4">
                 <button className="btn-marquis-premium w-full py-5 rounded-2xl text-md font-black italic uppercase shadow-xl">Get Local Pricing</button>
                 <button className="w-full bg-white text-marquis-blue border-2 border-marquis-blue px-6 py-5 rounded-2xl text-md font-black italic uppercase hover:bg-marquis-blue/5 transition-all">Find Dealer</button>
               </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            {/* Interactive Feature Map */}
            {product.overheadImageUrl && (
              <section className="bg-white p-6 rounded-[40px] shadow-xl border border-slate-100">
                <h4 className="text-xl font-black italic uppercase text-slate-900 mb-6 px-4">Interactive Feature Map</h4>
                <div className="relative aspect-square md:aspect-video rounded-3xl bg-slate-100 group">
                  <img 
                    src={product.overheadImageUrl} 
                    className="w-full h-full object-contain rounded-3xl" 
                    alt="Overhead View" 
                  />
                  
                  {/* Hotspots */}
                  {product.hotspots && (typeof product.hotspots === 'string' ? JSON.parse(product.hotspots) : product.hotspots).map((spot: any, i: number) => (
                    <div 
                      key={i}
                      className="absolute group/spot transition-all z-20"
                      style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                    >
                      <button className="w-8 h-8 bg-marquis-blue text-white rounded-full flex items-center justify-center shadow-lg hover:scale-125 transition-transform animate-pulse">
                        <Plus className="w-5 h-5" />
                      </button>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none z-30">
                        <div className="text-xs font-black uppercase italic text-marquis-blue mb-1">{spot.title}</div>
                        <p className="text-xs text-slate-300 leading-relaxed">{spot.description}</p>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-slate-900" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest italic animate-pulse">Hover over hotspots to reveal engineering details</p>
              </section>
            )}

            <section className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Star className="w-40 h-40" />
                </div>
                <h2 className="text-4xl font-black italic uppercase text-slate-900 mb-8 flex items-center gap-4">
                  The Marquis Match <Sparkles className="w-8 h-8 text-marquis-blue" />
                </h2>
                <div className="space-y-8 relative z-10">
                  <p className="text-xl text-slate-600 leading-relaxed font-black uppercase italic italic opacity-70">
                    "{product.marketingSummary}"
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reasons.slice(0, 4).map((r, i) => (
                      <div key={i} className="flex gap-4 items-start bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50 transition-all hover:scale-102">
                        <div className="bg-marquis-blue text-white rounded-full p-2 flex-shrink-0">
                          <Check className="w-4 h-4" />
                        </div>
                        <p className="text-sm text-slate-700 font-bold leading-relaxed">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>
            </section>

            <section className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-marquis-blue/20 to-transparent" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                     <h4 className="text-2xl font-black italic uppercase text-marquis-blue">Expert Insight</h4>
                     <p className="text-slate-400 leading-relaxed">Based on your {preferences.zipCode} location, we recommend the MaximizR™ insulation package to maintain peak efficiency during cold night cycles.</p>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-2xl font-black italic uppercase text-marquis-green">Placement Note</h4>
                     <p className="text-slate-400 leading-relaxed">For your {preferences.placement} installation, ensure a load-bearing capacity of at least 150 lbs/sqft to accommodate the filled weight of the {product.modelName}.</p>
                  </div>
                </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
