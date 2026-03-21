const { GoogleGenerativeAI } = require("@google/generative-ai");

async function run() {
  const genAI = new GoogleGenerativeAI("AIzaSyA96lKQn82UP1yUaLyuza-WL771eCC1Syc");
  
  try {
    const models = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyA96lKQn82UP1yUaLyuza-WL771eCC1Syc');
    const data = await models.json();
    console.log("AVAILABLE MODELS:");
    if (data.models) {
      data.models.forEach(model => console.log(model.name, " - ", model.supportedGenerationMethods.join(',')));
    } else {
      console.log(data);
    }
  } catch(e) {
    console.error(e);
  }
}

run();
