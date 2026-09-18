import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { runFullAudit } from '@localrank/audit-engine';
import { runAiAutoFixEngine } from './engine';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { provider = 'auto', apiKey } = body;

    const state = globalStore.getState();
    const currentBiz = state.currentBusiness;

    const autoFixResult = await runAiAutoFixEngine(
      currentBiz,
      state.currentAudit.findings,
      state.websiteAudit,
      provider,
      apiKey
    );

    // Apply fixes directly to current business
    currentBiz.description = autoFixResult.optimizedDescription;
    currentBiz.services = autoFixResult.recommendedServices;
    if (!currentBiz.regularHours) {
      currentBiz.openingHours = 'Mon-Fri: 08:30 - 18:00, Sat: 09:00 - 14:00';
    }

    // Re-evaluate full audit score
    const updatedAudit = runFullAudit(
      currentBiz,
      state.websiteAudit,
      state.reviewAudit,
      state.competitors
    );

    state.currentAudit = updatedAudit;
    globalStore.setCurrentBusiness(currentBiz);

    return NextResponse.json({
      success: true,
      result: autoFixResult,
      business: currentBiz,
      audit: updatedAudit,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'AI Auto-Fix execution failed.' },
      { status: 500 }
    );
  }
}
