import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { question, productId, preferences } = await request.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    // 1. Fetch Grounding Data
    const [product, marquisBrand] = await Promise.all([
      productId ? (prisma as any).product.findUnique({ 
        where: { id: productId },
        include: { series: true }
      }) : null,
      (prisma as any).brand.findFirst({
        where: { name: { contains: 'Marquis' } },
        include: { expertise: true, glossary: true }
      })
    ]);

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
      }
    };

    // 2. Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        answer: "I'm sorry, I need an API key to access my full engineering knowledge. Please contact support." 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are a helpful and knowledgeable sales expert at a Marquis hot tub dealership. 
A customer is looking at the ${product ? product.modelName : 'Marquis collection'} and has a question.

Your goal is to answer their question like a professional store expert: 
- Be helpful and solve their specific question.
- Use a friendly, professional tone (like a person, not a corporate robot).
- DO NOT refer to yourself as "Marquis Brain" or an AI. Just answer the question.
- Avoid being overly "markety" or "salesy"—focus on the facts and the benefits to the customer.

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

CUSTOMER PREFERENCES:
${JSON.stringify(preferences || {}, null, 2)}

USER QUESTION:
"${question}"

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

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : `{"answer": "${text.replace(/"/g, "'")}"}`);

    return NextResponse.json(parsed);

  } catch (error: any) {
    console.error('[ASK_API_ERROR]', error);
    return NextResponse.json({ error: 'Failed to process question', details: error.message }, { status: 500 });
  }
}
