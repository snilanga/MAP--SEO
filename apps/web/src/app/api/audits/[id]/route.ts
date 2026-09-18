import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const state = globalStore.getState();
  if (state.currentAudit.id === params.id || params.id === 'current' || params.id === 'latest') {
    return NextResponse.json(state.currentAudit);
  }
  return NextResponse.json(state.currentAudit);
}
