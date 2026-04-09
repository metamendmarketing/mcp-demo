import { NextResponse } from 'next/server';
import { getVertexModel } from '@/lib/vertexClient';

export async function GET() {
  try {
    const model = getVertexModel('gemini-2.5-flash');
    
    // Test the enterprise SLA connection
    const result = await model.generateContent("Reply with exactly: OK");
    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || 'FAIL';

    return NextResponse.json({
      ok: true,
      text: text.trim(),
      model: "gemini-2.5-flash (Vertex Enterprise)",
      environment: process.env.NODE_ENV,
      authMethod: process.env.VERTEX_CREDENTIALS_JSON ? 'Vercel Env' : 'Local JSON'
    });
  } catch (err: any) {
    return NextResponse.json({
      ok: false,
      message: err?.message || err.toString(),
      stack: err.stack
    }, { status: 500 });
  }
}
