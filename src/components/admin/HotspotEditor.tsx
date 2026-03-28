'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, Trash, FloppyDisk, ArrowsOut, ArrowUUpLeft, 
  CaretRight, CaretLeft, CaretUp, CaretDown, Image, 
  Info, CheckCircle, Warning, CircleNotch, X
} from '@phosphor-icons/react';
import { saveProductConfig } from '@/app/admin/actions';
import { useUploadThing } from '@/lib/uploadthing';

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

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadError: (e: Error) => {
      console.error("UploadThing Error:", e);
      alert(`Upload Error: ${e.message}`);
      setIsUploading(false);
    },
  });

  const handleCustomUpload = async (file: File, type: 'hero' | 'overhead' | 'hotspot', hotspotId?: string) => {
    setIsUploading(true);
    setMessage(null);
    try {
      const res = await startUpload([file]);
      if (res && res[0]) {
        onUploadComplete(res, type, hotspotId);
      } else {
        throw new Error("No response from cloud provider.");
      }
    } catch (e: any) {
      console.error("Upload failed", e);
      setMessage({ type: 'error', text: `Upload failed: ${e.message || 'Unknown error'}` });
      setIsUploading(false);
    }
  };
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLayout, setImgLayout] = useState({ width: 0, height: 0, offX: 0, offY: 0 });

  const updateImgLayout = () => {
    if (!imgRef.current || !containerRef.current) return;
    
    const container = containerRef.current.getBoundingClientRect();
    const { naturalWidth, naturalHeight } = imgRef.current;
    
    if (!naturalWidth || !naturalHeight) return;
    
    const containerAspect = container.width / container.height;
    const imgAspect = naturalWidth / naturalHeight;
    
    let renderW, renderH, offX, offY;
    
    if (imgAspect > containerAspect) {
      renderW = container.width;
      renderH = renderW / imgAspect;
      offX = 0;
      offY = (container.height - renderH) / 2;
    } else {
      renderH = container.height;
      renderW = renderH * imgAspect;
      offY = 0;
      offX = (container.width - renderW) / 2;
    }
    
    setImgLayout({ width: renderW, height: renderH, offX, offY });
  };

  useEffect(() => {
    updateImgLayout();
    const timer = setTimeout(updateImgLayout, 500); 
    window.addEventListener('resize', updateImgLayout);
    return () => {
      window.removeEventListener('resize', updateImgLayout);
      clearTimeout(timer);
    };
  }, [overheadImageUrl]);

  const handleImageClick = (e: React.MouseEvent) => {
    if (!containerRef.current || isDragging.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (imgLayout.width === 0 || imgLayout.height === 0) {
       updateImgLayout();
       return;
    }

    const x = ((mouseX - imgLayout.offX) / imgLayout.width) * 100;
    const y = ((mouseY - imgLayout.offY) / imgLayout.height) * 100;

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
    setHotspots(prev => prev.filter(h => h.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateHotspot = (id: string, updates: Partial<Hotspot>) => {
    setHotspots(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
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

  const onUploadComplete = (res: any, type: 'hero' | 'overhead' | 'hotspot', hotspotId?: string) => {
    const url = res[0].url;
    if (type === 'hero') setHeroImageUrl(url);
    else if (type === 'overhead') setOverheadImageUrl(url);
    else if (type === 'hotspot' && hotspotId) {
      updateHotspot(hotspotId, { imageUrl: url });
    }
    setMessage({ type: 'success', text: 'Image uploaded to cloud.' });
    setIsUploading(false);
  };

  const selectedHotspot = hotspots.find(h => h.id === selectedId);

  return (
    <div className="flex h-full overflow-hidden bg-[#F8FAFC]">
      
      {/* LEFT: INTERACTIVE CANVAS AREA */}
      <div className="flex-grow relative flex items-center justify-center p-12 bg-slate-900 overflow-hidden shadow-2xl">
        <div 
          ref={containerRef}
          className="w-full max-w-6xl aspect-video bg-black relative shadow-[0_0_100px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden cursor-crosshair group"
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
            className="w-full h-full object-contain pointer-events-none select-none transition-opacity duration-700"
            onLoad={() => {
               updateImgLayout();
               setTimeout(updateImgLayout, 200);
            }}
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
                  ? 'bg-marquis-blue border-white ring-8 ring-marquis-blue/20 scale-125' 
                  : 'bg-white border-marquis-blue shadow-lg group-hover:scale-110'
              }`}>
                <Plus className={`w-4 h-4 ${selectedId === h.id ? 'text-white' : 'text-marquis-blue'}`} weight="bold" />
              </div>
              
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {h.label || "Unnamed Feature"}
              </div>
            </div>
          ))}

          {/* Active Area Indicator */}
          <div 
            className="absolute border-2 border-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500"
            style={{ 
              width: imgLayout.width, 
              height: imgLayout.height, 
              left: imgLayout.offX, 
              top: imgLayout.offY 
            }}
          />
        </div>

        {/* BOTTOM DASHBOARD */}
        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center pointer-events-none">
           <div className="flex gap-4 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 pointer-events-auto">
              <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest whitespace-nowrap">
                 <ArrowsOut className="w-4 h-4 text-marquis-blue" /> Click to map
              </div>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-[10px] font-black text-white/50 uppercase tracking-widest whitespace-nowrap">
                 <ArrowUUpLeft className="w-4 h-4 text-marquis-blue" /> Drag to position
              </div>
              {isUploading && (
                  <>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2 text-[10px] font-black text-marquis-blue animate-pulse uppercase tracking-widest">
                       <CircleNotch className="w-3 h-3 animate-spin" /> Syncing Cloud...
                    </div>
                  </>
              )}
           </div>
           
           <div className="flex items-center gap-3 pointer-events-auto">
              {message && (
                <div className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-bounce-in ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {message.type === 'success' ? <CheckCircle weight="bold" /> : <Warning weight="bold" />}
                  {message.text}
                </div>
              )}
              <button 
                onClick={onSave}
                disabled={isSaving}
                className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-[20px] text-xs font-black uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? <CircleNotch className="w-4 h-4 animate-spin text-marquis-blue" /> : <FloppyDisk className="w-4 h-4 text-marquis-blue" />}
                Save Config
              </button>
           </div>
        </div>
      </div>

      {/* RIGHT: PROPERTY SIDEBAR */}
      <aside className="w-[450px] bg-white border-l border-slate-200 flex flex-col h-full shadow-2xl z-50">
        
        {/* SIDEBAR HEADER */}
        <div className="p-8 border-b border-slate-100 flex-shrink-0">
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 shadow-sm text-slate-400">
                 <Image className="w-5 h-5" weight="duotone" />
              </div>
              <div>
                 <h3 className="text-xl font-black italic uppercase text-slate-800 leading-none">{product.modelName}</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Marquis Buying Assistant</p>
              </div>
           </div>
        </div>

        {/* SIDEBAR CONTENT */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar space-y-10 pb-12">
           
           {/* Section 1: Global Media */}
           <section>
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] mb-6 flex items-center gap-3">
                 Product Global Media <div className="h-px bg-slate-100 flex-grow" />
              </h4>
              <div className="space-y-6">
                 {/* Item: Hero */}
                 <div className="flex items-center gap-5 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-marquis-blue/30 transition-all group">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden relative shadow-sm flex-shrink-0">
                       {heroImageUrl ? (
                          <img src={heroImageUrl} className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-200">
                             <Image className="w-6 h-6 mb-1" weight="duotone" />
                             <span className="text-[7px] font-black uppercase">No Hero</span>
                          </div>
                       )}
                       <div className="absolute inset-0 bg-marquis-blue/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                          <Plus className="text-white w-6 h-6" />
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => e.target.files?.[0] && handleCustomUpload(e.target.files[0], 'hero')} />
                       </div>
                    </div>
                    <div>
                       <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Product Hero</span>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Used on main PDP</p>
                    </div>
                 </div>

                 {/* Item: Interactive BG */}
                 <div className="flex items-center gap-5 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:border-marquis-blue/30 transition-all group">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 overflow-hidden relative shadow-sm flex-shrink-0">
                       {overheadImageUrl ? (
                          <img src={overheadImageUrl} className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-200">
                             <Image className="w-6 h-6 mb-1" weight="duotone" />
                             <span className="text-[7px] font-black uppercase">No Map</span>
                          </div>
                       )}
                       <div className="absolute inset-0 bg-marquis-blue/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
                          <Plus className="text-white w-6 h-6" />
                          <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => e.target.files?.[0] && handleCustomUpload(e.target.files[0], 'overhead')} />
                       </div>
                    </div>
                    <div>
                       <span className="text-[11px] font-black text-slate-700 uppercase tracking-tight">Interactive Map</span>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Background for hotspots</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* Section 2: Hotspot Properties */}
           <section className="animate-in fade-in duration-500">
              <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[.3em] mb-6 flex items-center gap-3">
                 Hotspot Properties <div className="h-px bg-slate-100 flex-grow" />
              </h4>

              {selectedHotspot ? (
                <div className="space-y-6">
                   <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Feature Label</label>
                      <input 
                        type="text"
                        value={selectedHotspot.label}
                        onChange={(e) => updateHotspot(selectedHotspot.id, { label: e.target.value })}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-marquis-blue outline-none transition-all"
                        placeholder="e.g. Dual-Speed Pump"
                      />
                   </div>

                   <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Narrative Description</label>
                      <textarea 
                        value={selectedHotspot.description}
                        onChange={(e) => updateHotspot(selectedHotspot.id, { description: e.target.value })}
                        rows={4}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-800 focus:border-marquis-blue outline-none transition-all resize-none"
                        placeholder="Explain this engineering feature..."
                      />
                   </div>

                   <div className="p-5 rounded-3xl border border-slate-100 bg-[#F8FAFC]">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Close-up Detail Media</label>
                      <div className="flex gap-5 items-center">
                         <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 overflow-hidden relative shadow-sm group cursor-pointer flex-shrink-0">
                            {selectedHotspot.imageUrl ? (
                               <img src={selectedHotspot.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                               <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-200">
                                  <Image className="w-8 h-8 mb-1" weight="duotone" />
                                  <span className="text-[7px] font-black uppercase">No Media</span>
                               </div>
                            )}
                            <div className="absolute inset-0 bg-marquis-blue/80 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                               <Plus className="text-white w-5 h-5" />
                               <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => e.target.files?.[0] && handleCustomUpload(e.target.files[0], 'hotspot', selectedHotspot.id)} />
                            </div>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Feature Close-up</span>
                            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1 leading-relaxed">
                              CLICK IMAGE TO<br/>UPLOAD TO CLOUD
                            </p>
                         </div>
                      </div>
                   </div>

                   <div className="flex gap-2">
                     <button 
                        onClick={() => deleteHotspot(selectedHotspot.id)}
                        className="flex-grow p-4 rounded-2xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                     >
                        Delete Hotspot
                     </button>
                   </div>
                </div>
              ) : (
                <div className="py-12 px-6 rounded-3xl border-2 border-dashed border-slate-100 text-center">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300">
                      <Plus className="w-5 h-5" />
                   </div>
                   <h5 className="text-xs font-black italic uppercase text-slate-400 tracking-tight">No Hotspot Selected</h5>
                   <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2 leading-relaxed">Select a marker on the map to<br/>configure its properties</p>
                </div>
              )}
           </section>
        </div>
      </aside>
    </div>
  );
}
