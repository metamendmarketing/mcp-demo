import re

# 1. Update route.ts Prompt
with open('c:/dev2/src/app/api/narrative/route.ts', 'r', encoding='utf-8') as f:
    route_code = f.read()

old_instructions = r"""CRITICAL POSITIVE INSTRUCTIONS \(DO THIS INSTEAD\):
- Write evocative, confident, prescriptive luxury copy\. 
- Deeply integrate their preferences seamlessly\. If their focus is "Legs and Feet", simply describe the tub's features as if it was built exactly for that: "The Epic's engineered lounge seat features dedicated Geyser jets that deliver deep, penetrating relief to tired calves and feet for the ultimate lower-body recovery\."
- Synthesize their 'zipCode' and 'sunExposure' using your geographic knowledge\. Determine their local altitude, winter freeze-risk, and typical UV index natively\.
- Write the 'environmentalInsight' as specialized local expert advice \(e\.g\., "Given the heavy snowfall and harsh winters in Summit County, the MaximizR full-foam insulation is mandatory\.\.\."\)\.
- Keep paragraphs punchy and readable\. Frame the product as the ultimate vehicle to achieve their 'primaryPurpose'\.

Output strictly valid JSON matching this exact schema:
\{
  "heroTitle": "Catchy, 4-7 word luxury headline focusing on their primary purpose\.",
  "marquisMatch": "2-3 paragraphs of evocative, high-end sales copy explaining why this tub's specific jets, seats, and design perfectly fit their lifestyle\. Use basic HTML tags like <p>, <strong>, and <br/> for elegant formatting\. DO NOT recite their answers\.",
  "environmentalInsight": "A dedicated 1-2 paragraph expert insight explaining your geospatial climate analysis of their specific Zip/Postal Code and Sun Exposure, and how the hot tub natively handles it\. Use basic HTML tags\."
\}"""

new_instructions = r"""CRITICAL POSITIVE INSTRUCTIONS (DO THIS INSTEAD):
- Write evocative, confident, prescriptive luxury copy. 
- You MUST generate 4 distinct paragraphs, one for each specific topic below. 
- Deeply integrate their preferences seamlessly into each topic. If their focus is "Legs and Feet", describe the tub's features in the 'hydrotherapy' section as if it was built exactly for that.
- Synthesize their 'zipCode' and 'sunExposure' using your geographic knowledge for the 'climate' section. Determine their local altitude, winter freeze-risk, and typical UV index natively.
- Keep paragraphs punchy and readable (1 paragraph max per section). Frame the product as the ultimate vehicle to achieve their lifestyle.

Output strictly valid JSON matching this exact schema:
{
  "heroTitle": "Catchy, 4-7 word luxury headline focusing on their primary purpose.",
  "hydrotherapy": "1 masterfully written paragraph explaining how the tub's jets, pumps, and layout perfectly satisfy their 'primaryPurpose', 'intensity', and 'physicalFocus'. Use <strong> tags lightly.",
  "climate": "1 expert paragraph explaining your geospatial climate analysis of their specific Zip/Postal Code and Sun Exposure, and how the hot tub natively handles those local conditions.",
  "design": "1 paragraph explaining how the tub's capacity, aesthetic, and placement perfectly elevate their specific home environment.",
  "efficiency": "1 paragraph about how the hot tub's voltage, maintenance profile, and budget efficiency provide an effortless ownership experience."
}"""

route_code = re.sub(old_instructions, new_instructions, route_code, flags=re.DOTALL)

route_code = route_code.replace("""        heroTitle: "Your Perfect Marquis Spa",
        marquisMatch: "<p>We have calculated that this Marquis spa is the perfect fit for your lifestyle. Please add your GEMINI_API_KEY to see the full AI generation.</p>",
        environmentalInsight: "Your specific location and sun exposure requires specialized consideration. Add your API key to generate the geospatial climate report." """, """        heroTitle: "Your Perfect Marquis Spa",
        hydrotherapy: "We have calculated that this Marquis spa is the perfect fit for your lifestyle. Add API key for full generation.",
        climate: "Your specific location requires specialized consideration. Add your API key.",
        design: "This spa is aesthetically matched to your home.",
        efficiency: "Built for peak efficiency." """)

with open('c:/dev2/src/app/api/narrative/route.ts', 'w', encoding='utf-8') as f:
    f.write(route_code)

# 2. Update Wizard.tsx
with open('c:/dev2/src/components/wizard/Wizard.tsx', 'r', encoding='utf-8') as f:
    wiz = f.read()

# Update state type
wiz = wiz.replace(
    "const [aiNarrative, setAiNarrative] = useState<{heroTitle?: string; marquisMatch?: string; environmentalInsight?: string; error?: string} | null>(null);",
    "const [aiNarrative, setAiNarrative] = useState<{heroTitle?: string; hydrotherapy?: string; climate?: string; design?: string; efficiency?: string; error?: string} | null>(null);"
)
wiz = wiz.replace(
    "const [aiNarrative, setAiNarrative] = useState<{heroTitle?: string; marquisMatch?: string; environmentalInsight?: string} | null>(null);",
    "const [aiNarrative, setAiNarrative] = useState<{heroTitle?: string; hydrotherapy?: string; climate?: string; design?: string; efficiency?: string; error?: string} | null>(null);"
)

# Update imports to ensure we have the icons we need
if "Thermometer" not in wiz:
    wiz = wiz.replace("import { ", "import { Thermometer, Users, Activity, Zap, ")
else:
    if "Zap," not in wiz:
        wiz = wiz.replace("import { ", "import { Zap, Activity, ")


old_sections_block_regex = r"<section className=\"bg-white p-10 rounded-\[40px\] shadow-xl border border-slate-100 relative overflow-hidden\">.*?</section>\n\n            <section className=\"bg-slate-900 text-white p-10 rounded-\[40px\] shadow-2xl relative overflow-hidden\">.*?</section>"

new_sections = """
            {/* HERO TITLE HEADER */}
            <div className="text-center mb-8">
               <h2 className="text-4xl md:text-6xl font-black italic uppercase text-slate-900 tracking-tight flex items-center justify-center gap-4">
                  {narrativeLoading ? "Synthesizing Profile..." : (aiNarrative?.heroTitle || product.modelName)} 
                  <Sparkles className="w-10 h-10 text-marquis-blue" />
               </h2>
               <p className="text-xl text-slate-500 font-medium mt-4 max-w-2xl mx-auto">We've generated completely personalized blueprints analyzing how this specific model seamlessly anchors your lifestyle.</p>
            </div>

            {/* AI MODULES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 w-full mb-12">
              {[
                { id: 'hydrotherapy', title: 'Hydrotherapy & Wellness', icon: <Activity className="w-8 h-8" />, delay: 'delay-100' },
                { id: 'climate', title: 'Climate & Surroundings', icon: <Thermometer className="w-8 h-8" />, delay: 'delay-200' },
                { id: 'design', title: 'Design & Capacity', icon: <Users className="w-8 h-8" />, delay: 'delay-300' },
                { id: 'efficiency', title: 'Power & Maintenance', icon: <Zap className="w-8 h-8" />, delay: 'delay-500' }
              ].map((mod, i) => (
                <section key={i} className={`bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden animate-in fade-in slide-in-from-bottom fill-mode-both ${mod.delay}`}>
                  <h3 className="text-2xl font-black italic uppercase text-slate-900 mb-6 flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="bg-marquis-blue/10 p-4 rounded-2xl text-marquis-blue flex-shrink-0">
                      {mod.icon}
                    </div>
                    {mod.title}
                  </h3>
                  {narrativeLoading ? (
                    <div className="space-y-4 animate-pulse pt-2">
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                    </div>
                  ) : (aiNarrative as any)?.error ? (
                    <div className="text-red-500 text-sm font-medium">AI Generation Failed: {(aiNarrative as any).error}</div>
                  ) : (
                    <div 
                      className="text-lg text-slate-600 leading-relaxed font-medium prose prose-slate prose-lg" 
                      dangerouslySetInnerHTML={{ __html: (aiNarrative as any)?.[mod.id] || "Synthesizing your personalized profile..." }} 
                    />
                  )}
                </section>
              ))}
            </div>
"""

wiz = re.sub(old_sections_block_regex, new_sections.strip(), wiz, flags=re.DOTALL)

with open('c:/dev2/src/components/wizard/Wizard.tsx', 'w', encoding='utf-8') as f:
    f.write(wiz)

print("Modular layout applied successfully")
