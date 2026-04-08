const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load .env explicitly
dotenv.config({ path: path.join(__dirname, '../.env') });

async function verifyAI() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    console.error("No API key found in .env");
    process.exit(1);
  }

  console.log(`Using key: ...${apiKey.slice(-4)}`);
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = "Act as a Marquis Spa advisor. Provide a simple JSON object: { \"status\": \"online\", \"message\": \"Ready for premium narratives.\" }";

  try {
    console.log("Sending prompt to gemini-2.5-flash...");
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Response:", text);
  } catch (error) {
    console.error("AI Error:", error.message);
    process.exit(1);
  }
}

verifyAI();
