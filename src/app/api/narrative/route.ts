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
        hydrotherapy: "We have calculated that this Marquis spa is the perfect fit for your lifestyle. Add API key for full generation.",
        climate: "Your specific location requires specialized consideration. Add your API key.",
        design: "This spa is aesthetically matched to your home.",
        efficiency: "Built for peak efficiency."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
- You MUST generate 4 distinct paragraphs, one for each specific topic below. 
- Deeply integrate their preferences seamlessly into each topic. If their focus is "Legs and Feet", describe the tub's features in the 'hydrotherapy' section as if it was built exactly for that.
- Synthesize their 'zipCode' and 'sunExposure' using your geographic knowledge for the 'climate' section. Determine their local altitude, winter freeze-risk, and typical UV index natively.
- Keep paragraphs punchy and readable (1 paragraph max per section). Frame the product as the ultimate vehicle to achieve their lifestyle.

Output strictly valid JSON matching this exact schema:
{
  "heroTitle": "Catchy, 4-7 word luxury headline focusing on their primary purpose.",
  "hydrotherapy": "1 masterfully written paragraph explaining how the tub's jets, pumps, and layout perfectly satisfy their 'primaryPurpose', 'intensity', and 'physicalFocus'. Use <strong> tags lightly.",
  "climate": "1 expert paragraph explaining your geospatial climate analysis of their specific Zip/Postal Code and Sun Exposure, and how the hot tub natively handles those local conditions.",
  "design": "1 paragraph explaining how the tub's capacity, aesthetic, and placement perfectly elevate their specific home environment.",
  "efficiency": "1 paragraph about how the hot tub's voltage, maintenance profile, and budget efficiency provide an effortless ownership experience."
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
