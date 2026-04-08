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
      model: 'gemini-1.5-flash',
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
You are a Senior Marquis Advisor. You have 40 years of brand heritage at your fingertips.
The user has just completed a **14-Step Precision Consultation**. Your goal is to provide a "warm, professional, and natural" explanation for why the **{{MODEL_NAME}}** is their perfect match. Speak directly to the consumer in plain English while clearly demonstrating deep product knowledge. 

KNOWLEDGE BASE:
{{KNOWLEDGE_BASE}}

PRODUCT DATA:
{{PRODUCT_DATA}}

USER PROFILE:
- **Consultation Answers**: {{USER_PREFERENCES}}
- **Derived Climate Zone**: {{CLIMATE_ZONE}}

TASK: Write the definitive recommendation narrative.

STRICT INSTRUCTIONS:
1. **THE SENIOR ADVISOR PERSONA**: Your tone is warm, easy to read, and immediately useful. **Avoid overly complex 'corporate-speak' or excessive jargon.** Write like a helpful human expert.
2. **BREVITY & CLARITY**: Keep paragraphs short and punchy (1-2 sentences maximum per field). No long-winded technical dissertations. 
3. **LOGISTICS & LOCAL ANCHORING**: Reference the **Delivery Access** data and their localized **City/Region** based on their Zip Code to make the advice feel personal (e.g., "Perfect for navigating those narrow Portland side yards").
4. **ENGINEERING CONTEXT**: Explain *why* the components (GPM, VOLT, MaximizR) benefit them personally, rather than just listing specs. Use correct terminology (e.g. ConstantClean+™).
5. **PREFERENCE SUMMARY**: Provide ONE hyper-targeted sentence starting with "We chose the [Model] because..." that explicitly cites their seating, jets, or layout choices. **Limit to 25 words maximum.**
6. **DESIGN CONSIDERATION**: Provide ONE concise, naturally phrased sentence stating a legitimate physical trade-off (e.g., size vs. social capacity). *Do not sound like a legal disclaimer or corporate whitepaper.* Example: "While its compact footprint is excellent for targeted therapy, it is less ideal if you frequently host large groups."

Output strictly valid JSON matching this schema:
{
  "heroTitle": "Catchy, warm headline (3-6 words).",
  "preferenceSummary": "The hyper-targeted 'We chose...' confirmation sentence (Max 25 words).",
  "hydrotherapy": "1 concise paragraph connecting their 'Primary Focus' to the jet placement.",
  "climate": "1 concise paragraph on how the insulation protects them in their specific 'Zip Code' climate.",
  "design": "1 concise paragraph combining 'Aesthetic' and 'Placement' benefits.",
  "efficiency": "1 concise paragraph on 'Maintenance' and 'Electrical' specs.",
  "designConsideration": "1 simple, naturally phrased trade-off sentence."
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
