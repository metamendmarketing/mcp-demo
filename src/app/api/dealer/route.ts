import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * POST /api/dealer
 * Accepts a zip/postal code and returns nearby authorized dealers.
 * 
 * Expected payload:
 * {
 *   "brandId": "marquis",
 *   "postalCode": "90210",
 *   "lat": 34.0901,    // optional - for precise geo lookup
 *   "lng": -118.4065   // optional - for precise geo lookup
 * }
 * 
 * TODO: Implement geo-distance calculation (Haversine formula or PostGIS)
 * TODO: Add support for radius filtering
 * TODO: Integrate with external dealer directory APIs if available
 * TODO: Add crane/delivery service locator for installation logistics
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandId, postalCode, lat, lng } = body;

    if (!postalCode && (!lat || !lng)) {
      return NextResponse.json(
        { error: 'A postal code or coordinates are required to find dealers.' },
        { status: 400 }
      );
    }

    // Phase 1: Simple postal code prefix matching
    // Phase 2: Replace with Haversine distance calculation using lat/lng
    const dealers = await prisma.dealer.findMany({
      where: {
        brandId: brandId || undefined,
        active: true,
        ...(postalCode ? { postalCode: { startsWith: postalCode.substring(0, 3) } } : {}),
      },
      orderBy: { dealerName: 'asc' },
      take: 10,
    });

    return NextResponse.json({
      dealers,
      totalFound: dealers.length,
      searchedPostalCode: postalCode || null,
      searchedCoordinates: lat && lng ? { lat, lng } : null,
    });

  } catch (error: any) {
    console.error('[DEALER_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to find dealers', details: error.message },
      { status: 500 }
    );
  }
}
