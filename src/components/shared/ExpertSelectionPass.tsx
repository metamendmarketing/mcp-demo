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

  // REFINED Human-Centric Consultation Questions
  const getConsultationQuestions = () => {
    const questions = [];
    const goal = preferences?.primaryPurpose;
    const model = currentProduct?.modelName || 'this one';
    const series = currentProduct?.seriesName || currentProduct?.series?.name || '';

    // 1. Warm Goal question
    if (goal === 'therapy' || goal === 'athletes') {
      questions.push({
        q: `How do the H.O.T. Zone jets help with recovery?`,
        reason: "Ensures the hydrotherapy power is aligned with your physical wellness goals."
      });
    } else if (goal === 'exercise') {
      questions.push({
        q: `Can you show me the best swim settings?`,
        reason: "Helps you get the most out of your aquatic training and fitness routine."
      });
    } else {
      questions.push({
        q: `How does ConstantClean™ keep water clear?`,
        reason: "Shows you how easy it is to maintain pristine water for family relaxation."
      });
    }

    // 2. Warm Preference question
    if (preferences?.lounge === 'yes') {
      questions.push({
        q: `Is the Adirondack Chair right for my height?`,
        reason: "Helps you find the perfect ergonomic fit for your back and shoulder support."
      });
    } else {
      questions.push({
        q: `Is this open layout good for entertaining?`,
        reason: "Gives you a feel for the conversation flow and comfort when guests visit."
      });
    }

    // 3. Warm Technical/Series question
    if (series.includes('Crown')) {
      questions.push({
        q: "What makes the DuraShell® so durable?",
        reason: "Focuses on the long-term quality and structural integrity of your luxury spa."
      });
    } else if (series.includes('Vector')) {
      questions.push({
        q: "How does the V3 Throttle control work?",
        reason: "Lets you see how simple it is to direct the exact massage power you need."
      });
    } else {
      questions.push({
        q: `How simple is the daily maintenance?`,
        reason: "Confirms that owning a Marquis® is as stress-free as the sessions themselves."
      });
    }

    // 4. Practical question
    questions.push({
      q: `What base preparation do I need?`,
      reason: "Ensures your backyard is perfectly ready for a seamless installation day."
    });

    return questions.slice(0, 4);
  };

  const dynamicQuestions = getConsultationQuestions();

  const content = (
    <div className="expert-pass-root fixed inset-0 z-[-1] invisible print:visible print:static print:z-[auto] bg-white text-slate-800 font-sans p-0 m-0 print:block">
      
      {/* PAGE 1: DISCOVERY & MATCHES */}
      <div className="p-8 pb-4 flex flex-col overflow-hidden" style={{ height: '10.5in', pageBreakAfter: 'always', boxSizing: 'border-box' }}>
        
        {/* CORRECTED LOGO PATH & BALANCED HEADER */}
        <div className="flex justify-between items-center border-b-[3px] border-marquis-blue pb-6 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black italic uppercase text-marquis-blue tracking-tighter leading-none">Discovery Summary</h1>
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">Marquis® Personal Selection Guide</div>
          </div>
          <div className="flex items-center gap-6 shrink-0">
             <img src="/mcp/demo/assets/marquis-logo-full.png" alt="Marquis" className="h-12 grayscale-0" />
          </div>
        </div>

        {/* SECTION: DISCOVERY CRITERIA */}
        <section className="mb-6">
          <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
            <div className="flex-1">
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-marquis-blue mb-4 flex items-center gap-3">
                 <Sparkle weight="fill" className="w-4 h-4" /> Discovery Criteria
               </h2>
               <div className="grid grid-cols-4 gap-y-4 gap-x-12">
                  {[
                    { label: 'Primary Goal', value: preferences?.primaryPurpose || 'Therapy' },
                    { label: 'Architecture', value: preferences?.aesthetic || 'Modern' },
                    { label: 'Ownership', value: preferences?.ownership || 'Discovery' },
                    { label: 'Region', value: zip || 'Local' }
                  ].map((pref, i) => (
                    <div key={i}>
                      <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{pref.label}</div>
                      <div className="text-sm font-black italic uppercase text-slate-700">{pref.value}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* YOUR MATCHES - RE-REFINED */}
        <section className="flex-1">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400 mb-6 flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-marquis-blue" /> Your matches...
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {results.slice(0, 4).map((res, i) => {
              if (!res?.product) return null;
              const description = res.naturalNarrative || (res.reasons?.length > 1 ? res.reasons[1] : res.reasons?.[0]) || 'Precision-tuned for your lifestyle.';
              
              return (
                <div key={i} className="flex flex-col p-5 rounded-[28px] border border-slate-100 bg-white" style={{ breakInside: 'avoid' }}>
                   <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100/50">
                          <img 
                            src={res.product.heroImageUrl || `/mcp/demo/assets/products/${res.product.slug}/hero.png`} 
                            className="w-full h-full object-cover" 
                            alt={res.product.modelName} 
                          />
                      </div>
                      <div className="flex flex-col justify-center">
                          <div className="text-marquis-blue font-black uppercase italic text-xl leading-none mb-1">{res.product.modelName}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">{res.product.seriesName || res.product.series?.name || 'Marquis'}</div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase italic">
                             <SealCheck className="w-4 h-4 text-marquis-green" weight="fill" />
                             {Math.round(res.score)}% Match
                          </div>
                      </div>
                   </div>
                   <div className="border-t border-slate-50 pt-3">
                      <p className="text-[10px] text-slate-500 leading-normal font-medium italic line-clamp-3">"{description}"</p>
                   </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* FOOTER OF PAGE 1 */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
           <p className="text-[7px] text-slate-300 font-bold uppercase tracking-[0.4em]">Marquis® Spas | Precision Discovery | Page 1 of 2</p>
        </div>
      </div>

      {/* PAGE 2: SPECS & CONSULTATION GUIDE */}
      <div className="p-8 pb-4 flex flex-col justify-between overflow-hidden" style={{ height: '10.5in', boxSizing: 'border-box' }}>
        
        {/* HIGH-LEVEL SPECS */}
        <div className="flex-1">
          {currentProduct && (
            <section className="mb-6 bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
               <div className="relative z-10">
                 <div className="mb-8 flex justify-between items-end border-b border-white/10 pb-4">
                    <div>
                       <h2 className="text-3xl font-black italic uppercase text-white leading-none mb-1">High-Level Specs</h2>
                       <p className="text-marquis-blue text-[9px] font-black uppercase tracking-[0.3em] font-mono">{currentProduct.modelName} Profile</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-y-6 gap-x-8 mb-6">
                    {[
                      { icon: Users, label: 'Capacity', value: `${getSpec(currentProduct.seatsMax, '--')} Adults` },
                      { icon: CornersOut, label: 'Dimensions', value: `${currentProduct.lengthIn || '--'}" x ${currentProduct.widthIn || '--'}"` },
                      { icon: Lightning, label: 'Jet System', value: `${getSpec(currentProduct.jetCount)} Jets` },
                      { icon: Waves, label: 'Pump Flow', value: `${getSpec(currentProduct.pumpFlowGpm, '160')} GPM` },
                      { icon: Thermometer, label: 'Sanitation', value: 'ConstantClean™' },
                      { icon: BatteryCharging, label: 'Electrical', value: `${getSpec(currentProduct.electricalAmps, '50')}A` }
                    ].map((spec, idx) => (
                      <div key={idx} className="flex gap-3">
                         <div className="bg-white/10 p-2 rounded-xl h-fit shrink-0"><spec.icon className="w-4 h-4 text-marquis-blue" /></div>
                         <div>
                            <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">{spec.label}</div>
                            <div className="text-[10px] font-black uppercase">{spec.value}</div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="text-[8px] font-black uppercase text-marquis-blue tracking-widest mb-3">Why we picked this model...</div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                       {(Array.isArray(currentProduct.reasons) ? currentProduct.reasons : []).slice(1, 5).map((r: string, idx: number) => (
                          <div key={idx} className="flex gap-2 items-start">
                             <Check className="w-2.5 h-2.5 text-marquis-blue mt-0.5 shrink-0" weight="bold" />
                             <p className="text-[9px] text-white/70 font-semibold leading-tight italic">{r}</p>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
            </section>
          )}

          {/* REFINED HUMAN DEALER CONSULTATION GUIDE */}
          <section className="mb-6">
             <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
               <ChatTeardropDots weight="fill" className="w-4 h-4 text-marquis-blue" /> Dealer Consultation Guide
             </h2>
             <div className="grid grid-cols-2 gap-4">
                {dynamicQuestions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2" style={{ breakInside: 'avoid' }}>
                     <div className="text-xs font-black italic uppercase text-marquis-blue leading-tight">{item.q}</div>
                     <div className="text-[8px] font-semibold text-slate-500 italic pb-1">
                        <span className="text-marquis-blue font-black uppercase not-italic mr-1">WHY ASK:</span> 
                        {item.reason}
                     </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* RESTORED FINAL CLOSING & QR SECTION */}
        <div className="bg-marquis-blue rounded-[32px] p-6 flex items-center justify-between text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
          <div className="max-w-md">
             <h4 className="text-xl font-black italic uppercase mb-1">Your next step is locally guided</h4>
             <p className="text-white/70 text-[10px] font-medium leading-relaxed italic">
               Bring this Discovery Summary to your local Marquis® dealership. Your curated selections provide the perfect baseline for a customized ownership plan.
             </p>
          </div>
          <div className="text-center bg-white p-2.5 rounded-2xl shrink-0 ml-8 shadow-xl">
             <div className="bg-slate-50 p-1 rounded-lg mb-1">
                <img src={qrUrl} alt="Locate Dealer" className="w-14 h-14" />
             </div>
             <div className="text-[7px] font-black uppercase tracking-widest text-marquis-blue">Scan to locate dealer</div>
          </div>
        </div>

        {/* PAGE 2 FOOTER */}
        <div className="mt-4 text-center">
           <p className="text-[7px] text-slate-300 font-bold uppercase tracking-[0.4em]">Marquis® Spas | Precision Engineering Through Discovery | Page 2 of 2</p>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return content;
  const target = document.getElementById('print-root');
  if (!target) return content;

  return createPortal(content, target);
}
