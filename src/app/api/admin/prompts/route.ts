import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/app/admin/actions';

export async function GET() {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const prompts = await (prisma as any).systemPrompt.findMany({
      orderBy: { title: 'asc' }
    });

    return NextResponse.json(prompts);
  } catch (error: any) {
    console.error('[API] Prompts GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { key, content } = body;

    if (!key || !content) {
      return NextResponse.json({ error: 'Key and content are required' }, { status: 400 });
    }

    const updated = await (prisma as any).systemPrompt.update({
      where: { key },
      data: { content }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('[API] Prompts POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
