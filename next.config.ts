
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["mobilize-spray-embellish.ngrok-free.dev"],

  experimental: {
    agentFeedback: true,
  },

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

export default nextConfig;
