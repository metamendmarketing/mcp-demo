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

    // Initialize Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Returning fallback narrative.");
      return NextResponse.json({ 
        heroTitle: "Your Perfect Marquis Spa",
        marquisMatch: "<p>We have calculated that this Marquis spa is the perfect fit for your lifestyle. Please add your GEMINI_API_KEY to see the full AI generation.</p>",
        environmentalInsight: "Your specific location and sun exposure requires specialized consideration. Add your API key to generate the geospatial climate report."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are Marquis, an elite, luxury hot tub concierge. 
The user completed a 14-question profile. Based on their answers, our deterministic engine selected the following Marquis Crown Series model for them:
${JSON.stringify(body.product, null, 2)}

Here is the user's specific profile and hydrotherapy needs:
${JSON.stringify(body.preferences, null, 2)}

Your task is to generate a dynamic Product Detail Page (PDP) narrative that connects this specific product's features EXACTLY to their lifestyle inputs.

CRITICAL INSTRUCTIONS:
1. Look at their 'zipCode' and 'sunExposure'. You are required to use your native geospatial knowledge to determine the average winter temperatures, freeze-risk, altitude, and typical UV index of that specific Zip or Postal Code.
2. Synthesize that macro-climate (from the Zip Code) with their micro-climate (from their 'sunExposure' answer). For example, if they live in Miami but their tub is heavily shaded, or if they live in Calgary and their tub is exposed to harsh winter sun.
3. Formulate an 'environmentalInsight' explaining your geospatial climate analysis of their area, and how this specific tub's insulation or cover accommodates it.
4. If they requested specific physical therapy (e.g., lower back, neck/shoulders), explicitly highlight how this hot tub model's specific jets solve their exact problem in the 'marquisMatch'.
5. Output strictly valid JSON matching this exact schema:
{
  "heroTitle": "Catchy, 4-7 word luxury headline focusing on their primary purpose.",
  "marquisMatch": "2-3 paragraphs of highly personalized sales copy explaining why this specific tub fits their physical focus, capacity, and aesthetic needs. Use basic HTML tags like <p>, <strong>, and <br/> for elegant formatting.",
  "environmentalInsight": "A dedicated 1-2 paragraph insight explaining your geospatial climate analysis based on their specific Zip/Postal Code + Sun Exposure, and how this tub handles it. Use basic HTML tags for formatting."
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
    return NextResponse.json({ 
      error: 'Failed to generate narrative', 
      details: error.message 
    }, { status: 500 });
  }
}
