import type {
  BusinessProfile,
  ReviewAuditMetrics,
  CompetitorComparisonItem,
} from '../../types/src/index.ts';

export interface IGoogleBusinessProfileClient {
  getBusinessProfile(placeIdOrName: string): Promise<BusinessProfile>;
  searchBusinesses(query: string, location?: string): Promise<BusinessProfile[]>;
  getReviews(placeId: string): Promise<ReviewAuditMetrics>;
  getCompetitors(keyword: string, location: string): Promise<CompetitorComparisonItem[]>;
}

export interface GoogleApiConfig {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  useMockFallback?: boolean;
}
