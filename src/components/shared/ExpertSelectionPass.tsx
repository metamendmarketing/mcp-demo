'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Check, Users, Lightning, Waves, Package, Thermometer, 
  BatteryCharging, CornersOut, Sparkle, MapPin, 
  ChatTeardropDots, Info, SealCheck, Info as PhosphorInfo
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
      reason: "Ensures you understand the maintenance advantages and water-clarity standards of your selected model."
    },
    {
      q: "Can we review the delivery access requirements for my backyard?",
      reason: `Crucial for seamless installation planning of a model like the ${currentProduct?.modelName || 'this one'}.`
    },
    {
      q: "What are the specific electrical requirements for this series?",
      reason: `Confirms your home is ready for the precision-engineered ${getSpec(currentProduct?.electricalAmps, '50')}A connection.`
    },
    {
      q: "Can I experience the V-O-L-T™ system in a 'wet test' today?",
      reason: "The absolute best way to feel the Marquis® difference in hydraulic flow and control."
    }
  ];

  const content = (
    <div className="expert-pass-root fixed inset-0 z-[-1] invisible print:visible print:static print:z-[auto] bg-white text-slate-900 font-sans p-0 m-0 print:block">
      
      {/* PAGE 1: DISCOVERY & MATCHES */}
      <div className="p-10 flex flex-col overflow-hidden" style={{ height: '10.5in', pageBreakAfter: 'always', boxSizing: 'border-box' }}>
        
        {/* HEADER - REFINED TO ONE LINE */}
        <div className="flex justify-between items-center border-b-4 border-marquis-blue pb-6 mb-8">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-black italic uppercase text-marquis-blue tracking-tighter leading-none whitespace-nowrap">Selection Summary: Your Personal Marquis® Discovery</h1>
            <span className="bg-marquis-blue text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap">High-Performance Selection Guide</span>
          </div>
          <div className="text-right flex items-center gap-4">
             <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-8 grayscale-0" />
             <p className="text-slate-400 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* SECTION: DISCOVERY CRITERIA */}
        <section className="mb-8">
          <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
            <div className="flex-1">
               <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-marquis-blue mb-4 flex items-center gap-3">
                 <Sparkle weight="fill" className="w-4 h-4" /> Discovery Criteria
               </h2>
               <div className="grid grid-cols-4 gap-y-4 gap-x-12">
                  {[
                    { label: 'Primary Goal', value: preferences?.primaryPurpose || 'Therapy' },
                    { label: 'Seating', value: `${preferences?.capacity || '5'} Adults` },
                    { label: 'Aesthetic', value: preferences?.aesthetic || 'Modern' },
                    { label: 'Ownership', value: preferences?.ownership || 'Forever Spa' }
                  ].map((pref, i) => (
                    <div key={i}>
                      <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1">{pref.label}</div>
                      <div className="text-xs font-black italic uppercase text-slate-800">{pref.value}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* SECTION: PERSONALIZED MATCH SET */}
        <section className="flex-1">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b border-slate-100 pb-3">Personalized Match Set</h2>
          <div className="grid grid-cols-2 gap-4">
            {results.slice(0, 4).map((res, i) => {
              if (!res?.product) return null;
              return (
                <div key={i} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm" style={{ breakInside: 'avoid' }}>
                   <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                      <img 
                        src={res.product.heroImageUrl || `/mcp/demo/assets/products/${res.product.slug}/hero.png`} 
                        className="w-full h-full object-cover" 
                        alt={res.product.modelName} 
                      />
                   </div>
                   <div className="flex flex-col justify-center">
                      <div className="text-marquis-blue font-black uppercase italic text-lg leading-none mb-1">{res.product.modelName}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">{res.product.seriesName || res.product.series?.name || 'Marquis Series'}</div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-800 uppercase italic">
                           <SealCheck className="w-3.5 h-3.5 text-marquis-green" weight="fill" />
                           {Math.round(res.score)}% Preference Match
                        </div>
                        <p className="text-[9px] text-slate-500 leading-tight font-medium line-clamp-2 italic">"{res.reasons?.[0] || 'Precision-tuned for your unique lifestyle and backyard environment.'}"</p>
                      </div>
                   </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* FOOTER OF PAGE 1 */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
           <p className="text-[7px] text-slate-300 font-black uppercase tracking-[0.5em]">The Ultimate Hot Tub Experience® | Page 1 of 2</p>
        </div>
      </div>

      {/* PAGE 2: SPECS & CONSULTATION GUIDE */}
      <div className="p-10 flex flex-col justify-between overflow-hidden" style={{ height: '10.5in', boxSizing: 'border-box' }}>
        
        {/* HIGH-LEVEL SPECS */}
        <div className="flex-1">
          {currentProduct && (
            <section className="mb-8 p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-3xl font-black italic uppercase text-white mb-1 leading-none">High-level Specs</h2>
                      <p className="text-marquis-blue text-[10px] font-black uppercase tracking-[0.3em]">{currentProduct.modelName} Analysis</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-center min-w-[100px]">
                       <div className="text-[8px] font-black uppercase text-marquis-blue tracking-widest mb-1">Seating</div>
                       <div className="text-lg font-black italic uppercase leading-none">{getSpec(currentProduct.seatsMax, '--')} Adults</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-y-8 gap-x-6 mb-8">
                    {[
                      { 
                        icon: CornersOut, 
                        label: 'Dimensions', 
                        value: (currentProduct.lengthIn && currentProduct.widthIn) 
                          ? `${currentProduct.lengthIn}x${currentProduct.widthIn}x${currentProduct.depthIn || '--'}"` 
                          : (currentProduct.depthIn ? `${currentProduct.depthIn}" Depth` : '--')
                      },
                      { icon: Lightning, label: 'Jet System', value: `${getSpec(currentProduct.jetCount)} Kinetic Jets` },
                      { icon: Waves, label: 'Hydraulic Flow', value: `${getSpec(currentProduct.pumpFlowGpm, '160')} GPM` },
                      { icon: Thermometer, label: 'Sanitation', value: 'ConstantClean™ System' },
                      { icon: BatteryCharging, label: 'Electrical', value: `${getSpec(currentProduct.electricalAmps, '50')}A Config` },
                      { icon: Package, label: 'Capacity', value: `${getSpec(currentProduct.capacityGallons, '350')} Gallons` }
                    ].map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                         <div className="bg-white/5 p-2 rounded-xl border border-white/5"><spec.icon className="w-5 h-5 text-marquis-blue" /></div>
                         <div>
                            <div className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-0.5">{spec.label}</div>
                            <div className="text-[10px] font-black uppercase tracking-tight">{spec.value}</div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="border-t border-white/10 pt-6">
                    <div className="text-[9px] font-black uppercase text-marquis-blue tracking-widest mb-3">Why we picked this model...</div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                       {(Array.isArray(currentProduct.reasons) ? currentProduct.reasons : []).slice(0, 4).map((r: string, idx: number) => (
                          <div key={idx} className="flex gap-3 items-start">
                             <div className="bg-marquis-blue text-white rounded-full p-1 mt-0.5 flex-shrink-0"><Check className="w-2 h-2" weight="bold" /></div>
                             <p className="text-[10px] text-white/80 font-semibold leading-snug italic">{r}</p>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
            </section>
          )}

          {/* DEALER CONSULTATION GUIDE */}
          <section className="mb-8">
             <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 border-b border-slate-100 pb-3 flex items-center gap-3">
               <ChatTeardropDots weight="fill" className="w-4 h-4 text-marquis-blue" /> Dealer Consultation Guide
             </h2>
             <p className="text-[10px] text-slate-500 font-medium mb-6 max-w-2xl leading-relaxed italic">
               To ensure your ultimate satisfaction, we recommend discussing these refined engineering and installation points with your local Marquis® expert.
             </p>
             <div className="grid grid-cols-2 gap-4">
                {questions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-3" style={{ breakInside: 'avoid' }}>
                     <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                           <PhosphorInfo className="w-3 h-3 text-marquis-blue" weight="bold" />
                        </div>
                        <div className="text-xs font-black italic uppercase text-slate-800 leading-tight">{item.q}</div>
                     </div>
                     <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest border-l-2 border-slate-200 pl-3">WHY ASK THIS: {item.reason}</p>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* FINAL CLOSING & QR */}
        <div className="bg-marquis-blue rounded-[24px] p-6 flex items-center justify-between text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
          <div className="relative z-10 max-w-lg">
             <h4 className="text-xl font-black italic uppercase mb-1">Ready to start your journey?</h4>
             <p className="text-white/70 text-[10px] font-medium leading-relaxed italic">
               Bring this Discovery Summary to your local dealership. Your selected criteria and zip code ({zip || 'Local'}) will guide your expert consultant in providing the ultimate ownership experience.
             </p>
          </div>
          <div className="relative z-10 text-center bg-white p-3 rounded-2xl shrink-0 ml-8 shadow-xl">
             <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100 mb-1">
                <img src={qrUrl} alt="Locate Dealer" className="w-16 h-16" />
             </div>
             <div className="text-[7px] font-black uppercase tracking-widest text-marquis-blue">Scan to find your local dealer</div>
          </div>
        </div>

        {/* FOOTER OF PAGE 2 */}
        <div className="mt-6 text-center">
           <p className="text-[7px] text-slate-300 font-black uppercase tracking-[0.5em]">Marquis® Spas | Precision Engineering Through Discovery | Page 2 of 2</p>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return content;
  const target = document.getElementById('print-root');
  if (!target) return content;

  return createPortal(content, target);
}
