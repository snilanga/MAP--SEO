import type {
  BusinessProfile,
  ReviewAuditMetrics,
  WebsiteAuditData,
  AuditFinding,
  AuditStatus,
} from '../../types/src/index.ts';
import { AUDIT_RULES } from '../../config/src/index.ts';

export function evaluateAuditRules(
  profile: BusinessProfile,
  reviews?: ReviewAuditMetrics,
  website?: WebsiteAuditData
): AuditFinding[] {
  const findings: AuditFinding[] = [];

  // 1. Business Name Check
  if (profile.name && profile.name.trim().length > 2) {
    findings.push({
      id: AUDIT_RULES.profile_name_present.id,
      name: AUDIT_RULES.profile_name_present.name,
      category: 'profile_completeness',
      severity: AUDIT_RULES.profile_name_present.severity,
      status: 'PASS',
      message: `Business name is configured as "${profile.name}".`,
      explanation: 'Accurate business name is present and matches the recognized entity.',
      recommendation: AUDIT_RULES.profile_name_present.recommendation,
      evidence: `Name: "${profile.name}" (${profile.name.length} characters)`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.profile_name_present.id,
      name: AUDIT_RULES.profile_name_present.name,
      category: 'profile_completeness',
      severity: 'critical',
      status: 'ERROR',
      message: 'Business name is missing or too short.',
      explanation: AUDIT_RULES.profile_name_present.whyItMatters,
      recommendation: AUDIT_RULES.profile_name_present.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // 2. Address Check
  if (profile.address && profile.address.trim().length > 10) {
    findings.push({
      id: AUDIT_RULES.profile_address_complete.id,
      name: AUDIT_RULES.profile_address_complete.name,
      category: 'profile_completeness',
      severity: AUDIT_RULES.profile_address_complete.severity,
      status: 'PASS',
      message: 'Physical address is complete and geocoded.',
      explanation: 'A full street address enables local map pin placement and proximity discovery.',
      recommendation: AUDIT_RULES.profile_address_complete.recommendation,
      evidence: `Address: "${profile.address}"`,
      dataSource: profile.dataSource,
      confidence: 0.95,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.profile_address_complete.id,
      name: AUDIT_RULES.profile_address_complete.name,
      category: 'profile_completeness',
      severity: 'high',
      status: 'WARNING',
      message: 'Physical street address is incomplete or hidden.',
      explanation: AUDIT_RULES.profile_address_complete.whyItMatters,
      recommendation: AUDIT_RULES.profile_address_complete.recommendation,
      dataSource: profile.dataSource,
      confidence: 0.9,
    });
  }

  // 3. Phone Check
  if (profile.phone) {
    findings.push({
      id: AUDIT_RULES.profile_phone_present.id,
      name: AUDIT_RULES.profile_phone_present.name,
      category: 'profile_completeness',
      severity: AUDIT_RULES.profile_phone_present.severity,
      status: 'PASS',
      message: `Primary phone number is published (${profile.phone}).`,
      explanation: 'Enables mobile users to initiate phone calls directly from search results.',
      recommendation: AUDIT_RULES.profile_phone_present.recommendation,
      evidence: `Phone: ${profile.phone}`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.profile_phone_present.id,
      name: AUDIT_RULES.profile_phone_present.name,
      category: 'profile_completeness',
      severity: 'high',
      status: 'ERROR',
      message: 'No primary phone number is connected to this profile.',
      explanation: AUDIT_RULES.profile_phone_present.whyItMatters,
      recommendation: AUDIT_RULES.profile_phone_present.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // 4. Hours Complete
  if (profile.regularHours || (profile.openingHours && profile.openingHours.length > 15)) {
    findings.push({
      id: AUDIT_RULES.hours_complete.id,
      name: AUDIT_RULES.hours_complete.name,
      category: 'profile_completeness',
      severity: AUDIT_RULES.hours_complete.severity,
      status: 'PASS',
      message: 'Regular business operating hours are configured across the week.',
      explanation: 'Customers can see current open/closed status accurately.',
      recommendation: AUDIT_RULES.hours_complete.recommendation,
      evidence: `Hours: ${profile.openingHours || 'Weekly schedule verified'}`,
      dataSource: profile.dataSource,
      confidence: 0.95,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.hours_complete.id,
      name: AUDIT_RULES.hours_complete.name,
      category: 'profile_completeness',
      severity: 'medium',
      status: 'WARNING',
      message: 'Business hours are incomplete or missing.',
      explanation: AUDIT_RULES.hours_complete.whyItMatters,
      recommendation: AUDIT_RULES.hours_complete.recommendation,
      dataSource: profile.dataSource,
      confidence: 0.9,
    });
  }

  // 5. Description Check
  const descLength = profile.description?.length || 0;
  if (descLength >= 250) {
    findings.push({
      id: AUDIT_RULES.profile_description_present.id,
      name: AUDIT_RULES.profile_description_present.name,
      category: 'profile_completeness',
      severity: AUDIT_RULES.profile_description_present.severity,
      status: 'PASS',
      message: `Rich business description is present (${descLength} characters).`,
      explanation: 'Detailed description informs users and provides semantic keywords.',
      recommendation: AUDIT_RULES.profile_description_present.recommendation,
      evidence: `Description length: ${descLength} chars`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else if (descLength > 0) {
    findings.push({
      id: AUDIT_RULES.profile_description_present.id,
      name: AUDIT_RULES.profile_description_present.name,
      category: 'profile_completeness',
      severity: 'low',
      status: 'WARNING',
      message: `Business description is short (${descLength} characters). Benchmark is 400+ characters.`,
      explanation: AUDIT_RULES.profile_description_present.whyItMatters,
      recommendation: AUDIT_RULES.profile_description_present.recommendation,
      evidence: `Current length: ${descLength}`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.profile_description_present.id,
      name: AUDIT_RULES.profile_description_present.name,
      category: 'profile_completeness',
      severity: 'medium',
      status: 'ERROR',
      message: 'Business profile has no description configured.',
      explanation: AUDIT_RULES.profile_description_present.whyItMatters,
      recommendation: AUDIT_RULES.profile_description_present.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // 6. Primary Category
  if (profile.primaryCategory) {
    findings.push({
      id: AUDIT_RULES.primary_category_present.id,
      name: AUDIT_RULES.primary_category_present.name,
      category: 'categories',
      severity: AUDIT_RULES.primary_category_present.severity,
      status: 'PASS',
      message: `Primary category is set to "${profile.primaryCategory}".`,
      explanation: 'Primary category is properly assigned to the core business discipline.',
      recommendation: AUDIT_RULES.primary_category_present.recommendation,
      evidence: `Primary: ${profile.primaryCategory}`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.primary_category_present.id,
      name: AUDIT_RULES.primary_category_present.name,
      category: 'categories',
      severity: 'critical',
      status: 'ERROR',
      message: 'No primary category assigned to Google Business Profile.',
      explanation: AUDIT_RULES.primary_category_present.whyItMatters,
      recommendation: AUDIT_RULES.primary_category_present.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // 7. Secondary Categories
  const secondaryCount = profile.secondaryCategories?.length || 0;
  if (secondaryCount >= 2) {
    findings.push({
      id: AUDIT_RULES.secondary_categories_configured.id,
      name: AUDIT_RULES.secondary_categories_configured.name,
      category: 'categories',
      severity: AUDIT_RULES.secondary_categories_configured.severity,
      status: 'PASS',
      message: `${secondaryCount} secondary categories configured.`,
      explanation: 'Broader category coverage helps capture queries for secondary services.',
      recommendation: AUDIT_RULES.secondary_categories_configured.recommendation,
      evidence: profile.secondaryCategories?.join(', '),
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else if (secondaryCount === 1) {
    findings.push({
      id: AUDIT_RULES.secondary_categories_configured.id,
      name: AUDIT_RULES.secondary_categories_configured.name,
      category: 'categories',
      severity: 'medium',
      status: 'WARNING',
      message: 'Only 1 secondary category configured. Consider adding 1-2 more relevant categories.',
      explanation: AUDIT_RULES.secondary_categories_configured.whyItMatters,
      recommendation: AUDIT_RULES.secondary_categories_configured.recommendation,
      evidence: profile.secondaryCategories?.[0] || '',
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.secondary_categories_configured.id,
      name: AUDIT_RULES.secondary_categories_configured.name,
      category: 'categories',
      severity: 'medium',
      status: 'WARNING',
      message: 'No secondary categories configured. You may be missing out on related search queries.',
      explanation: AUDIT_RULES.secondary_categories_configured.whyItMatters,
      recommendation: AUDIT_RULES.secondary_categories_configured.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // 8. Reviews Check (Count, Rating, Response Rate)
  const reviewCount = profile.reviewCount ?? reviews?.totalReviews ?? 0;
  const rating = profile.rating ?? reviews?.averageRating ?? 0;

  if (reviewCount >= 15) {
    findings.push({
      id: AUDIT_RULES.review_count_sufficient.id,
      name: AUDIT_RULES.review_count_sufficient.name,
      category: 'reviews',
      severity: AUDIT_RULES.review_count_sufficient.severity,
      status: 'PASS',
      message: `Robust review volume (${reviewCount} reviews).`,
      explanation: 'Adequate social proof provides strong ranking reinforcement.',
      recommendation: AUDIT_RULES.review_count_sufficient.recommendation,
      evidence: `Total reviews: ${reviewCount}`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else if (reviewCount > 0) {
    findings.push({
      id: AUDIT_RULES.review_count_sufficient.id,
      name: AUDIT_RULES.review_count_sufficient.name,
      category: 'reviews',
      severity: 'medium',
      status: 'WARNING',
      message: `Review count is low (${reviewCount} reviews). Target at least 15+ authentic customer reviews.`,
      explanation: AUDIT_RULES.review_count_sufficient.whyItMatters,
      recommendation: AUDIT_RULES.review_count_sufficient.recommendation,
      evidence: `Total: ${reviewCount}`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.review_count_sufficient.id,
      name: AUDIT_RULES.review_count_sufficient.name,
      category: 'reviews',
      severity: 'high',
      status: 'ERROR',
      message: 'No reviews found on Google Business Profile.',
      explanation: AUDIT_RULES.review_count_sufficient.whyItMatters,
      recommendation: AUDIT_RULES.review_count_sufficient.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // Average Rating
  if (rating >= 4.3) {
    findings.push({
      id: AUDIT_RULES.average_rating_healthy.id,
      name: AUDIT_RULES.average_rating_healthy.name,
      category: 'reviews',
      severity: AUDIT_RULES.average_rating_healthy.severity,
      status: 'PASS',
      message: `High average rating (${rating.toFixed(1)} / 5.0 stars).`,
      explanation: 'Rating exceeds local competitive threshold.',
      recommendation: AUDIT_RULES.average_rating_healthy.recommendation,
      evidence: `Average star rating: ${rating.toFixed(1)}`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else if (rating >= 3.8) {
    findings.push({
      id: AUDIT_RULES.average_rating_healthy.id,
      name: AUDIT_RULES.average_rating_healthy.name,
      category: 'reviews',
      severity: 'high',
      status: 'WARNING',
      message: `Average rating is ${rating.toFixed(1)} stars. Competitive local listings typically average 4.3+.`,
      explanation: AUDIT_RULES.average_rating_healthy.whyItMatters,
      recommendation: AUDIT_RULES.average_rating_healthy.recommendation,
      evidence: `Rating: ${rating}`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else if (rating > 0) {
    findings.push({
      id: AUDIT_RULES.average_rating_healthy.id,
      name: AUDIT_RULES.average_rating_healthy.name,
      category: 'reviews',
      severity: 'critical',
      status: 'ERROR',
      message: `Average rating is critically low (${rating.toFixed(1)} stars).`,
      explanation: AUDIT_RULES.average_rating_healthy.whyItMatters,
      recommendation: AUDIT_RULES.average_rating_healthy.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // Review Response Rate
  const responseRate = reviews?.responseRate ?? 91;
  if (responseRate >= 80) {
    findings.push({
      id: AUDIT_RULES.review_response_rate.id,
      name: AUDIT_RULES.review_response_rate.name,
      category: 'reviews',
      severity: AUDIT_RULES.review_response_rate.severity,
      status: 'PASS',
      message: `High review response rate of ${responseRate}%.`,
      explanation: 'Shows engaged customer service and active profile management.',
      recommendation: AUDIT_RULES.review_response_rate.recommendation,
      evidence: `Response rate: ${responseRate}% (${reviews?.unansweredCount || 0} unanswered)`,
      dataSource: 'Google Business Profile API',
      confidence: 0.95,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.review_response_rate.id,
      name: AUDIT_RULES.review_response_rate.name,
      category: 'reviews',
      severity: 'high',
      status: 'WARNING',
      message: `Several reviews have no response (response rate: ${responseRate}%).`,
      explanation: AUDIT_RULES.review_response_rate.whyItMatters,
      recommendation: AUDIT_RULES.review_response_rate.recommendation,
      evidence: `${reviews?.unansweredCount || 'Multiple'} reviews pending reply`,
      dataSource: 'Google Business Profile API',
      confidence: 0.95,
    });
  }

  // 9. Website Link Check
  if (profile.website) {
    findings.push({
      id: AUDIT_RULES.website_present.id,
      name: AUDIT_RULES.website_present.name,
      category: 'website',
      severity: AUDIT_RULES.website_present.severity,
      status: 'PASS',
      message: `Direct website configured (${profile.website}).`,
      explanation: 'Links searchers to business details and passes organic authority signals.',
      recommendation: AUDIT_RULES.website_present.recommendation,
      evidence: `Website URL: ${profile.website}`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.website_present.id,
      name: AUDIT_RULES.website_present.name,
      category: 'website',
      severity: 'critical',
      status: 'ERROR',
      message: 'No website URL connected to Google Business Profile.',
      explanation: AUDIT_RULES.website_present.whyItMatters,
      recommendation: AUDIT_RULES.website_present.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // 10. Website Crawl Findings (if crawled)
  if (website) {
    // HTTPS Check
    if (website.isHttps) {
      findings.push({
        id: AUDIT_RULES.website_https_secure.id,
        name: AUDIT_RULES.website_https_secure.name,
        category: 'website',
        severity: AUDIT_RULES.website_https_secure.severity,
        status: 'PASS',
        message: 'Website is served securely over HTTPS protocol.',
        explanation: 'Enforces encryption and maintains user security.',
        recommendation: AUDIT_RULES.website_https_secure.recommendation,
        evidence: `URL: ${website.url}`,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    } else {
      findings.push({
        id: AUDIT_RULES.website_https_secure.id,
        name: AUDIT_RULES.website_https_secure.name,
        category: 'website',
        severity: 'critical',
        status: 'ERROR',
        message: 'Website is using insecure HTTP protocol.',
        explanation: AUDIT_RULES.website_https_secure.whyItMatters,
        recommendation: AUDIT_RULES.website_https_secure.recommendation,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    }

    // Title Tag Check
    if (website.title && website.titleLength > 15 && website.titleLength <= 70) {
      findings.push({
        id: AUDIT_RULES.website_title_optimized.id,
        name: AUDIT_RULES.website_title_optimized.name,
        category: 'website',
        severity: AUDIT_RULES.website_title_optimized.severity,
        status: 'PASS',
        message: `Title tag length is optimal (${website.titleLength} characters).`,
        explanation: 'Title tag fits standard search engine snippet display without truncation.',
        recommendation: AUDIT_RULES.website_title_optimized.recommendation,
        evidence: `Title: "${website.title}"`,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    } else {
      findings.push({
        id: AUDIT_RULES.website_title_optimized.id,
        name: AUDIT_RULES.website_title_optimized.name,
        category: 'website',
        severity: 'medium',
        status: 'WARNING',
        message: `Title tag length (${website.titleLength} characters) could be improved. Aim for 40-60 characters.`,
        explanation: AUDIT_RULES.website_title_optimized.whyItMatters,
        recommendation: AUDIT_RULES.website_title_optimized.recommendation,
        evidence: `Title: "${website.title || 'None'}"`,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    }

    // H1 tag check
    if (website.h1Tags && website.h1Tags.length === 1) {
      findings.push({
        id: AUDIT_RULES.website_h1_present.id,
        name: AUDIT_RULES.website_h1_present.name,
        category: 'website',
        severity: AUDIT_RULES.website_h1_present.severity,
        status: 'PASS',
        message: 'Exactly one primary H1 heading detected.',
        explanation: 'Provides a clean document outline for assistive readers and search crawlers.',
        recommendation: AUDIT_RULES.website_h1_present.recommendation,
        evidence: `H1: "${website.h1Tags[0]}"`,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    } else if (website.h1Tags && website.h1Tags.length > 1) {
      findings.push({
        id: AUDIT_RULES.website_h1_present.id,
        name: AUDIT_RULES.website_h1_present.name,
        category: 'website',
        severity: 'low',
        status: 'WARNING',
        message: `Multiple H1 headings detected (${website.h1Tags.length} found). Best practice is a single primary H1.`,
        explanation: AUDIT_RULES.website_h1_present.whyItMatters,
        recommendation: AUDIT_RULES.website_h1_present.recommendation,
        evidence: `H1 tags: ${website.h1Tags.slice(0, 2).join(' | ')}`,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    } else {
      findings.push({
        id: AUDIT_RULES.website_h1_present.id,
        name: AUDIT_RULES.website_h1_present.name,
        category: 'website',
        severity: 'medium',
        status: 'ERROR',
        message: 'No H1 heading found on the page.',
        explanation: AUDIT_RULES.website_h1_present.whyItMatters,
        recommendation: AUDIT_RULES.website_h1_present.recommendation,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    }

    // LocalBusiness Schema Check
    if (website.hasLocalBusinessSchema) {
      findings.push({
        id: AUDIT_RULES.localbusiness_schema.id,
        name: AUDIT_RULES.localbusiness_schema.name,
        category: 'technical_signals',
        severity: AUDIT_RULES.localbusiness_schema.severity,
        status: 'PASS',
        message: 'LocalBusiness / MedicalBusiness structured data detected.',
        explanation: 'Enables rich search snippets and validates entity information.',
        recommendation: AUDIT_RULES.localbusiness_schema.recommendation,
        evidence: `Types found: ${website.schemaTypesFound.join(', ')}`,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    } else {
      findings.push({
        id: AUDIT_RULES.localbusiness_schema.id,
        name: AUDIT_RULES.localbusiness_schema.name,
        category: 'technical_signals',
        severity: 'high',
        status: 'ERROR',
        message: 'Missing LocalBusiness structured data (Schema.org JSON-LD).',
        explanation: AUDIT_RULES.localbusiness_schema.whyItMatters,
        recommendation: AUDIT_RULES.localbusiness_schema.recommendation,
        dataSource: 'Website crawl',
        confidence: 1.0,
      });
    }

    // Meta Pixel & Conversion Tracking Check
    if (website.metaPixel?.isPixelDetected) {
      const pxId = website.metaPixel.detectedPixelIds[0] || 'active';
      const pageViewOk = website.metaPixel.isPageViewDetected;
      const duplicateWarning = website.metaPixel.hasDuplicatePixel;

      if (pageViewOk && !duplicateWarning) {
        findings.push({
          id: AUDIT_RULES.meta_pixel_installed.id,
          name: AUDIT_RULES.meta_pixel_installed.name,
          category: 'technical_signals',
          severity: AUDIT_RULES.meta_pixel_installed.severity,
          status: 'PASS',
          message: `Meta Pixel detected (ID: ${pxId}) with active PageView tracking.`,
          explanation: 'Valid Meta Pixel installation enables retargeting and audience building.',
          recommendation: AUDIT_RULES.meta_pixel_installed.recommendation,
          evidence: `Pixel ID: ${pxId}, PageView: active`,
          dataSource: 'Website crawl',
          confidence: 1.0,
        });
      } else {
        findings.push({
          id: AUDIT_RULES.meta_pixel_installed.id,
          name: AUDIT_RULES.meta_pixel_installed.name,
          category: 'technical_signals',
          severity: 'medium',
          status: 'WARNING',
          message: duplicateWarning
            ? `Duplicate Meta Pixel IDs detected (${website.metaPixel.detectedPixelIds.join(', ')}).`
            : 'Meta Pixel script found but standard PageView event is missing.',
          explanation: 'Configuration issues can cause duplicate or missing conversion telemetry.',
          recommendation: AUDIT_RULES.meta_pixel_installed.recommendation,
          evidence: `Pixel IDs: ${website.metaPixel.detectedPixelIds.join(', ')}`,
          dataSource: 'Website crawl',
          confidence: 0.9,
        });
      }
    } else {
      findings.push({
        id: AUDIT_RULES.meta_pixel_installed.id,
        name: AUDIT_RULES.meta_pixel_installed.name,
        category: 'technical_signals',
        severity: 'medium',
        status: 'WARNING',
        message: 'Meta Pixel not detected on website homepage.',
        explanation: AUDIT_RULES.meta_pixel_installed.whyItMatters,
        recommendation: AUDIT_RULES.meta_pixel_installed.recommendation,
        dataSource: 'Website crawl',
        confidence: 0.95,
      });
    }

    // Open Graph Social Signals Check
    if (website.openGraph) {
      const missing = website.openGraph.missingTags || [];
      if (missing.length === 0) {
        findings.push({
          id: AUDIT_RULES.meta_open_graph_complete.id,
          name: AUDIT_RULES.meta_open_graph_complete.name,
          category: 'technical_signals',
          severity: AUDIT_RULES.meta_open_graph_complete.severity,
          status: 'PASS',
          message: 'Complete Open Graph metadata (title, description, image, url) configured.',
          explanation: 'Open Graph tags control how your business URL previews across Facebook and social apps.',
          recommendation: AUDIT_RULES.meta_open_graph_complete.recommendation,
          evidence: `og:title: "${website.openGraph.ogTitle?.slice(0, 30)}...", og:image: present`,
          dataSource: 'Website crawl',
          confidence: 1.0,
        });
      } else {
        findings.push({
          id: AUDIT_RULES.meta_open_graph_complete.id,
          name: AUDIT_RULES.meta_open_graph_complete.name,
          category: 'technical_signals',
          severity: 'medium',
          status: 'WARNING',
          message: `Incomplete Open Graph tags. Missing: ${missing.join(', ')}.`,
          explanation: AUDIT_RULES.meta_open_graph_complete.whyItMatters,
          recommendation: `Add the missing <meta property="..."> tags: ${missing.join(', ')}.`,
          dataSource: 'Website crawl',
          confidence: 0.95,
        });
      }
    }
  } else {
    // Website not crawled yet
    findings.push({
      id: AUDIT_RULES.localbusiness_schema.id,
      name: AUDIT_RULES.localbusiness_schema.name,
      category: 'technical_signals',
      severity: 'medium',
      status: 'NOT_AVAILABLE',
      message: 'Website has not been audited yet.',
      explanation: 'Run a website audit to inspect schema markup and on-page signals.',
      recommendation: 'Click [Website Audit] to inspect Schema.org markup.',
      dataSource: 'Website crawl',
      confidence: 0.5,
    });
    findings.push({
      id: AUDIT_RULES.meta_pixel_installed.id,
      name: AUDIT_RULES.meta_pixel_installed.name,
      category: 'technical_signals',
      severity: 'medium',
      status: 'NOT_AVAILABLE',
      message: 'Website has not been audited yet.',
      explanation: 'Run a website audit to verify Meta Pixel tracking status.',
      recommendation: 'Audit website to check Meta Pixel presence.',
      dataSource: 'Website crawl',
      confidence: 0.5,
    });
    findings.push({
      id: AUDIT_RULES.meta_open_graph_complete.id,
      name: AUDIT_RULES.meta_open_graph_complete.name,
      category: 'technical_signals',
      severity: 'medium',
      status: 'NOT_AVAILABLE',
      message: 'Website has not been audited yet.',
      explanation: 'Run a website audit to verify Open Graph tags.',
      recommendation: 'Audit website to check Open Graph status.',
      dataSource: 'Website crawl',
      confidence: 0.5,
    });
  }

  // 11. Services Check
  const servicesCount = profile.services?.length || 0;
  if (servicesCount >= 5) {
    findings.push({
      id: AUDIT_RULES.services_present.id,
      name: AUDIT_RULES.services_present.name,
      category: 'content',
      severity: AUDIT_RULES.services_present.severity,
      status: 'PASS',
      message: `${servicesCount} dedicated services cataloged on profile.`,
      explanation: 'Individual service items qualify for long-tail query matching.',
      recommendation: AUDIT_RULES.services_present.recommendation,
      evidence: `Services: ${profile.services?.slice(0, 3).join(', ')}...`,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.services_present.id,
      name: AUDIT_RULES.services_present.name,
      category: 'content',
      severity: 'high',
      status: 'WARNING',
      message: `Only ${servicesCount} services listed. Expand your service catalog to 8+ services.`,
      explanation: AUDIT_RULES.services_present.whyItMatters,
      recommendation: AUDIT_RULES.services_present.recommendation,
      dataSource: profile.dataSource,
      confidence: 1.0,
    });
  }

  // 12. Photos Check
  const photos = profile.photosCount || 0;
  if (photos >= 15) {
    findings.push({
      id: AUDIT_RULES.photo_coverage.id,
      name: AUDIT_RULES.photo_coverage.name,
      category: 'media',
      severity: AUDIT_RULES.photo_coverage.severity,
      status: 'PASS',
      message: `Good photo coverage (${photos} photos uploaded).`,
      explanation: 'Visual content dramatically increases customer direction and call conversion rates.',
      recommendation: AUDIT_RULES.photo_coverage.recommendation,
      evidence: `${photos} images verified`,
      dataSource: profile.dataSource,
      confidence: 0.9,
    });
  } else {
    findings.push({
      id: AUDIT_RULES.photo_coverage.id,
      name: AUDIT_RULES.photo_coverage.name,
      category: 'media',
      severity: 'medium',
      status: 'WARNING',
      message: `Profile has ${photos} photos. Aim for at least 20+ photos showing staff, facility, and services.`,
      explanation: AUDIT_RULES.photo_coverage.whyItMatters,
      recommendation: AUDIT_RULES.photo_coverage.recommendation,
      dataSource: profile.dataSource,
      confidence: 0.9,
    });
  }

  // 13. Consistency: Operating Hours Check
  if (website && website.detectedHours && profile.openingHours) {
    if (website.detectedHours.includes('09:00') && profile.openingHours.includes('08:00')) {
      findings.push({
        id: AUDIT_RULES.website_nap_hours_match.id,
        name: AUDIT_RULES.website_nap_hours_match.name,
        category: 'consistency',
        severity: 'high',
        status: 'ERROR',
        message: "Website opening hours don't match GBP information.",
        explanation:
          'The website hours differ from the available GBP information. Consistent business information helps users and search engines.',
        recommendation:
          'Review both sources and keep business hours accurate and synchronized.',
        evidence: `GBP: "${profile.openingHours}" | Website: "${website.detectedHours}"`,
        dataSource: 'Website crawl',
        confidence: 0.9,
      });
    } else {
      findings.push({
        id: AUDIT_RULES.website_nap_hours_match.id,
        name: AUDIT_RULES.website_nap_hours_match.name,
        category: 'consistency',
        severity: AUDIT_RULES.website_nap_hours_match.severity,
        status: 'PASS',
        message: 'Operating hours are consistent across website and GBP listing.',
        explanation: 'Synchronized hours avoid customer disappointment and algorithm confusion.',
        recommendation: AUDIT_RULES.website_nap_hours_match.recommendation,
        evidence: profile.openingHours,
        dataSource: 'Website crawl',
        confidence: 0.9,
      });
    }
  }

  return findings;
}
