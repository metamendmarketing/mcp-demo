import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreProducts, UserPreferences } from '@/lib/recommendation/scoring';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/recommend
 * 
 * The core intelligence endpoint for the Marquis Buying Assistant.
 * It performs a multi-stage recommendation process:
 * 1. Heuristic Scoring: Ranks all 29 models against 15+ user preference vectors.
 * 2. Inclusive Filtering: Expands the candidate pool to ensure specialized models (e.g. ATVs) are included.
 * 3. AI Refinement: Gemini 1.5 Flash performs the final "elimination" and picks the Top 4, 
 *    generating technical match strategies and narratives based on deep product specs.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('[API] Received preferences:', JSON.stringify(body.preferences));

    // 1. Fetch all products with series for rich context
    const allProducts = await prisma.product.findMany({
      include: { series: true }
    });
    console.log(`[API] DB Sync: ${allProducts.length} products found.`);

    if (allProducts.length === 0) {
      return NextResponse.json({ results: [], error: "Database empty" });
    }
    
    // 2. Rank using heuristic engine and expand pool
    const heuristicResults = scoreProducts(allProducts, body.preferences);
    
    // Inclusive Selection Strategy: Start with Top 12
    let shortList = heuristicResults.slice(0, 12);

    // Force-Inject Category Matches (Ensures ATVs/Swim Spas always reach AI when relevant)
    if (body.preferences.primaryPurpose === 'exercise' || body.preferences.primaryPurpose === 'athletes') {
      const categoryMatches = heuristicResults.filter(r => 
        (r.product.category === 'swim_spa' || r.product.series?.name?.includes('ATV')) &&
        !shortList.find(s => s.product.id === r.product.id)
      );
      shortList = [...shortList, ...categoryMatches].slice(0, 16); // Cap at 16 for context window
    }

    console.log(`[API] Candidate Pool: ${shortList.map(c => c.product.modelName).join(', ')}`);

    // 3. AI Refinement (Gemini)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[API] GEMINI_API_KEY missing. Falling back to heuristic Top 4.");
      return NextResponse.json({ 
        results: shortList.slice(0, 4).map(r => ({
          ...r,
          matchStrategy: "Expert Heuristic",
          naturalNarrative: r.product.marketingSummary
        }))
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      // Fetch Brand Context
      const marquisBrand = await (prisma as any).brand.findFirst({
        where: { name: { contains: 'Marquis' } },
        include: { expertise: true, glossary: true }
      });

      const knowledgeBase = {
        expertise: marquisBrand?.expertise.map((e: any) => ({ key: e.key, content: e.content })) || [],
        glossary: marquisBrand?.glossary.map((g: any) => ({ term: g.term, explanation: g.consumerExplanation })) || []
      };

      const prompt = `
You are a Marquis Hot Tub Advisor. We have a pool of candidates filtered by our engineering engine.
Your job: Be the FINAL DECISION MAKER. Select the TOP 4 that best fit their lifestyle and provide a technical "Match Strategy" and a "Natural Narrative".

BRAND KNOWLEDGE:
${JSON.stringify(knowledgeBase, null, 2)}

User Preferences:
${JSON.stringify(body.preferences, null, 2)}

Candidate Pool (JSON with deep specs):
${JSON.stringify(shortList.map(c => ({ 
  id: String(c.product.id), 
  name: c.product.modelName, 
  series: c.product.series?.name, 
  category: c.product.category,
  tier: c.product.positioningTier,
  score: c.score,
  gpm: c.product.pumpFlowGpm,
  jets: c.product.jetCount,
  dims: `${c.product.lengthIn}x${c.product.widthIn}x${c.product.depthIn}`,
  hotspots: typeof c.product.hotspots === 'string' ? JSON.parse(c.product.hotspots) : (c.product.hotspots || []),
  features: typeof c.product.standardFeatures === 'string' ? JSON.parse(c.product.standardFeatures) : (c.product.standardFeatures || []),
  summary: c.product.marketingSummary
})), null, 2)}

INSTRUCTIONS:
1. ELIMINATION: Use your data insight to eliminate models that technically clash with preferences (e.g. if zip code is extreme cold, prioritize models with high-grade insulation or Crown series).
2. TECHNICAL SELECTION: Prioritize models with specific Hotspots or Features mentioned in the data (like H.O.T. Zones for therapy).
3. MATCH STRATEGY: 2-4 word technical badge (e.g., "High-Flow Hydrotherapy", "Elite Thermal Integrity").
4. NARRATIVE: 1 warm, premium paragraph (max 60 words). Cite a specific GLOSSARY TERM or HOTSPOT name from the data to prove authority.
5. DESIGN CONSIDERATION: 1 professional sentence about a trade-off (size, power requirements, or seating style).

Output strictly valid JSON:
{
  "refinement": [
    { "id": "...", "matchStrategy": "...", "naturalNarrative": "...", "designConsiderations": "..." }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const refinedData = JSON.parse(text);
      console.log(`[API] AI refined ${refinedData.refinement?.length} products from pool.`);

      const finalResults = refinedData.refinement.map((refinedItem: any) => {
        const original = shortList.find(c => String(c.product.id) === String(refinedItem.id));
        if (!original) return null;
        return {
          ...original,
          matchStrategy: refinedItem.matchStrategy,
          naturalNarrative: refinedItem.naturalNarrative,
          designConsiderations: refinedItem.designConsiderations
        };
      }).filter(Boolean);

      if (finalResults.length > 0) {
        // Final Relative Re-scaling
        const maxScore = Math.max(...finalResults.map((r: any) => r.score || 0));
        const anchoredResults = finalResults.map((r: any) => ({
          ...r,
          score: maxScore > 0 ? Math.round(((r.score || 0) / maxScore) * 100) : 100
        }));

        anchoredResults.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
        return NextResponse.json({ results: anchoredResults });
      }
    } catch (aiError) {
      console.error('[API] AI Refinement failed:', aiError);
    }

    // Final Fallback: Shortlist Top 4
    return NextResponse.json({ 
      results: shortList.slice(0, 4).map(r => ({
        ...r,
        matchStrategy: "Expert Selection",
        naturalNarrative: r.product.marketingSummary
      }))
    });

  } catch (error) {
    console.error('[API] Fatal Error:', error);
    return NextResponse.json({ results: [], error: 'Internal Server Error' }, { status: 500 });
  }
}
