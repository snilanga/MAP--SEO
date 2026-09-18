import { NextResponse } from 'next/server';
import { globalStore } from '@/lib/store';
import { MetaPixelEventConfig } from '@localrank/types';

const STANDARD_META_EVENTS: MetaPixelEventConfig[] = [
  {
    eventName: 'PageView',
    description: 'Track key page views across your entire site. Standard base tracking event.',
    eventStatus: 'ACTIVE',
    installationStatus: 'INSTALLED',
    eventCode: "fbq('track', 'PageView');",
    category: 'STANDARD',
  },
  {
    eventName: 'ViewContent',
    description: 'Tracks visits to specialized service pages, treatment details, or pricing menus.',
    eventStatus: 'ACTIVE',
    installationStatus: 'INSTALLED',
    eventCode: "fbq('track', 'ViewContent', { content_name: 'Cosmetic Teeth Whitening', content_category: 'Dental Service' });",
    category: 'STANDARD',
  },
  {
    eventName: 'Lead',
    description: 'Triggered when a prospective patient submits a consultation or callback form.',
    eventStatus: 'ACTIVE',
    installationStatus: 'INSTALLED',
    eventCode: "fbq('track', 'Lead', { content_name: 'New Patient Appointment Request', value: 35.00, currency: 'USD' });",
    category: 'LEAD_GEN',
  },
  {
    eventName: 'Contact',
    description: 'Fired when a visitor taps the phone call button, WhatsApp link, or contact email.',
    eventStatus: 'ACTIVE',
    installationStatus: 'INSTALLED',
    eventCode: "fbq('track', 'Contact', { method: 'Phone Call / WhatsApp' });",
    category: 'LEAD_GEN',
  },
  {
    eventName: 'CompleteRegistration',
    description: 'Tracks customer account creation, patient portal registrations, or newsletter signups.',
    eventStatus: 'INACTIVE',
    installationStatus: 'OPTIONAL',
    eventCode: "fbq('track', 'CompleteRegistration', { status: 'success' });",
    category: 'STANDARD',
  },
  {
    eventName: 'Search',
    description: 'Logged when a user uses your on-site search bar for treatments or doctors.',
    eventStatus: 'INACTIVE',
    installationStatus: 'OPTIONAL',
    eventCode: "fbq('track', 'Search', { search_string: 'emergency tooth extraction' });",
    category: 'STANDARD',
  },
  {
    eventName: 'AddToCart',
    description: 'Fired when an item, dental package, or care product is added to cart.',
    eventStatus: 'INACTIVE',
    installationStatus: 'OPTIONAL',
    eventCode: "fbq('track', 'AddToCart', { content_name: 'Electric Dental Care Kit', value: 89.00, currency: 'USD' });",
    category: 'ECOMMERCE',
  },
  {
    eventName: 'InitiateCheckout',
    description: 'Logged when a customer commences the checkout process or appointment deposit payment.',
    eventStatus: 'INACTIVE',
    installationStatus: 'OPTIONAL',
    eventCode: "fbq('track', 'InitiateCheckout', { num_items: 1, value: 50.00, currency: 'USD' });",
    category: 'ECOMMERCE',
  },
  {
    eventName: 'Purchase',
    description: 'Critical bottom-funnel conversion event fired on the order confirmation or payment thank-you page.',
    eventStatus: 'INACTIVE',
    installationStatus: 'OPTIONAL',
    eventCode: "fbq('track', 'Purchase', { value: 120.00, currency: 'USD', content_type: 'product' });",
    category: 'ECOMMERCE',
  },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('businessId') || globalStore.getState().currentBusiness.id;
  const config = globalStore.getMetaConfig(businessId);

  const activeSet = new Set(config.activeEvents || ['PageView']);
  const events = STANDARD_META_EVENTS.map(ev => ({
    ...ev,
    eventStatus: activeSet.has(ev.eventName) ? 'ACTIVE' : 'INACTIVE',
    installationStatus: activeSet.has(ev.eventName) ? 'INSTALLED' : 'OPTIONAL',
  }));

  return NextResponse.json({ success: true, events, activeEvents: Array.from(activeSet) });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { activeEvents, businessId } = body;
    const targetBizId = businessId || globalStore.getState().currentBusiness.id || 'biz-abc-dental';

    if (!Array.isArray(activeEvents)) {
      return NextResponse.json({ error: 'activeEvents must be an array of event names.' }, { status: 400 });
    }

    const updated = globalStore.updateMetaConfig(targetBizId, {
      activeEvents,
    });

    return NextResponse.json({
      success: true,
      message: 'Tracking events successfully updated.',
      config: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save events' }, { status: 500 });
  }
}
