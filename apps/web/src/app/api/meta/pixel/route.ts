import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId') || globalStore.getState().currentBusiness.id;
  const config = globalStore.getMetaConfig(businessId);
  return NextResponse.json({ success: true, config });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { pixelId, pixelName, businessId } = body;

    if (!pixelId || !/^\d{14,17}$/.test(pixelId.trim())) {
      return NextResponse.json(
        { error: 'Invalid Meta Pixel ID format. Pixel IDs consist of 14 to 17 numeric digits (e.g. 482910395820194).' },
        { status: 400 }
      );
    }

    const targetBizId = businessId || globalStore.getState().currentBusiness.id || 'biz-abc-dental';
    const cleanId = pixelId.trim();
    const cleanName = (pixelName || 'Website Pixel').trim();

    const snippet = `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${cleanId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${cleanId}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`;

    const updated = globalStore.updateMetaConfig(targetBizId, {
      pixelId: cleanId,
      pixelName: cleanName,
      isConnected: true,
      auditScore: 90,
    });

    return NextResponse.json({
      success: true,
      config: updated,
      generatedSnippet: snippet,
      message: 'Meta Pixel ID successfully validated and configured.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to update Meta Pixel' },
      { status: 500 }
    );
  }
}
