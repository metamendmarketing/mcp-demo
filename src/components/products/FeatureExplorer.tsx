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
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [imgLayout, setImgLayout] = useState({ width: 0, height: 0, offX: 0, offY: 0, containerW: 0, containerH: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Calculate the actual rendered bounds of the image within the object-contain container
  const updateImageLayout = () => {
    if (!containerRef.current || !imgRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const naturalW = imgRef.current.naturalWidth;
    const naturalH = imgRef.current.naturalHeight;

    if (!naturalW || !naturalH) return;

    const containerRatio = container.width / container.height;
    const imageRatio = naturalW / naturalH;

    let renderedW, renderedH, offsetX, offsetY;
    if (imageRatio > containerRatio) {
      renderedW = container.width;
      renderedH = container.width / imageRatio;
      offsetX = 0;
      offsetY = (container.height - renderedH) / 2;
    } else {
      renderedW = container.height * imageRatio;
      renderedH = container.height;
      offsetX = (container.width - renderedW) / 2;
      offsetY = 0;
    }

    setImgLayout({ 
      width: renderedW, 
      height: renderedH, 
      offX: offsetX, 
      offY: offsetY,
      containerW: container.width,
      containerH: container.height
    });
  };

  useEffect(() => {
    updateImageLayout();
    window.addEventListener('resize', updateImageLayout);
    return () => window.removeEventListener('resize', updateImageLayout);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveHotspot(activeHotspot === id ? null : id);
    }
    if (e.key === 'Escape') setActiveHotspot(null);
  };

  const getSmartDirection = (spot: Hotspot) => {
    let dir = spot.direction || 'top';
    if (spot.y < 25 && dir.includes('top')) dir = dir.replace('top', 'bottom') as any;
    if (spot.y > 75 && dir.includes('bottom')) dir = dir.replace('bottom', 'top') as any;
    if (spot.x < 25 && dir.includes('left')) dir = dir.replace('left', 'right') as any;
    if (spot.x > 75 && dir.includes('right')) dir = dir.replace('right', 'left') as any;
    return dir;
  };

  // Image-relative coordinate for the magnifier content
  // We clamp it to 0-100 of the image content area
  const imgRelX = Math.max(0, Math.min(100, ((mousePos.x - imgLayout.offX) / imgLayout.width) * 100));
  const imgRelY = Math.max(0, Math.min(100, ((mousePos.y - imgLayout.offY) / imgLayout.height) * 100));

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative group overflow-hidden bg-slate-50 border border-slate-200 shadow-xl select-none",
        showMagnifier && !activeHotspot ? "cursor-none" : "cursor-default",
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
        ref={imgRef}
        src={src} 
        alt={alt} 
        onLoad={updateImageLayout}
        className={cn(
          "w-full h-full object-contain transition-opacity duration-500 pointer-events-none",
          showMagnifier ? "opacity-40" : "opacity-100"
        )}
      />

      {/* Magnifier Lens (Desktop Only) */}
      {showMagnifier && !activeHotspot && imgLayout.width > 0 && (
        <div 
          className="absolute pointer-events-none z-[100] w-64 h-64 rounded-full border-4 border-white shadow-[0_0_50px_rgba(0,0,0,0.4)] overflow-hidden bg-white hidden md:block"
          style={{ 
            left: `${mousePos.x}px`, 
            top: `${mousePos.y}px`,
            transform: 'translate(-50%, -50%)',
            backgroundImage: `url(${src})`,
            // Accurate 3.0x Zoom of the image content area
            backgroundPosition: `${Math.round(128 - (mousePos.x - imgLayout.offX) * 3.0)}px ${Math.round(128 - (mousePos.y - imgLayout.offY) * 3.0)}px`,
            backgroundSize: `${Math.round(imgLayout.width * 3.0)}px ${Math.round(imgLayout.height * 3.0)}px`,
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
        </div>
      )}

      {/* Hotspots Layer - Positioned relative to the IMAGE area, not the container */}
      {hotspots.map((spot) => {
        const smartDir = getSmartDirection(spot);
        const isActive = activeHotspot === spot.id;

        // Map percentage to actual container pixels using the calibrated image bounds
        const spotLeft = imgLayout.offX + (spot.x / 100) * imgLayout.width;
        const spotTop = imgLayout.offY + (spot.y / 100) * imgLayout.height;

        return (
          <div 
            key={spot.id} 
            className="absolute z-20"
            style={{ 
              left: `${(spotLeft / imgLayout.containerW) * 100}%`, 
              top: `${(spotTop / imgLayout.containerH) * 100}%`, 
              transform: 'translate(-50%, -50%)' 
            }}
          >
            {/* Hotspot Pulse Trigger */}
            <button
              aria-label={`Show details for ${spot.title}`}
              aria-expanded={isActive}
              onMouseEnter={() => {
                setActiveHotspot(spot.id);
                setShowMagnifier(false);
              }}
              onMouseLeave={() => {
                setActiveHotspot(null);
                setShowMagnifier(true);
              }}
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

            {/* Smart Tooltip Layer */}
            <div 
              className={cn(
                "absolute w-72 bg-slate-900 text-white rounded-2xl shadow-2xl transition-all duration-300 pointer-events-none z-[150] p-0 overflow-hidden border border-white/10",
                isActive ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 pointer-events-none translate-y-2",
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
                  smartDir === 'bottom-right' && "top-[-6px] left-4 border-b-0 border-r-0",
                  !isActive && "hidden"
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
