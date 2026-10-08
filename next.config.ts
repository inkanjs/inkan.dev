import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  // a server of its own, without node_modules next to it, for a machine of your own;
  // Vercel builds and serves Next itself and needs none of it
  output: process.env.VERCEL ? undefined : "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default createMDX()(nextConfig);
