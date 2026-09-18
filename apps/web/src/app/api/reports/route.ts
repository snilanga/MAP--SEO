import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'json';
  const state = globalStore.getState();
  const audit = state.currentAudit;

  if (format === 'csv') {
    // Generate CSV of audit findings
    const header = 'Rule ID,Name,Category,Severity,Status,Message,Recommendation,Data Source\n';
    const rows = audit.findings
      .map(
        (f) =>
          `"${f.id}","${f.name}","${f.category}","${f.severity}","${f.status}","${f.message.replace(/"/g, '""')}","${f.recommendation.replace(/"/g, '""')}","${f.dataSource}"`
      )
      .join('\n');

    return new Response(header + rows, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="localrank-audit-${audit.business.name.replace(/\s+/g, '-').toLowerCase()}.csv"`,
      },
    });
  }

  return NextResponse.json({
    report: audit,
    agencyBranding: state.settings,
  });
}

export async function POST(req: Request) {
  const state = globalStore.getState();
  return NextResponse.json({
    success: true,
    message: 'Report ready for download/print view',
    reportId: state.currentAudit.id,
  });
}
