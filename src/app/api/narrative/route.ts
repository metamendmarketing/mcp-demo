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
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are an elite, world-class luxury copywriter for Marquis Hot Tubs. 
A customer has just completed a consultation profile, and our engine has selected the following Marquis Crown Series model for them:
${JSON.stringify(body.product, null, 2)}

Here is the customer's consultation profile:
${JSON.stringify(body.preferences, null, 2)}

Your task is to write the copy for their personalized Product Detail Page (PDP). 

CRITICAL NEGATIVE CONSTRAINTS (DO NOT DO THIS):
- NEVER use survey-recitation language. 
- NEVER say "You expressed a need for", "We noted your focus on", "You selected", "Based on your preference for", or "Because you want".
- NEVER mechanically list back their answers.

CRITICAL POSITIVE INSTRUCTIONS (DO THIS INSTEAD):
- Write evocative, confident, prescriptive luxury copy. 
- Deeply integrate their preferences seamlessly. If their focus is "Legs and Feet", simply describe the tub's features as if it was built exactly for that: "The Epic's engineered lounge seat features dedicated Geyser jets that deliver deep, penetrating relief to tired calves and feet for the ultimate lower-body recovery."
- Synthesize their 'zipCode' and 'sunExposure' using your geographic knowledge. Determine their local altitude, winter freeze-risk, and typical UV index natively.
- Write the 'environmentalInsight' as specialized local expert advice (e.g., "Given the heavy snowfall and harsh winters in Summit County, the MaximizR full-foam insulation is mandatory...").
- Keep paragraphs punchy and readable. Frame the product as the ultimate vehicle to achieve their 'primaryPurpose'.

Output strictly valid JSON matching this exact schema:
{
  "heroTitle": "Catchy, 4-7 word luxury headline focusing on their primary purpose.",
  "marquisMatch": "2-3 paragraphs of evocative, high-end sales copy explaining why this tub's specific jets, seats, and design perfectly fit their lifestyle. Use basic HTML tags like <p>, <strong>, and <br/> for elegant formatting. DO NOT recite their answers.",
  "environmentalInsight": "A dedicated 1-2 paragraph expert insight explaining your geospatial climate analysis of their specific Zip/Postal Code and Sun Exposure, and how the hot tub natively handles it. Use basic HTML tags."
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
