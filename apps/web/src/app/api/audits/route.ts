import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { runFullAudit } from '@localrank/audit-engine';

export async function GET() {
  const state = globalStore.getState();
  return NextResponse.json({
    audit: state.currentAudit,
    business: state.currentBusiness,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const state = globalStore.getState();
    const targetBusiness = body.business || state.currentBusiness;

    const audit = runFullAudit(
      targetBusiness,
      state.websiteAudit,
      state.reviewAudit,
      state.competitors
    );

    state.currentAudit = audit;
    return NextResponse.json({ success: true, audit });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Audit execution failed' },
      { status: 400 }
    );
  }
}
