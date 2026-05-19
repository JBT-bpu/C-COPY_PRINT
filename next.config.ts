import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin Turbopack to this project. Without this, Next 16 auto-detects the
  // root by walking up the tree and picks D:\C-COPY (the parent that
  // contains briefs + design PNGs), which then fails to resolve
  // `tailwindcss` because node_modules lives in D:\C-COPY\ccopy-site.
  // Use process.cwd() instead of __dirname — reliable in ESM config context.
  turbopack: {
    root: process.cwd(),
  },
  // The assistant routes read src/content/scraped-knowledge.txt via
  // fs.readFileSync at module load. Next's dependency tracer doesn't
  // reliably catch a dynamic readFileSync, so on Vercel the file can be
  // missing from the serverless bundle → SCRAPED_KNOWLEDGE silently "".
  // Force-include it in both function bundles.
  outputFileTracingIncludes: {
    "/api/assistant": ["./src/content/scraped-knowledge.txt"],
    "/api/assistant/summary": ["./src/content/scraped-knowledge.txt"],
  },
};

export default nextConfig;
