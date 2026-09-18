import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { compareGBPWithWebsite } from '../packages/audit-engine/src/napMatcher.ts';
import { MOCK_GBP_BUSINESS, MOCK_WEBSITE_AUDIT } from '../packages/google/src/index.ts';

describe('NAP Consistency Matching Verification', () => {
  test('Exact matching business name is marked as MATCH', () => {
    const results = compareGBPWithWebsite(MOCK_GBP_BUSINESS, MOCK_WEBSITE_AUDIT);
    const nameItem = results.find((r) => r.field === 'Name');
    assert.ok(nameItem);
    assert.equal(nameItem.status, 'MATCH');
  });

  test('Phone number with differing formatting matches on normalized digits', () => {
    const customWebsite = {
      ...MOCK_WEBSITE_AUDIT,
      detectedPhone: '011-234-5678', // local format without +94 country code
    };

    const results = compareGBPWithWebsite(MOCK_GBP_BUSINESS, customWebsite);
    const phoneItem = results.find((r) => r.field === 'Phone');
    assert.ok(phoneItem);
    assert.ok(phoneItem.status === 'MATCH' || phoneItem.status === 'PARTIAL MATCH');
  });

  test('Operating hours discrepancy is detected as MISMATCH', () => {
    const results = compareGBPWithWebsite(MOCK_GBP_BUSINESS, MOCK_WEBSITE_AUDIT);
    const hoursItem = results.find((r) => r.field === 'Hours');
    assert.ok(hoursItem);
    assert.equal(hoursItem.status, 'MISMATCH');
    assert.match(hoursItem.evidence, /08:00/);
    assert.match(hoursItem.evidence, /09:00/);
  });

  test('Uncrawled website yields NOT AVAILABLE or NOT FOUND status', () => {
    const results = compareGBPWithWebsite(MOCK_GBP_BUSINESS, undefined);
    assert.ok(results.length >= 4);
    assert.ok(results.every((r) => r.status === 'NOT AVAILABLE'));
  });
});
