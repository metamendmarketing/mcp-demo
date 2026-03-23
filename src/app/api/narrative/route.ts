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
    const marquisBrand = await (prisma as any).brand.findFirst({
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
    
    // Derive climate context from Zip Code prefix
    const safeZip = body.preferences.zipCode || '';
    const zipPrefix = safeZip[0];
    const climateZone = 
      ['0', '1', '2', '5'].includes(zipPrefix) ? "Deep Freeze / Extreme Cold" :
      ['8', '9'].includes(zipPrefix) ? "Mild / Temperate West" :
      ['3', '7'].includes(zipPrefix) ? "Hot / Arid South" : "Standard Variable North";

    const prompt = `
You are a Lead Engineering Consultant for Marquis Spas. You have 40 years of brand heritage at your fingertips.
The user has just completed a **14-Step Precision Consultation**. Your goal is to provide a "Laser-Focused" engineering justification for why the **${body.product.modelName || 'Marquis Spa'}** is their perfect match.

KNOWLEDGE BASE:
${JSON.stringify(knowledgeBase || {}, null, 2)}

PRODUCT DATA:
${JSON.stringify(sanitizedProduct, null, 2)}

USER PROFILE (High-Resolution Data):
- **14-Step Consultation Answers**: ${JSON.stringify(body.preferences, null, 2)}
- **Derived Climate Zone**: ${climateZone} (Based on Zip: ${body.preferences.zipCode})

TASK: Write the definitive Engineering Narrative.

STRICT INSTRUCTIONS:
1. **The "Laser-Focus" Guarantee**: Every paragraph MUST acknowledge a specific user data point from the 14 steps. 
   - If they picked 'Social' but this model has a 'Lounge', justify the balance. 
   - Use the 'Derived Climate Zone' to explain why the **MaximizR™ insulation** and **DuraCover®** are mandatory for their specific location.
2. **Professional Honesty**: Use the 'designConsideration' field to state one legitimate engineering trade-off. Do not just praise the model; tell them what they are trading for their primary goal.
3. **Terminology**: Use RHK™ jets, V-O-L-T™ system, and ConstantClean+™ correctly. These are not features; they are engineering solutions to the user's focus (e.g. chronic pain or social ease).
4. **Authority**: Speak with the confidence of the Head of Engineering. No generic marketing. No "Based on your choices." Just "This model excels because..."

Output strictly valid JSON matching this schema:
{
  "heroTitle": "Catchy headline focused on the product's primary engineering strength (4-7 words).",
  "hydrotherapy": "1 paragraph cross-referencing their 'Primary Focus' and 'Intensity' with the model's GPM and jet placement.",
  "climate": "1 paragraph explaining how MaximizR™ insulation protects their specific 'Zip Code' climate.",
  "design": "1 paragraph justifying the 'Aesthetic' and 'Capacity' match for their 'Placement' (e.g. deck vs patio).",
  "efficiency": "1 paragraph on 'Maintenance' and 'Electrical' specs for their ownership style.",
  "designConsideration": "One professional, honest engineering trade-off sentence (e.g. 'Note: This compact footprint prioritizes high-intensity therapy over multi-person social depth.')"
}
Do not return markdown. Return raw JSON.
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
