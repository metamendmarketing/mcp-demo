import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export const getGeminiModel = (modelName: string = 'gemini-1.5-pro') => {
  return genAI.getGenerativeModel({ model: modelName });
};

export interface AIResponse {
  content: string;
  sources?: string[];
  suggestedQuestions?: string[];
}

export const generateGroundedResponse = async (
  prompt: string,
  context: string,
  brandId: string
): Promise<AIResponse> => {
  // Boilerplate for grounded generation
  const model = getGeminiModel();
  
  // Structured prompt with brand awareness
  const fullPrompt = `
    You are an AI Buying Assistant for ${brandId}.
    Use the following grounded context to answer the user's request.
    If the information is not in the context, politely say you don't know.
    
    Context:
    ${context}
    
    User Request:
    ${prompt}
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return {
      content: response.text(),
    };
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate AI response');
  }
};
