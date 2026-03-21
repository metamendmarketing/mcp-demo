import re

with open('c:/dev2/src/components/wizard/Wizard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Remove duplicate fetch blocks that accidentally accumulated
# Find the sequence starting from `setResults(formattedResults || []);` and ending with the end of the try block.
# We want exactly ONE `if (formattedResults && formattedResults.length > 0) { setNarrativeLoading(true); ... }`

fetch_pattern = r"      if \(formattedResults && formattedResults\.length > 0\) \{.*?setNarrativeLoading\(false\);\n        \}\n      \}"
matches = re.findall(fetch_pattern, code, re.DOTALL)
if len(matches) > 1:
    # Keep only the first one, remove the rest
    for m in matches[1:]:
        code = code.replace("\n" + m, "", 1)


# 2. Update Details View - The Marquis Match Header
old_match_header = """                <h2 className="text-4xl font-black italic uppercase text-slate-900 mb-8 flex items-center gap-4">
                  The Marquis Match <Sparkles className="w-8 h-8 text-marquis-blue" />
                </h2>
                <div className="space-y-8 relative z-10">
                  <p className="text-xl text-slate-600 leading-relaxed font-black uppercase italic italic opacity-70">
                    "{product.marketingSummary}"
                  </p>"""

new_match_header = """                <h2 className="text-3xl md:text-4xl font-black italic uppercase text-slate-900 mb-8 flex items-center gap-4">
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
                      dangerouslySetInnerHTML={{ __html: aiNarrative?.marquisMatch || `"${product.marketingSummary}"` }}
                    />
                  )}"""

code = code.replace(old_match_header, new_match_header)

# 3. Update Details View - Environmental Insight
old_env = """                  <div className="space-y-4">
                     <h4 className="text-2xl font-black italic uppercase text-marquis-blue">Expert Insight</h4>
                     <p className="text-slate-400 leading-relaxed">Based on your {preferences.zipCode} location, we recommend the MaximizR™ insulation package to maintain peak efficiency during cold night cycles.</p>
                  </div>"""

new_env = """                  <div className="space-y-4">
                     <h4 className="text-2xl font-black italic uppercase text-marquis-blue border-b border-marquis-blue/30 pb-2">Geo-Climate Analysis</h4>
                     {narrativeLoading ? (
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
                     )}
                  </div>"""

code = code.replace(old_env, new_env)

with open('c:/dev2/src/components/wizard/Wizard.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("UI state bindings updated successfully")
