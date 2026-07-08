import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  outputFileTracingIncludes: {
    "/api/chat": [
      "./src/data/knowledge/**/*",
      "./node_modules/onnxruntime-node/bin/napi-v3/linux/**/*",
    ],
  },
};

export default nextConfig;