import { NextResponse } from 'next/server';
import { WebsiteCrawler } from '@localrank/crawler';
import { globalStore } from '@/lib/store';

export async function GET() {
  const state = globalStore.getState();
  return NextResponse.json({
    currentBusiness: state.currentBusiness,
    businesses: state.businesses,
    websiteAudit: state.websiteAudit || null,
    consistency: state.currentAudit.consistency || [],
  });
}

export async function POST(req: Request) {
  try {
    let { url, businessId } = await req.json();
    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json({ error: 'Target URL is required.' }, { status: 400 });
    }

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    let currentBiz = globalStore.getState().currentBusiness;
    if (businessId) {
      const target = globalStore.getBusinessById(businessId);
      if (target) {
        globalStore.setCurrentBusiness(target);
        currentBiz = target;
      }
    }

    const crawler = new WebsiteCrawler({
      timeoutMs: 12000,
      allowMockFallback: true,
    });

    const result = await crawler.crawlUrl(cleanUrl, currentBiz);
    globalStore.updateWebsiteAudit(result, currentBiz);

    return NextResponse.json({
      success: true,
      data: result,
      currentBusiness: currentBiz,
      audit: globalStore.getState().currentAudit,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Website crawl failed.' },
      { status: 400 }
    );
  }
}
