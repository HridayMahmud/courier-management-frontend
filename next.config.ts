import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // keep the dev-only indicator away from the sidebar's sign-out button
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
