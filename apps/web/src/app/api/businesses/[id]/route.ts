import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const biz = globalStore.getBusinessById(params.id);
  if (!biz) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  return NextResponse.json(biz);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const biz = globalStore.getBusinessById(params.id);
  if (!biz) {
    return NextResponse.json({ error: 'Business not found' }, { status: 404 });
  }
  const body = await req.json();
  Object.assign(biz, body);
  globalStore.setCurrentBusiness(biz);
  return NextResponse.json({ success: true, business: biz });
}
