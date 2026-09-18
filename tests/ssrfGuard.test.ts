import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { validateUrlForCrawl } from '../packages/crawler/src/ssrfGuard.ts';

describe('SSRF Guard Security Verification', () => {
  test('should reject localhost and loopback hostnames', () => {
    const res1 = validateUrlForCrawl('http://localhost:3000');
    assert.equal(res1.isSafe, false);
    assert.match(res1.reason || '', /Blocked restricted hostname/);

    const res2 = validateUrlForCrawl('https://127.0.0.1:8080/admin');
    assert.equal(res2.isSafe, false);
    assert.match(res2.reason || '', /Private or loopback IP/);
  });

  test('should reject private IPv4 network ranges (RFC 1918)', () => {
    const res10 = validateUrlForCrawl('http://10.0.0.1/status');
    assert.equal(res10.isSafe, false);

    const res192 = validateUrlForCrawl('http://192.168.1.1/router');
    assert.equal(res192.isSafe, false);

    const res172 = validateUrlForCrawl('http://172.16.0.5/api');
    assert.equal(res172.isSafe, false);
  });

  test('should reject AWS/GCP cloud metadata endpoints', () => {
    const res = validateUrlForCrawl('http://169.254.169.254/latest/meta-data/');
    assert.equal(res.isSafe, false);

    const resGoogle = validateUrlForCrawl('http://metadata.google.internal/computeMetadata/v1/');
    assert.equal(resGoogle.isSafe, false);
  });

  test('should reject dangerous non-web protocols like file:, ftp:, gopher:', () => {
    const resFile = validateUrlForCrawl('file:///etc/passwd');
    assert.equal(resFile.isSafe, false);

    const resFtp = validateUrlForCrawl('ftp://ftp.example.com');
    assert.equal(resFtp.isSafe, false);
  });

  test('should approve legitimate public web domains', () => {
    const res = validateUrlForCrawl('https://example.com/contact');
    assert.equal(res.isSafe, true);
    assert.equal(res.normalizedUrl, 'https://example.com/contact');

    const resSub = validateUrlForCrawl('https://dental-clinic.lk/about-us');
    assert.equal(resSub.isSafe, true);
  });
});
