import type { WebsiteAuditData } from '../../types/src/index.ts';

export const MOCK_WEBSITE_AUDIT: WebsiteAuditData = {
  url: 'https://abcdentalcolombo.example.com',
  httpStatus: 200,
  isHttps: true,
  isResponsive: true,
  responseTimeMs: 380,
  redirectsCount: 0,
  canonicalUrl: 'https://abcdentalcolombo.example.com',
  robotsTxtPresent: true,
  sitemapPresent: true,
  title: 'ABC Dental Clinic Colombo | Advanced Cosmetic & Family Dentistry',
  titleLength: 64,
  metaDescription:
    'ABC Dental Clinic in Colombo 03 offers cosmetic dentistry, teeth whitening, painless root canals, and emergency dental care. Call +94 11 234 5678.',
  metaDescriptionLength: 153,
  h1Tags: ['Gentle & Advanced Family Dentistry in Colombo'],
  h2Tags: [
    'Comprehensive Dental Services',
    'Why Choose ABC Dental Clinic',
    'Meet Dr. Nilanka Silva & Associates',
    'Patient Reviews & Smile Transformations',
    'Visit Our Colombo 03 Clinic',
  ],
  wordCount: 1350,
  totalImages: 19,
  imagesWithoutAlt: 2,
  internalLinksCount: 28,
  externalLinksCount: 5,
  hasLocalBusinessSchema: true,
  hasOrganizationSchema: true,
  hasFaqSchema: true,
  schemaTypesFound: ['LocalBusiness', 'Dentist', 'PostalAddress', 'FAQPage'],
  detectedBusinessName: 'ABC Dental Clinic',
  detectedPhone: '+94 11 234 5678',
  detectedAddress: 'No 45 Galle Road, Colombo 03, Sri Lanka',
  detectedHours: 'Mon - Fri: 09:00 - 17:00, Sat: 09:00 - 13:00', // Note difference with GBP 08:00 - 18:00
  serviceKeywordsFound: [
    'dental cleaning',
    'teeth whitening',
    'dental implants',
    'root canal',
    'orthodontics',
    'fillings',
  ],
  locationKeywordsFound: ['colombo', 'colombo 03', 'galle road', 'kollupitiya', 'western province'],
  metaPixel: {
    isPixelDetected: true,
    detectedPixelIds: ['482910395820194'],
    isPageViewDetected: true,
    hasDuplicatePixel: false,
    scriptSnippet: "fbq('init', '482910395820194');",
    status: 'PASS',
    recommendations: [],
  },
  openGraph: {
    ogTitle: 'ABC Dental Clinic Colombo | Advanced Cosmetic & Family Dentistry',
    ogDescription: 'ABC Dental Clinic in Colombo 03 offers cosmetic dentistry, teeth whitening, and emergency dental care.',
    ogImage: 'https://abcdentalcolombo.example.com/assets/og-cover.jpg',
    ogUrl: 'https://abcdentalcolombo.example.com',
    ogType: 'website',
    facebookPageLinked: true,
    facebookPageUrl: 'https://facebook.com/abcdentalcolombo',
    status: 'PASS',
    missingTags: [],
  },
};

export const MOCK_AUTO_WEBSITE_AUDIT: WebsiteAuditData = {
  url: 'https://colomboautocare.example.com',
  httpStatus: 200,
  isHttps: true,
  isResponsive: true,
  responseTimeMs: 290,
  redirectsCount: 0,
  canonicalUrl: 'https://colomboautocare.example.com',
  robotsTxtPresent: true,
  sitemapPresent: true,
  title: 'Colombo Auto Care Specialists | Hybrid & Mechanical Repair Colombo 09',
  titleLength: 68,
  metaDescription:
    'Colombo Auto Care Specialists provides hybrid battery repair, computer engine diagnostics, oil changes, and lube services in Colombo 09. Call +94 11 288 9911.',
  metaDescriptionLength: 156,
  h1Tags: ['Expert Automotive & Hybrid Repair in Colombo'],
  h2Tags: [
    'Comprehensive Automotive Services',
    'Why Choose Colombo Auto Care',
    'Customer Testimonials',
    'Visit Our Baseline Road Workshop',
  ],
  wordCount: 1420,
  totalImages: 22,
  imagesWithoutAlt: 1,
  internalLinksCount: 30,
  externalLinksCount: 4,
  hasLocalBusinessSchema: true,
  hasOrganizationSchema: true,
  hasFaqSchema: false,
  schemaTypesFound: ['LocalBusiness', 'AutoRepair', 'PostalAddress'],
  detectedBusinessName: 'Colombo Auto Care Specialists',
  detectedPhone: '+94 11 288 9911',
  detectedAddress: '112 Baseline Road, Colombo 09, Sri Lanka',
  detectedHours: 'Mon - Sat: 07:30 - 19:00, Sun: Closed',
  serviceKeywordsFound: ['auto repair', 'hybrid battery', 'engine diagnostics', 'wheel alignment', 'oil change'],
  locationKeywordsFound: ['colombo', 'colombo 09', 'baseline road', 'western province'],
};

export const MOCK_RESTAURANT_WEBSITE_AUDIT: WebsiteAuditData = {
  url: 'https://cinnamonkitchen.example.com',
  httpStatus: 200,
  isHttps: true,
  isResponsive: true,
  responseTimeMs: 310,
  redirectsCount: 0,
  canonicalUrl: 'https://cinnamonkitchen.example.com',
  robotsTxtPresent: true,
  sitemapPresent: true,
  title: 'The Cinnamon Kitchen Colombo | Authentic Sri Lankan Cuisine & Dining',
  titleLength: 69,
  metaDescription:
    'Authentic Ceylon dining, fresh seafood curries, and courtyard ambiance at The Cinnamon Kitchen Colombo 03. Call +94 11 250 1122.',
  metaDescriptionLength: 147,
  h1Tags: ['Authentic Ceylon Dining & Courtyard Experience in Colombo 03'],
  h2Tags: [
    'Our Signature Dishes & Curries',
    'Courtyard Dining & Private Events',
    'Farm-Fresh Locally Sourced Ingredients',
    'Find Us on Alfred House Gardens',
  ],
  wordCount: 1150,
  totalImages: 26,
  imagesWithoutAlt: 2,
  internalLinksCount: 24,
  externalLinksCount: 3,
  hasLocalBusinessSchema: true,
  hasOrganizationSchema: true,
  hasFaqSchema: false,
  schemaTypesFound: ['LocalBusiness', 'Restaurant', 'PostalAddress'],
  detectedBusinessName: 'The Cinnamon Kitchen Colombo',
  detectedPhone: '+94 11 250 1122',
  detectedAddress: '28 Alfred House Gardens, Colombo 03, Sri Lanka',
  detectedHours: 'Tue - Sun: 12:00 - 23:00, Mon: Closed',
  serviceKeywordsFound: ['restaurant', 'seafood curry', 'dine-in', 'catering', 'ceylon cuisine'],
  locationKeywordsFound: ['colombo', 'colombo 03', 'alfred house gardens', 'western province'],
};

export function generateMockWebsiteAudit(
  business: {
    name?: string;
    address?: string;
    phone?: string;
    website?: string;
    primaryCategory?: string;
    openingHours?: string;
  },
  overrideUrl?: string
): WebsiteAuditData {
  const url = overrideUrl || business.website || 'https://example.com';
  const name = business.name || 'Local Business';
  const address = business.address || 'Colombo, Sri Lanka';
  const phone = business.phone || '+94 11 000 0000';
  const category = business.primaryCategory || 'Local Business';
  const hours = business.openingHours || 'Mon-Fri: 09:00 - 17:00';

  return {
    url,
    httpStatus: 200,
    isHttps: url.startsWith('https://'),
    isResponsive: true,
    responseTimeMs: 320,
    redirectsCount: 0,
    canonicalUrl: url,
    robotsTxtPresent: true,
    sitemapPresent: true,
    title: `${name} | Official Website - ${category}`,
    titleLength: `${name} | Official Website - ${category}`.length,
    metaDescription: `Welcome to ${name}. Providing premier ${category.toLowerCase()} services in ${address}. Contact us today at ${phone}.`,
    metaDescriptionLength: 145,
    h1Tags: [`Welcome to ${name}`],
    h2Tags: [
      `Our ${category} Services`,
      `Why Choose ${name}`,
      `Customer Reviews & Testimonials`,
      `Contact & Location`,
    ],
    wordCount: 1280,
    totalImages: 18,
    imagesWithoutAlt: 1,
    internalLinksCount: 26,
    externalLinksCount: 4,
    hasLocalBusinessSchema: true,
    hasOrganizationSchema: true,
    hasFaqSchema: false,
    schemaTypesFound: ['LocalBusiness', 'PostalAddress'],
    detectedBusinessName: name,
    detectedPhone: phone,
    detectedAddress: address,
    detectedHours: hours,
    serviceKeywordsFound: [category.toLowerCase(), 'consultation', 'booking'],
    locationKeywordsFound: ['colombo', 'sri lanka'],
  };
}

