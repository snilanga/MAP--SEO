import type {
  BusinessProfile,
  WebsiteAuditData,
  ReviewAuditMetrics,
  CompetitorComparisonItem,
  FullAuditReport,
} from '../../types/src/index.ts';
import { evaluateAuditRules } from './rulesEvaluator.ts';
import { computeAuditScore } from './scorer.ts';
import { compareGBPWithWebsite } from './napMatcher.ts';
import { generateActionRecommendations } from './recommendationEngine.ts';

export * from './rulesEvaluator.ts';
export * from './scorer.ts';
export * from './napMatcher.ts';
export * from './recommendationEngine.ts';

export function runFullAudit(
  profile: BusinessProfile,
  website?: WebsiteAuditData,
  reviews?: ReviewAuditMetrics,
  competitors?: CompetitorComparisonItem[]
): FullAuditReport {
  // 1. Evaluate rules
  const findings = evaluateAuditRules(profile, reviews, website);

  // 2. Score calculations
  const { summary, categoryScores, priorityIssues } = computeAuditScore(findings);

  // 3. Consistency comparison
  const consistency = compareGBPWithWebsite(profile, website);

  // 4. Actionable recommendations
  const aiRecommendations = generateActionRecommendations(
    findings,
    profile,
    website,
    reviews,
    competitors
  );

  return {
    id: `audit-${Date.now()}`,
    business: profile,
    summary,
    categoryScores,
    findings,
    priorityIssues,
    consistency,
    websiteAudit: website,
    reviewAudit: reviews,
    competitors,
    aiRecommendations,
    generatedAt: new Date().toISOString(),
    methodologyNotes:
      'Scoring derived according to original multi-category rules defined in /config/auditRules.ts. Consistency evaluated through normalized entity comparison. AI recommendations derived from observed audit evidence.',
  };
}
