import type {
  BusinessProfile,
  ReviewAuditMetrics,
  CompetitorComparisonItem,
} from '../../types/src/index.ts';
import type { IGoogleBusinessProfileClient, GoogleApiConfig } from './interfaces.ts';
import { MOCK_GBP_BUSINESS, MOCK_BUSINESS_LIST } from './mockGBPData.ts';
import { MOCK_REVIEW_AUDIT_METRICS } from './mockReviews.ts';
import { MOCK_COMPETITORS } from './mockCompetitors.ts';

export class GoogleBusinessProfileClient implements IGoogleBusinessProfileClient {
  private config: GoogleApiConfig;

  constructor(config: GoogleApiConfig = {}) {
    this.config = {
      useMockFallback: true,
      ...config,
    };
  }

  async getBusinessProfile(placeIdOrName: string): Promise<BusinessProfile> {
    // If real API key is configured, query Google Places API
    if (this.config.apiKey && !this.config.useMockFallback) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
          placeIdOrName
        )}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,types,geometry,photos&key=${
          this.config.apiKey
        }`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.result) {
            const r = json.result;
            return {
              name: r.name || 'Unknown Business',
              placeId: placeIdOrName,
              address: r.formatted_address,
              phone: r.formatted_phone_number,
              website: r.website,
              primaryCategory: r.types?.[0]?.replace(/_/g, ' ') || 'Local Business',
              secondaryCategories: r.types?.slice(1).map((t: string) => t.replace(/_/g, ' ')) || [],
              rating: r.rating || 0,
              reviewCount: r.user_ratings_total || 0,
              openingHours: r.opening_hours?.weekday_text?.join(', '),
              latitude: r.geometry?.location?.lat,
              longitude: r.geometry?.location?.lng,
              photosCount: r.photos?.length || 0,
              dataSource: 'Google Business Profile API',
            };
          }
        }
      } catch (err) {
        console.warn('Google Places API request failed, falling back to mock provider:', err);
      }
    }

    // Default: Mock Provider for instant local dev & testing
    const found = MOCK_BUSINESS_LIST.find(
      (b) =>
        b.placeId === placeIdOrName ||
        b.name.toLowerCase().includes(placeIdOrName.toLowerCase()) ||
        b.id === placeIdOrName
    );

    return found || MOCK_GBP_BUSINESS;
  }

  async searchBusinesses(query: string, location?: string): Promise<BusinessProfile[]> {
    if (this.config.apiKey && !this.config.useMockFallback) {
      // Real Places Text Search query
      try {
        const searchQuery = location ? `${query} in ${location}` : query;
        const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
          searchQuery
        )}&key=${this.config.apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.results)) {
            return json.results.map((r: any) => ({
              name: r.name,
              placeId: r.place_id,
              address: r.formatted_address,
              primaryCategory: r.types?.[0]?.replace(/_/g, ' ') || 'Business',
              secondaryCategories: r.types?.slice(1, 4).map((t: string) => t.replace(/_/g, ' ')),
              rating: r.rating || 0,
              reviewCount: r.user_ratings_total || 0,
              latitude: r.geometry?.location?.lat,
              longitude: r.geometry?.location?.lng,
              dataSource: 'Google Maps public information',
            }));
          }
        }
      } catch (err) {
        console.warn('Text Search API failed, using mock list:', err);
      }
    }

    const q = (query || '').toLowerCase();
    const filtered = MOCK_BUSINESS_LIST.filter(
      (b) => b.name.toLowerCase().includes(q) || (b.city && b.city.toLowerCase().includes(q))
    );

    return filtered.length > 0 ? filtered : MOCK_BUSINESS_LIST;
  }

  async getReviews(placeId: string): Promise<ReviewAuditMetrics> {
    return MOCK_REVIEW_AUDIT_METRICS;
  }

  async getCompetitors(keyword: string, location: string): Promise<CompetitorComparisonItem[]> {
    return MOCK_COMPETITORS;
  }
}
