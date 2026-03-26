/**
 * PrintLayout.tsx
 * 
 * The "Expert Selection Pass" - This component is the definitive printable 
 * record of a customer's Marquis discovery session. It aggregates their 
 * lifestyle criteria, top 4 recommended models, and the technical deep-dive
 * of their final selection into a single, professional PDF-ready format.
 */
import React from 'react';
import { 
  Plus, Users, Lightning, Waves, Package, Thermometer, 
  BatteryCharging, CornersOut, Check, Sparkle
} from '@phosphor-icons/react';

interface PrintLayoutProps {
  preferences: any;
  results: any[];
  currentProduct?: any;
}

export default function PrintLayout({ preferences, results, currentProduct }: PrintLayoutProps) {
  // Extract zip for the QR code
  const zip = preferences?.zipCode || '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://demos.metamend.ca/mcp/demo/dealer-locator?zip=${encodeURIComponent(zip)}`;

  return (
    <div className="print-only bg-white p-12 max-w-[8.5in] mx-auto text-slate-900 border-2 border-slate-100">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start border-b-4 border-marquis-blue pb-8 mb-10">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-marquis-blue tracking-tight leading-none mb-2">Expert Selection Pass</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Marquis® Buying Assistant | Official Documentation</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black italic uppercase text-slate-800">The Ultimate Hot Tub Experience®</div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* CUSTOMER LIFE-STYLE CRITERIA */}
      <section className="mb-12">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
           <h4 className="text-sm font-black uppercase tracking-[0.2em] text-marquis-blue mb-4 flex items-center gap-2">
             <Sparkle weight="fill" className="w-4 h-4" /> Discovery Summary
           </h4>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Primary Goal', value: preferences?.primaryPurpose || 'Therapy' },
                { label: 'Seating', value: `${preferences?.capacity || '5'} Adults` },
                { label: 'Theme', value: preferences?.aesthetic || 'Modern' },
                { label: 'Investment', value: preferences?.budget || 'Premium' },
                { label: 'Location', value: preferences?.zipCode || 'N/A' },
                { label: 'Ownership', value: preferences?.ownership || 'Forever Spa' },
                { label: 'Electrical', value: preferences?.electrical || '240V' },
                { label: 'Placement', value: preferences?.placement || 'Patio' }
              ].map((pref, i) => (
                <div key={i}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{pref.label}</div>
                  <div className="text-sm font-black italic uppercase text-slate-800">{pref.value}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* TOP 4 RECOMMENDATIONS */}
      <section className="mb-12">
        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 mb-6 border-b border-slate-100 pb-2">Your Expert Match Set</h4>
        <div className="grid grid-cols-2 gap-6">
          {results.slice(0, 4).map((res, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-white">
               <div className="w-24 h-24 bg-slate-50 rounded-lg overflow-hidden shrink-0">
                  <img 
                    src={res.product.heroImageUrl || `/mcp/demo/assets/products/${res.product.slug}/hero.png`} 
                    className="w-full h-full object-cover" 
                    alt={res.product.modelName} 
                  />
               </div>
               <div>
                  <div className="text-marquis-blue font-black uppercase italic text-lg leading-none mb-1">{res.product.modelName}</div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">{res.product.seriesName || 'Marquis Series'}</div>
                  <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-2 font-medium">Matched Strategy: {res.matchStrategy || 'Precision Engineering'}</p>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* CURRENT SELECTION DEEP-DIVE */}
      {currentProduct && (
        <section className="mb-12 p-8 bg-blue-50/30 rounded-3xl border border-blue-100 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <Plus className="w-32 h-32 text-marquis-blue" />
           </div>
           
           <h4 className="text-xl font-black italic uppercase text-marquis-blue mb-2 leading-none">Engineering Deep-Dive: {currentProduct.modelName}</h4>
           <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-8">Detailed Specifications & Hydrotherapy Logic</p>

           <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-8 relative z-10">
              <div className="flex items-center gap-3">
                 <CornersOut className="w-6 h-6 text-marquis-blue" />
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Footprint</div>
                    <div className="text-xs font-black uppercase text-slate-800">{currentProduct.lengthIn}x{currentProduct.widthIn}x{currentProduct.depthIn}"</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Users className="w-6 h-6 text-marquis-blue" />
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seating</div>
                    <div className="text-xs font-black uppercase text-slate-800">{currentProduct.seatsMax} Adults</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Lightning className="w-6 h-6 text-marquis-blue" />
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Jet Architecture</div>
                    <div className="text-xs font-black uppercase text-slate-800">{currentProduct.jetCount} Kinetic Jets</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Waves className="w-6 h-6 text-marquis-blue" />
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hydraulic Flow</div>
                    <div className="text-xs font-black uppercase text-slate-800">{currentProduct.pumpFlowGpm || 160} GPM</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Thermometer className="w-6 h-6 text-marquis-blue" />
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sanitation</div>
                    <div className="text-xs font-black uppercase text-slate-800">ConstantClean™ System</div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <BatteryCharging className="w-6 h-6 text-marquis-blue" />
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Electral Amps</div>
                    <div className="text-xs font-black uppercase text-slate-800">{currentProduct.electricalAmps || 50}A Connection</div>
                 </div>
              </div>
           </div>

           <div className="border-t border-blue-100 pt-6">
              <div className="text-[10px] font-black uppercase text-marquis-blue tracking-widest mb-3">Engineering Reasoning</div>
              <div className="grid grid-cols-2 gap-4">
                 {(Array.isArray(currentProduct.reasons) ? currentProduct.reasons : []).slice(0, 4).map((r: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-start">
                       <div className="bg-marquis-blue text-white rounded-full p-0.5 mt-0.5"><Check className="w-2 h-2" /></div>
                       <p className="text-[10px] text-slate-700 font-semibold leading-relaxed">{r}</p>
                    </div>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* DEALER LOCATOR QR CODE SECTION */}
      <div className="flex justify-between items-end border-t-2 border-slate-100 pt-10">
        <div className="max-w-md">
           <h4 className="text-lg font-black italic uppercase text-marquis-blue mb-2">Ready to take the plunge?</h4>
           <p className="text-slate-500 text-[11px] font-medium leading-relaxed mb-4">
             Take this Selection Pass to your local Marquis expert to experience the V-O-L-T™ system in person and discuss local delivery logistics.
           </p>
           <div className="flex items-center gap-2 text-slate-400">
             <MapPin className="w-4 h-4" />
             <span className="text-[10px] font-black uppercase tracking-widest">Search: {zip || 'Enter zip on site'}</span>
           </div>
        </div>
        <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
           <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm mb-2">
              <img src={qrUrl} alt="Dealer Locator QR Code" className="w-24 h-24" />
           </div>
           <div className="text-[9px] font-black uppercase tracking-widest text-marquis-blue">Scan to find local dealer</div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-12 text-center">
         <p className="text-[8px] text-slate-300 font-black uppercase tracking-[0.4em]">Marquis® Buying Assistant | Precision Engineering Through Discovery</p>
      </div>
    </div>
  );
}
