const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function debugRecommend() {
  const prisma = new PrismaClient();
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  
  if (!apiKey) {
      console.log("CRITICAL ERROR: apiKey is completely empty from process.env!");
      return;
  }
  
  console.log(`Using API Key ending in: ...${apiKey.slice(-4)}`);
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const products = await prisma.product.findMany({ include: { series: true }, take: 10 });
    const promptRef = await prisma.systemPrompt.findUnique({ where: { key: 'recommend' } });
    
    if (!promptRef) {
      console.log("Missing recommend prompt in DB.");
      return;
    }

    const brand = await prisma.brand.findFirst({ where: { name: { contains: 'Marquis' } }, include: { expertise: true } });
    
    const promptTemplate = promptRef.content;
    const prompt = promptTemplate
      .replace('{{BRAND_KNOWLEDGE}}', JSON.stringify(brand?.expertise || []).substring(0, 1000))
      .replace('{{ENGINEERING_CONSTRAINTS}}', "Only recommend ATVs for exercise.")
      .replace('{{USER_PREFERENCES}}', JSON.stringify({ primaryPurpose: 'therapy', capacity: '6' }))
      .replace('{{CANDIDATE_POOL}}', JSON.stringify(products.map(p => ({ id: p.id, model: p.modelName }))));

    console.log("Sending prompt to gemini-2.5-flash...");
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Raw Response:", text);

  } catch (error) {
    console.log("Recommend Error Captured in try/catch:", error.message || error);
  } finally {
    await prisma.$disconnect();
  }
}

debugRecommend();
