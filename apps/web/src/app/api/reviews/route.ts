import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { fetchReviewsForBusiness } from '@localrank/google';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');
    const businessId = searchParams.get('businessId');

    const state = globalStore.getState();
    let targetBiz = state.currentBusiness;

    if (businessId) {
      const found = globalStore.getBusinessById(businessId);
      if (found) targetBiz = found;
    } else if (query && query.trim()) {
      targetBiz = {
        ...state.currentBusiness,
        name: query.trim(),
        address: query.trim(),
      };
    }

    const result = await fetchReviewsForBusiness(targetBiz);
    state.reviewAudit = result.metrics;

    return NextResponse.json({
      success: true,
      metrics: result.metrics,
      samples: result.reviews,
      googleMapsUrl: result.googleMapsUrl,
      mapEmbedUrl: result.mapEmbedUrl,
      source: result.source,
      placeName: result.placeName,
      formattedAddress: result.formattedAddress,
      isRealGoogleApi: result.isRealGoogleApi,
      googleRank: result.googleRank,
      seoLevel: result.seoLevel,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state = globalStore.getState();

    let targetBiz = state.currentBusiness;

    if (body.businessId) {
      const found = globalStore.getBusinessById(body.businessId);
      if (found) {
        globalStore.setCurrentBusiness(found);
        targetBiz = found;
      }
    } else if (body.query && body.query.trim()) {
      targetBiz = {
        id: `biz-query-${Date.now()}`,
        name: body.query.trim(),
        address: body.address || body.query.trim(),
        city: body.city || 'Colombo',
        primaryCategory: body.category || 'Local Business',
        rating: 4.8,
        reviewCount: 160,
        dataSource: 'Google Maps public information',
      };
    }

    const result = await fetchReviewsForBusiness(targetBiz);
    state.reviewAudit = result.metrics;

    return NextResponse.json({
      success: true,
      metrics: result.metrics,
      samples: result.reviews,
      googleMapsUrl: result.googleMapsUrl,
      mapEmbedUrl: result.mapEmbedUrl,
      source: result.source,
      placeName: result.placeName,
      formattedAddress: result.formattedAddress,
      isRealGoogleApi: result.isRealGoogleApi,
      googleRank: result.googleRank,
      seoLevel: result.seoLevel,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
