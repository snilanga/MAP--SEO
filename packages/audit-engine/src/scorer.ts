import type {
  AuditFinding,
  FindingCategory,
  CategoryScore,
  AuditSummary,
} from '../../types/src/index.ts';
import { CATEGORY_WEIGHTS } from '../../config/src/index.ts';

export interface ScoreComputationResult {
  summary: AuditSummary;
  categoryScores: Record<FindingCategory, CategoryScore>;
  priorityIssues: AuditFinding[];
}

export function computeAuditScore(findings: AuditFinding[]): ScoreComputationResult {
  const categories: FindingCategory[] = [
    'profile_completeness',
    'categories',
    'reviews',
    'website',
    'content',
    'media',
    'consistency',
    'technical_signals',
  ];

  const categoryScores = {} as Record<FindingCategory, CategoryScore>;
  let weightedScoreTotal = 0;
  let totalAvailableWeight = 0;

  let totalPassed = 0;
  let totalWarnings = 0;
  let totalIssues = 0;
  let totalNotAvailable = 0;

  for (const cat of categories) {
    const config = CATEGORY_WEIGHTS[cat];
    const catFindings = findings.filter((f) => f.category === cat);

    let catPointsEarned = 0;
    let catMaxPoints = 0;

    let passed = 0;
    let warnings = 0;
    let issues = 0;
    let notAvailable = 0;

    for (const f of catFindings) {
      if (f.status === 'PASS') {
        passed++;
        catPointsEarned += 100;
        catMaxPoints += 100;
      } else if (f.status === 'WARNING') {
        warnings++;
        catPointsEarned += 50; // partial credit for minor warning
        catMaxPoints += 100;
      } else if (f.status === 'ERROR') {
        issues++;
        catPointsEarned += 0;
        catMaxPoints += 100;
      } else if (f.status === 'NOT_AVAILABLE' || f.status === 'INFO') {
        notAvailable++;
        // Excluded from penalty denominator if data is genuinely not available
      }
    }

    totalPassed += passed;
    totalWarnings += warnings;
    totalIssues += issues;
    totalNotAvailable += notAvailable;

    const catScore = catMaxPoints > 0 ? Math.round((catPointsEarned / catMaxPoints) * 100) : 80;

    categoryScores[cat] = {
      category: cat,
      name: config.name,
      weight: config.weight,
      score: catScore,
      passed,
      warnings,
      issues,
      notAvailable,
    };

    weightedScoreTotal += catScore * (config.weight / 100);
    totalAvailableWeight += config.weight;
  }

  // Normalize final score to 0 - 100
  const finalScore = Math.round(
    totalAvailableWeight > 0 ? (weightedScoreTotal / totalAvailableWeight) * 100 : 0
  );

  // Grade mapping
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  if (finalScore >= 92) grade = 'A+';
  else if (finalScore >= 85) grade = 'A';
  else if (finalScore >= 75) grade = 'B';
  else if (finalScore >= 65) grade = 'C';
  else if (finalScore >= 50) grade = 'D';

  // Priority issues: filter ERROR or critical/high WARNINGs sorted by severity
  const severityRank: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
    info: 0,
  };

  const priorityIssues = findings
    .filter((f) => f.status === 'ERROR' || (f.status === 'WARNING' && (f.severity === 'high' || f.severity === 'critical')))
    .sort((a, b) => (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0));

  const summary: AuditSummary = {
    overallScore: finalScore,
    passedCount: totalPassed,
    warningCount: totalWarnings,
    issueCount: totalIssues,
    notAvailableCount: totalNotAvailable,
    grade,
    auditDate: new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
  };

  return {
    summary,
    categoryScores,
    priorityIssues,
  };
}
