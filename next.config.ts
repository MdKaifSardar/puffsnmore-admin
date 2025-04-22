import { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {},
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint checks during builds (e.g., on Vercel)
  },
  images: {
    domains: ["puffsnmore.com"], // Allow images from puffsnmore.com
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      self: false, // Prevent `self` issues in SSR
    };
    return config;
  },
};

export default nextConfig;
