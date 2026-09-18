import type {
  BusinessProfile,
  WebsiteAuditData,
  ConsistencyCheckItem,
  ConsistencyStatus,
} from '../../types/src/index.ts';

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^0+/, '');
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s:]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function compareGBPWithWebsite(
  profile: BusinessProfile,
  website?: WebsiteAuditData
): ConsistencyCheckItem[] {
  const items: ConsistencyCheckItem[] = [];

  // 1. Business Name Consistency
  if (!website || !website.detectedBusinessName) {
    items.push({
      field: 'Name',
      gbpValue: profile.name || 'Not provided',
      websiteValue: 'Not detected on website',
      status: website ? 'NOT FOUND' : 'NOT AVAILABLE',
      confidence: 0.7,
      evidence: website
        ? `Page title was "${website.title || ''}", but no exact LocalBusiness schema or matching brand header found.`
        : 'Website audit has not been conducted yet.',
    });
  } else {
    const gbpNorm = normalizeText(profile.name);
    const webNorm = normalizeText(website.detectedBusinessName);

    let status: ConsistencyStatus = 'MISMATCH';
    let confidence = 0.95;

    if (gbpNorm === webNorm) {
      status = 'MATCH';
    } else if (gbpNorm.includes(webNorm) || webNorm.includes(gbpNorm)) {
      status = 'PARTIAL MATCH';
      confidence = 0.85;
    }

    items.push({
      field: 'Name',
      gbpValue: profile.name,
      websiteValue: website.detectedBusinessName,
      status,
      confidence,
      evidence: `GBP name "${profile.name}" compared against detected website business name "${website.detectedBusinessName}".`,
    });
  }

  // 2. Phone Number Consistency
  if (!profile.phone) {
    items.push({
      field: 'Phone',
      gbpValue: 'Not configured',
      websiteValue: website?.detectedPhone || 'Not detected',
      status: 'NOT AVAILABLE',
      confidence: 0.9,
      evidence: 'No phone number listed on Google Business Profile.',
    });
  } else if (!website || !website.detectedPhone) {
    items.push({
      field: 'Phone',
      gbpValue: profile.phone,
      websiteValue: 'Not detected on crawled page',
      status: website ? 'NOT FOUND' : 'NOT AVAILABLE',
      confidence: 0.8,
      evidence: website
        ? `Scanned page text did not contain matching telephone microdata or tel: links.`
        : 'Website not crawled.',
    });
  } else {
    const gbpPhoneDigits = normalizePhone(profile.phone);
    const webPhoneDigits = normalizePhone(website.detectedPhone);

    let status: ConsistencyStatus = 'MISMATCH';
    let confidence = 0.95;

    if (gbpPhoneDigits === webPhoneDigits) {
      status = 'MATCH';
    } else if (
      gbpPhoneDigits.endsWith(webPhoneDigits) ||
      webPhoneDigits.endsWith(gbpPhoneDigits)
    ) {
      status = 'PARTIAL MATCH';
      confidence = 0.88;
    }

    items.push({
      field: 'Phone',
      gbpValue: profile.phone,
      websiteValue: website.detectedPhone,
      status,
      confidence,
      evidence: `Normalized digits comparison: GBP (${gbpPhoneDigits}) vs Website (${webPhoneDigits}).`,
    });
  }

  // 3. Address / Location Consistency
  const gbpAddress = profile.address || `${profile.street || ''}, ${profile.city || ''}`.trim();
  if (!gbpAddress) {
    items.push({
      field: 'Address',
      gbpValue: 'Not configured',
      websiteValue: website?.detectedAddress || 'Not detected',
      status: 'NOT AVAILABLE',
      confidence: 0.85,
      evidence: 'GBP address is hidden or service-area based.',
    });
  } else if (!website || !website.detectedAddress) {
    items.push({
      field: 'Address',
      gbpValue: gbpAddress,
      websiteValue: 'Not detected in schema or body',
      status: website ? 'NOT FOUND' : 'NOT AVAILABLE',
      confidence: 0.75,
      evidence: website
        ? 'Website does not expose PostalAddress structured data or clear physical address on the audited page.'
        : 'Website not crawled.',
    });
  } else {
    const gbpNorm = normalizeText(gbpAddress);
    const webNorm = normalizeText(website.detectedAddress);

    let status: ConsistencyStatus = 'MISMATCH';
    let confidence = 0.85;

    if (gbpNorm === webNorm) {
      status = 'MATCH';
    } else if (
      (profile.city && webNorm.includes(profile.city.toLowerCase())) ||
      (profile.street && webNorm.includes(profile.street.toLowerCase()))
    ) {
      status = 'PARTIAL MATCH';
    }

    items.push({
      field: 'Address',
      gbpValue: gbpAddress,
      websiteValue: website.detectedAddress,
      status,
      confidence,
      evidence: `Address comparison evaluated against physical location cues and city strings.`,
    });
  }

  // 4. Operating Hours Consistency
  if (!profile.openingHours) {
    items.push({
      field: 'Hours',
      gbpValue: 'Not listed',
      websiteValue: website?.detectedHours || 'Not listed',
      status: 'NOT AVAILABLE',
      confidence: 0.9,
      evidence: 'No opening hours configured in GBP.',
    });
  } else if (!website || !website.detectedHours) {
    items.push({
      field: 'Hours',
      gbpValue: profile.openingHours,
      websiteValue: 'Not detected',
      status: website ? 'NOT FOUND' : 'NOT AVAILABLE',
      confidence: 0.7,
      evidence: 'No openingHoursSpecification or opening hours text detected on website.',
    });
  } else {
    // Compare hours strings
    const gbpNorm = normalizeText(profile.openingHours);
    const webNorm = normalizeText(website.detectedHours);

    let status: ConsistencyStatus = 'MISMATCH';
    if (gbpNorm === webNorm) {
      status = 'MATCH';
    } else if (
      (gbpNorm.includes('08:00') && webNorm.includes('09:00')) ||
      (gbpNorm.includes('18:00') && webNorm.includes('17:00'))
    ) {
      status = 'MISMATCH';
    } else {
      status = 'PARTIAL MATCH';
    }

    items.push({
      field: 'Hours',
      gbpValue: profile.openingHours,
      websiteValue: website.detectedHours,
      status,
      confidence: 0.9,
      evidence: `GBP lists: "${profile.openingHours}". Website lists: "${website.detectedHours}".`,
    });
  }

  // 5. Services Consistency
  const gbpServices = profile.services || [];
  if (gbpServices.length === 0) {
    items.push({
      field: 'Services',
      gbpValue: 'No services listed',
      websiteValue: `${website?.serviceKeywordsFound?.length || 0} service terms found`,
      status: 'NOT AVAILABLE',
      confidence: 0.8,
      evidence: 'Google Business Profile does not currently have custom services configured.',
    });
  } else if (!website || !website.serviceKeywordsFound) {
    items.push({
      field: 'Services',
      gbpValue: `${gbpServices.length} services configured`,
      websiteValue: 'Not analyzed',
      status: 'NOT AVAILABLE',
      confidence: 0.7,
      evidence: 'Website service catalog not yet scanned.',
    });
  } else {
    const webServiceTerms = new Set(website.serviceKeywordsFound.map((k) => k.toLowerCase()));
    let matchingCount = 0;
    for (const service of gbpServices) {
      const lower = service.toLowerCase();
      if (Array.from(webServiceTerms).some((term) => lower.includes(term))) {
        matchingCount++;
      }
    }

    let status: ConsistencyStatus = 'MISMATCH';
    const ratio = matchingCount / gbpServices.length;
    if (ratio >= 0.75) {
      status = 'MATCH';
    } else if (ratio > 0.25) {
      status = 'PARTIAL MATCH';
    }

    items.push({
      field: 'Services',
      gbpValue: `${gbpServices.length} services in GBP`,
      websiteValue: `${matchingCount} matched keywords on website`,
      status,
      confidence: 0.85,
      evidence: `${matchingCount} of ${gbpServices.length} GBP services correspond to keyword topics identified on the website.`,
    });
  }

  return items;
}
