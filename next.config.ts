import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  compiler: {
    // Remove all console.* calls in application code
    removeConsole: true,
  },
};

export default nextConfig;
