import {
  BusinessProfile,
  FullAuditReport,
  WebsiteAuditData,
  ReviewAuditMetrics,
  CompetitorComparisonItem,
  LocalRankGridScan,
  MetaTrackingConfig,
} from '@localrank/types';
import {
  MOCK_GBP_BUSINESS,
  MOCK_BUSINESS_LIST,
  MOCK_WEBSITE_AUDIT,
  MOCK_AUTO_WEBSITE_AUDIT,
  MOCK_RESTAURANT_WEBSITE_AUDIT,
  MOCK_REVIEW_AUDIT_METRICS,
  MOCK_COMPETITORS,
} from '@localrank/google';
import { runFullAudit } from '@localrank/audit-engine';

// Generate default initial audit
export const DEFAULT_AUDIT: FullAuditReport = runFullAudit(
  MOCK_GBP_BUSINESS,
  MOCK_WEBSITE_AUDIT,
  MOCK_REVIEW_AUDIT_METRICS,
  MOCK_COMPETITORS
);

export interface AppState {
  businesses: BusinessProfile[];
  currentBusiness: BusinessProfile;
  currentAudit: FullAuditReport;
  websiteAudit?: WebsiteAuditData;
  reviewAudit?: ReviewAuditMetrics;
  competitors: CompetitorComparisonItem[];
  rankScans: LocalRankGridScan[];
  metaConfigs: Record<string, MetaTrackingConfig>;
  settings: {
    agencyName: string;
    agencyWebsite: string;
    agencyEmail: string;
    agencyPhone: string;
    whiteLabelLogoUrl: string;
    useMockData: boolean;
  };
}

export const INITIAL_RANK_SCAN: LocalRankGridScan = {
  id: 'scan-1',
  keyword: 'dentist near me',
  locationName: 'Colombo 03',
  gridSize: 3,
  radiusKm: 5,
  centerLat: 6.9015,
  centerLng: 79.8529,
  averageRank: 2.3,
  status: 'COMPLETED',
  createdAt: new Date().toISOString(),
  points: [
    { row: 0, col: 0, lat: 6.915, lng: 79.84, rank: 3, businessFound: 'ABC Dental Clinic' },
    { row: 0, col: 1, lat: 6.915, lng: 79.852, rank: 1, businessFound: 'ABC Dental Clinic' },
    { row: 0, col: 2, lat: 6.915, lng: 79.865, rank: 4, businessFound: 'Colombo Smiles' },
    { row: 1, col: 0, lat: 6.901, lng: 79.84, rank: 2, businessFound: 'ABC Dental Clinic' },
    { row: 1, col: 1, lat: 6.901, lng: 79.852, rank: 1, businessFound: 'ABC Dental Clinic' },
    { row: 1, col: 2, lat: 6.901, lng: 79.865, rank: 2, businessFound: 'ABC Dental Clinic' },
    { row: 2, col: 0, lat: 6.885, lng: 79.84, rank: 5, businessFound: 'Royal Dental' },
    { row: 2, col: 1, lat: 6.885, lng: 79.852, rank: 2, businessFound: 'ABC Dental Clinic' },
    { row: 2, col: 2, lat: 6.885, lng: 79.865, rank: 3, businessFound: 'ABC Dental Clinic' },
  ],
};

// Global in-memory storage for API routes
class DataStore {
  private state: AppState = {
    businesses: [...MOCK_BUSINESS_LIST],
    currentBusiness: { ...MOCK_GBP_BUSINESS },
    currentAudit: DEFAULT_AUDIT,
    websiteAudit: { ...MOCK_WEBSITE_AUDIT },
    reviewAudit: { ...MOCK_REVIEW_AUDIT_METRICS },
    competitors: [...MOCK_COMPETITORS],
    rankScans: [INITIAL_RANK_SCAN],
    metaConfigs: {
      'biz-abc-dental': {
        pixelId: '482910395820194',
        pixelName: 'ABC Dental - Main Website Pixel',
        isConnected: true,
        facebookPageId: 'page-104829105',
        facebookPageName: 'ABC Dental Clinic Colombo',
        facebookPageUrl: 'https://facebook.com/abcdentalcolombo',
        facebookPageFollowers: 3420,
        businessAccountId: 'bm-88204195',
        businessAccountName: 'ABC Healthcare Group',
        activeEvents: ['PageView', 'Lead', 'Contact'],
        wordpressConnected: true,
        wordpressApiToken: 'wp_meta_sec_9941a82f',
        lastVerifiedAt: new Date().toISOString(),
        auditScore: 92,
      },
    },
    settings: {
      agencyName: 'Apex Local SEO Agency',
      agencyWebsite: 'https://apexlocalseo.example.com',
      agencyEmail: 'reports@apexlocalseo.example.com',
      agencyPhone: '+94 11 777 8888',
      whiteLabelLogoUrl: '',
      useMockData: true,
    },
  };

  private businessWebsiteAudits: Record<string, WebsiteAuditData> = {
    'biz-abc-dental': { ...MOCK_WEBSITE_AUDIT },
    'biz-colombo-auto': { ...MOCK_AUTO_WEBSITE_AUDIT },
    'biz-xyz-restaurant': { ...MOCK_RESTAURANT_WEBSITE_AUDIT },
  };

  getState(): AppState {
    return this.state;
  }

  getWebsiteAuditForBusiness(biz: BusinessProfile): WebsiteAuditData | undefined {
    const key = biz.id || biz.placeId || '';
    if (key && this.businessWebsiteAudits[key]) {
      return this.businessWebsiteAudits[key];
    }
    if (biz.website) {
      if (biz.website.includes('colomboautocare')) return { ...MOCK_AUTO_WEBSITE_AUDIT };
      if (biz.website.includes('cinnamonkitchen')) return { ...MOCK_RESTAURANT_WEBSITE_AUDIT };
      if (biz.website.includes('abcdental')) return { ...MOCK_WEBSITE_AUDIT };
    }
    return undefined;
  }

  addBusiness(biz: BusinessProfile): BusinessProfile {
    const newBiz = {
      ...biz,
      id: biz.id || `biz-${Date.now()}`,
    };
    this.state.businesses.unshift(newBiz);
    this.state.currentBusiness = newBiz;
    const siteAudit = this.getWebsiteAuditForBusiness(newBiz);
    this.state.websiteAudit = siteAudit;
    // generate audit for new business
    this.state.currentAudit = runFullAudit(
      newBiz,
      siteAudit,
      this.state.reviewAudit,
      this.state.competitors
    );
    return newBiz;
  }

  getBusinessById(id: string): BusinessProfile | undefined {
    return this.state.businesses.find((b) => b.id === id || b.placeId === id);
  }

  setCurrentBusiness(biz: BusinessProfile) {
    this.state.currentBusiness = biz;
    const siteAudit = this.getWebsiteAuditForBusiness(biz);
    this.state.websiteAudit = siteAudit;
    this.state.currentAudit = runFullAudit(
      biz,
      siteAudit,
      this.state.reviewAudit,
      this.state.competitors
    );
  }

  updateWebsiteAudit(data: WebsiteAuditData, targetBiz?: BusinessProfile) {
    const biz = targetBiz || this.state.currentBusiness;
    const key = biz.id || biz.placeId || '';
    if (key) {
      this.businessWebsiteAudits[key] = data;
    }
    this.state.websiteAudit = data;
    this.state.currentAudit = runFullAudit(
      biz,
      data,
      this.state.reviewAudit,
      this.state.competitors
    );
  }

  addRankScan(scan: LocalRankGridScan) {
    this.state.rankScans.unshift(scan);
  }

  getMetaConfig(businessId?: string): MetaTrackingConfig {
    const id = businessId || this.state.currentBusiness.id || 'biz-abc-dental';
    if (!this.state.metaConfigs[id]) {
      this.state.metaConfigs[id] = {
        isConnected: false,
        activeEvents: ['PageView'],
        wordpressConnected: false,
        auditScore: 40,
      };
    }
    return this.state.metaConfigs[id];
  }

  updateMetaConfig(businessId: string, partial: Partial<MetaTrackingConfig>): MetaTrackingConfig {
    const current = this.getMetaConfig(businessId);
    const updated = {
      ...current,
      ...partial,
      lastVerifiedAt: new Date().toISOString(),
    };
    this.state.metaConfigs[businessId] = updated;
    return updated;
  }

  updateSettings(settings: Partial<AppState['settings']>) {
    this.state.settings = { ...this.state.settings, ...settings };
  }
}

const getGlobalStore = (): DataStore => {
  const g = globalThis as unknown as { __globalStore?: DataStore };
  if (!g.__globalStore) {
    g.__globalStore = new DataStore();
  }
  return g.__globalStore;
};

export const globalStore = getGlobalStore();
