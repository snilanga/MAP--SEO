import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');
  const businessId = searchParams.get('businessId') || globalStore.getState().currentBusiness.id;
  const config = globalStore.getMetaConfig(businessId);

  // If token is provided, verify against store or authorize headless client
  const isValid = Boolean(token && (token === config.wordpressApiToken || token.startsWith('wp_meta_')));

  const snippet = config.pixelId ? `<!-- LocalRank Meta Pixel Sync -->
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${config.pixelId}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${config.pixelId}&ev=PageView&noscript=1"
/></noscript>` : '';

  return NextResponse.json({
    success: true,
    authenticated: isValid,
    pixelId: config.pixelId,
    pixelName: config.pixelName,
    activeEvents: config.activeEvents || ['PageView'],
    injectionSnippet: snippet,
    wordpressConnected: config.wordpressConnected,
    lastSync: config.lastVerifiedAt,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const businessId = body.businessId || globalStore.getState().currentBusiness.id || 'biz-abc-dental';

    const generatedToken = `wp_meta_${Math.random().toString(36).substring(2, 12)}_${Date.now().toString(36)}`;
    const updated = globalStore.updateMetaConfig(businessId, {
      wordpressConnected: true,
      wordpressApiToken: generatedToken,
    });

    return NextResponse.json({
      success: true,
      token: generatedToken,
      config: updated,
      message: 'New WordPress plugin integration token generated.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to generate token' }, { status: 500 });
  }
}
