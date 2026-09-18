# LocalRank Audit — Security & SSRF Defense Architecture

## 1. Strict SSRF Protection (`ssrfGuard.ts`)

The crawler (`@localrank/crawler`) implements strict Server-Side Request Forgery defenses before initiating any outbound HTTP connection.

### Prohibited Destinations
The crawler explicitly blocks requests attempting to access:
- **Loopback addresses**: `localhost`, `127.0.0.1`, `::1`, `127.0.0.0/8`, `*.local`.
- **RFC 1918 Private Ranges**:
  - `10.0.0.0/8`
  - `172.16.0.0/12`
  - `192.168.0.0/16`
- **Link-Local & Cloud Metadata Endpoints**:
  - `169.254.169.254` (AWS, DigitalOcean, Azure instance metadata)
  - `metadata.google.internal` (GCP metadata)
- **Carrier-Grade NAT & Multicast**:
  - `100.64.0.0/10`
  - `224.0.0.0/4`
- **Obfuscated IP formats**: Decimal (`2130706433`), Hexadecimal (`0x7f000001`), Octal representations.
- **Non-Web Protocols**: `file:`, `ftp:`, `gopher:`, `ssh:`.
- **Non-Standard Ports**: Requests are restricted to standard web ports (80, 443, 8080, 8443).

## 2. Chrome Extension Security (Manifest V3)

The extension adheres strictly to the principle of least privilege:
- **Permissions requested**: Only `storage`, `activeTab`, `scripting`, and `sidePanel`.
- **Host permissions**: Strictly scoped to Google Maps and Google Search domains (`https://www.google.com/maps/*`, `https://maps.google.com/*`, `https://www.google.com/search*`).
- **No background DOM tampering**: Content scripts only inspect publicly rendered business headings and microdata.
- **Zero credential leakage**: All API keys and authentication tokens remain securely encapsulated on the server side.

## 3. Compliance & Anti-Bot Protection

- **No CAPTCHA Bypassing**: LocalRank Audit does not implement, bundle, or utilize CAPTCHA breaking, proxy rotation pools, or browser fingerprint spoofing intended to circumvent Google or website access controls.
- **Robots.txt Adherence**: The website crawler respects `robots.txt` disallow directives and enforces polite crawling rate limits.
- **Rank Tracking Fallback**: When no paid rank tracking partner API is configured, the system transparently indicates `"Rank data provider not configured"` rather than fabricating false rankings or running unauthorized scraping loops.
