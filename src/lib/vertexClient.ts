import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs';
import path from 'path';

export function getVertexModel(modelName: string = 'gemini-2.5-flash') {
  let credentials;

  // 1. Production (Vercel) uses the secure environment variable containing the minified JSON string
  if (process.env.VERTEX_CREDENTIALS_JSON) {
    try {
      credentials = JSON.parse(process.env.VERTEX_CREDENTIALS_JSON);
    } catch (e) {
      console.error("[VERTEX] Failed to parse vertical credentials JSON from env", e);
    }
  } 
  // 2. Local Development safely reads the hidden file we placed in the root directory via .gitignore
  else {
    try {
      const filePath = path.join(process.cwd(), 'vertex-key.json');
      const fileContents = fs.readFileSync(filePath, 'utf8');
      credentials = JSON.parse(fileContents);
    } catch (e) {
      console.error("[VERTEX] Failed to read local vertex-key.json file", e);
    }
  }

  // Initialize the enterprise SDK
  const vertex = new VertexAI({
    project: 'gen-lang-client-0736948026',
    location: 'us-central1',
    googleAuthOptions: credentials ? { credentials } : undefined
  });

  return vertex.preview.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: "application/json" }
  });
}
