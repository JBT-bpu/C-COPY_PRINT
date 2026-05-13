import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin Turbopack to this project. Without this, Next 16 auto-detects the
  // root by walking up the tree and picks D:\C-COPY (the parent that
  // contains briefs + design PNGs), which then fails to resolve
  // `tailwindcss` because node_modules lives in D:\C-COPY\ccopy-site.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
