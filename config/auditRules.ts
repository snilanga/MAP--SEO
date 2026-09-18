/**
 * LocalRank Audit - Configurable Audit Rules & Weights
 * All audit scoring, severity, categories, and recommendations are driven from this configuration.
 */

import type { FindingCategory, AuditSeverity } from '../packages/types/src/index.ts';

export interface AuditRuleDefinition {
  id: string;
  name: string;
  category: FindingCategory;
  weight: number; // relative weight within category or global
  severity: AuditSeverity;
  description: string;
  recommendation: string;
  whyItMatters: string;
}

export interface CategoryWeightConfig {
  category: FindingCategory;
  name: string;
  weight: number; // percentage of total score (must sum to 100)
}

export const CATEGORY_WEIGHTS: Record<FindingCategory, CategoryWeightConfig> = {
  profile_completeness: {
    category: 'profile_completeness',
    name: 'Profile Completeness',
    weight: 20,
  },
  website: {
    category: 'website',
    name: 'Website & Technical',
    weight: 20,
  },
  reviews: {
    category: 'reviews',
    name: 'Reviews & Reputation',
    weight: 15,
  },
  categories: {
    category: 'categories',
    name: 'Categories',
    weight: 10,
  },
  content: {
    category: 'content',
    name: 'Content & Services',
    weight: 10,
  },
  media: {
    category: 'media',
    name: 'Photos & Media',
    weight: 10,
  },
  consistency: {
    category: 'consistency',
    name: 'Local SEO Consistency (NAP)',
    weight: 10,
  },
  technical_signals: {
    category: 'technical_signals',
    name: 'Local Signals & Schema',
    weight: 5,
  },
};

export const AUDIT_RULES: Record<string, AuditRuleDefinition> = {
  // Profile Completeness Rules (20%)
  profile_name_present: {
    id: 'profile_name_present',
    name: 'Business Name',
    category: 'profile_completeness',
    weight: 20,
    severity: 'critical',
    description: 'Business name is populated and formatted appropriately.',
    recommendation: 'Ensure your official registered business name matches your real-world signage.',
    whyItMatters: 'The business name is the fundamental identifier for Google Maps and search algorithms.',
  },
  profile_address_complete: {
    id: 'profile_address_complete',
    name: 'Complete Address & Pin',
    category: 'profile_completeness',
    weight: 25,
    severity: 'critical',
    description: 'Physical street address or verified service area is configured.',
    recommendation: 'Provide complete street, city, postal code, and verify map pin location.',
    whyItMatters: 'Local ranking proximity is calculated based on exact address coordinates.',
  },
  profile_phone_present: {
    id: 'profile_phone_present',
    name: 'Primary Phone Number',
    category: 'profile_completeness',
    weight: 20,
    severity: 'high',
    description: 'Direct local or primary business phone number is provided.',
    recommendation: 'Add a direct local phone number to enable instant click-to-call conversions.',
    whyItMatters: 'Phone visibility directly impacts mobile user conversion and verification trust.',
  },
  hours_complete: {
    id: 'hours_complete',
    name: 'Regular Business Hours',
    category: 'profile_completeness',
    weight: 20,
    severity: 'high',
    description: 'Opening and closing hours are set for all operating days.',
    recommendation: 'Review and complete regular weekly hours and maintain holiday special hours.',
    whyItMatters: 'Businesses without accurate hours frustrate customers and receive penalty signals during open/closed filters.',
  },
  profile_description_present: {
    id: 'profile_description_present',
    name: 'Business Description',
    category: 'profile_completeness',
    weight: 15,
    severity: 'medium',
    description: 'Comprehensive business description detailing history, offerings, and value proposition.',
    recommendation: 'Craft a 500-750 character description highlighting your key services, history, and differentiators.',
    whyItMatters: 'Helps customers understand your specialty and reinforces secondary relevance.',
  },

  // Categories Rules (10%)
  primary_category_present: {
    id: 'primary_category_present',
    name: 'Primary Category Selection',
    category: 'categories',
    weight: 60,
    severity: 'critical',
    description: 'Accurate primary Google category defined.',
    recommendation: 'Select the exact primary category representing the core business function.',
    whyItMatters: 'Primary category is the single strongest ranking factor for Google local pack results.',
  },
  secondary_categories_configured: {
    id: 'secondary_categories_configured',
    name: 'Secondary Categories',
    category: 'categories',
    weight: 40,
    severity: 'medium',
    description: 'Relevant secondary categories are configured to cover ancillary offerings.',
    recommendation: 'Add 2 to 5 specific secondary categories without keyword stuffing.',
    whyItMatters: 'Secondary categories allow your business to rank for related service searches.',
  },

  // Reviews Rules (15%)
  review_count_sufficient: {
    id: 'review_count_sufficient',
    name: 'Review Volume',
    category: 'reviews',
    weight: 25,
    severity: 'high',
    description: 'Business has gathered an adequate volume of authentic customer reviews (benchmark: 15+).',
    recommendation: 'Implement an active post-service review request workflow to build review depth.',
    whyItMatters: 'Review velocity and volume heavily influence local search visibility and consumer trust.',
  },
  average_rating_healthy: {
    id: 'average_rating_healthy',
    name: 'Average Star Rating',
    category: 'reviews',
    weight: 30,
    severity: 'critical',
    description: 'Average rating maintains a competitive threshold (benchmark: 4.3+).',
    recommendation: 'Address negative customer feedback promptly to sustain high customer satisfaction.',
    whyItMatters: 'Consumers filter out businesses under 4.0 stars, and Google favors higher rated profiles.',
  },
  review_response_rate: {
    id: 'review_response_rate',
    name: 'Review Response Rate',
    category: 'reviews',
    weight: 25,
    severity: 'high',
    description: 'Owner responses provided to customer reviews (benchmark: 80%+ response rate).',
    recommendation: 'Respond to both positive and negative reviews politely within 24-48 hours.',
    whyItMatters: 'High response rate shows Google and customers that the business is actively managed and engaged.',
  },
  recent_review_velocity: {
    id: 'recent_review_velocity',
    name: 'Recent Review Activity',
    category: 'reviews',
    weight: 20,
    severity: 'medium',
    description: 'Business received new reviews in the past 60-90 days.',
    recommendation: 'Continuously invite satisfied customers to share feedback to maintain review recency.',
    whyItMatters: 'Recent reviews carry greater weight in search algorithms than stale multi-year-old reviews.',
  },

  // Website & Technical Rules (20%)
  website_present: {
    id: 'website_present',
    name: 'Website Link Configured',
    category: 'website',
    weight: 25,
    severity: 'critical',
    description: 'Direct website URL is linked to the GBP profile.',
    recommendation: 'Ensure your website URL is linked directly to your primary location or homepage.',
    whyItMatters: 'Links to your website pass domain authority and organic relevance signals to your GBP listing.',
  },
  website_https_secure: {
    id: 'website_https_secure',
    name: 'HTTPS Security',
    category: 'website',
    weight: 15,
    severity: 'critical',
    description: 'Website serves traffic over secure HTTPS protocol.',
    recommendation: 'Install and enforce an SSL/TLS certificate with automated HTTPS redirection.',
    whyItMatters: 'Browsers warn users away from HTTP sites, hurting engagement and ranking signals.',
  },
  website_mobile_responsive: {
    id: 'website_mobile_responsive',
    name: 'Mobile Viewport Optimization',
    category: 'website',
    weight: 15,
    severity: 'high',
    description: 'Page includes proper mobile viewport configuration.',
    recommendation: 'Ensure standard `<meta name="viewport" content="width=device-width, initial-scale=1">` is present.',
    whyItMatters: 'Over 70% of local searches happen on mobile devices.',
  },
  website_title_optimized: {
    id: 'website_title_optimized',
    name: 'Homepage Title Tag',
    category: 'website',
    weight: 20,
    severity: 'high',
    description: 'Page title contains clear brand and primary local/service terms.',
    recommendation: 'Format title tag with Primary Service | Brand Name | City (under 60 characters).',
    whyItMatters: 'Title tags are a primary on-page signal connecting web content with local intent.',
  },
  website_meta_description: {
    id: 'website_meta_description',
    name: 'Meta Description Presence',
    category: 'website',
    weight: 10,
    severity: 'medium',
    description: 'Engaging meta description under 160 characters.',
    recommendation: 'Add a compelling meta description highlighting your services, location, and call to action.',
    whyItMatters: 'Improves organic click-through rates from search engine result pages.',
  },
  website_h1_present: {
    id: 'website_h1_present',
    name: 'Single Clear H1 Heading',
    category: 'website',
    weight: 15,
    severity: 'medium',
    description: 'Exactly one primary H1 heading on landing page.',
    recommendation: 'Include your core service and city/area in a concise H1 header tag.',
    whyItMatters: 'H1 tags provide immediate semantic context to search engine crawlers.',
  },

  // Content & Services Rules (10%)
  services_present: {
    id: 'services_present',
    name: 'Services Catalog',
    category: 'content',
    weight: 50,
    severity: 'high',
    description: 'Structured list of individual business services configured.',
    recommendation: 'Add detailed descriptions and pricing for your top 5-15 services in your GBP dashboard.',
    whyItMatters: 'Specific service listings trigger direct ranking for long-tail service search queries.',
  },
  attributes_configured: {
    id: 'attributes_configured',
    name: 'Business Attributes',
    category: 'content',
    weight: 25,
    severity: 'low',
    description: 'Profile attributes (accessibility, amenities, payment options) filled out.',
    recommendation: 'Complete all relevant category-specific attributes in Google Business Profile.',
    whyItMatters: 'Attributes qualify your listing for specialized search filters (e.g. wheelchair accessible).',
  },
  posts_recent_activity: {
    id: 'posts_recent_activity',
    name: 'Google Posts Updates',
    category: 'content',
    weight: 25,
    severity: 'low',
    description: 'Publishing active updates, offers, or event posts.',
    recommendation: 'Publish a new update or promotional offer every 14 to 30 days.',
    whyItMatters: 'Google Posts demonstrate active management and occupy prominent screen space in mobile results.',
  },

  // Media Rules (10%)
  photo_coverage: {
    id: 'photo_coverage',
    name: 'Photo Volume & Quality',
    category: 'media',
    weight: 40,
    severity: 'medium',
    description: 'Adequate collection of interior, exterior, and team photos (benchmark: 10+ photos).',
    recommendation: 'Upload high-resolution photos of your storefront, interior, staff, and past work.',
    whyItMatters: 'Listings with photos receive 42% more requests for driving directions on Google Maps.',
  },
  cover_photo_present: {
    id: 'cover_photo_present',
    name: 'Cover Photo Set',
    category: 'media',
    weight: 30,
    severity: 'medium',
    description: 'Dedicated high-quality cover photo selected.',
    recommendation: 'Set an engaging 16:9 landscape photo as your preferred cover photo.',
    whyItMatters: 'The cover photo is the dominant visual asset displayed in local search cards.',
  },
  logo_configured: {
    id: 'logo_configured',
    name: 'Official Logo Set',
    category: 'media',
    weight: 30,
    severity: 'medium',
    description: 'Square branding logo added to profile.',
    recommendation: 'Upload a clear square 1:1 format logo.',
    whyItMatters: 'Reinforces brand identity when customers view review replies and posts.',
  },

  // Local SEO Consistency (NAP) Rules (10%)
  website_nap_name_match: {
    id: 'website_nap_name_match',
    name: 'Business Name Consistency',
    category: 'consistency',
    weight: 35,
    severity: 'critical',
    description: 'Business name on website matches Google Business Profile exact name.',
    recommendation: 'Ensure your website header/footer name matches your GBP listing name verbatim.',
    whyItMatters: 'Discrepancies introduce entity confusion for Google knowledge graph algorithms.',
  },
  website_nap_phone_match: {
    id: 'website_nap_phone_match',
    name: 'Phone Number Consistency',
    category: 'consistency',
    weight: 35,
    severity: 'critical',
    description: 'Primary phone number on website matches GBP contact number.',
    recommendation: 'Display the same phone number in standard international/local format across both.',
    whyItMatters: 'Consistent phone numbers confirm the legitimacy and contactability of the physical entity.',
  },
  website_nap_hours_match: {
    id: 'website_nap_hours_match',
    name: 'Operating Hours Consistency',
    category: 'consistency',
    weight: 30,
    severity: 'high',
    description: 'Operating hours published on website match GBP listed schedule.',
    recommendation: 'Synchronize opening and closing hours across website footer/contact page and GBP.',
    whyItMatters: 'Inconsistent hours lead to wasted customer visits and negative reviews.',
  },

  // Technical & Local Signals Rules (5%)
  localbusiness_schema: {
    id: 'localbusiness_schema',
    name: 'LocalBusiness Structured Data',
    category: 'technical_signals',
    weight: 35,
    severity: 'high',
    description: 'Valid JSON-LD LocalBusiness or Organization schema detected on website.',
    recommendation: 'Add Schema.org JSON-LD markup with matching name, address, telephone, and geo coordinates.',
    whyItMatters: 'Structured data provides machine-readable verification of your local entity coordinates.',
  },
  sitemap_and_robots: {
    id: 'sitemap_and_robots',
    name: 'Robots.txt & Sitemap',
    category: 'technical_signals',
    weight: 25,
    severity: 'medium',
    description: 'Proper crawl configuration with sitemap and permissive robots.txt.',
    recommendation: 'Ensure your robots.txt does not disallow search engine crawlers and points to an XML sitemap.',
    whyItMatters: 'Enables prompt discovery and re-indexing of your local service pages.',
  },
  meta_pixel_installed: {
    id: 'meta_pixel_installed',
    name: 'Meta Pixel & Conversion Tracking',
    category: 'technical_signals',
    weight: 20,
    severity: 'medium',
    description: 'Meta Pixel base tracking script and PageView event detected on homepage.',
    recommendation: 'Install Meta Pixel base code in website <head> to track conversions and build retargeting audiences.',
    whyItMatters: 'Enables high-intent local conversion tracking, custom audiences, and social attribution across Meta platforms.',
  },
  meta_open_graph_complete: {
    id: 'meta_open_graph_complete',
    name: 'Open Graph Social Signals (og:tags)',
    category: 'technical_signals',
    weight: 20,
    severity: 'medium',
    description: 'Standard Open Graph metadata (og:title, og:description, og:image, og:url) for social sharing.',
    recommendation: 'Configure complete Open Graph tags and link an authentic Facebook Page.',
    whyItMatters: 'Controls how your business link appears on Facebook/Instagram and sends brand authority signals.',
  },
};
