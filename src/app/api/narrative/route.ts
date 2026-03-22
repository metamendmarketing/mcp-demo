import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserPreferences } from '@/lib/recommendation/scoring';
import { Product } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json() as { preferences: UserPreferences; product: Product };
    
    if (!body.preferences || !body.product) {
      return NextResponse.json({ error: 'Missing preferences or product data' }, { status: 400 });
    }

    // 1. Fetch Brand Knowledge Base
    const { prisma } = await import('@/lib/prisma');
    const marquisBrand = await prisma.brand.findFirst({
      where: { name: { contains: 'Marquis' } },
      include: { expertise: true, glossary: true }
    });

    const knowledgeBase = {
      expertise: marquisBrand?.expertise.map((e: any) => ({ key: e.key, content: e.content })) || [],
      glossary: marquisBrand?.glossary.map((g: any) => ({ term: g.term, explanation: g.consumerExplanation })) || []
    };

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Returning fallback narrative.");
      return NextResponse.json({ 
        heroTitle: "Your Perfect Marquis Spa",
        hydrotherapy: "We have calculated that this Marquis spa is the perfect fit for your lifestyle.",
        climate: "Your specific location requires specialized consideration.",
        design: "This spa is aesthetically matched to your home.",
        efficiency: "Built for peak efficiency."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    // Sanitize product data
    const sanitizedProduct = JSON.parse(
      JSON.stringify(body.product)
        .replace(/[™®©]/g, '')
        .replace(/[\u0080-\uFFFF]/g, (m) => `\\u${m.charCodeAt(0).toString(16).padStart(4, '0')}`)
    );
    
    const prompt = `
You are a Technical Brand Specialist for Marquis Hot Tubs. Your goal is to provide "Post-Search Engineering Justification" to a customer.

KNOWLEDGE BASE (Grounded Facts):
${JSON.stringify(knowledgeBase, null, 2)}

PRODUCT DATA:
${JSON.stringify(sanitizedProduct, null, 2)}

USER PREFERENCES:
${JSON.stringify(body.preferences, null, 2)}

TASK: Write the personalized PDP copy as a Trusted Engineering Advisor.

CRITICAL INSTRUCTIONS:
1. TECHNICAL AUTHORITY: You MUST justify the match using technical specs. Mention the 'pumpFlowGpm' (High-Flow capacity) and 'jetCount'. Use terms from the Feature Glossary (e.g., RHK™ jets, V-O-L-T™ system, ConstantClean+™) to explain *why* it fits their hydrotherapy profile.
2. SUBTLE BRANDING: Weave in a single, subtle reference to Marquis' 40-year heritage or Make-A-Wish partnership ONLY if it bolsters trust in the engineering or community value. Do not make it a fluff paragraph.
3. CLIMATE BENCHMARKING: Use the user's Zip/Postal Code to derive their local climate. Explain how the DuraCover® and MaximizR™ insulation (full-foam) provide specific thermal protection for their region.
4. ZERO RECITATION: Never say "Based on your preference" or "You chose". Simply state why this model is the superior choice for their objectives.

Output strictly valid JSON matching this schema:
{
  "heroTitle": "Catchy, 4-7 word headline focusing on the product's primary engineering strength.",
  "hydrotherapy": "1 paragraph (max 100 words) explaining the High-Flow/GPM dynamics and RHK™ jet placement for their physical focus.",
  "climate": "1 paragraph explaining local winter/UV performance based on Zip Code and insulation specs.",
  "design": "1 paragraph on aesthetic harmony and capacity.",
  "efficiency": "1 paragraph on voltage, maintenance (ConstantClean+™), and durability (DuraCover®).",
  "designConsideration": "1 professional, honest sentence about a potential engineering trade-off (e.g. 'Note: This open-seating model trades the full-body lounge for maximum social capacity.')"
}
Do not wrap the output in markdown blocks (e.g., \`\`\`json). Return raw valid JSON.
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Aggressively extract JSON from the text
    let cleanJson = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON:", cleanJson);
      throw new Error("Invalid JSON returned from AI");
    }

    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('[NARRATIVE_API_ERROR]', error);
    // Include full error details in the response for debugging on the live site
    return NextResponse.json({ 
      error: `Generation Failed: ${error.message || 'Unknown Error'}`, 
      details: error.stack || 'No stack trace available',
      rawError: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)))
    }, { status: 500 });
  }
}
