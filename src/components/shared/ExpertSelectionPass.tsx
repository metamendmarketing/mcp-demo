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
      reason: "Ensures you understand the maintenance advantages of your selected model."
    },
    {
      q: "Can we review the delivery access requirements for my backyard?",
      reason: `Crucial for planning the installation of models like the ${currentProduct?.modelName || 'this one'}.`
    },
    {
      q: "What are the specific electrical requirements for this series?",
      reason: `Confirms if your home is ready for the ${getSpec(currentProduct?.electricalAmps, '50')}A connection.`
    },
    {
      q: "Can I experience the V-O-L-T™ system in a 'wet test' today?",
      reason: "The best way to feel the difference in Marquis hydraulic engineering."
    }
  ];

  const content = (
    <div className="expert-pass-root fixed inset-0 z-[-1] invisible print:visible print:static print:z-[auto] bg-white text-slate-900 font-sans p-0 m-0 print:block">
      
      {/* PAGE 1: DISCOVERY & MATCHES */}
      <div className="p-12 flex flex-col overflow-hidden" style={{ height: '10.5in', pageBreakAfter: 'always', boxSizing: 'border-box' }}>
        
        {/* HEADER */}
        <div className="flex justify-between items-start border-b-8 border-marquis-blue pb-8 mb-10">
          <div>
            <h1 className="text-5xl font-black italic uppercase text-marquis-blue tracking-tighter leading-none mb-3">Expert Selection Pass</h1>
            <div className="flex items-center gap-3">
              <span className="bg-marquis-blue text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Official Discovery Record</span>
              <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Marquis® Buying Assistant | Precision Engineering</p>
            </div>
          </div>
          <div className="text-right">
             <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-10 ml-auto mb-4 grayscale brightness-0" />
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Generation Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* SECTION: LIFESTYLE CRITERIA */}
        <section className="mb-12">
          <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 flex items-center justify-between">
            <div className="flex-1">
               <h2 className="text-xs font-black uppercase tracking-[0.3em] text-marquis-blue mb-6 flex items-center gap-3">
                 <Sparkle weight="fill" className="w-4 h-4" /> Discovery Context
               </h2>
               <div className="grid grid-cols-4 gap-y-8 gap-x-12">
                  {[
                    { label: 'Primary Goal', value: preferences?.primaryPurpose || 'Therapy' },
                    { label: 'Seating', value: `${preferences?.capacity || '5'} Adults` },
                    { label: 'Aesthetic', value: preferences?.aesthetic || 'Modern' },
                    { label: 'Ownership', value: preferences?.ownership || 'Forever Spa' }
                  ].map((pref, i) => (
                    <div key={i}>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{pref.label}</div>
                      <div className="text-sm font-black italic uppercase text-slate-800">{pref.value}</div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* SECTION: TOP 4 MATCH SET */}
        <section className="flex-1 overflow-hidden">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b border-slate-100 pb-4">Personalized Match Set</h2>
          <div className="grid grid-cols-2 gap-8">
            {results.slice(0, 4).map((res, i) => {
              if (!res?.product) return null;
              return (
                <div key={i} className="flex gap-6 p-6 rounded-3xl border border-slate-100 bg-white shadow-sm" style={{ breakInside: 'avoid' }}>
                   <div className="w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                      <img 
                        src={res.product.heroImageUrl || `/mcp/demo/assets/products/${res.product.slug}/hero.png`} 
                        className="w-full h-full object-cover" 
                        alt={res.product.modelName} 
                      />
                   </div>
                   <div className="flex flex-col justify-center">
                      <div className="text-marquis-blue font-black uppercase italic text-xl leading-none mb-1">{res.product.modelName}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{res.product.seriesName || res.product.series?.name || 'Marquis Series'}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-800 uppercase italic">
                           <SealCheck className="w-3.5 h-3.5 text-marquis-green" weight="fill" />
                           {(res.score * 10).toFixed(0)}% Strategy Match
                        </div>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-2 italic">"{res.reasons?.[0] || 'Precision engineered for your specific discovery path.'}"</p>
                      </div>
                   </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* FOOTER OF PAGE 1 */}
        <div className="mt-8 pt-8 border-t border-slate-100 text-center">
           <p className="text-[8px] text-slate-300 font-black uppercase tracking-[0.5em]">The Ultimate Hot Tub Experience® | Page 1 of 2</p>
        </div>
      </div>

      {/* PAGE 2: DEEP DIVE & CONSULTATION GUIDE */}
      <div className="p-12 flex flex-col justify-between overflow-hidden" style={{ height: '10.5in', boxSizing: 'border-box' }}>
        
        {/* CURRENT SELECTION DEEP-DIVE */}
        <div className="flex-1">
          {currentProduct && (
            <section className="mb-12 p-10 bg-slate-900 rounded-[48px] text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-10">
                    <div>
                      <h2 className="text-4xl font-black italic uppercase text-white mb-2 leading-none">Engineering Deep-Dive</h2>
                      <p className="text-marquis-blue text-xs font-black uppercase tracking-[0.3em]">{currentProduct.modelName} Blueprint Analysis</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-center min-w-[120px]">
                       <div className="text-[9px] font-black uppercase text-marquis-blue tracking-widest mb-1">Seating</div>
                       <div className="text-xl font-black italic uppercase leading-none">{getSpec(currentProduct.seatsMax, '--')} Adults</div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-y-12 gap-x-8 mb-12">
                    {[
                      { 
                        icon: CornersOut, 
                        label: 'Dimensions', 
                        value: (currentProduct.lengthIn && currentProduct.widthIn) 
                          ? `${currentProduct.lengthIn}x${currentProduct.widthIn}x${currentProduct.depthIn || '--'}"` 
                          : (currentProduct.depthIn ? `${currentProduct.depthIn}" Depth` : '--')
                      },
                      { icon: Lightning, label: 'Jet Architecture', value: `${getSpec(currentProduct.jetCount)} Kinetic Jets` },
                      { icon: Waves, label: 'Hydraulic Flow', value: `${getSpec(currentProduct.pumpFlowGpm, '160')} GPM` },
                      { icon: Thermometer, label: 'Sanitation', value: 'ConstantClean™ System' },
                      { icon: BatteryCharging, label: 'Electrical', value: `${getSpec(currentProduct.electricalAmps, '50')}A Connection` },
                      { icon: Package, label: 'Capacity', value: `${getSpec(currentProduct.capacityGallons, '350')} Gallons` }
                    ].map((spec, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                         <div className="bg-white/5 p-3 rounded-2xl border border-white/5"><spec.icon className="w-6 h-6 text-marquis-blue" /></div>
                         <div>
                            <div className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-1">{spec.label}</div>
                            <div className="text-xs font-black uppercase tracking-tight">{spec.value}</div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="border-t border-white/10 pt-8">
                    <div className="text-[10px] font-black uppercase text-marquis-blue tracking-widest mb-4">Expert Engineering Reasoning</div>
                    <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                       {(Array.isArray(currentProduct.reasons) ? currentProduct.reasons : []).slice(0, 4).map((r: string, idx: number) => (
                          <div key={idx} className="flex gap-3 items-start">
                             <div className="bg-marquis-blue text-white rounded-full p-1 mt-0.5 flex-shrink-0"><Check className="w-2.5 h-2.5" weight="bold" /></div>
                             <p className="text-[11px] text-white/80 font-semibold leading-relaxed italic">{r}</p>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
            </section>
          )}

          {/* DEALER CONSULTATION GUIDE */}
          <section className="mb-12">
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b border-slate-100 pb-4 flex items-center gap-3">
               <ChatTeardropDots weight="fill" className="w-4 h-4 text-marquis-blue" /> Dealer Consultation Guide
             </h2>
             <p className="text-[11px] text-slate-500 font-medium mb-8 max-w-2xl leading-relaxed italic">
               To get the most out of your visit, we recommend discussing these specific engineering and installation points with your local Marquis expert.
             </p>
             <div className="grid grid-cols-2 gap-8">
                {questions.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col gap-4" style={{ breakInside: 'avoid' }}>
                     <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                           <PhosphorInfo className="w-4 h-4 text-marquis-blue" weight="bold" />
                        </div>
                        <div className="text-sm font-black italic uppercase text-slate-800 leading-tight">{item.q}</div>
                     </div>
                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest border-l-2 border-slate-200 pl-4">Expert Advice: {item.reason}</p>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* FINAL CLOSING & QR */}
        <div className="bg-marquis-blue rounded-[32px] p-8 flex items-center justify-between text-white relative overflow-hidden" style={{ breakInside: 'avoid' }}>
          <div className="relative z-10 max-w-lg">
             <h4 className="text-2xl font-black italic uppercase mb-2">Ready to take the plunge?</h4>
             <p className="text-white/70 text-[11px] font-medium leading-relaxed italic">
               Bring this Selection Pass to your local dealership for final local pricing and delivery scheduling. Your zip code {zip || '[Not Provided]'} was used to identify local logistics.
             </p>
          </div>
          <div className="relative z-10 text-center bg-white p-4 rounded-3xl shrink-0 ml-8 shadow-2xl">
             <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 mb-2">
                <img src={qrUrl} alt="Locate Dealer" className="w-20 h-20" />
             </div>
             <div className="text-[8px] font-black uppercase tracking-widest text-marquis-blue">Scan to find local dealer</div>
          </div>
        </div>

        {/* FOOTER OF PAGE 2 */}
        <div className="mt-8 text-center">
           <p className="text-[8px] text-slate-300 font-black uppercase tracking-[0.5em]">Marquis® Spas | Precision Engineering Through Discovery | Page 2 of 2</p>
        </div>
      </div>
    </div>
  );

  if (typeof document === 'undefined') return content;
  const target = document.getElementById('print-root');
  if (!target) return content;

  return createPortal(content, target);
}
