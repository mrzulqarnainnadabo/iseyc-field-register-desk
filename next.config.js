/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Notion secrets are only ever read server-side inside API routes / lib/notion.ts.
  // Nothing in `env` here is exposed to the client bundle.
};

module.exports = nextConfig;
