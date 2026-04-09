import { NextResponse } from 'next/server';
import { getVertexModel } from '@/lib/vertexClient';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { question, productId, preferences } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // 1. Fetch Grounding Data
    const [product, marquisBrand, allProducts] = await Promise.all([
      productId ? (prisma as any).product.findUnique({ 
        where: { id: productId },
        include: { series: true }
      }) : null,
      (prisma as any).brand.findFirst({
        where: { name: { contains: 'Marquis' } },
        include: { expertise: true, glossary: true }
      }),
      (prisma as any).product.findMany({
        where: { status: 'active' },
        select: { 
          modelName: true, 
          series: { select: { name: true } },
          jetCount: true,
          seatsMax: true,
          loungeCount: true,
          capacityGallons: true,
          lengthIn: true,
          widthIn: true,
          therapySummary: true,
          standardFeatures: true,
          optionalFeatures: true
        }
      })
    ]);

    // Format catalog by series with technical specs for comparisons
    const catalogSummary = (allProducts as any[]).reduce((acc: any, p: any) => {
      const sName = p.series?.name || 'Other';
      if (!acc[sName]) acc[sName] = [];
      acc[sName].push({
        model: p.modelName,
        jets: p.jetCount,
        seats: p.seatsMax,
        loungers: p.loungeCount,
        gallons: p.capacityGallons,
        size: `${p.lengthIn}x${p.widthIn}in`,
        focus: p.therapySummary,
        features: typeof p.standardFeatures === 'string' ? JSON.parse(p.standardFeatures) : p.standardFeatures,
        options: typeof p.optionalFeatures === 'string' ? JSON.parse(p.optionalFeatures) : p.optionalFeatures
      });
      return acc;
    }, {});

    const knowledgeBase = {
      product: product ? {
        name: product.modelName,
        series: product.series?.name,
        specs: product.marketingSummary,
        therapy: product.therapySummary,
        gpm: product.pumpFlowGpm,
        jets: product.jetCount,
        insulation: product.insulationType,
        dimensions: `${product.lengthIn}x${product.widthIn}x${product.depthIn}`,
        features: product.standardFeatures
      } : "No specific product selected.",
      brand: {
        expertise: (marquisBrand as any)?.expertise?.map((e: any) => ({ category: e.category, content: e.content })) || [],
        glossary: (marquisBrand as any)?.glossary?.map((g: any) => ({ term: g.term, explanation: g.consumerExplanation })) || []
      },
      catalog: catalogSummary
    };

    try {
      const model = getVertexModel('gemini-2.5-flash');

      // 2. Fetch System Prompt from DB
      const systemPrompt = await (prisma as any).systemPrompt.findUnique({ where: { key: 'ask' } });
      const promptTemplate = systemPrompt?.content || `
You have access to the full Marquis product catalog in the knowledge base (under "catalog"), including all models across the Crown, Vector21, Elite, and Celebrity series with their technical specifications. 

Use this data to:
1. Answer questions about any model, even if it's not the one the customer is currently viewing.
2. Compare the current model to others in the catalog when asked (e.g., "How does this compare to the V84L?" or "Which model has more jets?").
3. Recommend alternative models if the current one doesn't meet the customer's specific needs (e.g., if they need more seats or a lower budget).
4. Provide technical details (jets, seats, dimensions) accurately for the entire lineup.

Your goal is to answer their question like a professional store expert: 
- Be helpful and solve their specific question.
- Use a friendly, professional tone (like a person, not a corporate robot).
- DO NOT refer to yourself as "Marquis Brain" or an AI. Just answer the question.
- Avoid being overly "markety" or "salesy"—focus on the facts and the benefits to the customer.

KNOWLEDGE BASE:
{{KNOWLEDGE_BASE}}

CUSTOMER PREFERENCES:
{{CUSTOMER_PREFERENCES}}

USER QUESTION:
"{{USER_QUESTION}}"

INSTRUCTIONS:
1. FACT-BASED ONLY: Only answer based on the provided Knowledge Base. If asked about something not documented, politely explain that you'll have to check on that or that you only have technical data for the Marquis brand.
2. TECHNICAL ACCURACY: Use the correct terms (e.g., ConstantClean™, V-O-L-T™, High-Flow) but explain their benefit simply.
3. CONCISE: Keep answers very short and direct. Max 2-3 sentences unless the question requires more detail.
4. RESPONSE FORMAT: Strictly valid JSON. The "answer" should be the main text.

Output strictly valid JSON:
{
  "answer": "Your helpful, expert answer here.",
  "citedFeatures": ["Feature Name 1", "Benefit 2"]
}
`;

      const prompt = promptTemplate
        .replace('{{KNOWLEDGE_BASE}}', JSON.stringify(knowledgeBase, null, 2))
        .replace('{{CUSTOMER_PREFERENCES}}', JSON.stringify(preferences || {}, null, 2))
        .replace('{{USER_QUESTION}}', question);


      const result = await model.generateContent(prompt);
      const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      
      // Extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : `{"answer": "${text.replace(/"/g, "'")}"}`);

      return NextResponse.json(parsed);

    } catch (aiError: any) {
      console.error('[ASK_AI_ERROR]', aiError);
      throw aiError;
    }

  } catch (error: any) {
    console.error('[ASK_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to process question', details: error.message }, { status: 500 });
  }
}
