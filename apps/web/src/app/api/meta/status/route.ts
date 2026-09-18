import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId') || globalStore.getState().currentBusiness.id;
  const config = globalStore.getMetaConfig(businessId);
  const websiteAudit = globalStore.getState().websiteAudit;

  // Compute Meta & Facebook Audit Score (0 - 100)
  let score = 0;
  if (config.pixelId) score += 35;
  if (websiteAudit?.metaPixel?.isPixelDetected) score += 20;
  if (websiteAudit?.metaPixel?.isPageViewDetected) score += 10;
  if (config.isConnected && config.facebookPageId) score += 15;
  if (websiteAudit?.openGraph?.ogTitle && websiteAudit?.openGraph?.ogImage) score += 10;
  if (websiteAudit?.openGraph?.facebookPageLinked) score += 10;

  return NextResponse.json({
    success: true,
    config,
    score: Math.min(100, Math.max(score, 40)),
    metaPixelDetected: websiteAudit?.metaPixel?.isPixelDetected || false,
    openGraphStatus: websiteAudit?.openGraph?.status || 'NOT_AVAILABLE',
    openGraph: websiteAudit?.openGraph,
    metaPixel: websiteAudit?.metaPixel,
  });
}
