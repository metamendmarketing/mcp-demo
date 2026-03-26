'use client';

import React from 'react';
import { Check, Star, MapPin, Lightning, Users, Waves, Heartbeat } from '@phosphor-icons/react';

interface PrintLayoutProps {
  preferences: any;
  results: any[];
  currentProduct?: any;
}

const CRITERIA_LABELS: Record<string, string> = {
  primaryPurpose: 'Primary Goal',
  capacity: 'Ideal Seating',
  lounge: 'Seating Style',
  budget: 'Price Tier',
  zipCode: 'Local Climate',
  delivery: 'Site Access',
  ownership: 'Ownership Focus',
  aesthetic: 'Visual Style'
};

export default function PrintLayout({ preferences, results, currentProduct }: PrintLayoutProps) {
  const zipCode = preferences?.zipCode || 'Not provided';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://demos.metamend.ca/mcp/demo/dealer-locator?zip=${zipCode}`)}`;

  return (
    <div className="print-only w-full bg-white p-4">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b-4 border-slate-900 pb-6 mb-8">
        <div>
          <img src="/mcp/demo/assets/marquis_logo.png" alt="Marquis" className="h-10 mb-2 brightness-0" />
          <h1 className="text-2xl font-black italic uppercase text-slate-900 tracking-tighter">Engineering Selection Pass</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Authorized Specialist Document | {new Date().toLocaleDateString()}</p>
        </div>
        <div className="text-right">
          <div className="bg-slate-900 text-white px-4 py-2 font-black italic uppercase text-xs">Verified Selection</div>
          <p className="text-[9px] text-slate-400 mt-2 max-w-[150px]">Bring this pass to your local dealer for priority consultation and regional pricing.</p>
        </div>
      </div>

      {/* SECTION 1: CUSTOMER CRITERIA */}
      <div className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4 border-b border-slate-100 pb-2">Customer Discovery Profile</h2>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(CRITERIA_LABELS).map(([key, label]) => (
            <div key={key} className="border border-slate-100 p-2 rounded-lg bg-slate-50/30">
              <div className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</div>
              <div className="text-[10px] font-black uppercase text-slate-800 italic">{preferences?.[key] || 'Not specified'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: THE RECOMMENDATION SUITE (TOP 4) */}
      <div className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4 border-b border-slate-100 pb-2">Expert Shortlist</h2>
        <div className="grid grid-cols-4 gap-3">
          {results?.slice(0, 4).map((res, i) => (
            <div key={res.product.id} className={`border p-3 rounded-xl relative ${i === 0 ? 'bg-amber-50/20 border-amber-200' : 'border-slate-100'}`}>
              <div className="flex items-center gap-1 mb-2">
                {i === 0 && <Star className="w-3 h-3 text-amber-500" weight="fill" />}
                <div className="text-[10px] font-black uppercase italic text-slate-900 leading-none">{res.product.modelName}</div>
              </div>
              <div className="text-[7px] font-bold text-marquis-blue uppercase mb-2">{res.product.seriesName || 'Marquis'}</div>
              <div className="space-y-1">
                {res.reasons?.slice(0, 2).map((r: string, idx: number) => (
                  <div key={idx} className="flex gap-1 items-start">
                    <Check className="w-2 h-2 text-slate-400 mt-0.5" />
                    <p className="text-[7px] text-slate-600 leading-tight">{r}</p>
                  </div>
                ))}
              </div>
              {i === 0 && <div className="absolute top-2 right-2 text-[6px] font-black bg-amber-400 text-slate-900 px-1 rounded">MATCH</div>}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: DEEP DIVE (CURRENT PRODUCT) */}
      {currentProduct && (
        <div className="mb-8 border-2 border-slate-900 p-6 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">Deep Dive Selection: {currentProduct.modelName}</h2>
            
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-4">
                <img 
                  src={currentProduct.heroImageUrl || `/mcp/demo/assets/products/${currentProduct.slug}/hero.png`} 
                  className="w-full rounded-xl border border-slate-100 shadow-sm"
                  alt={currentProduct.modelName}
                />
              </div>
              <div className="col-span-8">
                <div className="grid grid-cols-3 gap-y-4 gap-x-6 mb-6">
                  <div>
                    <div className="text-[7px] font-bold text-slate-400 uppercase">Dimensions</div>
                    <div className="text-[10px] font-black italic uppercase">{currentProduct.lengthIn}x{currentProduct.widthIn}x{currentProduct.depthIn}"</div>
                  </div>
                  <div>
                    <div className="text-[7px] font-bold text-slate-400 uppercase">Weight (Full)</div>
                    <div className="text-[10px] font-black italic uppercase">{currentProduct.fullWeightLbs || 4500} lbs</div>
                  </div>
                  <div>
                    <div className="text-[7px] font-bold text-slate-400 uppercase">Jet Count</div>
                    <div className="text-[10px] font-black italic uppercase">{currentProduct.jetCount} Velocity Jets</div>
                  </div>
                  <div>
                    <div className="text-[7px] font-bold text-slate-400 uppercase">Flow Rate</div>
                    <div className="text-[10px] font-black italic uppercase">{currentProduct.pumpFlowGpm || 160} GPM</div>
                  </div>
                  <div>
                    <div className="text-[7px] font-bold text-slate-400 uppercase">Series</div>
                    <div className="text-[10px] font-black italic uppercase">{currentProduct.series?.name || currentProduct.seriesName}</div>
                  </div>
                  <div>
                    <div className="text-[7px] font-bold text-slate-400 uppercase">Capacity</div>
                    <div className="text-[10px] font-black italic uppercase">{currentProduct.seatsMax} Adults</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="text-[8px] font-black text-marquis-blue uppercase tracking-widest mb-2">The Therapy Objective</div>
                  <p className="text-[9px] text-slate-700 font-semibold leading-relaxed italic">
                    "{currentProduct.therapySummary || 'Engineered for complete physical and mental rejuvenation through high-volume hydrotherapy.'}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER: DEALER PORTAL */}
      <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-end">
        <div className="flex gap-6 items-center">
          <div className="border-4 border-slate-900 p-2 bg-white">
            <img src={qrUrl} alt="Dealer Locator QR" className="w-20 h-20" />
          </div>
          <div>
            <div className="text-xs font-black italic uppercase text-slate-900 mb-1">Locate Your Dealer</div>
            <p className="text-[8px] text-slate-400 max-w-[200px] font-medium leading-tight">Scan this code to immediately find Authorized Marquis Specialists near {zipCode}.</p>
            <div className="text-[8px] font-black text-marquis-blue mt-2">MARQUISSPAS.COM/FIND-DEALER</div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest italic mb-1">The Ultimate Hot Tub Experience®</p>
          <div className="text-[7px] text-slate-400">Marquis is an employee-owned company. Made in Nevada, USA.</div>
        </div>
      </div>
    </div>
  );
}
