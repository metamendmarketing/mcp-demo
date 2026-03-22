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
You are the "Marquis Brain," a technical expert at the Marquis Las Vegas facility. 
Your goal is to answer a customer's question with absolute technical accuracy and professional warmth.

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase, null, 2)}

CUSTOMER PREFERENCES:
${JSON.stringify(preferences || {}, null, 2)}

USER QUESTION:
"${question}"

INSTRUCTIONS:
1. FACT-BASED ONLY: Only answer based on the provided Knowledge Base. If a question is about something not in the data, politely explain that you represent Marquis and can only speak to their documented engineering and history.
2. TECHNICAL AUTHORITY: If the user asks about jets, mention RHK™ or High-Flow. If they ask about history, mention the 40-year heritage or employee ownership.
3. PERSONALIZED CONTEXT: If preferences are available, tailor the tone to their goals (e.g., "Since you're looking for deep tissue therapy, you'll be glad to know our V-O-L-T system...").
4. CONCISE & PROFESSIONAL: Keep it under 150 words. Avoid fluff.

Output strictly valid JSON:
{
  "answer": "Your expert, grounded answer here.",
  "citedFeatures": ["Feature 1", "Benefit 2"]
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
