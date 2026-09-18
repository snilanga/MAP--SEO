import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET() {
  const state = globalStore.getState();
  return NextResponse.json({
    currentBusiness: state.currentBusiness,
    competitors: state.competitors,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state = globalStore.getState();

    const newComp = {
      id: `comp-${Date.now()}`,
      name: body.name || 'New Competitor',
      primaryCategory: body.primaryCategory || state.currentBusiness.primaryCategory || 'Dentist',
      secondaryCategories: body.secondaryCategories || [],
      rating: parseFloat(body.rating) || 4.5,
      reviewCount: parseInt(body.reviewCount, 10) || 50,
      website: body.website || '',
      servicesCount: parseInt(body.servicesCount, 10) || 10,
      photosCount: parseInt(body.photosCount, 10) || 20,
      profileCompletenessScore: 85,
      reviewResponseRate: 80,
      observedDifferences: [
        `Competitor active in ${body.location || 'Colombo'}.`,
        `Comparison generated against ${state.currentBusiness.name}.`,
      ],
    };

    state.competitors.push(newComp);
    return NextResponse.json({ success: true, competitor: newComp });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
