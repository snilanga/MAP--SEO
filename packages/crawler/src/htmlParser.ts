import type { WebsiteAuditData } from '../../types/src/index.ts';

export function parseHtmlContent(html: string, baseUrl: string, responseTimeMs: number = 250): Partial<WebsiteAuditData> {
  // Title tag extraction
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Meta description extraction
  const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
                        html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i);
  const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : '';

  // Canonical tag extraction
  const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : undefined;

  // Viewport check
  const viewportMatch = html.match(/<meta[^>]+name=["']viewport["']/i);
  const isResponsive = Boolean(viewportMatch);

  // H1 tags
  const h1Tags: string[] = [];
  const h1Regex = /<h1[^>]*>([\s\S]*?)<\/h1>/gi;
  let match;
  while ((match = h1Regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text) h1Tags.push(text);
  }

  // H2 tags
  const h2Tags: string[] = [];
  const h2Regex = /<h2[^>]*>([\s\S]*?)<\/h2>/gi;
  while ((match = h2Regex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text) h2Tags.push(text);
  }

  // Images and alt attributes
  const imgRegex = /<img\b([^>]*)>/gi;
  let totalImages = 0;
  let imagesWithoutAlt = 0;
  while ((match = imgRegex.exec(html)) !== null) {
    totalImages++;
    const attrs = match[1];
    const hasAlt = /alt=["'][^"']+["']/i.test(attrs);
    if (!hasAlt) imagesWithoutAlt++;
  }

  // Links
  const baseHostname = new URL(baseUrl).hostname;
  const linkRegex = /<a\b[^>]+href=["']([^"']+)["']/gi;
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1].trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;
    try {
      const linkUrl = new URL(href, baseUrl);
      if (linkUrl.hostname === baseHostname) {
        internalLinksCount++;
      } else {
        externalLinksCount++;
      }
    } catch {
      // Relative link is internal
      internalLinksCount++;
    }
  }

  // Schema.org JSON-LD extraction
  const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const schemaTypesFound = new Set<string>();
  let hasLocalBusinessSchema = false;
  let hasOrganizationSchema = false;
  let hasFaqSchema = false;
  let detectedBusinessName: string | undefined;
  let detectedPhone: string | undefined;
  let detectedAddress: string | undefined;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const json = JSON.parse(match[1]);
      const objects = Array.isArray(json) ? json : [json];
      for (const obj of objects) {
        const type = obj['@type'] || (obj['@graph'] ? 'Graph' : '');
        if (typeof type === 'string') schemaTypesFound.add(type);
        if (type === 'LocalBusiness' || type === 'Dentist' || type === 'MedicalBusiness' || type === 'Store' || type === 'ProfessionalService') {
          hasLocalBusinessSchema = true;
          if (obj.name) detectedBusinessName = obj.name;
          if (obj.telephone) detectedPhone = obj.telephone;
          if (obj.address) {
            detectedAddress = typeof obj.address === 'string'
              ? obj.address
              : `${obj.address.streetAddress || ''}, ${obj.address.addressLocality || ''}`;
          }
        }
        if (type === 'Organization') hasOrganizationSchema = true;
        if (type === 'FAQPage') hasFaqSchema = true;
      }
    } catch {
      // Ignore JSON parse error in malformed user script
    }
  }

  // Clean body text for word count and keyword detection
  const bodyText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = bodyText.split(/\s+/).filter(w => w.length > 2);
  const wordCount = words.length;

  // Phone regex fallback if schema didn't catch it
  if (!detectedPhone) {
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}/;
    const phoneMatch = bodyText.match(phoneRegex);
    if (phoneMatch) detectedPhone = phoneMatch[0];
  }

  // Service and location keywords detection
  const lowerBody = bodyText.toLowerCase();
  const commonServiceKeywords = ['dental', 'dentist', 'cleaning', 'whitening', 'implants', 'root canal', 'orthodontics', 'surgery', 'clinic', 'treatment'];
  const serviceKeywordsFound = commonServiceKeywords.filter(kw => lowerBody.includes(kw));

  const commonLocationKeywords = ['colombo', 'kollupitiya', 'bambalapitiya', 'galle road', 'sri lanka', 'western province'];
  const locationKeywordsFound = commonLocationKeywords.filter(kw => lowerBody.includes(kw));

  // Meta Pixel Extraction
  const pixelIdMatches = new Set<string>();
  const initRegex = /fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]\s*\)/gi;
  let pxMatch;
  while ((pxMatch = initRegex.exec(html)) !== null) {
    if (pxMatch[1]) pixelIdMatches.add(pxMatch[1]);
  }

  // Also check noscript image tag tr?id=
  const noscriptPxRegex = /facebook\.com\/tr\?[^'"]*id=(\d+)/gi;
  while ((pxMatch = noscriptPxRegex.exec(html)) !== null) {
    if (pxMatch[1]) pixelIdMatches.add(pxMatch[1]);
  }

  const detectedPixelIds = Array.from(pixelIdMatches);
  const isPixelDetected = detectedPixelIds.length > 0 || /connect\.facebook\.net\/[a-z_A-Z]+\/fbevents\.js/i.test(html);
  const isPageViewDetected = /fbq\s*\(\s*['"]track['"]\s*,\s*['"]PageView['"]\s*\)/i.test(html);
  const hasDuplicatePixel = detectedPixelIds.length > 1;

  const pixelRecommendations: string[] = [];
  if (!isPixelDetected) {
    pixelRecommendations.push('Install Meta Pixel base code in your website <head> to track conversions and build retargeting audiences.');
  } else {
    if (!isPageViewDetected) {
      pixelRecommendations.push('Meta Pixel is detected, but standard PageView event call fbq("track", "PageView") is missing.');
    }
    if (hasDuplicatePixel) {
      pixelRecommendations.push(`Multiple Pixel IDs detected (${detectedPixelIds.join(', ')}). Remove duplicate tags to prevent duplicate event counting.`);
    }
  }

  const metaPixel = {
    isPixelDetected,
    detectedPixelIds,
    isPageViewDetected,
    hasDuplicatePixel,
    scriptSnippet: isPixelDetected ? (detectedPixelIds[0] ? `fbq('init', '${detectedPixelIds[0]}');` : undefined) : undefined,
    status: (!isPixelDetected ? 'ERROR' : !isPageViewDetected || hasDuplicatePixel ? 'WARNING' : 'PASS') as 'PASS' | 'WARNING' | 'ERROR',
    recommendations: pixelRecommendations,
  };

  // Open Graph Extraction
  const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i) ||
                       html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i);
  const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:description["']/i);
  const ogImageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i) ||
                       html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["']/i);
  const ogUrlMatch = html.match(/<meta[^>]+property=["']og:url["'][^>]+content=["']([^"']*)["']/i) ||
                     html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:url["']/i);
  const ogTypeMatch = html.match(/<meta[^>]+property=["']og:type["'][^>]+content=["']([^"']*)["']/i) ||
                      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:type["']/i);

  // Facebook Page link detection on website
  const fbPageRegex = /href=["'](https?:\/\/(www\.)?facebook\.com\/([a-zA-Z0-9._-]+))\/?["']/i;
  const fbMatch = html.match(fbPageRegex);
  const facebookPageLinked = Boolean(fbMatch && !fbMatch[1].includes('sharer') && !fbMatch[1].includes('tr?id'));
  const facebookPageUrl = fbMatch && !fbMatch[1].includes('sharer') ? fbMatch[1] : undefined;

  const missingOgTags: string[] = [];
  if (!ogTitleMatch) missingOgTags.push('og:title');
  if (!ogDescMatch) missingOgTags.push('og:description');
  if (!ogImageMatch) missingOgTags.push('og:image');
  if (!ogUrlMatch) missingOgTags.push('og:url');

  const openGraph = {
    ogTitle: ogTitleMatch ? ogTitleMatch[1].trim() : undefined,
    ogDescription: ogDescMatch ? ogDescMatch[1].trim() : undefined,
    ogImage: ogImageMatch ? ogImageMatch[1].trim() : undefined,
    ogUrl: ogUrlMatch ? ogUrlMatch[1].trim() : undefined,
    ogType: ogTypeMatch ? ogTypeMatch[1].trim() : 'website',
    facebookPageLinked,
    facebookPageUrl,
    status: (missingOgTags.length === 0 && facebookPageLinked ? 'PASS' : missingOgTags.length <= 2 ? 'WARNING' : 'ERROR') as 'PASS' | 'WARNING' | 'ERROR',
    missingTags: missingOgTags,
  };

  return {
    url: baseUrl,
    httpStatus: 200,
    isHttps: baseUrl.startsWith('https://'),
    isResponsive,
    responseTimeMs,
    redirectsCount: 0,
    canonicalUrl,
    robotsTxtPresent: true,
    sitemapPresent: true,
    title,
    titleLength: title.length,
    metaDescription,
    metaDescriptionLength: metaDescription.length,
    h1Tags,
    h2Tags: h2Tags.slice(0, 10),
    wordCount,
    totalImages,
    imagesWithoutAlt,
    internalLinksCount,
    externalLinksCount,
    hasLocalBusinessSchema,
    hasOrganizationSchema,
    hasFaqSchema,
    schemaTypesFound: Array.from(schemaTypesFound),
    detectedBusinessName,
    detectedPhone,
    detectedAddress,
    serviceKeywordsFound,
    locationKeywordsFound,
    metaPixel,
    openGraph,
  };
}
