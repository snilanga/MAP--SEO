import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { generateActionRecommendations } from '@localrank/audit-engine';

export async function GET() {
  const state = globalStore.getState();
  return NextResponse.json({
    recommendations: state.currentAudit.aiRecommendations,
  });
}

export async function POST(req: Request) {
  const state = globalStore.getState();
  const recs = generateActionRecommendations(
    state.currentAudit.findings,
    state.currentBusiness,
    state.websiteAudit,
    state.reviewAudit,
    state.competitors
  );
  state.currentAudit.aiRecommendations = recs;
  return NextResponse.json({ success: true, recommendations: recs });
}
