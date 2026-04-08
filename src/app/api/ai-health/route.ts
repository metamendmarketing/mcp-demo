import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
        return NextResponse.json({ ok: false, error: "NO_API_KEY_FOUND_IN_ENV" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    
    const result = await model.generateContent("Reply with exactly: OK");
    const text = result.response.text();

    return NextResponse.json({
      ok: true,
      text: text.trim(),
      keySuffix: apiKey.slice(-4),
      model: "gemini-2.5-flash-lite",
      environment: process.env.NODE_ENV
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      status: err?.status,
      message: err?.message || err.toString(),
      keySuffix: (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY)?.slice(-4) || 'NONE'
    }, { status: 500 });
  }
}
