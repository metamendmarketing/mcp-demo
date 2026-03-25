import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

/**
 * POST /api/lead
 * Captures a qualified buyer lead with their recommendation results,
 * wizard answers, and contact information for dealer follow-up.
 * 
 * Expected payload:
 * {
 *   "brandId": "marquis",
 *   "dealerId": "dealer-123",           // optional - if dealer already selected
 *   "userContact": {
 *     "name": "Jane Doe",
 *     "email": "jane@example.com",
 *     "phone": "555-0123"               // optional
 *   },
 *   "answers": { ... },                 // full wizard preferences object
 *   "rankedProducts": [ ... ],          // top recommendation results
 *   "selectedProductIds": ["prod-1"],   // which products the user explored
 *   "transcriptSummary": "...",         // optional - AI-generated session summary
 *   "consent": {
 *     "contactConsent": true,
 *     "dataRetention": true
 *   }
 * }
 * 
 * TODO: Add email/webhook notification to dealer on new lead
 * TODO: Generate AI summary of buyer profile for dealer handoff
 * TODO: Integrate with CRM/marketing automation
 * TODO: Add PDF buyer summary generation
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandId, dealerId, userContact, answers, rankedProducts, selectedProductIds, transcriptSummary, consent } = body;

    if (!brandId || !userContact?.email) {
      return NextResponse.json(
        { error: 'Brand ID and contact email are required.' },
        { status: 400 }
      );
    }

    if (!consent?.contactConsent) {
      return NextResponse.json(
        { error: 'Contact consent is required to save lead information.' },
        { status: 400 }
      );
    }

    const sessionId = randomUUID();

    const lead = await prisma.lead.create({
      data: {
        brandId,
        dealerId: dealerId || null,
        sessionId,
        answers: answers || {},
        rankedProducts: rankedProducts || [],
        selectedProductIds: selectedProductIds || [],
        transcriptSummary: transcriptSummary || null,
        userContact: userContact || {},
        consent: consent || {},
      },
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      sessionId,
      message: 'Your information has been saved. A dealer will be in touch shortly.',
    });

  } catch (error: any) {
    console.error('[LEAD_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to save lead', details: error.message },
      { status: 500 }
    );
  }
}
