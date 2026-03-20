import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scoreProducts, UserPreferences } from '@/lib/recommendation/scoring';

/**
 * POST /api/recommend
 * Accepts user preferences and returns ranked Marquis swim spas.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json() as { preferences: UserPreferences };
    
    if (!body.preferences) {
      return NextResponse.json({ error: 'Missing preferences' }, { status: 400 });
    }

    // 1. Fetch all products (Marquis for now)
    const products = await prisma.product.findMany();
    console.log(`[API] Found ${products.length} products`);

    // 2. Rank using our deterministic scoring engine
    const results = scoreProducts(products, body.preferences);
    console.log(`[API] Scored ${results.length} results`);

    // 3. Return ranked results
    return NextResponse.json({ results });

  } catch (error: any) {
    console.error('[RECOMMEND_API_ERROR]', error);
    if (error.stack) console.error(error.stack);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
