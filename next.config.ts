import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/_betterstack/web-vitals",
        destination: "https://in.logs.betterstack.com/web-vitals",
      },
      {
        source: "/_betterstack/logs",
        destination: "https://in.logs.betterstack.com/logs",
      },
    ];
  },
};

export default nextConfig;
