async function testFetch() {
  const apiKey = 'AIzaSyDjRl_hV1cwjZTcMtFnrQpsvz6k91R1WzI';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const body = {
    contents: [{ parts: [{ text: "Respond only with 'OK'" }] }]
  };

  try {
    console.log("Testing with raw fetch...");
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("Fetch Error:", error.message);
  }
}

testFetch();
