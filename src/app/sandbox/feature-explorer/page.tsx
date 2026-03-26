/**
 * Sandbox Page: Feature Explorer
 * 
 * This page serves as a test-bed for the Robust Feature Explorer component.
 * It uses the V84 (Epic) model's overhead view to demonstrate:
 * - Circular magnifier with 4.5x zoom.
 * - Accessible hotspots with directional tooltips.
 * - Mobile-responsive layout.
 */
'use client';

import React from 'react';
import FeatureExplorer from '@/components/products/FeatureExplorer';

const SAMPLE_HOTSPOTS = [
  {
    id: 'hot-zones',
    x: 28,
    y: 42,
    title: 'H.O.T. Zones™',
    caption: 'High-Output Therapy zones focus massive water volume on specific muscle groups for deep-tissue relief.',
    direction: 'bottom-right' as const
  },
  {
    id: 'constant-clean',
    x: 72,
    y: 15,
    title: 'ConstantClean™',
    caption: 'Dual-filter sanitation system that cleans 100% of the water up to 34 times per day.',
    direction: 'bottom-left' as const
  },
  {
    id: 'v-o-l-t',
    x: 50,
    y: 65,
    title: 'V-O-L-T™ System',
    caption: 'Velocity-Optimized Laminar Therapy ensures smooth, high-volume flow with zero turbulence.',
    direction: 'top' as const
  },
  {
    id: 'hk-jets',
    x: 85,
    y: 80,
    title: 'HK™-40 Jets',
    caption: 'Precision-engineered jets designed for targeted acupressure and rhythmic massage.',
    direction: 'top-left' as const
  }
];

export default function FeatureExplorerSandbox() {
  return (
    <div className="min-h-screen bg-slate-100 py-20 px-4">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black italic uppercase text-slate-900 tracking-tight">Feature Explorer Sandbox</h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Testing Refactored Interactive Architecture</p>
        </div>

        {/* Component Display */}
        <div className="bg-white p-2 rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
          <FeatureExplorer 
            src="/mcp/demo/assets/products/marquis-vector21-series-v84/overhead.jpg" 
            alt="Marquis Vector (V84) Overhead View"
            hotspots={SAMPLE_HOTSPOTS}
            aspectRatio="aspect-video"
            className="rounded-[38px]"
          />
        </div>

        {/* Instructions/Docs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-black uppercase text-marquis-blue mb-4">Magnifier</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Desktop: A circular lens follows the cursor with a 4.5x zoom ratio.
              Calculations use clientX/Y for viewport-locking to prevent scroll-offset issues.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-black uppercase text-marquis-blue mb-4">Smart Hotspots</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Supports 8 directions (top, bottom, left, etc.). 
              Edge-collision detection automatically flips the tooltip if it's too close to a boundary.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-black uppercase text-marquis-blue mb-4">Accessibility</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fully keyboard focusable. Use Tab to navigate through hotspots and Enter to toggle tooltips. 
              Escape closes any active tooltip.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <a href="/mcp/demo/products" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-marquis-blue transition-colors">
            Return to Product Catalog
          </a>
        </div>
      </div>
    </div>
  );
}
