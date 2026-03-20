'use client';

import React, { useState } from 'react';
import { Check, ChevronRight, RotateCcw, Zap, Users, Star, Maximize, UserCheck, MessageSquare, MapPin, Droplets, Heart, Sparkles, ArrowRight } from 'lucide-react';

type Priority = 'fitness' | 'therapy' | 'recreational';
type Seating = '2+' | '4+' | '6+';

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
}

interface ScoredProduct {
  product: Product;
  score: number;
  reasons: string[];
}

export default function Wizard() {
  const [step, setStep] = useState<'intro' | 'usage' | 'seating' | 'results' | 'details'>('intro');
  const [priority, setPriority] = useState<Priority | null>(null);
  const [seating, setSeating] = useState<Seating | null>(null);
  const [results, setResults] = useState<ScoredProduct[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<ScoredProduct | null>(null);

  const handleRecommend = async (overrideSeating?: Seating) => {
    const activeSeating = overrideSeating || seating;
    setLoading(true);
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preferences: {
            priority,
            seatingNeeds: activeSeating === '2+' ? 2 : activeSeating === '4+' ? 4 : 6,
          }
        }),
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
    if (modelCode.includes('V150')) return '/assets/v150_hero.png';
    if (modelCode.includes('V174')) return '/assets/v174_hero.png';
    return null;
  };

  const StepHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="bg-gradient-to-r from-marquis-light-blue to-marquis-blue w-full py-6 px-6 text-center shadow-md relative overflow-hidden text-white">
      <div className="relative z-10 space-y-1">
        <h3 className="text-xs font-bold tracking-[0.2em] text-white/70 uppercase">The Ultimate Hot Tub Experience®</h3>
        <h2 className="text-xl md:text-2xl font-black italic uppercase leading-none drop-shadow-sm">{title}</h2>
        {subtitle && <p className="text-sm font-medium text-white/90 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  if (step === 'intro') {
    return (
      <div className="flex flex-col h-full bg-[url('/assets/intro_bg.png')] bg-cover bg-center relative overflow-hidden animate-slick-reveal">
         <div className="absolute inset-0 bg-slate-900/50" />
         <div className="p-8 pb-16 md:p-16 flex flex-col items-center justify-center text-center relative z-10 flex-grow min-h-[500px]">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black italic uppercase text-white mb-6 leading-[1.1] drop-shadow-xl max-w-2xl">
               Find the perfect <br /> <span className="text-marquis-blue drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">hot tub for you.</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-xl mb-10 font-medium drop-shadow-md">
               "Create the ultimate relaxation oasis in your own backyard with meticulous refinement and obsessive attention to detail."
            </p>
            <button 
              onClick={() => setStep('usage')}
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

  if (step === 'usage') {
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-slick-reveal">
        <StepHeader title="What is the primary purpose of your hot tub?" />
        
        <div className="p-6 md:p-10 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { id: 'therapy', title: 'THERAPY & HEALING', desc: 'Meticulous hydrotherapy and orthopedic recovery powered by V-O-L-T™ flow management.', icon: <Heart className="w-6 h-6" />, img: '/assets/therapy_premium.png' },
              { id: 'recreational', title: 'QUALITY TIME', desc: 'Extraordinary social environments designed for family connection and refined leisure.', icon: <Users className="w-6 h-6" />, img: '/assets/recreation_premium.png' },
              { id: 'fitness', title: 'RELAXATION', desc: 'Create your ultimate oasis for stress relief and world-class quietude.', icon: <Sparkles className="w-6 h-6" />, img: '/assets/fitness_premium.png' }
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setPriority(item.id as Priority);
                  setTimeout(() => setStep('seating'), 400); // Auto-advance with slight delay for visual feedback
                }}
                className={`bg-white rounded-2xl overflow-hidden group flex flex-col text-left border-2 transition-all shadow-sm hover:shadow-md ${
                  priority === item.id ? 'border-marquis-blue' : 'border-transparent'
                } stagger-${i+1}`}
              >
                <div className="w-full h-48 overflow-hidden relative">
                   <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90" />
                   
                   {priority === item.id && (
                     <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-marquis-blue flex items-center justify-center text-white shadow-lg animate-in zoom-in-50">
                        <Check className="w-5 h-5" />
                     </div>
                   )}

                   <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        {item.icon}
                        <h3 className="text-lg font-black uppercase italic leading-none">{item.title}</h3>
                      </div>
                   </div>
                </div>
                <div className="p-5 flex-grow bg-white">
                  <p className="text-slate-600 text-sm leading-relaxed">"{item.desc}"</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'seating') {
    const capacities = [
       { id: '2+', title: 'Intimate Retreat', desc: '2-3 Adults', img: '/assets/therapy_premium.png' },
       { id: '4+', title: 'Family Focus', desc: '4-5 Adults', img: '/assets/recreation_premium.png' },
       { id: '6+', title: 'Ultimate Entertainment', desc: '6+ Adults', img: '/assets/fitness_premium.png' }
    ];

    return (
      <div className="flex flex-col h-full bg-slate-50 animate-slick-reveal">
        <StepHeader title="What size hot tub are you looking for?" subtitle="Select the capacity that perfectly fits your space and lifestyle." />
        
        <div className="p-6 md:p-10 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {capacities.map((cap, i) => (
              <button
                key={cap.id}
                onClick={() => {
                  setSeating(cap.id as Seating);
                  handleRecommend(cap.id as Seating); // Auto-advance
                }}
                className={`relative bg-slate-200 rounded-2xl overflow-hidden text-center border-4 group transition-all shadow-md group ${
                  seating === cap.id ? 'border-marquis-blue shadow-marquis-blue/20' : 'border-transparent hover:border-marquis-blue/30'
                } stagger-${i+1}`}
              >
                <div className="w-full h-40 md:h-56 relative opacity-80 group-hover:opacity-100 transition-opacity">
                    <img src={cap.img} className="w-full h-full object-cover" alt={cap.title} />
                    <div className="absolute inset-0 bg-slate-900/60" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white z-10 point-events-none">
                    {seating === cap.id && (
                        <div className="absolute top-4 right-4 bg-marquis-blue w-8 h-8 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                    )}
                    <h3 className="text-2xl font-black italic uppercase text-white drop-shadow-md mb-2">{cap.title}</h3>
                    <div className="text-sm font-bold text-white/90 bg-black/40 px-4 py-1 rounded-full">{cap.desc}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <button onClick={() => setStep('usage')} className="group px-6 py-3 text-sm font-semibold text-slate-500 hover:text-marquis-blue transition-colors flex items-center gap-2">
              <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Purpose
            </button>
            {loading && (
              <div className="ml-4 flex items-center gap-3 text-marquis-blue font-bold text-sm animate-pulse">
                Analyzing Selections...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="flex flex-col h-full bg-slate-50 animate-slick-reveal">
        <StepHeader title="Your Personalized Selection" subtitle="Meticulously matched based on your purpose and capacity needs." />
        
        <div className="p-6 md:p-10">
           <div className="flex justify-between items-end mb-8 border-b-2 border-slate-200 pb-4 max-w-5xl mx-auto">
              <div className="space-y-1">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Criteria:</h2>
                <div className="flex gap-2 text-sm font-semibold text-slate-700">
                  <span className="bg-marquis-blue/10 text-marquis-blue px-3 py-1 rounded-md">{priority?.replace('recreational', 'Quality Time').replace('therapy', 'Therapy').replace('fitness', 'Relaxation').toUpperCase()}</span>
                  <span className="bg-white px-3 py-1 rounded-md border border-slate-200">{seating} Adults</span>
                </div>
              </div>
              <button 
                onClick={() => { setStep('intro'); setPriority(null); setSeating(null); }}
                className="group flex items-center gap-2 text-xs font-bold uppercase text-slate-500 hover:text-marquis-blue transition-colors px-4 py-2 bg-white rounded-md border border-slate-200"
              >
                <RotateCcw className="w-3 h-3 group-hover:-rotate-90 transition-transform" /> Start Over
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
             {results && results.slice(0, 2).map((res, i) => {
               const heroImg = getHeroImage(res.product.modelName);
               return (
                 <div key={res.product.id} className={`bg-white rounded-2xl overflow-hidden shadow-md flex flex-col border border-slate-100 ${i === 0 ? 'ring-2 ring-marquis-blue shadow-lg shadow-marquis-blue/10' : ''} animate-in fade-in slide-in-from-bottom duration-700`}>
                   
                   <div className="w-full h-56 relative bg-slate-100 overflow-hidden group">
                      {heroImg ? <img src={heroImg} className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" alt={res.product.modelName} /> : <div className="w-full h-full flex items-center justify-center font-black italic text-slate-300 text-3xl">MARQUIS</div>}
                      {i === 0 && (
                          <div className="absolute top-4 left-4 bg-marquis-blue px-4 py-1.5 rounded-full text-xs font-bold uppercase text-white shadow-md">Best Match</div>
                      )}
                      
                      {/* Compact Quick Stats overlaid on image shadow */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 flex justify-between text-white pb-3 pt-12">
                         <div className="text-xs font-semibold flex items-center gap-1"><Maximize className="w-3 h-3"/> {res.product.lengthIn}" Long</div>
                         <div className="text-xs font-semibold flex items-center gap-1"><Zap className="w-3 h-3"/> {res.product.jetCount} Jets</div>
                         <div className="text-xs font-semibold flex items-center gap-1"><Users className="w-3 h-3"/> {res.product.seatsMax} Seats</div>
                      </div>
                   </div>
                   
                   <div className="p-6 flex flex-col flex-grow">
                      <div className="mb-4">
                          <h3 className="text-2xl font-black italic uppercase text-slate-800 leading-none mb-1">{res.product.modelName}</h3>
                          <div className="text-marquis-blue text-xs font-bold uppercase tracking-wider">Vector21 Series</div>
                      </div>
                      
                      <p className="text-sm text-slate-600 mb-6 flex-grow line-clamp-3">"{res.product.marketingSummary}"</p>

                      <button 
                        onClick={() => { setSelectedResult(res); setStep('details'); window.scrollTo(0,0); }}
                        className="btn-marquis-premium w-full py-3 text-sm rounded-lg font-semibold"
                      >
                        Explore Details
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
      <div className="max-w-6xl mx-auto px-6 py-10 animate-slick-reveal bg-white rounded-3xl">
        <button onClick={() => setStep('results')} className="group text-slate-500 hover:text-marquis-blue flex items-center gap-2 mb-8 font-bold text-xs uppercase tracking-wider transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Visual & Key Action (Left Side on Desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-100 bg-slate-50">
              {heroImg ? <img src={heroImg} className="w-full h-[300px] object-cover" alt={product.modelName} /> : <div className="w-full h-[300px] flex items-center justify-center font-black italic text-slate-300 text-5xl">MARQUIS</div>}
            </div>
            
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
               <h3 className="text-3xl font-black italic uppercase text-slate-800 mb-2 leading-none">{product.modelName}</h3>
               <div className="text-marquis-blue text-sm font-bold uppercase mb-4">Vector21 Series</div>
               
               <div className="flex flex-wrap gap-2 mb-6">
                 {product.usageTags.map(tag => (
                    <span key={tag} className="bg-white border border-slate-200 px-3 py-1 rounded-md text-xs font-bold text-slate-600">
                       {tag.replace('therapy', 'Therapy').replace('fitness', 'Fitness').replace('recreational', 'Recreation')}
                    </span>
                 ))}
               </div>
               
               <div className="space-y-3">
                 <button className="w-full btn-marquis-premium py-3 rounded-lg text-sm shadow-md">
                   Get Local Pricing
                 </button>
                 <button className="w-full bg-white text-marquis-blue border border-marquis-blue/30 hover:border-marquis-blue hover:bg-blue-50 py-3 rounded-lg text-sm font-bold transition-all shadow-sm">
                   Find a Showroom Showroom
                 </button>
               </div>
            </div>
            
            {/* Quick Specs table instead of massive cards */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h4 className="text-sm font-bold text-slate-800 uppercase mb-4 border-b border-slate-100 pb-2">At a Glance</h4>
                <ul className="space-y-3 text-sm">
                    <li className="flex justify-between"><span className="text-slate-500">Dimensions</span> <span className="font-semibold text-slate-800">{product.lengthIn}" L x {product.widthIn}" W</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">Depth</span> <span className="font-semibold text-slate-800">{product.depthIn}"</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">Capacity</span> <span className="font-semibold text-slate-800">{product.seatsMin}-{product.seatsMax} Adults</span></li>
                    <li className="flex justify-between"><span className="text-slate-500">Velocity Jets</span> <span className="font-semibold text-slate-800">{product.jetCount} Injectors</span></li>
                </ul>
            </div>
          </div>

          {/* Educational Content & Marketing Narrative (Right Side on Desktop) */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white">
                <h2 className="text-2xl md:text-3xl font-black italic uppercase text-slate-800 mb-4 pb-2 border-b border-slate-100">
                   The Marquis Experience
                </h2>
                <div className="mb-8">
                   <p className="text-slate-600 text-base leading-relaxed font-medium italic mb-6">
                     "{product.marketingSummary}"
                   </p>
                   
                   <h3 className="text-sm font-bold uppercase text-marquis-green mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Why this model fits you perfectly
                   </h3>
                   <ul className="space-y-4">
                     {reasons.map((r, i) => (
                       <li key={i} className="flex gap-4 items-start bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                         <div className="mt-1 flex-shrink-0 text-marquis-blue">
                            <Check className="w-5 h-5" />
                         </div>
                         <p className="text-sm text-slate-700 font-medium leading-relaxed">{r}</p>
                       </li>
                     ))}
                   </ul>
                </div>
            </section>
            
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-marquis-blue/5 border border-marquis-blue/10 p-6 rounded-2xl">
                    <h4 className="text-lg font-black italic text-marquis-blue mb-2 flex items-center gap-2">
                       <Zap className="w-5 h-5"/> V-O-L-T™ Flow
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                       Our patented Vector-Optimized Laminar Therapy system delivers up to 40% more flow volume to specific zones without increasing pump size, providing deep, restorative muscle massage precisely where you need it.
                    </p>
                </div>
                
                <div className="bg-marquis-green/5 border border-marquis-green/10 p-6 rounded-2xl">
                    <h4 className="text-lg font-black italic text-marquis-green mb-2 flex items-center gap-2">
                       <Maximize className="w-5 h-5"/> Meticulous Space
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                       Designed with ergonomic precision. Every curve and seat depth in the {product.modelName} is calibrated to keep you naturally buoyant yet firmly anchored during high-intensity hydrotherapy sessions.
                    </p>
                </div>
            </section>
            
            <section className="bg-slate-100 p-6 orounded-2xl border border-slate-200 mt-8 rounded-2xl">
                <h4 className="text-md font-bold text-slate-800 mb-2">Showroom Checklist</h4>
                <p className="text-xs text-slate-500 mb-4">Print this or take a screenshot to discuss with your local Marquis dealer.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-marquis-blue"></div> Test V-O-L-T™ valve controls</div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-marquis-blue"></div> View shell color finishes</div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-marquis-blue"></div> Confirm site preparation</div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-medium"><div className="w-1.5 h-1.5 rounded-full bg-marquis-blue"></div> Discuss electrical requirements</div>
                </div>
            </section>

          </div>
        </div>
      </div>
    );
  }

  return null;
}
