import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateContentWithRetry(model: any, prompt: string, maxRetries: number = 3) {
  let attempt = 0;
  const baseDelay = 1500; // Wait 1.5 seconds minimum between throttles

  while (attempt < maxRetries) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (error: any) {
      attempt++;
      
      const isRecoverable = error?.message?.includes('503') || error?.message?.includes('429');
      
      if (!isRecoverable || attempt >= maxRetries) {
        throw error;
      }
      
      console.warn(`[GEMINI RETRY] Attempt ${attempt} failed with ${error.message.substring(0, 50)}. Retrying in ${baseDelay * attempt}ms...`);
      await new Promise(resolve => setTimeout(resolve, baseDelay * attempt));
    }
  }
}
