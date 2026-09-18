import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { BusinessProfile } from '@localrank/types';

export async function GET() {
  const state = globalStore.getState();
  return NextResponse.json({
    businesses: state.businesses,
    currentBusiness: state.currentBusiness,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Business name is required and must be at least 2 characters.' },
        { status: 400 }
      );
    }

    const combinedAddress = [body.address, body.city, body.country]
      .filter(Boolean)
      .join(', ');

    let cleanWebsite = (body.website || '').trim();
    if (cleanWebsite && !cleanWebsite.startsWith('http://') && !cleanWebsite.startsWith('https://')) {
      cleanWebsite = `https://${cleanWebsite}`;
    }

    const newBusiness: BusinessProfile = {
      id: `biz-${Date.now()}`,
      name: body.name.trim(),
      placeId: body.placeId || `place-${Date.now()}`,
      address: combinedAddress || 'Address pending verification',
      street: body.address,
      city: body.city,
      country: body.country,
      phone: body.phone,
      website: cleanWebsite,
      primaryCategory: body.primaryCategory || 'Local Business',
      secondaryCategories: body.secondaryCategories || [],
      rating: body.rating ? parseFloat(body.rating) : 4.5,
      reviewCount: body.reviewCount ? parseInt(body.reviewCount, 10) : 10,
      openingHours: body.openingHours || 'Mon-Fri: 09:00 - 17:00',
      description: body.description || '',
      services: body.services || ['General Consultation'],
      photosCount: body.photosCount ? parseInt(body.photosCount, 10) : 10,
      dataSource: body.dataSource || 'User input',
    };

    const created = globalStore.addBusiness(newBusiness);
    return NextResponse.json({ success: true, business: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to create business' },
      { status: 500 }
    );
  }
}
