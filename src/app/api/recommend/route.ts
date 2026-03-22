import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreProducts, UserPreferences } from '@/lib/recommendation/scoring';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/recommend
 * Accepts user preferences, heuristics filters top 8, and Gemini picks Top 4 + Narratives.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as { preferences: UserPreferences };
    
    if (!body.preferences) {
      return NextResponse.json({ error: 'Missing preferences' }, { status: 400 });
    }

    // 1. Fetch all products with series for rich context
    const allProducts = await prisma.product.findMany({
      include: { series: true }
    });
    
    // 2. Rank using heuristic engine to find Top 8 candidates
    const heuristicResults = scoreProducts(allProducts, body.preferences);
    const top8Candidates = heuristicResults.slice(0, 8);

    // 3. AI Refinement (Gemini)
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback: return top 4 from heuristic if AI key is missing
      return NextResponse.json({ 
        results: top8Candidates.slice(0, 4).map(r => ({
          ...r,
          matchStrategy: "Heuristic Match",
          naturalNarrative: r.product.marketingSummary
        }))
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are a Marquis Hot Tub Advisor. We have filtered 8 candidates for a customer.
Pick the TOP 4 that best match their profile. 

User Profile:
${JSON.stringify(body.preferences, null, 2)}

Top 8 Candidates (JSON):
${JSON.stringify(top8Candidates.map(c => ({ id: c.product.id, name: c.product.modelName, series: c.product.series.name, specs: c.product.marketingSummary, jetCount: c.product.jetCount, seats: c.product.seatsMax })), null, 2)}

For each of the Top 4, provide:
1. id: The product ID.
2. matchStrategy: A 2-4 word "badge" (e.g. "Luxury Performance", "Family Value").
3. naturalNarrative: A warm, premium paragraph for the result card. Focus on strengths and naturally address differences (e.g. "While this model uses an open-seating layout for social connection, it maintains high-flow therapy"). Do not be negative or say "this model lacks X".
4. designConsiderations: A professional, gentle sentence for the Product Detail Page about any potential trade-off (e.g., "Note: This model does not include lounge seating in favor of maximizing social space.")

Output strictly valid JSON (no markdown):
{
  "refinement": [
    { "id": "product_id", "matchStrategy": "...", "naturalNarrative": "...", "designConsiderations": "..." }
  ]
}
`;

    const aiResult = await model.generateContent(prompt);
    const aiResponse = aiResult.response.text();
    
    // Extract JSON
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    const refinedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { refinement: [] };

    // 4. Merge AI narratives back into results
    const finalResults = refinedData.refinement.map((refinedItem: any) => {
      const original = top8Candidates.find(c => c.product.id === refinedItem.id);
      if (!original) return null;
      return {
        ...original,
        matchStrategy: refinedItem.matchStrategy,
        naturalNarrative: refinedItem.naturalNarrative,
        designConsiderations: refinedItem.designConsiderations
      };
    }).filter(Boolean);

    // Fallback if AI returned junk
    if (finalResults.length === 0) {
      return NextResponse.json({ results: top8Candidates.slice(0, 4) });
    }

    return NextResponse.json({ results: finalResults });

  } catch (error: any) {
    console.error('[RECOMMEND_API_ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
