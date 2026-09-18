# LocalRank Audit — Google Business Profile & Local SEO SaaS Platform

> **LocalRank Audit** is a modern, original, production-ready SaaS platform and Chrome Extension designed for Local SEO professionals, digital marketing agencies, freelancers, and business owners to audit Google Business Profiles, benchmark competitors, verify website NAP consistency, analyze customer reviews, and generate client-ready PDF reports.

---

## Key Capabilities

- **Google Business Profile Audit**: Comprehensive 0–100 scoring based on original multi-category weighting (Profile completeness 20%, Website 20%, Reviews 15%, Categories 10%, Content 10%, Media 10%, Consistency 10%, Local signals 5%). Driven dynamically via `/config/auditRules.ts`.
- **Website Crawler & Local SEO Auditor**: Automated crawl inspecting HTTPS, canonical, mobile viewport, title/meta tags, word count, image alt attributes, and JSON-LD structured data (`LocalBusiness`, `Organization`, `FAQPage`).
- **Strict SSRF Protection**: Hardened crawler defense blocking loopback addresses, RFC 1918 private subnets, carrier-grade NAT, and cloud metadata endpoints (`169.254.169.254`).
- **GBP ↔ Website Consistency (NAP)**: Granular reconciliation of Business Name, Address, Phone, Hours, and Services with evidence-backed status indicators (`MATCH`, `PARTIAL MATCH`, `MISMATCH`, `NOT FOUND`, `NOT AVAILABLE`).
- **Review Sentiment & Keyword Intelligence**: Review volume analysis, 1-to-5 star breakdown, owner reply response rate, and keyword topic clustering with clear transparency labels (`"AI-generated topic analysis"`).
- **Competitor Benchmarking**: Objective side-by-side signal comparison and factual observed differences without subjective bias.
- **Local Geo-Grid Rank Tracker**: Geographic rank matrix tracking across customizable radii and grid sizes using compliant provider interfaces.
- **AI Recommendations & Content Assistant**: Actionable priority recommendations backed by observed audit evidence, along with drafting tools for GBP descriptions, review replies, and location page outlines.
- **White-Label Agency Reporting**: Printable client dossier, server-side PDF generation, CSV data export, and JSON payload export.
- **Chrome Extension (Manifest V3)**: Extension popup, side panel, and content script adapters (`GoogleMapsAdapter`, `GoogleSearchAdapter`) allowing instant one-click business audits directly from Google Maps and Google Search.
- **Realistic Mock Datasets & Zero-Config Setup**: Includes realistic mock profiles (e.g. *ABC Dental Clinic*, *Colombo Auto Care*, *The Cinnamon Kitchen*) for local development without paid third-party API keys.

---

## Monorepo Architecture

```
.
├── apps/
│   ├── web/                     # Next.js App Router full-stack web dashboard & REST API
│   │   ├── src/app/             # Pages: Dashboard, Audits, Website, Reviews, Categories, etc.
│   │   ├── src/app/api/         # REST API endpoints with Zod validation
│   │   └── src/components/      # UI components, layout, score gauge, status badges
│   └── extension/               # Chrome Extension (Manifest V3, TypeScript, React, Vite)
│       ├── src/popup/           # Quick audit popup
│       ├── src/sidepanel/       # Multi-dimensional side panel
│       ├── src/content/         # Modular extraction adapters (Maps & Search)
│       └── src/background/      # Service worker
├── packages/
│   ├── types/                   # Shared TypeScript models & interfaces
│   ├── config/                  # Re-exported audit rules & scoring configuration
│   ├── google/                  # Google Business Profile / Places API client + Mock data
│   ├── crawler/                 # Polite website crawler with strict SSRF defense
│   └── audit-engine/            # Scorer, NAP matcher, rules evaluator, recommendation engine
├── prisma/
│   └── schema.prisma            # Comprehensive 23-model database schema
├── config/
│   └── auditRules.ts            # Central configurable audit rules, weights & severities
├── docs/                        # Architecture, security, rules, and Google API documentation
├── tests/                       # Automated test suite (Scorer, NAP matcher, SSRF guard)
└── .env.example                 # Environment configuration template
```

---

## Quick Start & Local Development

### 1. Requirements
- Node.js 20+ (tested on Node v22.14.0)
- npm 10+

### 2. Install & Configure
```bash
# Clone the repository
git clone <repo-url>
cd "GMB Everywhere - GBP Audit for Local SEO"

# Copy environment variables
cp .env.example .env

# Install dependencies across all workspaces
npm install
```

### 3. Run Automated Tests
```bash
npm test
```
*Executes all 12 unit tests verifying scoring weights, audit rules, NAP consistency matching, and SSRF security defense.*

### 4. Start the Web Dashboard
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the LocalRank Audit dashboard.

### 5. Install Chrome Extension (Manifest V3)
1. Open Google Chrome and go to `chrome://extensions/`.
2. Toggle on **Developer mode** (top right).
3. Click **Load unpacked** and choose `apps/extension`.
4. Open Google Maps or click the extension icon to view the popup and side panel.

---

## Security, Privacy & Legal Compliance

- **No Unauthorized Scraping or CAPTCHA Bypassing**: The system strictly complies with platform terms and API policies.
- **SSRF Defense**: The crawler blocks requests to loopback addresses, private IP ranges (RFC 1918), and cloud instance metadata.
- **Data Transparency**: Every metric clearly displays its origin (`Google Business Profile API`, `Google Maps public information`, `Website crawl`, or `AI analysis`).
- **No Fabricated Data**: If an external attribute is missing, the platform displays `"Not available"` rather than guessing.

---

## License

Original work. Built for Local SEO professionals and marketing agencies.
