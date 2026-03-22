import re

with open('c:/dev2/src/components/wizard/Wizard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Make sure BookOpen and Scale are imported
if "BookOpen" not in code:
    code = code.replace("import {\n  Check,", "import {\n  BookOpen, Scale, Check,")

# Pattern to replace the entire step === 'details' block
pattern = r"if \(step === 'details' && selectedResult\) \{.*?return null;\n\}"

replacement = """if (step === 'details' && selectedResult) {
    const { product, reasons } = selectedResult;
    const heroImg = getHeroImage(product.modelName);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-slick-reveal">
         {/* TOP ACTIONS */}
         <div className="flex justify-between items-center mb-6">
            <button onClick={() => setStep('results')} className="text-slate-500 hover:text-marquis-blue flex items-center gap-2 font-black text-xs uppercase tracking-widest transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-2 sm:gap-4">
               <button className="hidden sm:block bg-white text-marquis-blue border-2 border-marquis-blue px-6 py-2 rounded-xl text-sm font-black italic uppercase hover:bg-marquis-blue/5 transition-all">Find Dealer</button>
               <button className="bg-marquis-blue text-white px-6 py-2 rounded-xl text-sm font-black italic uppercase shadow-xl hover:bg-blue-700 transition-all">Get Pricing</button>
            </div>
         </div>

         {/* HERO SECTION - COMPACT */}
         <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100 mb-8 flex flex-col md:flex-row">
            <div className="md:w-1/2 relative bg-slate-50 border-r border-slate-100">
               <img src={heroImg} className="w-full h-full object-cover absolute inset-0" alt={product.modelName} />
               <div className="relative z-10 p-8 min-h-[350px] flex flex-col justify-end bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent">
                  <div className="text-white/80 text-xs font-black uppercase tracking-widest mb-1 shadow-sm">Crown Series Collection</div>
                  <h3 className="text-5xl md:text-6xl font-black italic uppercase text-white leading-none drop-shadow-lg">{product.modelName}</h3>
               </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
               <h2 className="text-2xl md:text-3xl font-black italic uppercase text-slate-800 tracking-tight flex items-center gap-3 mb-8 border-b border-slate-100 pb-6">
                  {narrativeLoading ? "Synthesizing Profile..." : (aiNarrative?.heroTitle || product.modelName)} 
                  <Sparkles className="w-6 h-6 text-marquis-blue flex-shrink-0" />
               </h2>
               
               {/* At a glance boxes */}
               <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                     <Maximize className="w-6 h-6 text-marquis-blue/80" />
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dimensions</div>
                       <div className="text-sm font-black italic uppercase text-slate-700">{product.lengthIn}x{product.widthIn}"</div>
                     </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                     <Users className="w-6 h-6 text-marquis-blue/80" />
                     <div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capacity</div>
                       <div className="text-sm font-black italic uppercase text-slate-700">{product.seatsMin}-{product.seatsMax} Adults</div>
                     </div>
                  </div>
               </div>

               {/* Confirmation Bullets */}
               <div className="space-y-4 bg-blue-50/40 p-6 rounded-2xl border border-blue-100/50">
                  <div className="text-xs font-black text-marquis-blue uppercase tracking-widest mb-3">Why this is your perfect match</div>
                  {reasons.slice(0, 3).map((r, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div className="bg-marquis-blue text-white rounded-full p-1 mt-0.5"><Check className="w-3 h-3" /></div>
                      <p className="text-sm text-slate-700 font-semibold leading-snug">{r}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* INTERACTIVE HOTSPOTS - FULL WIDTH */}
         {product.overheadImageUrl && (
            <section className="mb-12">
               <div className="flex items-center gap-3 mb-6 px-2">
                 <Settings className="w-6 h-6 text-marquis-blue" />
                 <h4 className="text-2xl font-black italic uppercase text-slate-800">Interactive Feature Explorer</h4>
               </div>
               <div className="relative aspect-square md:aspect-video rounded-[32px] bg-[#f8fafc] group shadow-xl border border-slate-100 overflow-hidden">
                  <img src={product.overheadImageUrl} className="w-full h-full object-contain p-4 md:p-10" alt="Overhead View" />
                  
                  {/* Hotspots */}
                  {product.hotspots && (typeof product.hotspots === 'string' ? JSON.parse(product.hotspots) : product.hotspots).map((spot: any, i: number) => (
                    <div key={i} className="absolute group/spot transition-all z-20" style={{ top: `${spot.y}%`, left: `${spot.x}%` }}>
                      <button className="w-8 h-8 md:w-10 md:h-10 bg-marquis-blue text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse">
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-72 bg-slate-900/95 backdrop-blur-md text-white p-5 rounded-2xl shadow-2xl opacity-0 group-hover/spot:opacity-100 transition-opacity pointer-events-none z-30">
                        <div className="text-sm font-black uppercase italic text-marquis-blue mb-2 border-b border-marquis-blue/30 pb-2">{spot.title}</div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{spot.description}</p>
                      </div>
                    </div>
                  ))}
               </div>
               <p className="text-center text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest italic animate-pulse">Hover over hotspots to reveal engineering details</p>
            </section>
         )}

         {/* HORIZONTAL AI STACK */}
         <section className="mb-12">
            <div className="flex items-center gap-3 mb-8 px-2">
              <BookOpen className="w-6 h-6 text-marquis-blue" />
              <h4 className="text-2xl font-black italic uppercase text-slate-800">AI Synthesized Blueprint</h4>
            </div>
            
            <div className="space-y-4">
              {[
                { id: 'hydrotherapy', title: 'Hydrotherapy & Wellness', bg: 'bg-indigo-50/30', border: 'border-indigo-100', iconBg: 'bg-indigo-100 text-indigo-600', icon: <Activity className="w-6 h-6" /> },
                { id: 'climate', title: 'Climate & Surroundings', bg: 'bg-sky-50/30', border: 'border-sky-100', iconBg: 'bg-sky-100 text-sky-600', icon: <Thermometer className="w-6 h-6" /> },
                { id: 'design', title: 'Design & Capacity', bg: 'bg-amber-50/30', border: 'border-amber-100', iconBg: 'bg-amber-100 text-amber-600', icon: <Users className="w-6 h-6" /> },
                { id: 'efficiency', title: 'Power & Maintenance', bg: 'bg-emerald-50/30', border: 'border-emerald-100', iconBg: 'bg-emerald-100 text-emerald-600', icon: <Zap className="w-6 h-6" /> }
              ].map((mod, i) => (
                <div key={i} className={`flex flex-col md:flex-row gap-6 p-6 md:p-8 rounded-[32px] border shadow-sm transition-all hover:shadow-md ${mod.bg} ${mod.border}`}>
                  <div className="md:w-1/3 flex items-start gap-5 border-b md:border-b-0 md:border-r border-slate-200/50 pb-4 md:pb-0 md:pr-6">
                     <div className={`p-4 rounded-2xl shadow-sm flex-shrink-0 ${mod.iconBg}`}>{mod.icon}</div>
                     <div className="pt-1">
                       <h3 className="text-xl font-black italic uppercase text-slate-900 leading-none">{mod.title}</h3>
                     </div>
                  </div>
                  <div className="md:w-2/3 md:pl-2">
                    {narrativeLoading ? (
                      <div className="space-y-3 animate-pulse pt-1">
                        <div className="h-3 bg-slate-200/60 rounded w-full"></div>
                        <div className="h-3 bg-slate-200/60 rounded w-5/6"></div>
                        <div className="h-3 bg-slate-200/60 rounded w-4/6"></div>
                      </div>
                    ) : (aiNarrative as any)?.error ? (
                      <div className="text-red-500 text-sm font-medium">Generation Failed: {(aiNarrative as any).error}</div>
                    ) : (
                      <div className="text-sm md:text-base text-slate-600 leading-relaxed font-semibold prose prose-slate" dangerouslySetInnerHTML={{ __html: (aiNarrative as any)?.[mod.id] || "Synthesizing your personalized profile..." }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
         </section>

         {/* COMPARISON TABLE */}
         <section className="mb-14">
            <div className="flex items-center gap-3 mb-6 px-2">
              <Scale className="w-6 h-6 text-marquis-blue" />
              <h4 className="text-2xl font-black italic uppercase text-slate-800">Competitive Edge</h4>
            </div>
            
            <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-100">
               <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
                 <div className="col-span-2 p-5 md:p-8 font-black text-xs uppercase tracking-widest text-slate-400 flex items-end">Core Technology</div>
                 <div className="col-span-1 p-5 md:p-8 font-black italic text-lg md:text-2xl uppercase text-slate-900 border-l border-slate-200 bg-white">
                     {product.modelName}
                     <div className="text-[10px] sm:text-xs text-marquis-blue font-bold tracking-widest not-italic mt-1">Marquis Crown</div>
                 </div>
                 <div className="col-span-1 p-5 md:p-8 font-black italic text-lg md:text-2xl uppercase text-slate-400 border-l border-slate-200">
                     Industry<br className="hidden md:block"/> Standard
                     <div className="text-[10px] sm:text-xs text-slate-400 font-bold tracking-widest not-italic mt-1">Comparable</div>
                 </div>
               </div>
               
               {[
                 { feature: "Therapy Flow Protocol", desc: "How water is managed and driven to the jets", marquis: "V-O-L-T™ System (High Volume, Low Pressure)", comp: "Standard High-Pressure Manifolds" },
                 { feature: "Targeted Intensity", desc: "Specialized zones for deep tissue", marquis: "H.O.T. Zones™ (High Output Therapy)", comp: "Basic Seat Configurations" },
                 { feature: "Sanitation Automation", desc: "Water care management", marquis: "SmartClean™ Software Architecture", comp: "Manual Timer Cycles" },
                 { feature: "Thermal Retention", desc: "Insulation for cold climates", marquis: "MaximizR™ Full-Foam Matrix", comp: "Partial Foam / Perimeter" },
                 { feature: "Structural Integrity", desc: "Exterior cabinet material", marquis: "DuraWood™ Extruded Profiling", comp: "Hollow Synthetic Panels" }
               ].map((row, i) => (
                 <div key={i} className="grid grid-cols-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                   <div className="col-span-2 p-5 md:p-8 flex flex-col justify-center">
                      <div className="text-sm md:text-base font-black uppercase text-slate-700">{row.feature}</div>
                      <div className="text-xs text-slate-400 font-medium mt-1">{row.desc}</div>
                   </div>
                   <div className="col-span-1 p-5 md:p-8 text-xs md:text-sm font-black text-marquis-blue flex flex-col justify-center border-l border-slate-100 bg-blue-50/10">
                      <div className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-marquis-blue flex-shrink-0 mt-0.5 hidden md:block" />
                        <span className="leading-snug">{row.marquis}</span>
                      </div>
                   </div>
                   <div className="col-span-1 p-5 md:p-8 text-xs md:text-sm font-bold text-slate-400 flex flex-col justify-center border-l border-slate-100">
                      <span className="leading-snug">{row.comp}</span>
                   </div>
                 </div>
               ))}
            </div>
         </section>

         {/* BOTTOM CTAS */}
         <div className="bg-slate-900 rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-marquis-blue/30 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Star className="w-64 h-64" />
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black italic uppercase text-white mb-6 relative z-10 leading-none">Your Sanctuary<br/>Awaits.</h3>
            <p className="text-slate-300 mb-10 max-w-xl mx-auto font-medium text-base md:text-lg relative z-10">Lock in your personalized blueprint {product.modelName} spec sheet by contacting an Authorized Marquis Dealer.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
               <button className="bg-white text-marquis-blue px-10 py-5 rounded-2xl text-sm md:text-base font-black italic uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">Find Nearest Dealer</button>
               <button className="bg-marquis-blue border-2 border-marquis-blue text-white px-10 py-5 rounded-2xl text-sm md:text-base font-black italic uppercase shadow-xl hover:bg-transparent transition-all">Get Local Pricing</button>
            </div>
         </div>
      </div>
    );
  }

  return null;
}
"""

new_code = re.sub(pattern, replacement, code, flags=re.DOTALL)

with open('c:/dev2/src/components/wizard/Wizard.tsx', 'w', encoding='utf-8') as f:
    f.write(new_code)

print("Master Layout Refactor Completed Successfully.")
