const fetch = require('node-fetch');

async function testApi() {
  const body = {
    preferences: { zipCode: "80424", sunExposure: "Afternoon Sun", primaryPurpose: "Therapy" },
    product: { modelName: "Summit", marketingSummary: null }
  };
  
  try {
    const res = await fetch('https://demos.metamend.ca/mcp/demo/api/narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    console.log("API STATUS:", res.status);
    console.log("API RESPONSE:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
testApi();
