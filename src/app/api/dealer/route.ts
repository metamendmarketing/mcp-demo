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
// Helper for Haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { brandId, postalCode, lat, lng, radius = 100 } = body;

    // Fetch all active dealers for the brand
    const dealers = await prisma.dealer.findMany({
      where: {
        brandId: brandId || 'marquis',
        active: true,
      },
    });

    let results = dealers.map(dealer => {
      let distanceMiles: number | null = null;
      if (lat && lng && dealer.lat && dealer.lng) {
        distanceMiles = calculateDistance(lat, lng, dealer.lat, dealer.lng);
      }
      return { ...dealer, distanceMiles };
    });

    // Sort by distance if coordinates provided
    if (lat && lng) {
      results = results
        .filter(d => d.distanceMiles !== null && d.distanceMiles <= radius)
        .sort((a, b) => (a.distanceMiles || 0) - (b.distanceMiles || 0));
    } else if (postalCode) {
      // Fallback to simple postal code prefix matching
      const prefix = postalCode.substring(0, 3).toUpperCase();
      results = results.filter(d => d.postalCode.toUpperCase().startsWith(prefix));
      results.sort((a, b) => a.dealerName.localeCompare(b.dealerName));
    }

    return NextResponse.json({
      dealers: results,
      totalFound: results.length,
      searchedPostalCode: postalCode || null,
      searchedCoordinates: lat && lng ? { lat, lng } : null,
      radiusMiles: radius,
    });

  } catch (error: any) {
    console.error('[DEALER_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to find dealers', details: error.message },
      { status: 500 }
    );
  }
}
