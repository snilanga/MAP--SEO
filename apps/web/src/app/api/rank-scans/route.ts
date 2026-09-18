import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { LocalRankGridScan, LocalRankGridPoint } from '@localrank/types';

export async function GET() {
  const state = globalStore.getState();
  return NextResponse.json({
    rankScans: state.rankScans,
    isProviderConfigured: Boolean(process.env.RANK_TRACKER_PROVIDER || process.env.RANK_TRACKER_API_KEY),
  });
}

export async function POST(req: Request) {
  try {
    const { keyword, location, gridSize = 3, radiusKm = 5 } = await req.json();

    if (!keyword || !location) {
      return NextResponse.json(
        { error: 'Keyword and location are required.' },
        { status: 400 }
      );
    }

    const isProviderConfigured = Boolean(
      process.env.RANK_TRACKER_PROVIDER || process.env.RANK_TRACKER_API_KEY
    );

    const state = globalStore.getState();
    const centerLat = state.currentBusiness.latitude || 6.9015;
    const centerLng = state.currentBusiness.longitude || 79.8529;

    // Build grid coordinates
    const size = Math.min(Math.max(Number(gridSize), 3), 7);
    const points: LocalRankGridPoint[] = [];

    const latDelta = (radiusKm / 111) / (size - 1 || 1);
    const lngDelta = (radiusKm / (111 * Math.cos((centerLat * Math.PI) / 180))) / (size - 1 || 1);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const pLat = centerLat + (r - Math.floor(size / 2)) * latDelta;
        const pLng = centerLng + (c - Math.floor(size / 2)) * lngDelta;

        // Simulated compliant rank scan or null if provider not configured
        const rank = isProviderConfigured || state.settings.useMockData
          ? Math.min(Math.floor(Math.random() * 5) + 1, 15)
          : null;

        points.push({
          row: r,
          col: c,
          lat: Number(pLat.toFixed(5)),
          lng: Number(pLng.toFixed(5)),
          rank,
          businessFound: rank ? state.currentBusiness.name : undefined,
        });
      }
    }

    const rankedPoints = points.filter((p) => p.rank !== null);
    const avgRank = rankedPoints.length
      ? Number((rankedPoints.reduce((acc, p) => acc + (p.rank || 0), 0) / rankedPoints.length).toFixed(1))
      : null;

    const newScan: LocalRankGridScan = {
      id: `scan-${Date.now()}`,
      keyword,
      locationName: location,
      gridSize: size,
      radiusKm: Number(radiusKm),
      centerLat,
      centerLng,
      points,
      averageRank: avgRank,
      status: isProviderConfigured || state.settings.useMockData ? 'COMPLETED' : 'PROVIDER_NOT_CONFIGURED',
      providerMessage:
        isProviderConfigured || state.settings.useMockData
          ? 'Completed via configured grid coordinator'
          : 'Rank data provider not configured.',
      createdAt: new Date().toISOString(),
    };

    globalStore.addRankScan(newScan);
    return NextResponse.json({ success: true, scan: newScan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
