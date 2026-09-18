/**
 * LocalRank Audit - Core TypeScript Definitions
 */

export type AuditStatus = 'PASS' | 'WARNING' | 'ERROR' | 'INFO' | 'NOT_AVAILABLE';

export type AuditSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type DataSource =
  | 'Google Business Profile API'
  | 'Google Maps public information'
  | 'Website crawl'
  | 'User input'
  | 'AI analysis'
  | 'Third-party provider';

export type FindingCategory =
  | 'profile_completeness'
  | 'categories'
  | 'reviews'
  | 'website'
  | 'content'
  | 'media'
  | 'consistency'
  | 'technical_signals';

export interface AuditFinding {
  id: string;
  name: string;
  category: FindingCategory;
  severity: AuditSeverity;
  status: AuditStatus;
  message: string;
  explanation: string;
  recommendation: string;
  evidence?: string;
  dataSource: DataSource;
  confidence: number; // 0 to 1
}

export interface CategoryScore {
  category: FindingCategory;
  name: string;
  weight: number; // percentage (e.g., 20)
  score: number;  // 0 to 100
  passed: number;
  warnings: number;
  issues: number;
  notAvailable: number;
}

export interface AuditSummary {
  overallScore: number;
  passedCount: number;
  warningCount: number;
  issueCount: number;
  notAvailableCount: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  auditDate: string;
}

export interface DayHours {
  open: string;
  close: string;
  closed?: boolean;
}

export interface RegularHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface BusinessProfile {
  id?: string;
  name: string;
  placeId?: string;
  address?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  website?: string;
  primaryCategory?: string;
  secondaryCategories?: string[];
  rating?: number;
  reviewCount?: number;
  openingHours?: string;
  regularHours?: RegularHours;
  specialHours?: string[];
  description?: string;
  services?: string[];
  products?: string[];
  attributes?: Record<string, boolean | string>;
  photosCount?: number;
  hasCoverPhoto?: boolean;
  hasLogo?: boolean;
  postsCount?: number;
  lastPostDate?: string;
  latitude?: number;
  longitude?: number;
  mapsUrl?: string;
  dataSource: DataSource;
}

export type ConsistencyStatus = 'MATCH' | 'PARTIAL MATCH' | 'MISMATCH' | 'NOT FOUND' | 'NOT AVAILABLE';

export interface ConsistencyCheckItem {
  field: 'Name' | 'Phone' | 'Address' | 'Hours' | 'Website' | 'Services' | 'City';
  gbpValue: string;
  websiteValue: string;
  status: ConsistencyStatus;
  confidence: number;
  evidence: string;
}

export interface WebsiteAuditData {
  url: string;
  httpStatus: number;
  isHttps: boolean;
  isResponsive: boolean;
  responseTimeMs: number;
  redirectsCount: number;
  canonicalUrl?: string;
  robotsTxtPresent: boolean;
  sitemapPresent: boolean;
  title?: string;
  titleLength: number;
  metaDescription?: string;
  metaDescriptionLength: number;
  h1Tags: string[];
  h2Tags: string[];
  wordCount: number;
  totalImages: number;
  imagesWithoutAlt: number;
  internalLinksCount: number;
  externalLinksCount: number;
  hasLocalBusinessSchema: boolean;
  hasOrganizationSchema: boolean;
  hasFaqSchema: boolean;
  schemaTypesFound: string[];
  detectedBusinessName?: string;
  detectedPhone?: string;
  detectedAddress?: string;
  detectedHours?: string;
  serviceKeywordsFound: string[];
  locationKeywordsFound: string[];
  metaPixel?: MetaPixelAuditResult;
  openGraph?: OpenGraphAuditResult;
}

export interface MetaPixelAuditResult {
  isPixelDetected: boolean;
  detectedPixelIds: string[];
  isPageViewDetected: boolean;
  hasDuplicatePixel: boolean;
  scriptSnippet?: string;
  status: 'PASS' | 'WARNING' | 'ERROR';
  recommendations: string[];
}

export interface OpenGraphAuditResult {
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  facebookPageLinked: boolean;
  facebookPageUrl?: string;
  status: 'PASS' | 'WARNING' | 'ERROR';
  missingTags: string[];
}

export interface MetaPixelEventConfig {
  eventName: string;
  description: string;
  eventStatus: 'ACTIVE' | 'INACTIVE';
  installationStatus: 'INSTALLED' | 'PENDING' | 'OPTIONAL';
  eventCode: string;
  category: 'STANDARD' | 'ECOMMERCE' | 'LEAD_GEN';
}

export interface MetaTrackingConfig {
  pixelId?: string;
  pixelName?: string;
  isConnected: boolean;
  facebookPageId?: string;
  facebookPageName?: string;
  facebookPageUrl?: string;
  facebookPageFollowers?: number;
  businessAccountId?: string;
  businessAccountName?: string;
  activeEvents: string[];
  wordpressConnected: boolean;
  wordpressApiToken?: string;
  lastVerifiedAt?: string;
  auditScore?: number;
}

export interface ReviewItem {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  authorUrl?: string;
  rating: number;
  text: string;
  publishTime: string;
  relativeTime?: string;
  replyText?: string;
  replyTime?: string;
  sentimentLabel?: 'Positive' | 'Neutral' | 'Negative';
  isGoogleVerified?: boolean;
}

export interface ReviewTheme {
  topic: string;
  count: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sampleSnippet?: string;
}

export interface ReviewAuditMetrics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  responseRate: number; // percentage (e.g., 91)
  unansweredCount: number;
  averageResponseTimeDays?: number;
  frequentlyMentionedTopics: ReviewTheme[];
  recentTrend: {
    month: string;
    count: number;
    averageRating: number;
  }[];
  transparencyNote: string;
}

export interface CompetitorComparisonItem {
  id: string;
  name: string;
  primaryCategory: string;
  secondaryCategories: string[];
  rating: number;
  reviewCount: number;
  website?: string;
  servicesCount: number;
  photosCount: number;
  profileCompletenessScore: number;
  reviewResponseRate: number;
  observedDifferences: string[];
}

export interface LocalRankGridPoint {
  row: number;
  col: number;
  lat: number;
  lng: number;
  rank: number | null;
  businessFound?: string;
}

export interface LocalRankGridScan {
  id: string;
  keyword: string;
  locationName: string;
  gridSize: number; // e.g. 5 for 5x5
  radiusKm: number;
  centerLat: number;
  centerLng: number;
  points: LocalRankGridPoint[];
  averageRank: number | null;
  status: 'COMPLETED' | 'PROVIDER_NOT_CONFIGURED' | 'FAILED';
  providerMessage?: string;
  createdAt: string;
}

export interface AIActionRecommendation {
  id: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  evidence: string;
  recommendedAction: string;
  expectedPurpose: string;
  implementationDifficulty: 'EASY' | 'MODERATE' | 'COMPLEX';
  disclaimer: string;
}

export interface FullAuditReport {
  id: string;
  business: BusinessProfile;
  summary: AuditSummary;
  categoryScores: Record<FindingCategory, CategoryScore>;
  findings: AuditFinding[];
  priorityIssues: AuditFinding[];
  consistency: ConsistencyCheckItem[];
  websiteAudit?: WebsiteAuditData;
  reviewAudit?: ReviewAuditMetrics;
  competitors?: CompetitorComparisonItem[];
  aiRecommendations: AIActionRecommendation[];
  generatedAt: string;
  methodologyNotes: string;
}
