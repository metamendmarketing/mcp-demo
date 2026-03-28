'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash, FloppyDisk, ArrowsOut, ArrowUUpLeft, 
  CaretRight, CaretLeft, CaretUp, CaretDown, Image, 
  Info, CheckCircle, Warning, CircleNotch, X
} from '@phosphor-icons/react';
import { saveProductConfig } from '@/app/admin/actions';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  imageUrl?: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

interface HotspotEditorProps {
  product: any;
  initialHotspots: Hotspot[];
}

export default function HotspotEditor({ product, initialHotspots }: HotspotEditorProps) {
  const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots);
  const [heroImageUrl, setHeroImageUrl] = useState(product.heroImageUrl || '');
  const [overheadImageUrl, setOverheadImageUrl] = useState(product.overheadImageUrl || '');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLayout, setImgLayout] = useState({ width: 0, height: 0, offX: 0, offY: 0 });

  // Calculate image layout within the object-contain container
  // This mirrors the logic in FeatureExplorer.tsx for 100% compatibility
  const updateImgLayout = () => {
    if (!imgRef.current || !containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const { naturalWidth, naturalHeight } = imgRef.current;
    
    if (!naturalWidth || !naturalHeight) return;
    
    const containerAspect = container.width / container.height;
    const imgAspect = naturalWidth / naturalHeight;
    
    let renderW, renderH, offX, offY;
    
    if (imgAspect > containerAspect) {
      // Width limited
      renderW = container.width;
      renderH = renderW / imgAspect;
      offX = 0;
      offY = (container.height - renderH) / 2;
    } else {
      // Height limited
      renderH = container.height;
      renderW = renderH * imgAspect;
      offY = 0;
      offX = (container.width - renderW) / 2;
    }
    
    setImgLayout({ width: renderW, height: renderH, offX, offY });
  };

  useEffect(() => {
    window.addEventListener('resize', updateImgLayout);
    return () => window.removeEventListener('resize', updateImgLayout);
  }, []);

  const handleImageClick = (e: React.MouseEvent) => {
    if (!containerRef.current || isDragging.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates 0-100 based on the RENDERED IMAGE rectangle
    const x = ((mouseX - imgLayout.offX) / imgLayout.width) * 100;
    const y = ((mouseY - imgLayout.offY) / imgLayout.height) * 100;

    // Check if click is inside the actual image (out of black bars)
    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const newHotspot: Hotspot = {
      id: `new-${Date.now()}`,
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100,
      label: 'New Feature',
      description: 'Enter a detailed description of this feature...',
      direction: 'top'
    };

    setHotspots([...hotspots, newHotspot]);
    setSelectedId(newHotspot.id);
  };

  const isDragging = useRef(false);
  const dragTargetId = useRef<string | null>(null);

  const startDrag = (e: React.MouseEvent | React.TouchEvent, id: string) => {
    e.stopPropagation();
    isDragging.current = true;
    dragTargetId.current = id;
    setSelectedId(id);
  };

  const onDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !dragTargetId.current || !containerRef.current) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const x = Math.max(0, Math.min(100, ((mouseX - imgLayout.offX) / imgLayout.width) * 100));
    const y = Math.max(0, Math.min(100, ((mouseY - imgLayout.offY) / imgLayout.height) * 100));

    setHotspots(prev => prev.map(h => 
      h.id === dragTargetId.current ? { ...h, x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 } : h
    ));
  };

  const stopDrag = () => {
    setTimeout(() => { isDragging.current = false; }, 50);
    dragTargetId.current = null;
  };

  const deleteHotspot = (id: string) => {
    setHotspots(hotspots.filter(h => h.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateHotspot = (id: string, updates: Partial<Hotspot>) => {
    setHotspots(hotspots.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const onSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const dataToSave = hotspots.map(({ id, ...rest }) => rest);
      const result = await saveProductConfig(product.id, { 
        hotspots: dataToSave,
        heroImageUrl: heroImageUrl,
        overheadImageUrl: overheadImageUrl
      });
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Changes saved successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to save.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Fatal error during save.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'hero' | 'overhead' | 'hotspot', hotspotId?: string) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/mcp/demo/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        if (type === 'hero') setHeroImageUrl(data.url);
        else if (type === 'overhead') setOverheadImageUrl(data.url);
        else if (type === 'hotspot' && hotspotId) {
          updateHotspot(hotspotId, { imageUrl: data.url });
        }
        setMessage({ type: 'success', text: 'Image uploaded successfully.' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Upload failed.' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Upload error.' });
    } finally {
      setIsUploading(false);
    }
  };

  const selectedHotspot = hotspots.find(h => h.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-slate-100">
      
      {/* CANVAS AREA */}
      <div className="flex-grow flex flex-col p-6 min-h-[500px] overflow-y-auto">
        
        {/* MEDIA MANAGEMENT BAR */}
        <div className="bg-white rounded-3xl p-6 mb-8 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Product Hero (PDP Hero)</label>
                <div className="flex items-center gap-2">
                   {isUploading && <CircleNotch className="w-3 h-3 animate-spin text-marquis-blue" />}
                   <input 
                      type="file" 
                      id="hero-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'hero')}
                   />
                   <label htmlFor="hero-upload" className="text-[10px] font-bold text-marquis-blue hover:text-marquis-light-blue cursor-pointer flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Upload New
                   </label>
                </div>
             </div>
             <div className="flex gap-4">
               <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                  <img src={heroImageUrl || `/mcp/demo/assets/products/${product.slug}/hero.png`} className="w-full h-full object-cover" />
               </div>
               <input 
                 type="text" 
                 value={heroImageUrl}
                 onChange={(e) => setHeroImageUrl(e.target.value)}
                 className="flex-grow bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-500 self-center h-12 outline-none focus:border-marquis-blue"
                 placeholder="Hero Image URL..."
               />
             </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Interactive Image (Explorer)</label>
                <div className="flex items-center gap-2">
                   <input 
                      type="file" 
                      id="overhead-upload" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'overhead')}
                   />
                   <label htmlFor="overhead-upload" className="text-[10px] font-bold text-marquis-blue hover:text-marquis-light-blue cursor-pointer flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Upload New
                   </label>
                </div>
             </div>
             <div className="flex gap-4">
               <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                  <img src={overheadImageUrl || `/mcp/demo/assets/products/${product.slug}/overhead.jpg`} className="w-full h-full object-cover" />
               </div>
               <input 
                 type="text" 
                 value={overheadImageUrl}
                 onChange={(e) => setOverheadImageUrl(e.target.value)}
                 className="flex-grow bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-xs font-bold text-slate-500 self-center h-12 outline-none focus:border-marquis-blue"
                 placeholder="Overhead Image URL..."
               />
             </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black italic uppercase text-slate-800 leading-none">{product.modelName}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Interactive Hotspot Editor</p>
          </div>
          <div className="flex items-center gap-4">
             {message && (
               <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce-in ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                 {message.type === 'success' ? <CheckCircle weight="fill" /> : <Warning weight="fill" />}
                 {message.text}
               </div>
             )}
             <button 
               onClick={onSave}
               disabled={isSaving}
               className="btn-marquis-premium px-6 py-3 rounded-xl text-sm font-black italic uppercase shadow-lg flex items-center gap-2 disabled:opacity-50"
             >
               {isSaving ? <CircleNotch className="w-4 h-4 animate-spin" /> : <FloppyDisk className="w-4 h-4" />}
               Save Config
             </button>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="flex-grow relative bg-slate-900 rounded-[32px] overflow-hidden shadow-inner cursor-crosshair group"
          onClick={handleImageClick}
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchMove={onDrag}
          onTouchEnd={stopDrag}
        >
          {/* Base Product Image */}
          <img 
            ref={imgRef}
            src={overheadImageUrl || `/mcp/demo/assets/products/${product.slug}/overhead.jpg`}
            alt={product.modelName}
            className="w-full h-full object-contain pointer-events-none select-none"
            onLoad={updateImgLayout}
          />

          {/* Rendered Hotspots */}
          {hotspots.map((h) => (
            <div 
              key={h.id}
              className={`absolute group cursor-move -translate-x-1/2 -translate-y-1/2 transition-transform ${selectedId === h.id ? 'z-50' : 'z-20 hover:z-30'}`}
              style={{ 
                left: `${imgLayout.offX + (h.x * imgLayout.width / 100)}px`, 
                top: `${imgLayout.offY + (h.y * imgLayout.height / 100)}px` 
              }}
              onMouseDown={(e) => startDrag(e, h.id)}
              onTouchStart={(e) => startDrag(e, h.id)}
            >
              <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${
                selectedId === h.id 
                  ? 'bg-marquis-blue border-white ring-4 ring-marquis-blue/20 scale-125' 
                  : 'bg-white border-marquis-blue shadow-md group-hover:scale-110'
              }`}>
                <Plus className={`w-4 h-4 ${selectedId === h.id ? 'text-white' : 'text-marquis-blue'}`} weight="bold" />
              </div>
              
              {/* Optional ID tag while editing */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {h.label || "Unnamed"}
              </div>
            </div>
          ))}

          {/* Calibration Overlay (Optional indicator of active area) */}
          <div 
            className="absolute border-2 border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ 
              width: imgLayout.width, 
              height: imgLayout.height, 
              left: imgLayout.offX, 
              top: imgLayout.offY 
            }}
          />
        </div>

        <div className="mt-4 flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-white/50 p-4 rounded-2xl border border-slate-200/50">
           <div className="flex items-center gap-1.5"><ArrowsOut weight="bold" className="text-marquis-blue" /> Click center to add</div>
           <div className="flex items-center gap-1.5"><ArrowUUpLeft weight="bold" className="text-marquis-blue" /> Drag to move</div>
           <div className="flex items-center gap-1.5"><Plus weight="bold" className="text-marquis-blue" /> Select to edit info</div>
        </div>
      </div>

      {/* INSPECTOR SIDEBAR */}
      <aside className="w-full lg:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col h-full overflow-hidden animate-slide-in-right">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h4 className="text-lg font-black italic uppercase text-slate-800 tracking-tight">Hotspot Inspector</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Configure metadata & visual cues</p>
        </div>

        <div className="flex-grow overflow-y-auto p-8 space-y-8">
          {selectedHotspot ? (
            <>
              {/* Basic Metadata */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Feature Name (Title)</label>
                  <input 
                    type="text"
                    value={selectedHotspot.label}
                    onChange={(e) => updateHotspot(selectedHotspot.id, { label: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold text-slate-800 focus:border-marquis-blue outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Technical Description</label>
                  <textarea 
                    rows={4}
                    value={selectedHotspot.description}
                    onChange={(e) => updateHotspot(selectedHotspot.id, { description: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-sm font-bold text-slate-800 focus:border-marquis-blue outline-none resize-none"
                  />
                </div>
              </div>

              {/* Visual Config */}
              <div className="space-y-6 pt-8 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Explainer Direction (Tooltip Position)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { icon: <CaretUp />, key: 'top' },
                      { icon: <CaretDown />, key: 'bottom' },
                      { icon: <CaretLeft />, key: 'left' },
                      { icon: <CaretRight />, key: 'right' }
                    ].map(dir => (
                      <button 
                        key={dir.key}
                        onClick={() => updateHotspot(selectedHotspot.id, { direction: dir.key as any })}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center ${selectedHotspot.direction === dir.key ? 'border-marquis-blue bg-blue-50 text-marquis-blue' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                      >
                        {dir.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deep Feature Image URL (Optional)</label>
                    <input 
                      type="file" 
                      id={`hotspot-upload-${selectedHotspot.id}`} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'hotspot', selectedHotspot.id)}
                    />
                    <label htmlFor={`hotspot-upload-${selectedHotspot.id}`} className="text-[9px] font-black text-marquis-blue hover:text-marquis-light-blue cursor-pointer uppercase tracking-widest">
                      Upload
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input 
                        type="text"
                        placeholder="/assets/features/example.png"
                        value={selectedHotspot.imageUrl || ''}
                        onChange={(e) => updateHotspot(selectedHotspot.id, { imageUrl: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl py-3 pl-10 pr-3 text-xs font-bold text-slate-800 focus:border-marquis-blue outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Coordinates Display (Read-only for info) */}
              <div className="pt-8 flex justify-between gap-4">
                 <div className="flex-grow p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">POS X</span>
                    <span className="text-xs font-black text-slate-800">{selectedHotspot.x}%</span>
                 </div>
                 <div className="flex-grow p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">POS Y</span>
                    <span className="text-xs font-black text-slate-800">{selectedHotspot.y}%</span>
                 </div>
              </div>

              <div className="pb-8">
                <button 
                  onClick={() => deleteHotspot(selectedHotspot.id)}
                  className="w-full p-4 rounded-2xl border-2 border-red-50 bg-red-50/50 text-red-500 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-100 transition-all"
                >
                  <Trash className="w-4 h-4" /> Delete Hotspot
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-20 px-4">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center">
                 <Info className="w-8 h-8 text-slate-200" weight="duotone" />
              </div>
              <div>
                <h5 className="text-sm font-black italic uppercase text-slate-400 tracking-tight">No Selection</h5>
                <p className="text-[10px] font-bold text-slate-300 uppercase leading-relaxed mt-2">
                  Click an existing hotspot marker on the canvas or click anywhere on the image to add a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
