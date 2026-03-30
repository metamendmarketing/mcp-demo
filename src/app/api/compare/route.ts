import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * POST /api/compare
 * Accepts 2-3 product IDs and returns a normalized side-by-side comparison
 * with AI-generated plain-English summaries of who each model is best for.
 * 
 * Expected payload:
 * {
 *   "productIds": ["prod-1", "prod-2"],   // 2-3 product IDs
 *   "brandId": "marquis",                  // optional - for brand context
 *   "preferences": { ... }                 // optional - user preferences for personalized comparison
 * }
 * 
 * TODO: Add comparison PDF export
 * TODO: Add "best for" badges based on user preferences
 * TODO: Integrate with recommendation flow (compare from results page)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productIds, preferences } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2 || productIds.length > 3) {
      return NextResponse.json(
        { error: 'Please provide 2-3 product IDs to compare.' },
        { status: 400 }
      );
    }

    // Fetch all requested products with series data
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { series: true },
    });

    if (products.length < 2) {
      return NextResponse.json(
        { error: 'Could not find enough products to compare.' },
        { status: 400 }
      );
    }

    // Build normalized comparison grid
    const comparisonGrid = products.map((p: any) => ({
      id: p.id,
      modelName: p.modelName,
      series: p.series?.name || 'Marquis',
      positioningTier: p.positioningTier || 'value',
      specs: {
        seats: p.seatsMax,
        jets: p.jetCount,
        gpm: p.pumpFlowGpm,
        gallons: p.capacityGallons,
        dimensions: `${p.lengthIn}" x ${p.widthIn}" x ${p.depthIn}"`,
        dryWeight: p.dryWeightLbs,
        fullWeight: p.fullWeightLbs,
        electrical: `${p.electricalAmps || 50}A`,
        insulation: p.insulationType,
      },
      heroImageUrl: p.heroImageUrl,
      marketingSummary: p.marketingSummary,
      therapySummary: p.therapySummary,
    }));

    // AI-generated comparison summary (optional, falls back gracefully)
    let aiSummary = null;
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash',
          generationConfig: { responseMimeType: "application/json" }
        });

        // 2. Fetch System Prompt from DB
        const systemPrompt = await (prisma as any).systemPrompt.findUnique({ where: { key: 'compare' } });
        const promptTemplate = systemPrompt?.content || `
You are a Marquis Hot Tub expert. Compare these {{MODEL_COUNT}} models side-by-side.
{{PREFERENCES_CONTEXT}}

Models:
{{COMPARISON_GRID}}

Write a brief, helpful comparison. For each model, explain in 1-2 sentences who it's best for.
Then provide one overall recommendation sentence.

Output strictly valid JSON:
{
  "modelSummaries": [
    { "id": "...", "bestFor": "One sentence about who this model is ideal for." }
  ],
  "overallRecommendation": "One sentence picking the best overall fit."
}
`;

        const prompt = promptTemplate
          .replace('{{MODEL_COUNT}}', String(products.length))
          .replace('{{PREFERENCES_CONTEXT}}', preferences ? `The customer's preferences: ${JSON.stringify(preferences)}` : '')
          .replace('{{COMPARISON_GRID}}', JSON.stringify(comparisonGrid, null, 2));


        const result = await model.generateContent(prompt);
        const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
        aiSummary = JSON.parse(text);
      } catch (aiError) {
        console.error('[COMPARE_AI_ERROR]', aiError);
        // Graceful fallback — comparison still works without AI summary
      }
    }

    return NextResponse.json({
      products: comparisonGrid,
      aiSummary,
    });

  } catch (error: any) {
    console.error('[COMPARE_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to generate comparison', details: error.message },
      { status: 500 }
    );
  }
}
