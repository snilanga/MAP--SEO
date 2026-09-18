import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { generateAiContentDraft } from '@localrank/audit-engine';

export async function POST(req: Request) {
  try {
    const { type, context } = await req.json();
    const state = globalStore.getState();

    const draft = generateAiContentDraft(type || 'gbp_description', state.currentBusiness, context);

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
