/**
 * SSRF Guard - Strict Server-Side Request Forgery Defense
 * Validates URLs before crawling to prevent intranet scanning, loopback access,
 * and cloud instance metadata exfiltration.
 */

import { URL } from 'url';

export interface SSRFValidationResult {
  isSafe: boolean;
  reason?: string;
  normalizedUrl?: string;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'ip6-localhost',
  'ip6-loopback',
  'metadata.google.internal',
  'instance-data',
]);

/**
 * Checks whether an IPv4 address belongs to a private, loopback, link-local,
 * or restricted network range.
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed IPv4 is unsafe
  }

  const [a, b] = parts;

  // 0.0.0.0/8 (Current network)
  if (a === 0) return true;

  // 10.0.0.0/8 (Private)
  if (a === 10) return true;

  // 127.0.0.0/8 (Loopback)
  if (a === 127) return true;

  // 169.254.0.0/16 (Link-local / Cloud Metadata)
  if (a === 169 && b === 254) return true;

  // 172.16.0.0/12 (Private)
  if (a === 172 && b >= 16 && b <= 31) return true;

  // 192.168.0.0/16 (Private)
  if (a === 192 && b === 168) return true;

  // 100.64.0.0/10 (Carrier-grade NAT)
  if (a === 100 && b >= 64 && b <= 127) return true;

  // 224.0.0.0/4 (Multicast)
  if (a >= 224) return true;

  return false;
}

export function validateUrlForCrawl(inputUrl: string): SSRFValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { isSafe: false, reason: 'Empty or invalid URL input.' };
  }

  const trimmed = inputUrl.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    // If protocol was missing, attempt prefixing with https://
    try {
      parsed = new URL(`https://${trimmed}`);
    } catch {
      return { isSafe: false, reason: 'Malformed URL format.' };
    }
  }

  // 1. Protocol check
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isSafe: false,
      reason: `Disallowed protocol: ${parsed.protocol}. Only http and https are permitted.`,
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 2. Reject empty hostname
  if (!hostname) {
    return { isSafe: false, reason: 'URL missing hostname.' };
  }

  // 3. Reject known loopback/metadata hostnames
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith('.local') || hostname.endsWith('.internal')) {
    return {
      isSafe: false,
      reason: `Blocked restricted hostname: ${hostname}`,
    };
  }

  // 4. Reject IPv6 loopback / private
  if (
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname.startsWith('fe80:') ||
    hostname.startsWith('fc00:') ||
    hostname.startsWith('fd00:')
  ) {
    return {
      isSafe: false,
      reason: 'IPv6 loopback or unique-local addresses are not permitted.',
    };
  }

  // 5. IPv4 check
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (ipv4Regex.test(hostname)) {
    if (isPrivateIPv4(hostname)) {
      return {
        isSafe: false,
        reason: `Private or loopback IP address range is blocked: ${hostname}`,
      };
    }
  }

  // 6. Numeric or hex IP representation evasion detection (e.g. 2130706433 or 0x7f000001)
  if (/^(0x[0-9a-f]+|\d+)$/i.test(hostname)) {
    return {
      isSafe: false,
      reason: 'Numeric/hex IP addresses are not permitted.',
    };
  }

  // 7. Non-standard ports: limit to standard web ports (80, 443, 8080, 8443)
  if (parsed.port && !['80', '443', '8080', '8443'].includes(parsed.port)) {
    return {
      isSafe: false,
      reason: `Disallowed port: ${parsed.port}. Only standard web ports are permitted.`,
    };
  }

  return {
    isSafe: true,
    normalizedUrl: parsed.toString(),
  };
}
