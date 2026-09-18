/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@localrank/types',
    '@localrank/config',
    '@localrank/google',
    '@localrank/crawler',
    '@localrank/audit-engine',
  ],
};

export default nextConfig;
