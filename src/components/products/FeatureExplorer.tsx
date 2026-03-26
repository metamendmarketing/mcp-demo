/**
 * FeatureExplorer.tsx
 * 
 * A robust, reusable component for interactive product diagrams.
 * Features:
 * - Circular viewport-aware magnifier lens.
 * - Accessible, percentage-based hotspots with smart tooltips.
 * - Intelligent edge-collision handling.
 * - Responsive, mobile-friendly design.
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { cn } from '../../lib/utils';

interface Hotspot {
  id: string;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  title: string;
  caption: string;
  imageUrl?: string;
  link?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

interface FeatureExplorerProps {
  src: string;
  alt: string;
  hotspots: Hotspot[];
  aspectRatio?: string; // e.g. "aspect-video"
  className?: string;
}

export default function FeatureExplorer({ 
  src, 
  alt, 
  hotspots, 
  aspectRatio = "aspect-video",
  className
}: FeatureExplorerProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, relX: 0, relY: 0, width: 0, height: 0 });
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Mouse Movement for Magnifier
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    // Viewport relative coordinates for the 'fixed' lens
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Container relative coordinates for the 'background-position'
    const relX = ((clientX - left) / width) * 100;
    const relY = ((clientY - top) / height) * 100;

    setMagnifierPos({ 
      x: clientX, 
      y: clientY, 
      relX, 
      relY,
      width,
      height
    });
  };

  // Keyboard accessibility for hotspots
  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveHotspot(activeHotspot === id ? null : id);
    }
    if (e.key === 'Escape') {
      setActiveHotspot(null);
    }
  };

  // Tooltip Helper: Determine actual direction with collision handling
  const getSmartDirection = (spot: Hotspot) => {
    if (!containerRef.current) return spot.direction || 'top';
    
    // Basic flip logic: if it's too close to an edge, flip the primary axis
    let dir = spot.direction || 'top';
    
    if (spot.y < 20 && dir.includes('top')) dir = dir.replace('top', 'bottom') as any;
    if (spot.y > 80 && dir.includes('bottom')) dir = dir.replace('bottom', 'top') as any;
    if (spot.x < 20 && dir.includes('left')) dir = dir.replace('left', 'right') as any;
    if (spot.x > 80 && dir.includes('right')) dir = dir.replace('right', 'left') as any;
    
    return dir;
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative group overflow-hidden bg-slate-50 border border-slate-200 shadow-xl select-none",
        "cursor-none", // Hide cursor for magnifier
        aspectRatio,
        className
      )}
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => {
        setShowMagnifier(false);
        setActiveHotspot(null);
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Primary Image */}
      <img 
        src={src} 
        alt={alt} 
        className={cn(
          "w-full h-full object-contain transition-opacity duration-500 pointer-events-none",
          showMagnifier ? "opacity-50" : "opacity-100"
        )}
      />

      {/* Magnifier Lens (Desktop Only) */}
      {showMagnifier && !activeHotspot && (
        <div 
          className="absolute pointer-events-none z-[100] w-56 h-56 rounded-full border-4 border-white shadow-[0_0_40px_rgba(0,0,0,0.4)] overflow-hidden bg-white hidden md:block"
          style={{ 
            left: `${magnifierPos.relX}%`, 
            top: `${magnifierPos.relY}%`,
            transform: 'translate(-50%, -50%)',
            backgroundImage: `url(${src})`,
            // Pixel-based positioning for true 4.5x zoom relative to the container
            backgroundPosition: `${112 - (magnifierPos.relX / 100) * (magnifierPos.width * 4.5)}px ${112 - (magnifierPos.relY / 100) * (magnifierPos.height * 4.5)}px`,
            backgroundSize: `${magnifierPos.width * 4.5}px ${magnifierPos.height * 4.5}px`,
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Lens center indicator (optional) */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
        </div>
      )}

      {/* Hotspots Layer */}
      {hotspots.map((spot) => {
        const smartDir = getSmartDirection(spot);
        const isActive = activeHotspot === spot.id;

        return (
          <div 
            key={spot.id} 
            className="absolute z-20"
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            {/* Hotspot Pulse Trigger */}
            <button
              aria-label={`Show details for ${spot.title}`}
              aria-expanded={isActive}
              onMouseEnter={() => setActiveHotspot(spot.id)}
              onMouseLeave={() => setActiveHotspot(null)}
              onKeyDown={(e) => handleKeyDown(e, spot.id)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white shadow-lg focus:outline-none focus:ring-4 focus:ring-marquis-blue/50",
                isActive 
                  ? "bg-slate-900 scale-125 z-30" 
                  : "bg-marquis-blue hover:scale-110"
              )}
            >
              <div className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-25" />
              <Plus 
                className={cn("w-5 h-5 text-white transition-transform duration-300", isActive && "rotate-45")} 
                weight="bold" 
              />
            </button>

            {/* Smart Tooltip Tooltip */}
            <div 
              className={cn(
                "absolute w-72 bg-slate-900 text-white rounded-2xl shadow-2xl transition-all duration-300 pointer-events-none z-40 p-0 overflow-hidden border border-white/10",
                isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 pointer-events-none translate-y-2",
                // Positioning logic based on 'direction'
                smartDir === 'top' && "bottom-full mb-6 left-1/2 -translate-x-1/2",
                smartDir === 'bottom' && "top-full mt-6 left-1/2 -translate-x-1/2",
                smartDir === 'left' && "right-full mr-6 top-1/2 -translate-y-1/2",
                smartDir === 'right' && "left-full ml-6 top-1/2 -translate-y-1/2",
                smartDir === 'top-left' && "bottom-full mb-6 right-0",
                smartDir === 'top-right' && "bottom-full mb-6 left-0",
                smartDir === 'bottom-left' && "top-full mt-6 right-0",
                smartDir === 'bottom-right' && "top-full mt-6 left-0"
              )}
            >
              {spot.imageUrl && (
                <div className="w-full h-32 overflow-hidden border-b border-white/10">
                  <img src={spot.imageUrl} className="w-full h-full object-cover" alt={spot.title} />
                </div>
              )}
              <div className="p-5">
                <div className="text-sm font-black italic uppercase text-marquis-blue mb-2 tracking-tight">
                  {spot.title}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {spot.caption}
                </p>
                {spot.link && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-black uppercase text-white/60 tracking-widest flex items-center gap-2">
                      Learn More <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
              
              {/* Tooltip Tail */}
              <div 
                className={cn(
                  "absolute w-3 h-3 bg-slate-900 rotate-45 border border-white/10",
                  smartDir === 'top' && "bottom-[-6px] left-1/2 -translate-x-1/2 border-t-0 border-l-0",
                  smartDir === 'bottom' && "top-[-6px] left-1/2 -translate-x-1/2 border-b-0 border-r-0",
                  smartDir === 'left' && "right-[-6px] top-1/2 -translate-y-1/2 border-b-0 border-l-0",
                  smartDir === 'right' && "left-[-6px] top-1/2 -translate-y-1/2 border-t-0 border-r-0",
                  smartDir === 'top-left' && "bottom-[-6px] right-4 border-t-0 border-l-0",
                  smartDir === 'top-right' && "bottom-[-6px] left-4 border-t-0 border-l-0",
                  smartDir === 'bottom-left' && "top-[-6px] right-4 border-b-0 border-r-0",
                  smartDir === 'bottom-right' && "top-[-6px] left-4 border-b-0 border-r-0"
                )}
              />
            </div>
          </div>
        );
      })}

      {/* Instructional Overlay (Visible initially) */}
      <div className="absolute inset-0 bg-slate-900/10 pointer-events-none group-hover:bg-transparent transition-colors duration-500" />
    </div>
  );
}
