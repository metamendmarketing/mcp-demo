const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

async function testFullPrompt() {
  const prisma = new PrismaClient();
  const apiKey = 'AIzaSyCy3_3EcYYY_ekmV5Y5wTWvHIqJwO6_4xc';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const product = await prisma.product.findFirst({ where: { slug: 'marquis-crown-summit' } });
    const promptRef = await prisma.systemPrompt.findUnique({ where: { key: 'narrative' } });
    
    if (!product || !promptRef) {
      console.log("Missing product or prompt in DB.");
      return;
    }

    const prompt = promptRef.content
      .replace('{{MODEL_NAME}}', product.modelName)
      .replace('{{KNOWLEDGE_BASE}}', '{}')
      .replace('{{PRODUCT_DATA}}', JSON.stringify(product, null, 2))
      .replace('{{USER_PREFERENCES}}', '{}')
      .replace('{{CLIMATE_ZONE}}', 'Standard');

    console.log("Sending prompt to gemini-2.5-flash...");
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await model.generateContent(prompt);
    console.log("Response:", result.response.text());
  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testFullPrompt();
