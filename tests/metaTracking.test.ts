import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { parseHtmlContent } from '../packages/crawler/src/htmlParser.ts';
import { evaluateAuditRules } from '../packages/audit-engine/src/rulesEvaluator.ts';
import { MOCK_GBP_BUSINESS } from '../packages/google/src/index.ts';
import type { WebsiteAuditData } from '../packages/types/src/index.ts';

describe('Meta & Facebook Tracking Verification', () => {
  const sampleHtmlWithPixelAndOg = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>ABC Dental Care Colombo</title>
      <meta property="og:title" content="ABC Dental Care - Best Dentist in Colombo" />
      <meta property="og:description" content="Award-winning dental implants, teeth whitening, and general dentistry." />
      <meta property="og:image" content="https://example.com/og-image.jpg" />
      <meta property="og:url" content="https://example.com" />
      <meta property="og:type" content="website" />
      <!-- Meta Pixel Code -->
      <script>
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '982347102938472');
      fbq('track', 'PageView');
      </script>
      <noscript><img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=982347102938472&amp;ev=PageView&amp;noscript=1"
      /></noscript>
    </head>
    <body>
      <h1>ABC Dental Care</h1>
      <footer>
        <a href="https://facebook.com/abcdentalcolombo">Find us on Facebook</a>
      </footer>
    </body>
    </html>
  `;

  test('HTML parser accurately extracts Meta Pixel snippet and IDs', () => {
    const result = parseHtmlContent(sampleHtmlWithPixelAndOg, 'https://example.com');

    assert.ok(result.metaPixel, 'Meta Pixel audit result should exist');
    assert.equal(result.metaPixel.isPixelDetected, true);
    assert.equal(result.metaPixel.detectedPixelIds[0], '982347102938472');
    assert.equal(result.metaPixel.isPageViewDetected, true);
    assert.equal(result.metaPixel.hasDuplicatePixel, false);
    assert.equal(result.metaPixel.status, 'PASS');
  });

  test('HTML parser accurately extracts Open Graph social meta tags', () => {
    const result = parseHtmlContent(sampleHtmlWithPixelAndOg, 'https://example.com');

    assert.ok(result.openGraph, 'Open Graph audit result should exist');
    assert.equal(result.openGraph.ogTitle, 'ABC Dental Care - Best Dentist in Colombo');
    assert.equal(result.openGraph.ogDescription, 'Award-winning dental implants, teeth whitening, and general dentistry.');
    assert.equal(result.openGraph.ogImage, 'https://example.com/og-image.jpg');
    assert.equal(result.openGraph.ogUrl, 'https://example.com');
    assert.equal(result.openGraph.ogType, 'website');
    assert.equal(result.openGraph.facebookPageLinked, true);
    assert.equal(result.openGraph.facebookPageUrl, 'https://facebook.com/abcdentalcolombo');
    assert.equal(result.openGraph.missingTags.length, 0);
    assert.equal(result.openGraph.status, 'PASS');
  });

  test('HTML parser flags missing pixel when no script is embedded', () => {
    const plainHtml = '<html><head><title>No Pixel</title></head><body><h1>Hello</h1></body></html>';
    const result = parseHtmlContent(plainHtml, 'https://example.org');

    assert.ok(result.metaPixel);
    assert.equal(result.metaPixel.isPixelDetected, false);
    assert.equal(result.metaPixel.detectedPixelIds.length, 0);
    assert.equal(result.openGraph?.status, 'ERROR');
  });

  test('Audit rules evaluator scores meta_pixel_installed as PASS when installed', () => {
    const websiteData: any = {
      url: 'https://example.com',
      finalUrl: 'https://example.com',
      statusCode: 200,
      responseTimeMs: 250,
      htmlLength: 4000,
      title: 'ABC Dental',
      metaDescription: 'Dental clinic',
      h1Tags: ['ABC Dental'],
      canonicalUrl: 'https://example.com',
      isHttps: true,
      hasSitemap: true,
      hasRobotsTxt: true,
      schemaTypesFound: ['LocalBusiness'],
      hasLocalBusinessSchema: true,
      metaPixel: {
        isPixelDetected: true,
        detectedPixelIds: ['982347102938472'],
        isPageViewDetected: true,
        hasDuplicatePixel: false,
      },
      openGraph: {
        ogTitle: 'ABC Dental',
        missingTags: [],
      },
    };

    const findings = evaluateAuditRules(MOCK_GBP_BUSINESS, undefined, websiteData);
    const pixelFinding = findings.find((f) => f.id === 'meta_pixel_installed');
    const ogFinding = findings.find((f) => f.id === 'meta_open_graph_complete');

    assert.ok(pixelFinding, 'meta_pixel_installed rule should be evaluated');
    assert.equal(pixelFinding.status, 'PASS');

    assert.ok(ogFinding, 'meta_open_graph_complete rule should be evaluated');
    assert.equal(ogFinding.status, 'PASS');
  });

  test('Audit rules evaluator scores meta_pixel_installed as WARNING when missing', () => {
    const websiteDataWithoutPixel: any = {
      url: 'https://example.com',
      finalUrl: 'https://example.com',
      statusCode: 200,
      responseTimeMs: 250,
      htmlLength: 4000,
      title: 'ABC Dental',
      metaDescription: 'Dental clinic',
      h1Tags: ['ABC Dental'],
      canonicalUrl: 'https://example.com',
      isHttps: true,
      hasSitemap: true,
      hasRobotsTxt: true,
      schemaTypesFound: ['LocalBusiness'],
      hasLocalBusinessSchema: true,
      metaPixel: {
        isPixelDetected: false,
        detectedPixelIds: [],
        isPageViewDetected: false,
        hasDuplicatePixel: false,
      },
      openGraph: {
        missingTags: ['og:title', 'og:description'],
      },
    };

    const findings = evaluateAuditRules(MOCK_GBP_BUSINESS, undefined, websiteDataWithoutPixel);
    const pixelFinding = findings.find((f) => f.id === 'meta_pixel_installed');
    const ogFinding = findings.find((f) => f.id === 'meta_open_graph_complete');

    assert.ok(pixelFinding);
    assert.equal(pixelFinding.status, 'WARNING');

    assert.ok(ogFinding);
    assert.equal(ogFinding.status, 'WARNING');
  });

  test('Meta Pixel ID validation logic rejects invalid formats', () => {
    const validatePixelId = (id: string) => /^\d{14,17}$/.test(id.trim());

    assert.equal(validatePixelId('982347102938472'), true, 'Valid 15 digit ID');
    assert.equal(validatePixelId('12345678901234'), true, 'Valid 14 digit ID');
    assert.equal(validatePixelId('12345678901234567'), true, 'Valid 17 digit ID');

    assert.equal(validatePixelId('12345'), false, 'Too short');
    assert.equal(validatePixelId('123456789012345678'), false, 'Too long');
    assert.equal(validatePixelId('98234710293847a'), false, 'Contains letter');
    assert.equal(validatePixelId(''), false, 'Empty string');
  });
});
