'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Check, Users, Lightning, Waves, Package, Thermometer, 
  BatteryCharging, CornersOut, Sparkle, MapPin, 
  ChatTeardropDots, Info as PhosphorInfo, SealCheck
} from '@phosphor-icons/react';

interface ExpertSelectionPassProps {
  preferences: any;
  results: any[];
  currentProduct?: any;
}

export default function ExpertSelectionPass({ preferences, results, currentProduct }: ExpertSelectionPassProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Extract variables for the template with robust fallbacks
  const zip = preferences?.zipCode || '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://demos.metamend.ca/mcp/demo/dealer-locator?zip=${encodeURIComponent(zip)}`;

  // Safe spec extraction
  const getSpec = (val: any, fallback: string = '--') => (val !== null && val !== undefined) ? val : fallback;

  // Dynamic Consultation Questions Logic
  const getConsultationQuestions = () => {
    const questions = [];
    const goal = preferences?.primaryPurpose;
    const model = currentProduct?.modelName || 'this model';
    const series = currentProduct?.seriesName || currentProduct?.series?.name || '';

    // 1. Goal-Specific Question
    if (goal === 'therapy' || goal === 'athletes') {
      questions.push({
        q: `How do the H.O.T. Zone jets in the ${model} specifically target deep-tissue recovery?`,
        reason: "Ensures the hydrotherapy configuration matches your physical wellness objectives."
      });
    } else if (goal === 'exercise') {
      questions.push({
        q: `What is the optimal swim-current setting for the ${model} during high-intensity intervals?`,
        reason: "Validates the performance envelope for your specific fitness level."
      });
    } else {
      questions.push({
        q: `Can you show me how the ConstantClean™ system manages water clarity for high-use sessions?`,
        reason: "Important for maintaining pristine water with minimal owner intervention."
      });
    }

    // 2. Preference-Specific Question (Lounge/Space)
    if (preferences?.lounge === 'yes') {
      questions.push({
        q: `Why is the Adirondack Chair's ergonomics in the ${model} superior for full-body support?`,
        reason: "Confirms the long-term comfort of your preferred lounge configuration."
      });
    } else {
      questions.push({
        q: `How does the open-seating blueprint of the ${model} facilitate better conversation flow?`,
        reason: "Ensures the social layout meets your entertaining requirements."
      });
    }

    // 3. Series-Specific Technical Question
    if (series.includes('Crown')) {
      questions.push({
        q: "What are the specific longevity benefits of the DuraShell® structure in this series?",
        reason: "Focuses on the high-end build quality and lifetime value of the Crown series."
      });
    } else if (series.includes('Vector')) {
      questions.push({
        q: "Can we walk through the V3 Throttle Control and how it directs pump power?",
        reason: "The key to mastering the precise kinetic control of Vector-Optimized Therapy."
      });
    } else {
      questions.push({
        q: `What are the maintenance schedules for the high-volume filtration in the ${series} series?`,
        reason: "Standard operational query for maintaining your Marquis® investment."
      });
    }

    // 4. Logistics/Ownership Question
    questions.push({
      q: `Can we review the delivery access and base preparation required for the ${model}?`,
      reason: "Critical for ensuring a smooth, damage-free installation process in your backyard."
    });

    return questions.slice(0, 4);
  };

  const dynamicQuestions = getConsultationQuestions();

  const content = (
    <div className="expert-pass-root fixed inset-0 z-[-1] invisible print:visible print:static print:z-[auto] bg-white text-slate-800 font-sans p-0 m-0 print:block">
      
      {/* PAGE 1: DISCOVERY & MATCHES */}
      <div className="p-10 flex flex-col overflow-hidden" style={{ height: '10.5in', pageBreakAfter: 'always', boxSizing: 'border-box' }}>
        
        {/* REBALANCED HEADER */}
        <div className="flex justify-between items-center border-b-4 border-marquis-blue pb-8 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black italic uppercase text-marquis-blue tracking-tighter leading-none">Discovery Summary</h1>
            <div className="bg-slate-100 text-marquis-blue text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-fit">Marquis® Personal Selection Guide</div>
          </div>
          <div className="flex items-center gap-6 shrink-0">
             <img src="/assets/marquis-logo-full.png" alt="Marquis" className="h-14" />
             <div className="text-right border-l border-slate-200 pl-6">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{new Date().toLocaleDateString()}</p>
                <p className="text-slate-300 text-[7px] font-black uppercase tracking-[0.3em]">Official Record</p>
             </div>
          </div>
        </div>

        {/* SECTION: DISCOVERY CRITERIA */}
        <section className="mb-10">
          <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100/80">
             <div className="grid grid-cols-4 gap-x-12">
                {[
                  { label: 'Primary Goal', value: preferences?.primaryPurpose || 'Therapy' },
                  { label: 'Architecture', value: preferences?.aesthetic || 'Modern' },
                  { label: 'Ownership', value: preferences?.ownership || 'Discovery' },
                  { label: 'Zip/Region', value: zip || 'Local' }
                ].map((pref, i) => (
                  <div key={i}>
                    <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">{pref.label}</div>
                    <div className="text-sm font-black italic uppercase text-slate-700">{pref.value}</div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* PERSONALIZED MATCH SET */}
        <section className="flex-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 flex items-center gap-3">
             <Sparkle weight="fill" className="w-4 h-4 text-marquis-blue" /> Your Curated Match Set
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {results.slice(0, 4).map((res, i) => {
              if (!res?.product) return null;
              const description = res.naturalNarrative || (res.reasons?.length > 1 ? res.reasons[1] : res.reasons?.[0]) || 'Precision-tuned for your lifestyle.';
              
              return (
                <div key={i} className="flex flex-col p-6 rounded-[32px] border border-slate-100 bg-white" style={{ breakInside: 'avoid' }}>
                   <div className="flex gap-6 mb-6">
                      <div className="w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                          <img 
                            src={res.product.heroImageUrl || `/mcp/demo/assets/products/${res.product.slug}/hero.png`} 
                            className="w-full h-full object-cover" 
                            alt={res.product.modelName} 
                          />
                      </div>
                      <div className="flex flex-col justify-center">
                          <div className="text-marquis-blue font-black uppercase italic text-2xl leading-none mb-1">{res.product.modelName}</div>
                          <div className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[9px] mb-3">{res.product.seriesName || res.product.series?.name || 'Marquis'}</div>
                          <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase italic">
                             <SealCheck className="w-4 h-4 text-marquis-green" weight="fill" />
                             {Math.round(res.score)}% Match
                          </div>
                      </div>
                   </div>
                   <div className="border-t border-slate-50 pt-4">
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic line-clamp-3">"{description}"</p>
                   </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* PAGE 1 FOOTER */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
           <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.5em]">The Ultimate Hot Tub Experience® | Page 1 of 2</p>
        </div>
      </div>

      {/* PAGE 2: SPECS & CONSULTATION GUIDE */}
      <div className="p-10 flex flex-col justify-between overflow-hidden" style={{ height: '10.5in', boxSizing: 'border-box' }}>
        
        {/* HIGH-LEVEL SPECS SECTION */}
        <div className="flex-1">
          {currentProduct && (
            <section className="mb-10 bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
               <div className="relative z-10">
                 <div className="mb-10">
                    <h2 className="text-4xl font-black italic uppercase text-white leading-none mb-2">High-Level Specs</h2>
                    <p className="text-marquis-blue text-xs font-black uppercase tracking-[0.3em] font-mono">{currentProduct.modelName} Profile</p>
                 </div>

                 <div className="grid grid-cols-3 gap-y-10 gap-x-12 mb-10">
                    {[
                      { icon: Users, label: 'Capacity', value: `${getSpec(currentProduct.seatsMax, '--')} Adults` },
                      { icon: CornersOut, label: 'Footprint', value: `${currentProduct.lengthIn || '--'}" x ${currentProduct.widthIn || '--'}"` },
                      { icon: Lightning, label: 'Jetting', value: `${getSpec(currentProduct.jetCount)} Jets` },
                      { icon: Waves, label: 'Pump Flow', value: `${getSpec(currentProduct.pumpFlowGpm, '160')} GPM` },
                      { icon: Thermometer, label: 'Sanitation', value: 'ConstantClean™' },
                      { icon: BatteryCharging, label: 'Electrical', value: `${getSpec(currentProduct.electricalAmps, '50')}A Connection` }
                    ].map((spec, idx) => (
                      <div key={idx} className="flex gap-4">
                         <div className="bg-white/10 p-3 rounded-2xl h-fit"><spec.icon className="w-5 h-5 text-marquis-blue" /></div>
                         <div>
                            <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">{spec.label}</div>
                            <div className="text-xs font-black uppercase">{spec.value}</div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="bg-white/5 rounded-[32px] p-8 border border-white/5">
                    <div className="text-[10px] font-black uppercase text-marquis-blue tracking-widest mb-4">Why we picked this model...</div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                       {(Array.isArray(currentProduct.reasons) ? currentProduct.reasons : []).slice(1, 5).map((r: string, idx: number) => (
                          <div key={idx} className="flex gap-3 items-start">
                             <Check className="w-3 h-3 text-marquis-blue mt-0.5 shrink-0" weight="bold" />
                             <p className="text-xs text-white/70 font-semibold leading-relaxed italic">{r}</p>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
            </section>
          )}

          {/* DEALER CONSULTATION GUIDE */}
          <section className="mb-10">
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
               <ChatTeardropDots weight="fill" className="w-5 h-5 text-marquis-blue" /> Dealer Consultation Guide
             </h2>
             <div className="grid grid-cols-2 gap-6">
                {dynamicQuestions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-3" style={{ breakInside: 'avoid' }}>
                     <div className="text-sm font-black italic uppercase text-slate-800 leading-tight">{item.q}</div>
                     <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-marquis-blue" />
                        WHY ASK THIS: {item.reason}
                     </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* FINAL CLOSING & QR */}
        <div className="bg-marquis-blue rounded-[32px] p-8 flex items-center justify-between text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
          <div className="max-w-lg">
             <h4 className="text-2xl font-black italic uppercase mb-2">Locally Guided Expertise</h4>
             <p className="text-white/70 text-xs font-medium leading-relaxed italic">
               Bring this Discover Summary to your local Marquis® dealership. Your curated selections provide the perfect technical baseline for a customized ownership plan.
             </p>
          </div>
          <div className="text-center bg-white p-4 rounded-3xl shrink-0 ml-8 shadow-2xl">
             <div className="bg-slate-50 p-2 rounded-xl mb-2">
                <img src={qrUrl} alt="Locate Dealer" className="w-16 h-16" />
             </div>
             <div className="text-[8px] font-black uppercase tracking-widest text-marquis-blue">Scan to locate dealer</div>
          </div>
        </div>

        {/* PAGE 2 FOOTER */}
        <div className="mt-8 text-center text-slate-300 font-bold uppercase tracking-[0.5em] text-[8px]">
           Marquis® Spas | Page 2 of 2
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return content;
  const target = document.getElementById('print-root');
  if (!target) return content;

  return createPortal(content, target);
}
