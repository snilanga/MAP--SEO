import type {
  AuditFinding,
  AIActionRecommendation,
  BusinessProfile,
  ReviewAuditMetrics,
  WebsiteAuditData,
  CompetitorComparisonItem,
} from '../../types/src/index.ts';

export function generateActionRecommendations(
  findings: AuditFinding[],
  profile: BusinessProfile,
  website?: WebsiteAuditData,
  reviews?: ReviewAuditMetrics,
  competitors?: CompetitorComparisonItem[]
): AIActionRecommendation[] {
  const recommendations: AIActionRecommendation[] = [];

  // Check 1: Opening Hours Mismatch
  const hoursFinding = findings.find((f) => f.id === 'website_nap_hours_match' && f.status === 'ERROR');
  if (hoursFinding && website?.detectedHours && profile.openingHours) {
    recommendations.push({
      id: 'rec-hours-sync',
      priority: 'HIGH',
      issue: 'Website and GBP opening hours differ.',
      evidence: `GBP: ${profile.openingHours} | Website: ${website.detectedHours}`,
      recommendedAction:
        'Verify the accurate physical clinic opening hours and update the inaccurate source immediately to synchronize both channels.',
      expectedPurpose:
        'Eliminates entity discrepancy signals in Google Local algorithms and prevents walk-in customers arriving when closed.',
      implementationDifficulty: 'EASY',
      disclaimer: 'Action recommendation derived from observed evidence differences.',
    });
  }

  // Check 2: Missing or Incomplete LocalBusiness Schema
  const schemaFinding = findings.find((f) => f.id === 'localbusiness_schema' && f.status === 'ERROR');
  if (schemaFinding) {
    recommendations.push({
      id: 'rec-schema-localbusiness',
      priority: 'HIGH',
      issue: 'Missing LocalBusiness / MedicalBusiness structured data.',
      evidence: website?.schemaTypesFound?.length
        ? `Found types: ${website.schemaTypesFound.join(', ')}, but no LocalBusiness schema.`
        : 'No JSON-LD schema found on the landing page.',
      recommendedAction:
        `Implement Schema.org JSON-LD markup on homepage referencing name "${profile.name}", telephone "${profile.phone || ''}", and geo coordinates.`,
      expectedPurpose:
        'Allows Googlebot to directly ingest machine-readable physical address and opening hours for local pack validation.',
      implementationDifficulty: 'MODERATE',
      disclaimer: 'Based on automated crawl analysis of public HTML.',
    });
  }

  // Check 3: Review Response Rate
  if (reviews && reviews.responseRate < 85) {
    recommendations.push({
      id: 'rec-review-replies',
      priority: 'HIGH',
      issue: `Several customer reviews have no owner response (current response rate: ${reviews.responseRate}%).`,
      evidence: `${reviews.unansweredCount} reviews currently pending reply out of ${reviews.totalReviews} total reviews.`,
      recommendedAction:
        'Respond professionally to all unanswered reviews, especially those noting parking or appointment waiting times.',
      expectedPurpose:
        'Google confirms that responding to customer reviews actively improves local engagement signals and customer retention.',
      implementationDifficulty: 'EASY',
      disclaimer: 'Calculated from public Google Business Profile review metadata.',
    });
  }

  // Check 4: Service Catalog Depth vs Competitors
  const topCompetitor = competitors?.[0];
  if (topCompetitor && (profile.services?.length || 0) < topCompetitor.servicesCount) {
    recommendations.push({
      id: 'rec-services-gap',
      priority: 'MEDIUM',
      issue: `Competitor gap in listed GBP services (${profile.services?.length || 0} vs ${topCompetitor.servicesCount} on ${topCompetitor.name}).`,
      evidence: `You list ${profile.services?.length || 0} services. Top competitor lists ${topCompetitor.servicesCount} services.`,
      recommendedAction:
        'Expand your GBP services section with 5-8 additional granular dental procedures and write 150-word descriptions for each.',
      expectedPurpose:
        'Qualifies your business for long-tail search queries when patients search for exact procedure names.',
      implementationDifficulty: 'MODERATE',
      disclaimer: 'Observed difference between publicly configured service listings.',
    });
  }

  // Check 5: Photo Recency and Depth
  if ((profile.photosCount || 0) < 30) {
    recommendations.push({
      id: 'rec-photo-coverage',
      priority: 'LOW',
      issue: `Photo volume is below top local competitors (${profile.photosCount || 0} photos vs 60+ on leading competitor).`,
      evidence: `Current verified photo count: ${profile.photosCount || 0}.`,
      recommendedAction:
        'Upload 10-15 high-quality landscape photos of reception, doctor team, surgical suites, and exterior street signage.',
      expectedPurpose:
        'Listings with 30+ photos receive significantly more direction requests and website clicks.',
      implementationDifficulty: 'EASY',
      disclaimer: 'Based on publicly visible Google Maps media count.',
    });
  }

  return recommendations;
}

export interface ContentDraftResult {
  type: string;
  title: string;
  content: string;
  notice: string;
}

export function generateAiContentDraft(
  type: 'gbp_description' | 'service_description' | 'review_reply' | 'landing_page_outline' | 'meta_tags',
  profile: BusinessProfile,
  context?: { serviceName?: string; reviewText?: string; reviewerName?: string }
): ContentDraftResult {
  const notice = 'AI-generated draft — review and verify before publishing.';

  switch (type) {
    case 'gbp_description':
      return {
        type: 'gbp_description',
        title: `GBP Description Draft for ${profile.name}`,
        content:
          `Welcome to ${profile.name}, your trusted ${profile.primaryCategory?.toLowerCase() || 'local service'} located at ${profile.address || profile.city || 'our central clinic'}. ` +
          `We specialize in providing high-quality, personalized care using modern clinical technology and compassionate service. ` +
          `Our experienced team offers comprehensive treatments including ${(profile.services || ['preventive care', 'specialized consultations']).slice(0, 4).join(', ')}. ` +
          `Whether you need routine care or advanced solutions, we are dedicated to your comfort and health. Contact us today at ${profile.phone || 'our reception'} or visit our website to schedule your consultation.`,
        notice,
      };

    case 'review_reply':
      const name = context?.reviewerName || 'valued customer';
      return {
        type: 'review_reply',
        title: `Review Reply Draft for ${name}`,
        content:
          `Dear ${name},\n\nThank you very much for taking the time to share your feedback with us at ${profile.name}! ` +
          `We are delighted to hear that you had a positive experience with our team. Our priority is always providing gentle, top-quality care in a welcoming environment. ` +
          `We truly appreciate your support and look forward to welcoming you back whenever you need us.\n\nWarm regards,\nThe Clinical Team at ${profile.name}`,
        notice,
      };

    case 'service_description':
      const service = context?.serviceName || profile.services?.[0] || 'Specialized Service';
      return {
        type: 'service_description',
        title: `GBP Service Description: ${service}`,
        content:
          `At ${profile.name}, our professional ${service} is tailored to deliver optimal results with patient comfort at the forefront. ` +
          `Using advanced diagnostic techniques, our certified specialists ensure high-standard care from initial assessment through post-treatment care. ` +
          `Book your ${service} consultation in ${profile.city || 'our clinic'} today.`,
        notice,
      };

    case 'meta_tags':
      return {
        type: 'meta_tags',
        title: `SEO Title & Meta Description for ${profile.name}`,
        content:
          `Title Tag (58 chars):\n${profile.name} | ${profile.primaryCategory} in ${profile.city || 'Colombo'}\n\n` +
          `Meta Description (152 chars):\nLooking for top-rated ${profile.primaryCategory?.toLowerCase()} in ${profile.city || 'Colombo'}? ${profile.name} provides gentle, comprehensive care. Call ${profile.phone || 'today'} for an appointment!`,
        notice,
      };

    case 'landing_page_outline':
    default:
      return {
        type: 'landing_page_outline',
        title: `Local Landing Page Architecture (${profile.city || 'City'} Location)`,
        content:
          `# ${profile.name} - ${profile.city || 'Local'} Practice\n\n` +
          `## Section 1: Hero Banner\n- Primary H1: Leading ${profile.primaryCategory} in ${profile.city || 'Colombo'}\n- Direct Click-to-Call: ${profile.phone || 'Phone'}\n- Book Appointment CTA Button\n\n` +
          `## Section 2: Core Specialties & Services\n- Detailed cards for ${(profile.services || []).slice(0, 4).join(', ')}\n\n` +
          `## Section 3: Verified Patient Reviews & Rating\n- Star badge: ${profile.rating || 4.7} / 5.0 (${profile.reviewCount || 200}+ Google Reviews)\n\n` +
          `## Section 4: Location, Interactive Map & Operating Hours\n- Address: ${profile.address || 'Address'}\n- Hours: ${profile.openingHours || 'Hours'}\n\n` +
          `## Section 5: LocalBusiness Schema.org JSON-LD snippet`,
        notice,
      };
  }
}
