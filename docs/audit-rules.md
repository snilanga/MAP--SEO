# LocalRank Audit — Configurable Audit Rules & Scoring

## 1. Scoring Architecture

The LocalRank Audit scoring system evaluates profiles on a normalized scale from **0 to 100 points**. Scoring is driven dynamically by the configuration in `/config/auditRules.ts` rather than being hardcoded into UI components.

### Category Weights (Sum = 100%)

| Category | Weight | Description |
|---|---|---|
| **Profile Completeness** | 20% | Core business name, full street address, verified phone, complete regular hours, rich description. |
| **Website & Technical** | 20% | Linked website, HTTPS enforcement, mobile viewport, title tag optimization, meta description, clean H1 heading. |
| **Reviews & Reputation** | 15% | Review volume benchmark, average star rating threshold, owner response rate, and recent review velocity. |
| **Categories** | 10% | Core primary category selection and 2–5 relevant secondary category assignments. |
| **Content & Services** | 10% | Dedicated services catalog items, category attributes, and regular Google Post updates. |
| **Photos & Media** | 10% | Verified photo coverage (15+ photos), dedicated cover photo, and square branding logo. |
| **Local SEO Consistency (NAP)** | 10% | Verified alignment of business name, phone digits, address coordinates, and operating hours between GBP and website. |
| **Local Signals & Schema** | 5% | Machine-readable Schema.org `LocalBusiness` / `MedicalBusiness` JSON-LD markup, robots.txt, and XML sitemaps. |

## 2. Status Indicators & Severities

Each audit check produces an `AuditFinding` object containing:
- `status`: `PASS` (100% credit), `WARNING` (50% partial credit), `ERROR` (0% credit), `INFO`, or `NOT_AVAILABLE` (excluded from denominator).
- `severity`: `critical`, `high`, `medium`, `low`, or `info`.
- `evidence`: Direct string or measurement (e.g. `GBP: 08:00–18:00 | Website: 09:00–17:00`).
- `dataSource`: Transparency indicator showing whether the data came from the official Google Business Profile API, Google Maps public information, Website crawl, or AI analysis.
- `confidence`: Confidence score from 0.0 to 1.0.

## 3. Extending Rules

To register a new audit rule:
1. Open `/config/auditRules.ts`.
2. Add your rule definition to `AUDIT_RULES` specifying `id`, `name`, `category`, `weight`, `severity`, `description`, and `recommendation`.
3. Implement the condition check inside `packages/audit-engine/src/rulesEvaluator.ts`.
4. Run `npm test` to verify that weight calculations and scoring tests continue to pass.
