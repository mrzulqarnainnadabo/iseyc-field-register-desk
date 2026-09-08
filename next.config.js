/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Notion secrets stay server-side only (API routes / lib/notion.ts).
  swcMinify: true,
  experimental: {
    optimizePackageImports: ["@notionhq/client"],
  },
};

module.exports = nextConfig;
