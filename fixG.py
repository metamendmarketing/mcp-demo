import re

# 1. FIX ROUTE.TS PARSING
with open('c:/dev2/src/app/api/narrative/route.ts', 'r', encoding='utf-8') as f:
    route_code = f.read()

old_parse = """    // Clean potential markdown blocks just in case
    const cleanJson = responseText.replace(/^```json\\n/, '').replace(/\\n```$/, '').trim();
    
    let parsedData;"""

new_parse = """    // Aggressively extract JSON from the text
    let cleanJson = responseText;
    const jsonMatch = responseText.match(/\\{[\\s\\S]*\\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    let parsedData;"""

route_code = route_code.replace(old_parse, new_parse)

with open('c:/dev2/src/app/api/narrative/route.ts', 'w', encoding='utf-8') as f:
    f.write(route_code)


# 2. FIX WIZARD.TSX FALLBACKS
with open('c:/dev2/src/components/wizard/Wizard.tsx', 'r', encoding='utf-8') as f:
    wiz_code = f.read()

old_ui_heading = """                <h2 className="text-3xl md:text-4xl font-black italic uppercase text-slate-900 mb-8 flex items-center gap-4">
                  {narrativeLoading ? "Synthesizing AI Blueprint..." : (aiNarrative?.heroTitle || "The Marquis Match")} <Sparkles className="w-8 h-8 text-marquis-blue" />
                </h2>
                <div className="space-y-8 relative z-10">
                  {narrativeLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                    </div>
                  ) : (
                    <div 
                      className="text-lg text-slate-600 leading-relaxed font-medium space-y-4"
                      dangerouslySetInnerHTML={{ __html: aiNarrative?.marquisMatch || `"{product.marketingSummary}"` }}
                    />
                  )}"""

new_ui_heading = """                <h2 className="text-3xl md:text-4xl font-black italic uppercase text-slate-900 mb-8 flex items-center gap-4">
                  {narrativeLoading ? "Synthesizing AI Blueprint..." : (aiNarrative?.error ? "Blueprint Error" : aiNarrative?.heroTitle || "The Marquis Match")} <Sparkles className="w-8 h-8 text-marquis-blue" />
                </h2>
                <div className="space-y-8 relative z-10">
                  {narrativeLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 bg-slate-200 rounded w-full"></div>
                      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                    </div>
                  ) : (aiNarrative as any)?.error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-bold">
                       AI Generation Failed: {(aiNarrative as any).details || (aiNarrative as any).error}
                    </div>
                  ) : (
                    <div 
                      className="text-lg text-slate-600 leading-relaxed font-medium space-y-4"
                      dangerouslySetInnerHTML={{ __html: aiNarrative?.marquisMatch || product.marketingSummary || "We have calculated this Marquis spa is the perfect fit for your lifestyle." }}
                    />
                  )}"""

wiz_code = wiz_code.replace(old_ui_heading, new_ui_heading)

old_ui_env = """                     {narrativeLoading ? (
                       <div className="space-y-3 animate-pulse">
                         <div className="h-3 bg-slate-800 rounded w-full"></div>
                         <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                         <div className="h-3 bg-slate-800 rounded w-4/6"></div>
                       </div>
                     ) : (
                       <div 
                         className="text-sm md:text-base text-slate-400 leading-relaxed space-y-3"
                         dangerouslySetInnerHTML={{ __html: aiNarrative?.environmentalInsight || `Based on your ${preferences.zipCode} location, we recommend the MaximizR™ insulation package to maintain peak efficiency during cold night cycles.` }}
                       />
                     )}"""

new_ui_env = """                     {narrativeLoading ? (
                       <div className="space-y-3 animate-pulse">
                         <div className="h-3 bg-slate-800 rounded w-full"></div>
                         <div className="h-3 bg-slate-800 rounded w-5/6"></div>
                         <div className="h-3 bg-slate-800 rounded w-4/6"></div>
                       </div>
                     ) : (aiNarrative as any)?.error ? (
                       <div className="text-red-500 text-sm">Failed to generate climate insights due to backend error.</div>
                     ) : (
                       <div 
                         className="text-sm md:text-base text-slate-400 leading-relaxed space-y-3"
                         dangerouslySetInnerHTML={{ __html: aiNarrative?.environmentalInsight || `Based on your ${preferences.zipCode} location, we recommend the MaximizR™ insulation package to maintain peak efficiency during cold night cycles.` }}
                       />
                     )}"""

wiz_code = wiz_code.replace(old_ui_env, new_ui_env)

with open('c:/dev2/src/components/wizard/Wizard.tsx', 'w', encoding='utf-8') as f:
    f.write(wiz_code)

print("Error handling patched")
