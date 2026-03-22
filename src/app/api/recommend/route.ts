import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreProducts, UserPreferences } from '@/lib/recommendation/scoring';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/recommend
 * Accepts user preferences, heuristics filters top 8, and Gemini picks Top 4 + Narratives.
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
    
    // 2. Rank using heuristic engine to find Top 8 candidates
    const heuristicResults = scoreProducts(allProducts, body.preferences);
    const top8Candidates = heuristicResults.slice(0, 8);
    console.log(`[API] Heuristic Shortlist: ${top8Candidates.map(c => c.product.modelName).join(', ')}`);

    // 3. AI Refinement (Gemini)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[API] GEMINI_API_KEY missing. Falling back to heuristic.");
      return NextResponse.json({ 
        results: top8Candidates.slice(0, 4).map(r => ({
          ...r,
          matchStrategy: "Heuristic Match",
          naturalNarrative: r.product.marketingSummary
        }))
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const marquisBrand = await (prisma as any).brand.findFirst({
        where: { name: { contains: 'Marquis' } },
        include: { expertise: true, glossary: true }
      });

      const knowledgeBase = {
        expertise: marquisBrand?.expertise.map((e: any) => ({ key: e.key, content: e.content })) || [],
        glossary: marquisBrand?.glossary.map((g: any) => ({ term: g.term, explanation: g.consumerExplanation })) || []
      };

      const prompt = `
You are a Marquis Hot Tub Advisor. We have filtered 8 candidates for a customer. 
Your job: select the TOP 4 that best fit their preferences and provide a "Match Strategy" and a "Natural Narrative".

BRAND KNOWLEDGE:
${JSON.stringify(knowledgeBase, null, 2)}

User Preferences:
${JSON.stringify(body.preferences, null, 2)}

Top 8 Candidates (JSON):
${JSON.stringify(top8Candidates.map(c => ({ 
  id: String(c.product.id), 
  name: c.product.modelName, 
  series: c.product.series?.name, 
  tier: c.product.positioningTier,
  score: c.product.score,
  gpm: c.product.pumpFlowGpm,
  jets: c.product.jetCount,
  specs: c.product.marketingSummary,
  therapy: c.product.therapySummary
})), null, 2)}

INSTRUCTIONS:
1. TECHNICAL SELECTION: Prioritize models with higher GPM (>300) and RHK™ jets for "Firm" intensity.
2. MATCH STRATEGY: 2-4 word technical badge (e.g., "High-Flow Therapy", "Elite Efficiency").
3. NARRATIVE: 1 warm, premium paragraph (max 60 words). Enforce technical authority—mention a specific glossary term or spec from the data.
4. DESIGN CONSIDERATION: 1 professional sentence about a trade-off.

Output strictly valid JSON (no markdown):
{
  "refinement": [
    { "id": "...", "matchStrategy": "...", "naturalNarrative": "...", "designConsiderations": "..." }
  ]
}
`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();
      
      // Clean potential markdown blocks
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const refinedData = JSON.parse(text);
      console.log(`[API] AI refined ${refinedData.refinement?.length} products.`);

      const finalResults = refinedData.refinement.map((refinedItem: any) => {
        const original = top8Candidates.find(c => String(c.product.id) === String(refinedItem.id));
        if (!original) {
          console.warn(`[API] Could not find original product for ID: ${refinedItem.id}`);
          return null;
        }
        return {
          ...original,
          matchStrategy: refinedItem.matchStrategy,
          naturalNarrative: refinedItem.naturalNarrative,
          designConsiderations: refinedItem.designConsiderations
        };
      }).filter(Boolean);

      if (finalResults.length > 0) {
        // Sort by score descending to ensure UI consistency
        finalResults.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
        return NextResponse.json({ results: finalResults });
      }
    } catch (aiError) {
      console.error('[API] AI Refinement failed:', aiError);
    }

    // Final Fallback: Heuristic Top 4
    return NextResponse.json({ 
      results: top8Candidates.slice(0, 4).map(r => ({
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
