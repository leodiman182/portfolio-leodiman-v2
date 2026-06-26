import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/api/chat": ["./src/data/knowledge/**/*"],
  },
};

export default nextConfig;