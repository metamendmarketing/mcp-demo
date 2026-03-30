import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserPreferences } from '@/lib/recommendation/scoring';
import { Product } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const startTime = performance.now();
    const body = await request.json() as { preferences: UserPreferences; product: Product };
    
    console.log(`[API] Narrative Gen Started for: ${body.product?.modelName}`);

    // 1. Fetch Brand Knowledge Base
    const { prisma } = await import('@/lib/prisma');
    const marquisBrand = await (prisma as any).brand.findFirst({
      where: { name: { contains: 'Marquis' } },
      include: { expertise: true, glossary: true }
    });

    const knowledgeBase = {
      expertise: marquisBrand?.expertise.map((e: any) => ({ key: e.key, content: e.content })) || [],
      glossary: marquisBrand?.glossary.map((g: any) => ({ term: g.term, explanation: g.consumerExplanation })) || []
    };

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
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
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    
    // Sanitize product data
    const sanitizedProduct = JSON.parse(
      JSON.stringify(body.product)
        .replace(/[™®©]/g, '')
        .replace(/[\u0080-\uFFFF]/g, (m) => `\\u${m.charCodeAt(0).toString(16).padStart(4, '0')}`)
    );
    
    // Derive climate context from Zip Code prefix
    const safeZip = (body.preferences.zipCode || '').toUpperCase();
    const zipPrefix = safeZip[0];
    const isCanada = /^[A-Z]\d[A-Z]/.test(safeZip) || (safeZip.includes(',') && safeZip.split(',')[1]?.trim().length === 2);
    
    // Improved climate mapping (e.g., 'V' (Victoria) -> Mild)
    const climateZone = 
      ['0', '1', '2', '5', 'T', 'X', 'Y'].includes(zipPrefix) ? "Deep Freeze / Extreme Cold" :
      ['8', '9', 'V'].includes(zipPrefix) ? "Mild / Temperate West" :
      ['3', '7'].includes(zipPrefix) ? "Hot / Arid South" : 
      "Standard Variable North";

    // 2. Fetch System Prompt from DB
    let systemPrompt: any = await (prisma as any).systemPrompt.findUnique({ where: { key: 'narrative' } });
    let promptTemplate = systemPrompt?.content || `
You are a Lead Engineering Consultant for Marquis Spas. You have 40 years of brand heritage at your fingertips.
The user has just completed a **14-Step Precision Consultation**. Your goal is to provide a "Laser-Focused" engineering justification for why the **{{MODEL_NAME}}** is their perfect match.

KNOWLEDGE BASE:
{{KNOWLEDGE_BASE}}

PRODUCT DATA:
{{PRODUCT_DATA}}

USER PROFILE (High-Resolution Data):
- **14-Step Consultation Answers**: {{USER_PREFERENCES}}
- **Derived Climate Zone**: {{CLIMATE_ZONE}}

TASK: Write the definitive Engineering Narrative.

STRICT INSTRUCTIONS:
1.  **THE ELITE CONSULTANT PERSONA**: You are the Head of Engineering, not a marketing bot. Your tone is authoritative, technically precise, and sophisticated.
2.  **SEAMLESS FLOW**: Every paragraph must justify the model's componentry (GPM, RHK Jets, MaximizR, VOLT) and structural footprint (Dimensions, Dry Weight) by referencing the user's needs as the *context*, not as a label.
3.  **LOGISTICS & LOCAL ANCHORING**: Use the **Delivery Access** data to explain why the model's footprint is appropriate. Furthermore, identify the **City/Region** associated with the provided Zip Code (e.g., Beverly Hills for 90210) and use it in the 'Climate' paragraph to make the recommendation feel locally anchored (e.g., "Operating in a temperate zone like Beverly Hills").
4.  **ENGINEERING TIER**: Explicitly mention the model's **Engineering Tier** (Luxury, Premium, or Mid-Tier) as a badge of quality. Justify WHY this level of componentry is the right investment for their specific goals.
5.  **PROFESSIONAL HONESTY**: Use the 'designConsideration' field to state one legitimate engineering trade-off. Do not just praise the model; tell them what they are trading for their primary goal (e.g. "This compact footprint prioritizes targeted therapy over multi-person social depth").
6.  **TERMINOLOGY**: Use RHK™ jets, V-O-L-T™ system, and ConstantClean+™ correctly. These are engineering solutions, not just features.

Output strictly valid JSON matching this schema:
{
  "heroTitle": "Catchy headline focused on the product's primary engineering strength (4-7 words).",
  "hydrotherapy": "1 paragraph cross-referencing their 'Primary Focus' and 'Intensity' with GPM and jet placement.",
  "climate": "1 paragraph explaining how MaximizR™ insulation protects their specific 'Zip Code' climate.",
  "design": "1 paragraph justifying the 'Aesthetic' and 'Capacity' match for their 'Placement'.",
  "efficiency": "1 paragraph on 'Maintenance' and 'Electrical' specs for their ownership style.",
  "designConsideration": "One professional, honest engineering trade-off sentence."
}
Do not return markdown. Return raw JSON.
`;

    const prompt = promptTemplate
      .replace('{{MODEL_NAME}}', body.product.modelName || 'Marquis Spa')
      .replace('{{KNOWLEDGE_BASE}}', JSON.stringify(knowledgeBase || {}, null, 2))
      .replace('{{PRODUCT_DATA}}', JSON.stringify(sanitizedProduct, null, 2))
      .replace('{{USER_PREFERENCES}}', JSON.stringify(body.preferences, null, 2))
      .replace('{{CLIMATE_ZONE}}', `${climateZone} (Based on Zip: ${body.preferences.zipCode})`);


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

    const endTime = performance.now();
    console.log(`[API] Narrative Gen Complete: ${body.product?.modelName} in ${Math.round(endTime - startTime)}ms`);

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
