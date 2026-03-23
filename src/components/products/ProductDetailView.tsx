'use client';

import React, { useState } from 'react';
import { 
  Check, ChevronLeft, Zap, Users, Heart, Maximize, Star, BookOpen, Scale,
  MessageSquare, MapPin, Waves, Palette, Settings, BatteryCharging, 
  Box, Thermometer, Plus, Sparkles, Send, Loader2, CheckCircle2, ChevronRight, Info,
  Activity, ArrowRight
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';
import { AESTHETIC_MAPPINGS, getAestheticTitle } from '@/lib/brands/aesthetics';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- SUB-COMPONENTS ---

interface ColorExplorerProps {
  product: any;
  preferences?: any;
}

function ColorExplorer({ product, preferences: initialPreferences }: ColorExplorerProps) {
  const [showAllColors, setShowAllColors] = useState(false);
  const [persistedPreferences, setPersistedPreferences] = useState<any>(null);

  // Sync preferences with localStorage for deep linking/direct page loads
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (initialPreferences) {
        localStorage.setItem('marquis_user_preferences', JSON.stringify(initialPreferences));
        setPersistedPreferences(initialPreferences);
      } else {
        const stored = localStorage.getItem('marquis_user_preferences');
        if (stored) {
          try {
            setPersistedPreferences(JSON.parse(stored));
          } catch (e) {
            console.error("Failed to parse preferences", e);
          }
        }
      }
    }
  }, [initialPreferences]);

  const preferences = initialPreferences || persistedPreferences;

  if (!product.shellColors && !product.cabinetColors) return null;

  const shellColors = Array.isArray(product.shellColors) ? product.shellColors : [];
  const cabinetColors = Array.isArray(product.cabinetColors) ? product.cabinetColors : [];
  
  const seriesName = product.seriesName || product.series?.name || '';
  const seriesKey = seriesName.toLowerCase().includes('crown') ? 'crown' : 
                   (seriesName.toLowerCase().includes('vector') ? 'vector' : 
                   (seriesName.toLowerCase().includes('celebrity') ? 'celebrity' : null));
  const aestheticKey = preferences?.aesthetic;
  
  const suggested = seriesKey && aestheticKey ? AESTHETIC_MAPPINGS[seriesKey]?.[aestheticKey] : null;

  const suggestedShell = suggested ? shellColors.filter((c: string) => suggested.shell.includes(c)) : [];
  const otherShell = suggested ? shellColors.filter((c: string) => !suggested.shell.includes(c)) : shellColors;
  
  const suggestedCabinet = suggested ? cabinetColors.filter((c: string) => suggested.cabinet.includes(c)) : [];
  const otherCabinet = suggested ? cabinetColors.filter((c: string) => !suggested.cabinet.includes(c)) : cabinetColors;

  return (
    <div className="mt-8 border-t border-slate-100 pt-8">
       <div className="flex items-center justify-between mb-4">
         <div className="text-[10px] font-black text-marquis-blue uppercase tracking-widest flex items-center gap-2">
           <Palette className="w-3 h-3" />
           Curated Finishes
         </div>
         {suggested && (
           <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
             <Sparkles className="w-3 h-3" />
             Suggested for {getAestheticTitle(aestheticKey)}
           </div>
         )}
       </div>

       <div className="space-y-6">
         {/* Suggested Section */}
         {suggested && (suggestedShell.length > 0 || suggestedCabinet.length > 0) && (
           <div className="space-y-4">
             <div className="flex flex-wrap gap-2">
               {suggestedShell.map((color: string, i: number) => (
                 <div key={`s-shell-${i}`} className="group relative px-4 py-2 bg-white border-2 border-emerald-200 rounded-2xl text-[11px] font-black text-slate-800 uppercase shadow-sm hover:border-emerald-400 transition-all cursor-default">
                   <span className="relative z-10">{color}</span>
                   <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                     <Check className="w-2 h-2 text-white" />
                   </div>
                 </div>
               ))}
               {suggestedCabinet.map((color: string, i: number) => (
                 <div key={`s-cab-${i}`} className="group relative px-4 py-2 bg-slate-50 border-2 border-emerald-200 rounded-2xl text-[11px] font-black text-slate-800 uppercase shadow-sm hover:border-emerald-400 transition-all cursor-default">
                   <span className="relative z-10">{color}</span>
                   <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                     <Check className="w-2 h-2 text-white" />
                   </div>
                 </div>
               ))}
             </div>
             
             {!showAllColors && (
               <button 
                 onClick={() => setShowAllColors(true)}
                 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-marquis-blue transition-colors group/link"
               >
                 Explore all color options <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
               </button>
             )}
           </div>
         )}

         {/* All Options Section (Visible if not suggested or if showAllColors is true) */}
         {(showAllColors || !suggested) && (
           <div className="animate-in fade-in slide-in-from-top-2 duration-500">
             {suggested && <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">All available finishes</div>}
             <div className="flex flex-wrap gap-2">
               {otherShell.map((color: string, i: number) => (
                 <div key={`o-shell-${i}`} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase">{color}</div>
               ))}
               {otherCabinet.map((color: string, i: number) => (
                 <div key={`o-cab-${i}`} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase italic">{color}</div>
               ))}
             </div>
             {showAllColors && (
                <button 
                onClick={() => setShowAllColors(false)}
                className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 hover:text-marquis-blue transition-colors"
              >
                Show suggested only
              </button>
             )}
           </div>
         )}
       </div>
    </div>
  );
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

export interface Product {
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
  seriesName?: string;
  positioningTier?: string;
  score?: number;
  estimatedMsrp?: number;
  staticHeroTitle?: string;
  staticHydrotherapy?: string;
  staticClimate?: string;
  staticDesign?: string;
  staticEfficiency?: string;
  staticDesignConsideration?: string;
  staticReasons?: string[] | string;
}

export interface ScoredProduct {
  product: Product;
  score: number;
  reasons: string[];
  matchStrategy?: string;
  naturalNarrative?: string;
  designConsiderations?: string;
}

export interface ProductDetailViewProps {
  product: Product;
  mode: 'static' | 'influenced';
  aiNarrative?: any;
  reasons?: string[];
  preferences?: any;
  onBack?: () => void;
  isLoading?: boolean;
}

export default function ProductDetailView({ 
  product, 
  mode, 
  aiNarrative, 
  reasons, 
  preferences, 
  onBack,
  isLoading = false 
}: ProductDetailViewProps) {
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

  const getHeroImage = () => {
    // If we have a specific heroImageUrl that isn't the generic fallback, use it
    if (product.heroImageUrl && 
        !product.heroImageUrl.includes('therapy_premium.png') && 
        !product.heroImageUrl.includes('placeholder')) {
      return product.heroImageUrl;
    }

    // Fallback to slug-based conventions if the DB value is missing or generic
    if (product.slug) {
      const isCrown = product.slug.includes('crown');
      const isJpgVector = product.slug.includes('v65l') || product.slug.includes('v77l');
      const ext = (isCrown || isJpgVector) ? 'jpg' : 'png';
      return `/mcp/demo/assets/products/${product.slug}/hero.${ext}`;
    }
    return product.heroImageUrl || '/mcp/demo/assets/therapy_premium.png';
  };

  const heroImg = getHeroImage();
  const displayReasons = mode === 'influenced' ? (reasons || []) : (product.staticReasons ? (typeof product.staticReasons === 'string' ? JSON.parse(product.staticReasons) : product.staticReasons) : []);
  
  const displayNarrative = {
    heroTitle: mode === 'influenced' ? (aiNarrative?.heroTitle || product.modelName) : (product.staticHeroTitle || product.modelName),
    hydrotherapy: mode === 'influenced' ? aiNarrative?.hydrotherapy : product.staticHydrotherapy,
    climate: mode === 'influenced' ? aiNarrative?.climate : product.staticClimate,
    design: mode === 'influenced' ? aiNarrative?.design : product.staticDesign,
    efficiency: mode === 'influenced' ? aiNarrative?.efficiency : product.staticEfficiency,
    designConsideration: mode === 'influenced' ? aiNarrative?.designConsideration : product.staticDesignConsideration
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-slick-reveal">
       {/* TOP ACTIONS */}
       <div className="flex justify-between items-center mb-6">
          {onBack && (
            <button onClick={onBack} className="text-slate-500 hover:text-marquis-blue flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-colors">
              <ChevronLeft className="w-4 h-4" /> {mode === 'influenced' ? 'Back to Selection' : 'Back'}
            </button>
          )}
          {!onBack && (
               <a href="/mcp/demo/products" className="text-slate-500 hover:text-marquis-blue flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-colors">
               <ChevronLeft className="w-4 h-4" /> Back to Catalog
             </a>
          )}
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
                  {product.series?.name || product.seriesName || 'Marquis'} {product.positioningTier ? `| ${product.positioningTier.charAt(0).toUpperCase() + product.positioningTier.slice(1)}` : ''}
                </div>
                <h3 className="text-5xl md:text-6xl font-black italic uppercase text-white leading-none drop-shadow-lg">{product.modelName}</h3>
             </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
             <h2 className="text-2xl md:text-3xl font-black italic uppercase text-slate-800 tracking-tight flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                {isLoading ? "Expert Analysis..." : displayNarrative.heroTitle} 
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
             {displayNarrative.designConsideration && (
                <div className="mb-8 bg-amber-50/30 p-6 rounded-2xl border border-amber-100/50">
                   <div className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-2">
                     <Info className="w-3 h-3" />
                     {mode === 'influenced' ? 'Design Consideration' : 'Engineering Tip'}
                   </div>
                   <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                     {displayNarrative.designConsideration}
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
                
                <div className="text-xs font-black text-marquis-blue uppercase tracking-widest mb-3 border-t border-blue-100 pt-4">
                  {mode === 'influenced' ? 'Expert Reasoning' : 'Key Features'}
                </div>
                {displayReasons.slice(0, 4).map((r: string, i: number) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="bg-marquis-blue text-white rounded-full p-1 mt-0.5"><Check className="w-3 h-3" /></div>
                    <p className="text-sm text-slate-700 font-semibold leading-snug">{r}</p>
                  </div>
                ))}
             </div>
             {/* COLOR EXPLORER */}
             <ColorExplorer product={product} preferences={preferences} />
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
             <h4 className="text-2xl font-black italic uppercase text-slate-800">
               {mode === 'influenced' ? 'AI Synthesized Blueprint' : 'Engineering Specifications'}
             </h4>
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
                   {isLoading ? (
                     <div className="space-y-3 animate-pulse pt-1">
                       <div className="h-3 bg-slate-200/60 rounded w-full"></div>
                       <div className="h-3 bg-slate-200/60 rounded w-5/6"></div>
                       <div className="h-3 bg-slate-200/60 rounded w-4/6"></div>
                     </div>
                   ) : (aiNarrative as any)?.error ? (
                     <div className="text-red-500 text-sm font-medium">Generation Failed: {(aiNarrative as any).error}</div>
                   ) : (
                     <div className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold prose prose-slate" dangerouslySetInnerHTML={{ __html: (displayNarrative as any)?.[mod.id] || "Synthesizing your personalized profile..." }} />
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
                      {product.series?.name || product.seriesName || 'Marquis'}
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
          <p className="text-slate-300 mb-10 max-w-xl mx-auto font-medium text-base md:text-lg relative z-10">Lock in your {mode === 'influenced' ? 'personalized blueprint' : 'official'} {product.modelName} spec sheet by contacting an Authorized Marquis Dealer.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
             <button className="bg-white text-marquis-blue px-10 py-5 rounded-2xl text-sm md:text-base font-black italic uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">Find Nearest Dealer</button>
             <button className="bg-marquis-blue border-2 border-marquis-blue text-white px-10 py-5 rounded-2xl text-sm md:text-base font-black italic uppercase shadow-xl hover:bg-transparent transition-all">Get Local Pricing</button>
          </div>
       </div>
    </div>
  );
}
