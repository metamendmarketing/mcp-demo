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

  const questions = [
    {
      q: "How does the ConstantClean™ system differ from traditional sanitation?",
      reason: "Ensures you understand the maintenance advantages and water-clarity standards."
    },
    {
      q: "Can we review the delivery access requirements for my backyard?",
      reason: `Seamless installation planning for a model like the ${currentProduct?.modelName || 'this one'}.`
    },
    {
      q: "What are the specific electrical requirements for this series?",
      reason: `Confirms your home is ready for the precision-engineered ${getSpec(currentProduct?.electricalAmps, '50')}A connection.`
    },
    {
      q: "Can I experience the V-O-L-T™ system in a 'wet test' today?",
      reason: "The best way to feel the Marquis® difference in hydraulic flow and control."
    }
  ];

  const content = (
    <div className="expert-pass-root fixed inset-0 z-[-1] invisible print:visible print:static print:z-[auto] bg-white text-slate-800 font-sans p-0 m-0 print:block">
      
      {/* PAGE 1: DISCOVERY & MATCHES */}
      <div className="p-8 pb-4 flex flex-col overflow-hidden" style={{ height: '10.5in', pageBreakAfter: 'always', boxSizing: 'border-box' }}>
        
        {/* REFINED COMPACT HEADER */}
        <div className="flex justify-between items-center border-b-[3px] border-marquis-blue pb-4 mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black italic uppercase text-marquis-blue tracking-tighter leading-none">Marquis® Discovery Summary</h1>
            <span className="bg-slate-100 text-marquis-blue text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ring-1 ring-slate-200">Personal Selection Guide</span>
          </div>
          <div className="flex items-center gap-4 shrink-0">
             <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-6" />
             <p className="text-slate-300 text-[8px] font-bold uppercase tracking-widest border-l border-slate-200 pl-4">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* REFINED DISCOVERY CRITERIA */}
        <section className="mb-6">
          <div className="bg-slate-50/50 p-5 rounded-[24px] border border-slate-100/80">
             <div className="grid grid-cols-4 gap-x-8">
                {[
                  { label: 'Primary Goal', value: preferences?.primaryPurpose || 'Therapy' },
                  { label: 'Target Seats', value: `${preferences?.capacity || '5'} Adults` },
                  { label: 'Architecture', value: preferences?.aesthetic || 'Modern' },
                  { label: 'Ownership', value: preferences?.ownership || 'Forever' }
                ].map((pref, i) => (
                  <div key={i}>
                    <div className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mb-1">{pref.label}</div>
                    <div className="text-xs font-black italic uppercase text-slate-700">{pref.value}</div>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* PERSONALIZED MATCH SET - BROCHURE STYLE */}
        <section className="flex-1">
          <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-3">
             <Sparkle weight="fill" className="w-3.5 h-3.5 text-marquis-blue" /> Your Curated Match Set
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {results.slice(0, 4).map((res, i) => {
              if (!res?.product) return null;
              // Prioritize natural narrative over generic reasons
              const description = res.naturalNarrative || (res.reasons?.length > 1 ? res.reasons[1] : res.reasons?.[0]) || 'Precision-tuned for your lifestyle.';
              
              return (
                <div key={i} className="flex flex-col p-5 rounded-[24px] border border-slate-100 bg-white hover:border-marquis-blue/20 transition-all" style={{ breakInside: 'avoid' }}>
                   <div className="flex gap-4 mb-4">
                      <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100/50">
                          <img 
                            src={res.product.heroImageUrl || `/mcp/demo/assets/products/${res.product.slug}/hero.png`} 
                            className="w-full h-full object-cover" 
                            alt={res.product.modelName} 
                          />
                      </div>
                      <div className="flex flex-col justify-center">
                          <div className="text-marquis-blue font-black uppercase italic text-lg leading-none mb-1">{res.product.modelName}</div>
                          <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-2">{res.product.seriesName || res.product.series?.name || 'Marquis Series'}</div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase italic">
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

        {/* PAGE 1 FOOTER */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
           <p className="text-[7px] text-slate-300 font-bold uppercase tracking-[0.4em]">The Ultimate Hot Tub Experience® | Page 1 of 2</p>
        </div>
      </div>

      {/* PAGE 2: SPECS & CONSULTATION GUIDE */}
      <div className="p-8 pb-4 flex flex-col justify-between overflow-hidden" style={{ height: '10.5in', boxSizing: 'border-box' }}>
        
        {/* HIGH-LEVEL SPECS SECTION */}
        <div className="flex-1">
          {currentProduct && (
            <section className="mb-6 bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
               <div className="relative z-10">
                 <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-6">
                    <div>
                      <h2 className="text-2xl font-black italic uppercase text-white leading-none mb-1">High-Level Specs</h2>
                      <p className="text-marquis-blue text-[9px] font-black uppercase tracking-[0.3em] font-mono">{currentProduct.modelName} Profile</p>
                    </div>
                    <div className="text-right">
                       <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest block mb-1">Occupancy</span>
                       <span className="text-xl font-black italic uppercase text-marquis-blue">{getSpec(currentProduct.seatsMax, '--')} Adults</span>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-y-6 gap-x-12 mb-8">
                    {[
                      { 
                        icon: CornersOut, 
                        label: 'Footprint', 
                        value: (currentProduct.lengthIn && currentProduct.widthIn) 
                          ? `${currentProduct.lengthIn}x${currentProduct.widthIn}"` 
                          : 'Custom'
                      },
                      { icon: Lightning, label: 'Jetting', value: `${getSpec(currentProduct.jetCount)} Jets` },
                      { icon: Waves, label: 'Pump Flow', value: `${getSpec(currentProduct.pumpFlowGpm, '160')} GPM` },
                      { icon: Thermometer, label: 'Sanitation', value: 'ConstantClean™' },
                      { icon: BatteryCharging, label: 'Electrical', value: `${getSpec(currentProduct.electricalAmps, '50')}A` },
                      { icon: Package, label: 'Volume', value: `${getSpec(currentProduct.capacityGallons, '350')} Gal` }
                    ].map((spec, idx) => (
                      <div key={idx} className="flex gap-4">
                         <div className="bg-white/10 p-2 rounded-xl h-fit"><spec.icon className="w-4 h-4 text-marquis-blue" /></div>
                         <div>
                            <div className="text-[7px] font-bold text-white/40 uppercase tracking-widest mb-0.5">{spec.label}</div>
                            <div className="text-[10px] font-black uppercase">{spec.value}</div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                    <div className="text-[8px] font-black uppercase text-marquis-blue tracking-widest mb-3">Why we picked this model...</div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                       {(Array.isArray(currentProduct.reasons) ? currentProduct.reasons : []).slice(0, 4).map((r: string, idx: number) => (
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

          {/* DEALER CONSULTATION GUIDE */}
          <section className="mb-6">
             <h2 className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
               <ChatTeardropDots weight="fill" className="w-4 h-4 text-marquis-blue" /> Dealer Consultation Guide
             </h2>
             <div className="grid grid-cols-2 gap-4">
                {questions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2" style={{ breakInside: 'avoid' }}>
                     <div className="text-xs font-black italic uppercase text-slate-700 leading-tight">{item.q}</div>
                     <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-marquis-blue" />
                        WHY ASK THIS: {item.reason}
                     </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* FINAL CLOSING & QR */}
        <div className="bg-marquis-blue rounded-[24px] p-6 flex items-center justify-between text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
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
             <div className="text-[7px] font-black uppercase tracking-widest text-marquis-blue">Scan to locate expert</div>
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
