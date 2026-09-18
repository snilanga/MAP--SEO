# LocalRank Audit — System Architecture

## 1. High-Level Architecture Overview

LocalRank Audit is architected as a modern, modular, production-ready Local SEO auditing platform consisting of two client interfaces and a shared core engine:

1. **Chrome Extension (Manifest V3)**: Client-side companion running directly in Google Chrome. Operates non-intrusively on supported Google Maps and Search result pages to extract publicly accessible business listing attributes via modular adapters.
2. **Web Application & REST API (Next.js App Router)**: Comprehensive SaaS management dashboard for agencies and business owners to audit Google Business Profiles, crawl landing pages, inspect review velocity, benchmark competitors, monitor score trajectories, and export white-labeled reports.
3. **Core Engine Packages (`/packages/*`)**:
   - `@localrank/types`: Shared TypeScript data models, status enums, and API interfaces.
   - `@localrank/config`: Configurable scoring weights (`CATEGORY_WEIGHTS`) and rules repository (`AUDIT_RULES`).
   - `@localrank/audit-engine`: Pure TypeScript rule evaluation, multi-category scoring, NAP consistency matcher, and evidence-backed recommendation generator.
   - `@localrank/crawler`: Polite website crawler with strict SSRF defense, JSON-LD Schema.org extractor, and on-page SEO analyzer.
   - `@localrank/google`: Google Business Profile & Places API client interfaces with comprehensive realistic mock providers for zero-credential local development.

```
┌─────────────────────────────────────────────────────────────┐
│                       USER INTERFACES                       │
├──────────────────────────────┬──────────────────────────────┤
│   Chrome Extension (MV3)     │      Web Dashboard (Next.js) │
│   - Popup (Quick Audit)      │      - Executive Overview    │
│   - Side Panel (Dimensions)  │      - GBP Audit & Scores    │
│   - Content Script Adapters  │      - Website & NAP Matrix  │
│   - Background Worker        │      - Review Intelligence   │
│                              │      - Competitor Benchmark  │
│                              │      - Local Geo-Grid Scans  │
│                              │      - PDF / CSV Reports     │
└──────────────┬───────────────┴──────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS REST API LAYER                   │
│   /api/audits               /api/businesses                 │
│   /api/website-audits       /api/reviews                    │
│   /api/competitors          /api/rank-scans                 │
│   /api/reports              /api/ai/recommendations         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     CORE ENGINE PACKAGES                    │
│  @localrank/audit-engine    @localrank/crawler (SSRF Safe)  │
│  @localrank/config          @localrank/google (Mock/Real)   │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     PERSISTENCE LAYER                       │
│    Prisma ORM (23 Models: Organizations, Projects, Audits,  │
│    Reviews, Websites, Competitors, RankScans, UsageEvents)  │
└─────────────────────────────────────────────────────────────┘
```

## 2. Multi-Tenant Data Hierarchy

The database model is structured for agency multi-tenancy:
- **User**: Authenticated team member or consultant.
- **Organization**: Workspace / Agency account with white-label settings and subscription tier.
- **Project**: Client portfolio grouping multiple business entities.
- **Business**: Individual physical GBP listing (stores name, address, phone, category, placeId, opening hours).
- **Audits & Results**: Historical score snapshots, findings, and evidence.
- **Websites & Pages**: Crawled landing pages, Schema.org entities, and NAP signals.
- **Competitors & Snapshots**: Observed competitor differences over time.
- **RankScans & RankPoints**: Geo-grid proximity coordinates and ranking positions.
- **UsageEvents**: Event ledger tracking audits, crawls, and AI drafts for billing tier enforcement.
