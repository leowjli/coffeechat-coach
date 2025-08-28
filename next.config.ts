import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Reduce logging noise in development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
