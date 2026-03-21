import re

with open('c:/dev2/src/app/api/narrative/route.ts', 'r', encoding='utf-8') as f:
    code = f.read()

old_prompt = r"""    const prompt = `
You are Marquis, an elite, luxury hot tub concierge. 
The user completed a 14-question profile. Based on their answers, our deterministic engine selected the following Marquis Crown Series model for them:
\$\{JSON.stringify\(body\.product, null, 2\)\}

Here is the user's specific profile and hydrotherapy needs:
\$\{JSON.stringify\(body\.preferences, null, 2\)\}

Your task is to generate a dynamic Product Detail Page \(PDP\) narrative that connects this specific product's features EXACTLY to their lifestyle inputs.

CRITICAL INSTRUCTIONS:
1\. Look at their 'zipCode' and 'sunExposure'\. You are required to use your native geospatial knowledge to determine the average winter temperatures, freeze-risk, altitude, and typical UV index of that specific Zip or Postal Code\.
2\. Synthesize that macro-climate \(from the Zip Code\) with their micro-climate \(from their 'sunExposure' answer\)\. For example, if they live in Miami but their tub is heavily shaded, or if they live in Calgary and their tub is exposed to harsh winter sun\.
3\. Formulate an 'environmentalInsight' explaining your geospatial climate analysis of their area, and how this specific tub's insulation or cover accommodates it\.
4\. If they requested specific physical therapy \(e\.g\., lower back, neck/shoulders\), explicitly highlight how this hot tub model's specific jets solve their exact problem in the 'marquisMatch'\.
5\. Output strictly valid JSON matching this exact schema:
\{
  "heroTitle": "Catchy, 4-7 word luxury headline focusing on their primary purpose\.",
  "marquisMatch": "2-3 paragraphs of highly personalized sales copy explaining why this specific tub fits their physical focus, capacity, and aesthetic needs\. Use basic HTML tags like <p>, <strong>, and <br/> for elegant formatting\.",
  "environmentalInsight": "A dedicated 1-2 paragraph insight explaining your geospatial climate analysis based on their specific Zip/Postal Code \+ Sun Exposure, and how this tub handles it\. Use basic HTML tags for formatting\."
\}

Do not wrap the output in markdown blocks \(e\.g\., \`\`\`json\)\. Return raw valid JSON\.
`;"""

new_prompt = r"""    const prompt = `
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
`;"""

code = re.sub(old_prompt, new_prompt, code, flags=re.DOTALL)

with open('c:/dev2/src/app/api/narrative/route.ts', 'w', encoding='utf-8') as f:
    f.write(code)

print("Prompt refined successfully")
