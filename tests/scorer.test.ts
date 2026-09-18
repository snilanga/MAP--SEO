import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { CATEGORY_WEIGHTS } from '../config/auditRules.ts';
import { runFullAudit, evaluateAuditRules, computeAuditScore } from '../packages/audit-engine/src/index.ts';
import { MOCK_GBP_BUSINESS, MOCK_WEBSITE_AUDIT, MOCK_REVIEW_AUDIT_METRICS } from '../packages/google/src/index.ts';
import type { BusinessProfile } from '../packages/types/src/index.ts';

describe('Audit Scorer & Rules Verification', () => {
  test('Category weights must sum to exactly 100%', () => {
    const totalWeight = Object.values(CATEGORY_WEIGHTS).reduce(
      (sum, cat) => sum + cat.weight,
      0
    );
    assert.equal(totalWeight, 100, `Weights sum to ${totalWeight}%, but must sum to 100%`);
  });

  test('Full audit on realistic ABC Dental profile produces realistic score (75-95)', () => {
    const report = runFullAudit(
      MOCK_GBP_BUSINESS,
      MOCK_WEBSITE_AUDIT,
      MOCK_REVIEW_AUDIT_METRICS
    );

    assert.ok(report.summary.overallScore >= 75 && report.summary.overallScore <= 95);
    assert.ok(report.summary.passedCount > 10);
    assert.ok(report.findings.length >= 10);
    assert.ok(report.priorityIssues.length > 0);
    // Verified hours mismatch was identified
    const hoursIssue = report.findings.find(f => f.id === 'website_nap_hours_match');
    assert.ok(hoursIssue, 'Hours mismatch rule was evaluated');
    assert.equal(hoursIssue.status, 'ERROR');
  });

  test('Critical profile omissions significantly reduce score', () => {
    const emptyProfile: BusinessProfile = {
      name: 'X',
      dataSource: 'Google Maps public information',
    };

    const findings = evaluateAuditRules(emptyProfile);
    const { summary, priorityIssues } = computeAuditScore(findings);

    assert.ok(summary.overallScore < 50, `Score was ${summary.overallScore}, expected < 50`);
    assert.ok(summary.issueCount >= 4, 'Multiple critical issues identified');
    assert.ok(priorityIssues.some(i => i.id === 'profile_name_present'));
    assert.ok(priorityIssues.some(i => i.id === 'primary_category_present'));
    assert.ok(priorityIssues.some(i => i.id === 'website_present'));
  });
});
