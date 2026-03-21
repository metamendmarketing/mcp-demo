const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI("AIzaSyA96lKQn82UP1yUaLyuza-WL771eCC1Syc");
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `
You are Marquis, an elite, luxury hot tub concierge. 
The user completed a 14-question profile. Based on their answers, our deterministic engine selected the following Marquis Crown Series model for them:
{ "modelName": "Summit" }

Here is the user's specific profile and hydrotherapy needs:
{ "zipCode": "80424", "sunExposure": "Afternoon Sun", "primaryPurpose": "Therapy" }

CRITICAL INSTRUCTIONS:
1. Look at their 'zipCode' and 'sunExposure'.
2. Output strictly valid JSON matching this exact schema:
{
  "heroTitle": "Catchy headline",
  "marquisMatch": "2 paragraphs.",
  "environmentalInsight": "A dedicated 1-2 paragraph insight."
}
`;

  try {
    const result = await model.generateContent(prompt);
    console.log("SUCCESS:", result.response.text());
  } catch(e) {
    console.error("FAIL:", e);
  }
}

run();
